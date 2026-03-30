# 第7章：代理与 HTTP 配置

## 本章概述

本章将学习 Vite 的开发服务器代理配置、HTTPS 配置、CORS 设置以及请求重写。

## 依赖包说明

| 依赖包 | 版本 | 说明 |
|-------|------|------|
| vite | ^7.0.5 | 核心构建工具 |
| @vitejs/plugin-vue | ^6.0.5 | Vue 插件 |
| vue | ^3.5.13 | Vue3 框架 |

## 运行项目

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产构建
pnpm build
```

## 关键配置

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

### 代理配置选项

| 选项 | 说明 | 类型 |
|------|------|------|
| target | 代理目标地址 | string |
| changeOrigin | 修改请求头Origin | boolean |
| rewrite | 路径重写函数 | (path: string) => string |
| secure | 忽略 SSL 证书验证 | boolean |
| ws | 支持 WebSocket 代理 | boolean |

## 知识点

### 1. 代理配置

将指定路径的请求代理到目标服务器：

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
  },
}
```

### 2. 路径重写

使用 `rewrite` 重写请求路径：

```typescript
rewrite: (path) => path.replace(/^\/api/, '')
```

### 3. HTTPS 代理

设置 `secure: false` 忽略 SSL 证书验证：

```typescript
proxy: {
  '/foo': {
    target: 'https://example.com',
    secure: false,
  },
}
```

### 4. CORS 设置

代理可以解决开发阶段的跨域问题。

## 思考题

1. 代理的 `changeOrigin` 选项作用是什么？
2. 如何配置 HTTPS 代理？
3. 如何使用 rewrite 重写路径？