# 第9章：依赖预构建

## 本章概述

本章将学习 Vite 的依赖预构建机制，包括 node_modules 预构建原理、optimizeDeps 配置、依赖缓存机制以及大型依赖处理。

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

# 手动预构建
pnpm optimize

# 生产构建
pnpm build
```

## 关键配置

### optimizeDeps 配置

```typescript
export default defineConfig({
  optimizeDeps: {
    include: ['lodash-es'], // 需要预构建的依赖
    exclude: ['lodash'],   // 排除预构建的依赖
  },
})
```

### 预构建缓存

预构建结果缓存在 `node_modules/.vite` 目录。

## 知识点

### 1. 预构建原理

- 将 CommonJS 转换为 ESM
- 将多个小文件合并为单个模块
- 减少浏览器请求数量

### 2. optimizeDeps 配置

| 选项 | 说明 |
|------|------|
| include | 需要预构建的依赖列表 |
| exclude | 排除预构建的依赖列表 |
| esbuildOptions | esbuild 配置 |

### 3. 缓存机制

预构建结果会缓存，修改 `package.json` 后需要重新运行 `vite optimize`。

### 4. 大型依赖处理

对于大型库，可以通过 `exclude` 排除预构建。

## 思考题

1. 预构建的作用是什么？
2. 如何手动触发预构建？
3. 预构建的缓存机制是怎样的？