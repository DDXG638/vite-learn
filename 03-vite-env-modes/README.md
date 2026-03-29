# 第3章：环境变量与模式

## 本章概述

本章将学习 Vite 的环境变量配置机制，包括 `.env` 文件配置、环境变量类型、Vite 模式以及变量在代码中的使用。

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

# 开发模式（默认）
pnpm dev

# 指定模式
pnpm dev --mode test

# 生产构建
pnpm build

# 预览
pnpm preview
```

## 关键配置

### .env 文件

Vite 使用 `.env` 文件管理环境变量：

| 文件名 | 说明 | 优先级 |
|--------|------|--------|
| `.env` | 所有模式共享 | 1（最低） |
| `.env.development` | 开发模式 | 2 |
| `.env.production` | 生产模式 | 2 |
| `.env.test` | 测试模式 | 2 |
| `.env.local` | 本地覆盖（不提交） | 3（最高） |

### 命名规则

- 以 `VITE_` 开头的变量会暴露到客户端
- 其他变量仅在服务端可用

```bash
# 客户端可见
VITE_APP_TITLE=My App

# 仅服务端可见
API_KEY=secret-key
```

## 知识点

### 1. 环境变量类型

#### 客户端变量（以 VITE_ 开头）

```typescript
// 通过 import.meta.env 访问
import.meta.env.VITE_APP_TITLE
import.meta.env.VITE_APP_VERSION
import.meta.env.VITE_API_BASE_URL
```

#### Vite 内置变量

| 变量 | 说明 |
|------|------|
| `import.meta.env.MODE` | 当前模式 |
| `import.meta.env.DEV` | 是否开发模式 |
| `import.meta.env.PROD` | 是否生产模式 |
| `import.meta.env.SSR` | 是否 SSR |

### 2. Vite 模式

#### 内置模式

| 模式 | 说明 |
|------|------|
| `development` | 开发模式，对应 `vite` 命令 |
| `production` | 生产模式，对应 `vite build` |

#### 自定义模式

```bash
# 使用自定义模式
vite --mode test
vite build --mode staging
```

### 3. 模式加载优先级

以 `vite --mode development` 为例：

```
.env.local (最高)
.env.development
.env
.env.local (最低)
```

### 4. 条件判断

```typescript
if (import.meta.env.DEV) {
  console.log('开发模式')
}

if (import.meta.env.PROD) {
  console.log('生产模式')
}
```

### 5. TypeScript 类型支持

通过扩展 `ImportMetaEnv` 接口添加类型提示：

```typescript
// src/vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 6. 环境变量安全

#### 客户端暴露

所有 `VITE_` 开头的变量都会被 bundler 打包到客户端，**不要存储敏感信息**。

#### 安全方案

| 方案 | 说明 |
|------|------|
| 服务端代理 | 通过 Vite 代理转发请求 |
| .env.local | 本地覆盖，不提交到 git |
| 服务端配置 | 运行时从服务器获取 |

## 思考题

1. `.env`、`.env.development`、`.env.production` 的加载优先级是什么？
2. 为什么敏感信息不应该放在以 `VITE_` 开头的变量中？
3. 如何定义自定义模式？
4. `import.meta.env` 中内置了哪些变量？