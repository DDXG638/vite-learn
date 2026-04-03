# Chapter 13: SSR 生产环境构建

## 本章概述

本章将介绍 Vite 的 SSR 生产环境构建配置，学习如何将开发阶段的 SSR 应用打包成生产环境可用的 bundle，包括服务端 bundle 生成、客户端 bundle 分离，以及部署到 Node 服务的完整流程。

## 依赖包说明

| 依赖包 | 版本 | 说明 |
|--------|------|------|
| vite | ^7.0.5 | Vite 核心构建工具 |
| @vitejs/plugin-vue | ^6.0.5 | Vite 官方 Vue 插件 |
| vue | ^3.5.13 | Vue 3 渐进式前端框架 |
| express | ^4.18.2 | Express 服务器框架 |
| compression | ^1.8.1 | gzip/brotli 压缩中间件 |
| sirv | ^3.0.2 | 高性能静态文件服务 |
| typescript | ~5.7.3 | TypeScript 支持 |
| @types/express | ^5.0.0 | Express 类型定义 |

## 项目结构

```
13-vite-ssr-build/
├── index.html                    # 入口 HTML 文件
├── package.json                  # 项目配置
├── vite.config.ts                # Vite 配置
├── tsconfig.json                 # TypeScript 配置
├── server/
│   ├── index.js                 # SSR 生产服务器
│   └── index-dev.js             # SSR 开发服务器
└── src/
    ├── client/
    │   ├── main.ts               # 客户端入口
    │   └── App.vue               # 客户端组件
    ├── server/
    │   └── entry-server.ts       # 服务端入口
    └── vite-env.d.ts            # Vite 类型定义
```

## 关键配置

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@client': resolve(__dirname, 'src/client'),
      '@server': resolve(__dirname, 'src/server')
    }
  },
  // 生产构建配置
  build: {
    sourcemap: true
  },
  // SSR 构建配置（仅影响生产构建）
  ssr: {}
})
```

### package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "dev:ssr": "node server/index-dev.js",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --ssr src/server/entry-server.ts --outDir dist/server",
    "start": "node server/index.js"
  }
}
```

### server/index.js (生产服务器)

```javascript
import express from 'express'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, existsSync, readdirSync } from 'fs'
import compression from 'compression'
import sirv from 'sirv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// 动态查找服务端入口文件
function findServerEntry(serverDist) {
  const assetsDir = resolve(serverDist, 'assets')
  if (existsSync(assetsDir)) {
    const files = readdirSync(assetsDir)
    const entryFile = files.find(f => f.startsWith('entry-server-') && f.endsWith('.js'))
    if (entryFile) return resolve(assetsDir, entryFile)
  }
  const files = readdirSync(serverDist)
  const entryFile = files.find(f => f.startsWith('entry-server-') && f.endsWith('.js'))
  return entryFile ? resolve(serverDist, entryFile) : resolve(serverDist, 'entry-server.js')
}

async function createServer() {
  const app = express()
  const clientDist = resolve(root, 'dist', 'client')
  const serverDist = resolve(root, 'dist', 'server')

  // 检查构建产物
  if (!existsSync(clientDist) || !existsSync(serverDist)) {
    console.error('错误: 构建产物不存在，请先运行 npm run build')
    process.exit(1)
  }

  const serverEntryPath = findServerEntry(serverDist)

  // SSR 渲染路由（必须放在静态文件服务之前）
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    // 跳过静态资源请求，让 sirv 处理
    if (url.startsWith('/assets/') || url.startsWith('/@')) {
      return next()
    }

    try {
      // 1. 读取 HTML 模板
      const template = readFileSync(resolve(clientDist, 'index.html'), 'utf-8')

      // 2. 加载服务端 bundle
      const { createApp } = await import(serverEntryPath)

      // 3. 渲染应用
      const { app: appInstance } = createApp({ url })
      const { renderToString } = await import('vue/server-renderer')
      const appHtml = await renderToString(appInstance)

      // 4. 注入 HTML
      const html = template.replace('<!--app-html-->', appHtml)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      console.error(e)
      next(e)
    }
  })

  // 使用 compression 和 sirv 处理静态资源
  app.use(compression())
  app.use(sirv(clientDist, {
    etag: true,
    maxAge: 31536000,
    immutable: true
  }))

  app.listen(3000, () => {
    console.log(`SSR Production Server: http://localhost:3000`)
  })
}

createServer()
```

## 知识点

### 1. SSR 生产构建原理

#### 开发阶段 vs 生产阶段

```
┌─────────────────────────────────────────────────────────────┐
│                    开发阶段 (Development)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Browser ──▶ Express ──▶ Vite Dev Server ──▶ SSR Render    │
│                    │           │                           │
│                    │      Transform / HMR                   │
│                    │           │                           │
│              vite.middlewares │                           │
│                              (开发时实时转换)                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    生产阶段 (Production)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Browser ──▶ Express ──▶ SSR Render ──▶ Response          │
│                    │           │                           │
│                    │      ┌─────┴─────┐                    │
│                    │      ▼           ▼                    │
│                    │  compression   sirv                  │
│                    │      (gzip)    (静态资源)             │
│                    │                 │                    │
│                    │           dist/client                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 构建产物分离

| 产物类型 | 路径 | 说明 |
|----------|------|------|
| 客户端 JS | `dist/client/assets/*.js` | 可在浏览器直接运行 |
| 客户端 CSS | `dist/client/assets/*.css` | 样式文件 |
| HTML 模板 | `dist/client/index.html` | 包含内联 script 引用 |
| 服务端 JS | `dist/server/entry-server.js` | Node.js 运行 |

