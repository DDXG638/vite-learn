# Chapter 15: Vite 综合实战

## 本章概述

本章通过一个完整的电商项目，综合运用 Vite 的各项功能，包括 Monorepo 管理、SSR 渲染、打包优化、CSS 预处理等。

## 项目结构

```
15-vite-comprehensive/
├── packages/
│   ├── app/           # 主应用（商品列表、详情页）
│   │   ├── src/       # 源代码
│   │   ├── server/    # SSR 服务器脚本
│   │   ├── dist/      # 构建产物
│   │   └── index.html  # 入口 HTML
│   ├── components/    # 组件库（LazyImage 等）
│   └── utils/         # 工具库（format、function 等）
├── package.json        # 根目录 workspace 配置
└── pnpm-workspace.yaml
```

## 依赖包说明

### app 主应用

| 依赖包 | 版本 | 说明 |
|--------|------|------|
| vue | ^3.5.13 | Vue3 框架 |
| vue-router | ^5.0.0 | Vue 路由管理 |
| pinia | ^3.0.0 | Vue 状态管理 |
| @vite-comprehensive/components | workspace:* | 组件库 |
| @vite-comprehensive/utils | workspace:* | 工具库 |
| vite | ^7.0.5 | Vite 构建工具 |
| @vitejs/plugin-vue | ^6.0.5 | Vue 插件 |
| sass | ^1.83.0 | SCSS 预处理器 |
| express | ^5.0.0 | SSR 服务端框架 |
| compression | ^1.7.4 | 压缩中间件 |
| sirv | ^2.0.4 | 静态文件服务 |

### components 组件库

| 依赖包 | 版本 | 说明 |
|--------|------|------|
| vue | ^3.5.13 | Vue3 框架 |
| vite | ^7.0.5 | Vite 构建工具 |
| @vitejs/plugin-vue | ^6.0.5 | Vue 插件 |
| vitest | ^3.0.0 | 单元测试框架 |
| @vue/test-utils | ^2.4.0 | Vue 测试工具 |

### utils 工具库

| 依赖包 | 版本 | 说明 |
|--------|------|------|
| vite | ^7.0.5 | Vite 构建工具 |
| vitest | ^3.0.0 | 单元测试框架 |

## 关键配置

### 基础路由配置

```ts
// vite.config.ts
export default defineConfig({
  base: '/cool',
  // ...
})
```

### 路由级别动态引入

```ts
// router.ts
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/ProductList.vue')
  }
]
```

### SSR 配置

SSR 使用 Express + Vite 中间件模式：

- 开发环境：`node server/dev.mjs`
- 生产环境：`npm run ssr:build && node server/prod.mjs`

```js
// server/prod.mjs
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'custom'
})
app.use(vite.middlewares)
```

### Vitest 配置 (组件库)

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
```

## 知识点

### 1. Monorepo 架构
- 使用 pnpm workspace 管理多包
- packages/app、packages/components、packages/utils 三个独立包
- 组件库和工具库独立版本管理

### 2. 路由级别动态引入
```ts
const routes = [
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('./pages/ProductDetail.vue')
  }
]
```

### 3. 构建产物分包

通过路由代码分割实现按需加载：

```
dist/assets/main-xxx.js        99.83 kB (Vue 核心库)
dist/assets/index-xxx.js       25.08 kB (路由)
dist/assets/ProductList-xxx.js  1.10 kB (按需加载)
dist/assets/ProductDetail-xxx.js 1.50 kB (按需加载)
```

### 4. 图片懒加载组件

- 支持空占位（防止页面抖动）
- 支持首屏直接渲染
- 支持 IntersectionObserver 懒加载

```vue
<LazyImage
  :src="product.image"
  :alt="product.name"
  :first-screen="index < 2"
  aspect-ratio="1:1"
/>
```

### 5. CSS 预处理

使用 Sass 预处理器

### 6. SSR 渲染

- 基础路径：`/cool`
- 开发服务器：`node server/dev.mjs`
- 生产构建：`npm run ssr:build`
- 生产服务器：`node server/prod.mjs`

## 使用命令

```bash
# 安装依赖
pnpm install

# 开发模式（CSR）
pnpm dev

# 构建所有包
pnpm build

# 构建指定包
pnpm build:app
pnpm build:components
pnpm build:utils

# SSR 开发服务器
pnpm ssr:dev
# 访问 http://localhost:3000/cool/

# SSR 生产构建
pnpm ssr:build

# SSR 生产服务器
pnpm ssr:start
# 访问 http://localhost:3000/cool/

# 运行测试
pnpm test
pnpm test:components
pnpm test:utils

# 清理构建产物
pnpm clean
```
