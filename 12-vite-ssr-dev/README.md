# Chapter 12: Vite SSR 开发服务器

## 本章概述

本章将介绍 Vite 的服务端渲染（SSR）开发服务器配置，学习如何在开发阶段同时运行客户端和服务端代码，实现 SSR 应用的热更新功能。

## 依赖包说明

| 依赖包 | 版本 | 说明 |
|--------|------|------|
| vite | ^7.0.5 | Vite 核心构建工具 |
| @vitejs/plugin-vue | ^6.0.5 | Vite 官方 Vue 插件 |
| vue | ^3.5.13 | Vue 3 渐进式前端框架 |
| typescript | ~5.7.3 | TypeScript 支持 |
| vue-tsc | ^2.2.0 | Vue 类型检查工具 |
| express | ^4.18.2 | Express 服务器框架 |

## 项目结构

```
12-vite-ssr-dev/
├── index.html                    # 入口 HTML 文件
├── package.json                  # 项目配置
├── vite.config.ts                # Vite 配置
├── tsconfig.json                 # TypeScript 配置
├── server/
│   └── index.js                  # SSR 开发服务器
└── src/
    ├── client/
    │   ├── main.ts               # 客户端入口
    │   └── App.vue               # 客户端组件
    └── server/
        └── entry-server.ts       # 服务端入口
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
  server: {
    port: 5173
  }
})
```

### server/index.js

```javascript
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // 创建 Vite 开发服务器 (SSR 模式)
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // 使用 Vite 的中间件
  app.use(vite.middlewares)

  // SSR 渲染路由
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl
    try {
      // 1. 转换 index.html
      let template = await vite.transformIndexHtml(url, `...`)

      // 2. 加载服务端入口
      const { createApp } = await vite.ssrLoadModule('/src/server/entry-server.ts')

      // 3. 渲染应用
      const { app: appInstance } = createApp()
      const { renderToString } = await import('vue/server-renderer')
      const appHtml = await renderToString(appInstance)

      // 4. 注入 HTML
      const html = template.replace('<!--app-html-->', appHtml)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(3000, () => {
    console.log('SSR Dev Server: http://localhost:3000')
  })
}

createServer()
```

### src/server/entry-server.ts

```typescript
import { createSSRApp } from 'vue'
import App from '../client/App.vue'

export function createApp() {
  const app = createSSRApp(App)
  return { app }
}
```

## 知识点

### 1. SSR 基础概念

#### 什么是 SSR？

SSR（Server-Side Rendering，服务端渲染）是指在服务器上生成完整的 HTML 内容，然后发送给浏览器。与传统的客户端渲染（CSR）相比：

| 特性 | SSR | CSR |
|------|-----|-----|
| 首屏速度 | 快（HTML 已生成） | 慢（需等待 JS） |
| SEO | 友好（完整 HTML） | 差（需 JS 执行） |
| 交互 | 需要客户端 hydration | 即时响应 |
| 服务端负载 | 高（需渲染） | 低（仅静态文件） |

#### Vite SSR 工作原理

```
┌─────────────────────────────────────────────────────┐
│              开发阶段 SSR 架构                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐     ┌─────────────┐              │
│  │  Express    │────▶│  Vite       │              │
│  │  Server     │     │  Middleware │              │
│  └─────────────┘     └──────┬──────┘              │
│                             │                       │
│              ┌──────────────┼──────────────┐      │
│              ▼              ▼              ▼      │
│    ┌────────────┐   ┌────────────┐  ┌─────────┐   │
│    │ transform  │   │ ssrLoad    │  │ HMR     │   │
│    │ IndexHtml  │   │ Module     │  │ Server  │   │
│    └────────────┘   └─────┬──────┘  └─────────┘   │
│                           │                        │
│                           ▼                        │
│                    ┌─────────────┐                 │
│                    │ Vue SSR     │                 │
│                    │ renderToStr │                 │
│                    └─────────────┘                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. Vite SSR 开发服务器配置

#### 2.1 创建 Vite SSR 服务器

```javascript
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'custom'
})
```

关键配置：
- `middlewareMode: true`: 让 Vite 运行在中间件模式，不启动 HTTP 服务器
- `appType: 'custom'`: 使用自定义服务器，而非 Vite 默认的开发服务器

#### 2.2 处理 HTML 模板

```javascript
let template = await vite.transformIndexHtml(url, htmlString)
```

`transformIndexHtml` 会：
- 应用 Vite 插件链
- 处理 HTML 中的 `<script>` 引用
- 注入 HMR 客户端代码

#### 2.3 加载服务端模块

```javascript
const { createApp } = await vite.ssrLoadModule('/src/server/entry-server.ts')
```

`ssrLoadModule`:
- 类似 `import()`，但专门用于 SSR
- 会触发 Vite 的模块转换
- 返回模块的导出

### 3. 客户端与服务端代码组织

#### 代码分离策略

```
src/
├── client/           # 客户端和服务端共用
│   ├── App.vue       # 通用组件
│   └── main.ts       # 客户端入口 (createApp)
└── server/
    └── entry-server.ts  # 服务端入口 (createSSRApp)
```

#### 关键区别

| 客户端 | 服务端 |
|--------|--------|
| `createApp()` | `createSSRApp()` |
| `app.mount('#app')` | 使用 `renderToString()` |
| 直接渲染到 DOM | 返回 HTML 字符串 |

### 4. 流式渲染入门

#### 基本流式渲染

```typescript
import { renderToNodeStream } from 'vue/server-renderer'

app.use('*', async (req, res) => {
  const { app: appInstance } = createApp()

  // 设置正确的响应头
  res.setHeader('Content-Type', 'html')

  // 使用流式渲染
  const stream = renderToNodeStream(appInstance)
  stream.pipe(res)
})
```

流式渲染的优势：
- 更早开始发送数据
- 首字节时间（TTFB）更短
- 适合大型页面

#### 流式渲染注意事项

1. **正确设置 Content-Type**: `res.setHeader('Content-Type', 'text/html')`
2. **处理异步组件**: 等待 `onSSRBeforeMount` 钩子完成
3. **错误处理**: 使用 `stream.on('error')` 处理渲染错误

## 运行项目

```bash
# 安装依赖
cd 12-vite-ssr-dev
npm install

# 启动 SSR 开发服务器
npm run dev:ssr

# 访问 http://localhost:3000 查看效果
```

## 思考题

### 1. Vite SSR 开发服务器与普通开发服务器有什么区别？

主要区别在于：
- 普通开发服务器：直接提供静态文件和 HMR
- SSR 开发服务器：需要整合 Express，使用 `middlewareMode`，自定义路由处理

### 2. 为什么需要 `createSSRApp` 而不是 `createApp`？

`createSSRApp` 是 Vue 3 专门为 SSR 设计的：
- 不包含 DOM 操作相关的代码
- 避免 hydration 不匹配警告
- 性能更轻量

### 3. SSR 开发中，如何处理客户端专用的代码？

使用环境判断：
```typescript
// 判断是否在服务端
const isSSR = typeof window === 'undefined'

if (!isSSR) {
  // 客户端代码
  import('./client-only.ts')
}
```

或者使用 Vue 的 `onMounted` 钩子，它只在客户端执行。

## 下章预告

下一章我们将学习 **SSR 生产环境构建**，了解如何配置生产级别的 SSR 构建，包括服务端 bundle 生成、客户端 bundle 分离等内容。