### 2. 服务端 Bundle 生成

#### build:server 命令详解

```bash
vite build --ssr src/server/entry-server.ts --outDir dist/server
```

关键参数：
- `--ssr`: 指定 SSR 模式，不生成浏览器端代码
- `--outDir dist/server`: 输出到指定目录

#### SSR Bundle 特点

1. **Node.js 兼容**: 使用 `require()` 或 `import` 语法
2. **无 DOM 依赖**: 不包含 `window`、`document` 等浏览器 API
3. **保留 process.env**: 可以访问环境变量

### 3. 客户端 Bundle 生成

#### build:client 命令详解

```bash
vite build --outDir dist/client
```

客户端构建会：
1. 压缩 JavaScript 和 CSS
2. 生成 sourcemap（如果配置了）
3. 分离第三方依赖为 chunk
4. 生成 HTML 模板

### 4. 部署到 Node 服务

#### 生产部署流程

```
┌──────────────────────────────────────────────────────────┐
│                      部署流程                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. npm run build                                        │
│     ├── build:client → dist/client/                     │
│     └── build:server → dist/server/                     │
│                                                          │
│  2. npm start                                            │
│     └── node server/index.js                            │
│                                                          │
│  3. Nginx 反向代理 (可选)                                 │
│     └── 3000 → 80/443                                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### 生产服务器关键检查

```javascript
// 检查构建产物是否存在
if (!existsSync(clientDist) || !existsSync(serverDist)) {
  console.error('错误: 构建产物不存在，请先运行 npm run build')
  process.exit(1)
}
```

### 5. Hydration 机制

#### 什么是 Hydration

Hydration（也叫 CSR）是 SSR 的后续步骤：

```
┌────────────────────────────────────────────────────────┐
│                    SSR + Hydration 流程               │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Server                        Browser                 │
│    │                              │                    │
│    ▼                              │                    │
│  生成完整 HTML ───────────────────▶│                    │
│    │                              │                    │
│    │                              ▼                    │
│    │                         Hydration                 │
│    │                         (激活 Vue)                 │
│    │                              │                    │
│    ▼                              ▼                    │
│  Vue SSR App              Vue CSR App                  │
│  (服务端渲染)              (客户端激活)                   │
│                                                        │
│  差异: 无交互能力                 差异: 有交互能力        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### Hydration 代码示例

```typescript
// src/client/main.ts
import { createSSRApp } from 'vue'
import App from './App.vue'

// 注意: 使用 createSSRApp 而不是 createApp
const app = createSSRApp(App)

// hydration: 将事件监听器绑定到已存在的 HTML 上
app.mount('#app')
```

关键点：
- 服务端生成的 HTML 结构和客户端必须一致
- `createSSRApp` 不会重新渲染 DOM，只会绑定事件
- 如果结构不一致，会产生 hydration mismatch 警告

## 运行项目

### 开发模式

```bash
# 安装依赖
cd 13-vite-ssr-build
npm install

# 启动 SSR 开发服务器
npm run dev:ssr

# 访问 http://localhost:3000 查看效果
```

### 生产模式

```bash
# 构建 SSR 应用
npm run build

# 启动生产服务器
npm start

# 访问 http://localhost:3000 查看效果
```

### 构建产物

构建后会在 `dist/` 目录下生成：

```
dist/
├── client/                    # 客户端构建产物
│   ├── index.html            # HTML 模板
│   └── assets/               # JS/CSS 资源
│       ├── index-[hash].js
│       └── index-[hash].css
└── server/                   # 服务端构建产物
    └── assets/               # SSR bundle
        └── entry-server-[hash].js  # SSR 入口
```

> 注意：SSR 构建产物默认放在 `assets/` 子目录下，服务器会动态查找入口文件。

## 思考题

### 1. 为什么需要分离客户端和服务端 bundle？

分离的原因：
- **运行环境不同**: 客户端运行在浏览器，服务端运行在 Node.js
- **优化加载**: 客户端只需加载必要的 JS/CSS
- **代码差异**: 浏览器代码可能包含 `window`、`document`，服务端代码可能包含 `fs`、`path`

### 2. SSR 生产构建有哪些优化点？

1. **代码压缩**: Rollup/Terser 压缩代码
2. **Tree-shaking**: 移除未使用的代码
3. **Code splitting**: 分离第三方库和业务代码
4. **Sourcemap**: 生成调试用的源映射
5. **缓存策略**: 静态资源长时间缓存

### 3. 生产环境为什么使用 sirv 而不是 vite.middlewares？

| 特性 | vite.middlewares | sirv |
|------|-----------------|------|
| 用途 | 开发阶段 HMR | 生产静态资源 |
| 压缩 | 无 | gzip/brotli |
| 性能 | 一般 | 专为生产优化 |
| ETag | 无 | 自动生成 |
| Cache-Control | 无 | 支持 immutable |

### 4. 如何处理 SSR 中的环境变量？

```typescript
// 服务端和客户端都可以访问
const apiUrl = import.meta.env.VITE_API_URL

// 仅服务端可访问
// 在 vite.config.ts 中配置
export default defineConfig({
  define: {
    __SSR_SECRET__: JSON.stringify(process.env.SECRET)
  }
})
```

## 下章预告

下一章我们将学习 **Monorepo 配置**，了解如何使用 pnpm workspace 和 Vite 构建大型项目结构，实现跨包引用和统一管理。
