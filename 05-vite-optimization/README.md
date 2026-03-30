# 第5章：代码分割与优化

## 本章概述

本章将学习 Vite 的代码分割与优化机制，包括手动分包、动态导入、预构建依赖以及构建产物分析。

## 依赖包说明

| 依赖包 | 版本 | 说明 |
|-------|------|------|
| vite | ^7.0.5 | 核心构建工具 |
| @vitejs/plugin-vue | ^6.0.5 | Vue 插件 |
| vue | ^3.5.13 | Vue3 框架 |
| lodash-es | ^4.17.21 | 示例大型库 |

## 运行项目

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产构建
pnpm build

# 分析构建
pnpm build:analyze
```

## 关键配置

### manualChunks 手动分包

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue'],
          'vendor-lodash': ['lodash-es'],
        },
      },
    },
  },
})
```

### 动态导入

```typescript
// 动态导入自动进行代码分割
const module = await import('./module')
```

## 知识点

### 1. manualChunks 手动分包

将大型第三方库单独打包：

```typescript
manualChunks: {
  'vendor-vue': ['vue'],
  'vendor-lodash': ['lodash-es'],
}
```

### 2. 动态导入

动态 `import()` 会自动分割代码, 就js和css单独提取

Vite 会为入口 chunk 和它们在打包出的 HTML 中的直接引入自动生成 "<link rel="modulepreload">"指令。

```typescript
// 按需加载
const Component = defineAsyncComponent(() => import('./Component.vue'))
```

### 3. 预构建依赖

`optimizeDeps` 用于预构建依赖：node_modules中的依赖默认会进行依赖预构建，不需要显式指定。

```typescript
optimizeDeps: {
  include: ['lodash-es'],
}
```

### 4. 构建产物分析

使用 `--mode analyze` 分析构建产物。

### 5. 分包策略

| 策略 | 说明 |
|------|------|
| vendor | 第三方库 |
| common | 公共代码 |
| async | 动态导入 |

## 思考题

1. manualChunks 和动态导入有什么区别？
2. 预构建依赖的作用是什么？
3. 如何分析构建产物的大小？
4. 如何优化大型第三方库的加载？