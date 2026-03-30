# 第10章：生产构建与部署

## 本章概述

本章将学习 Vite 的生产环境构建配置、Rollup 选项配置、输出产物分析以及部署注意事项。

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

# 预览构建结果
pnpm preview

# 分析构建
pnpm build:analyze
```

## 关键配置

### build 配置

```typescript
export default defineConfig({
  build: {
    target: 'es2020',      // 目标浏览器
    outDir: 'dist',        // 输出目录
    sourcemap: false,     // 生成 sourcemap
    minify: 'terser',     // 压缩方式
    rollupOptions: {},    // Rollup 配置
  },
})
```

### 常用 build 选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| target | 目标浏览器 | 'es2020' |
| outDir | 输出目录 | 'dist' |
| sourcemap | 生成 sourcemap | false |
| minify | 压缩方式 | 'terser' |
| chunkSizeWarningLimit | chunk 大小警告 | 500 |

## 知识点

### 1. 构建配置

- target: 设置浏览器兼容级别
- outDir: 设置输出目录
- assetsDir: 设置资源目录

### 2. 代码分割

使用 manualChunks 进行代码分割：

```typescript
manualChunks: {
  'vendor-vue': ['vue'],
}
```

### 3. 构建产物分析

使用 vite-bundle-analyzer 分析构建产物：

```typescript
pnpm build:analyze
```

### 4. 部署注意事项

- 构建产物在 dist 目录(base可配置cdn域名)
- 需要 Web 服务器支持 ESM(js文件的content-type需设置为appliation/javascript)
- SPA 需要配置 fallback

## 思考题

1. 生产构建和开发模式有什么区别？
2. 如何分析构建产物大小？
3. 部署前需要检查哪些配置？