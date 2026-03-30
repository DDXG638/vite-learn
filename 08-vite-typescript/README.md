# 第8章：类型定义与 TS 支持

## 本章概述

本章将学习 Vite 的 TypeScript 支持，包括 tsconfig.json 配置、类型定义文件（.d.ts）、Vite 客户端类型以及热更新类型支持。

## 依赖包说明

| 依赖包 | 版本 | 说明 |
|-------|------|------|
| vite | ^7.0.5 | 核心构建工具 |
| @vitejs/plugin-vue | ^6.0.5 | Vue 插件 |
| vue | ^3.5.13 | Vue3 框架 |
| typescript | ~5.7.3 | TypeScript 支持 |

## 运行项目

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产构建
pnpm build

# 类型检查
pnpm typecheck
```

## 关键配置

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

### 路径别名

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Vite 客户端类型

```typescript
/// <reference types="vite/client" />
```

## 知识点

### 1. tsconfig.json 配置

Vite 使用 "moduleResolution": "bundler"，支持：

- 自动推导 `.ts` 文件的导入
- 路径别名支持
- 类型检查

### 2. 类型定义文件

创建 `.d.ts` 文件定义类型：

```typescript
// src/types/index.d.ts
export interface User {
  id: number
  name: string
}
```

### 3. Vite 客户端类型

`/// <reference types="vite/client" />` 提供：

- `import.meta.env` 类型
- `ImportMeta` 接口

### 4. vue-tsc

用于生产构建前的类型检查。

| 工具 | 说明 |
|------|------|
| tsc | TypeScript 官方编译器，只处理 `.ts` 文件 |
| vue-tsc | 基于 tsc，额外支持 `.vue` 文件类型检查 |

#### 核心区别

**tsc** 无法解析 `.vue` 文件：

## 思考题

1. tsconfig.json 中 "moduleResolution" 的作用是什么？
2. 如何配置路径别名？
3. vue-tsc 和 tsc 有什么区别？