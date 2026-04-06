# Chapter 14: Monorepo 配置

## 本章概述

本章将介绍 Monorepo（单体仓库）的概念与优势，学习如何使用 pnpm workspace 在 Vite 项目中实现 Monorepo 结构，包括跨包引用、依赖管理、构建与发布等完整流程。

## 依赖包说明

| 依赖包 | 版本 | 说明 |
|--------|------|------|
| pnpm | ^9.0.0 | 高性能的包管理器，支持 workspace |
| vite | ^7.0.5 | Vite 核心构建工具 |
| @vitejs/plugin-vue | ^6.0.5 | Vite 官方 Vue 插件 |
| vue | ^3.5.13 | Vue 3 渐进式前端框架 |
| typescript | ^5.7.3 | TypeScript 支持 |

## 项目结构

```
14-vite-monorepo/
├── pnpm-workspace.yaml              # pnpm workspace 配置
├── package.json                     # 根目录配置
├── tsconfig.json                    # TypeScript 项目引用配置
├── packages/
│   ├── app/                         # 主应用
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── main.ts
│   │       ├── App.vue
│   │       └── vite-env.d.ts
│   ├── shared/                      # 共享组件库
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── components/
│   │       │   ├── Button.vue
│   │       │   ├── Card.vue
│   │       │   └── Header.vue
│   │       └── utils/
│   │           └── format.ts
│   └── utils/                       # 工具函数库
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── math.ts
│           ├── function.ts
│           └── storage.ts
```

## 关键配置

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
```

### 根目录 package.json

```json
{
  "name": "vite-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @vite-monorepo/app dev",
    "build": "pnpm -r build",
    "build:app": "pnpm --filter @vite-monorepo/app build",
    "build:shared": "pnpm --filter @vite-monorepo/shared build",
    "build:utils": "pnpm --filter @vite-monorepo/utils build",
    "clean": "pnpm -r clean"
  }
}
```

### 子包 package.json（workspace 引用）

```json
{
  "dependencies": {
    "@vite-monorepo/utils": "workspace:*",
    "@vite-monorepo/shared": "workspace:*"
  }
}
```

### vite.config.ts（app）

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, '../shared/src'),
      '@utils': resolve(__dirname, '../utils/src')
    }
  }
})
```

## 知识点

### 1. Monorepo 概念与优势

#### 什么是 Monorepo

Monorepo（Monolithic Repository）是一种代码仓库组织方式，将多个相关项目放在同一个仓库中管理。

```
┌─────────────────────────────────────────────────────────────┐
│                      Monorepo 结构                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  repo/                                                      │
│  ├── packages/                                             │
│  │   ├── app/               # 主应用                        │
│  │   │   └── package.json                                       │
│  │   ├── shared/             # 共享组件库                    │
│  │   │   └── package.json                                       │
│  │   └── utils/              # 工具函数库                    │
│  │       └── package.json                                       │
│  └── pnpm-workspace.yaml                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Monorepo vs Polyrepo

| 特性 | Monorepo | Polyrepo |
|------|-----------|----------|
| 代码共享 | 天然支持，跨包引用简单 | 需要发布 npm 包 |
| 版本管理 | 统一版本，减少依赖冲突 | 各自管理版本 |
| CI/CD | 一次构建，所有包相关 | 需要分别构建 |
| 代码复用 | 复用率高 | 可能重复代码 |
| 仓库大小 | 可能较大 | 各自独立，大小可控 |
| 权限管理 | 统一权限 | 可按项目细分 |

### 2. pnpm workspace

#### workspace 原理

pnpm workspace 允许在同一个仓库中管理多个包，通过软链接实现依赖共享。

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'        # 匹配 packages 目录下所有子包
  - 'apps/*'           # 匹配 apps 目录下所有子包
```

#### workspace 协议

在 package.json 中使用 `workspace:*` 协议引用本地包：

```json
{
  "dependencies": {
    "@vite-monorepo/utils": "workspace:*",
    "@vite-monorepo/shared": "workspace:*"
  }
}
```

支持的协议：
- `workspace:*` - 最新版本
- `workspace:^1.0.0` - 兼容 1.x.x
- `workspace:~1.0.0` - 兼容 1.0.x

#### 常用命令

```bash
# 安装所有依赖
pnpm install

# 在所有包中运行命令
pnpm -r <command>
pnpm -r build
pnpm -r clean

# 只在特定包中运行
pnpm --filter @vite-monorepo/app dev
pnpm --filter @vite-monorepo/shared build

# 从指定包向下执行
pnpm --filter @vite-monorepo/app... build

# 受影响的包（相对于变更）
pnpm --filter "...@vite-monorepo/shared" build
```

### 3. Vite 在 Monorepo 中的配置

#### 库模式构建

对于共享包（shared、utils），使用 lib 模式构建：

```typescript
// packages/utils/vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Utils',
      formats: ['es'],
      fileName: 'index'
    }
  }
})
```

#### 路径别名配置

```typescript
// packages/app/vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, '../shared/src'),
      '@utils': resolve(__dirname, '../utils/src')
    }
  }
})
```

#### 跨包引用方式

在 Monorepo 中，跨包引用有两种方式：

**方式一：相对路径引用（推荐）**

```typescript
// packages/app/src/App.vue
import Header from '../../shared/src/components/Header.vue'
import { formatDate } from '../../shared/src/utils/format'
import { add } from '../../utils/src/math'
```

**方式二：workspace 包引用（发布后使用）**

```typescript
// 先构建共享包，再在 app 中引用
import Header from '@vite-monorepo/shared'
import { formatDate } from '@vite-monorepo/shared'
import { add } from '@vite-monorepo/utils'
```

> 注意：由于 vue-tsc 不支持 vite alias 解析，本项目使用相对路径方式确保类型检查正常工作。

#### TypeScript 项目引用

```json
// tsconfig.json (根目录)
{
  "files": [],
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/utils" },
    { "path": "./packages/app" }
  ]
}
```

```json
// packages/app/tsconfig.json
{
  "references": [
    { "path": "../shared/tsconfig.json" },
    { "path": "../utils/tsconfig.json" }
  ]
}
```

### 4. 跨包引用与依赖管理

#### 依赖提升

pnpm 默认会提升依赖到根目录的 node_modules，减少磁盘占用：

```
node_modules/
├── .pnpm/
│   ├── vue@3.5.13/
│   └── vite@7.0.5/
├── @vite-monorepo/           # workspace 包软链接
│   ├── shared -> ../.pnpm/shared@1.0.0/
│   └── utils -> ../.pnpm/utils@1.0.0/
├── vue -> .pnpm/vue@3.5.13/
└── vite -> .pnpm/vite@7.0.5/
```

#### 依赖类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 生产依赖 | 运行时代码需要 | vue, @vite-monorepo/utils |
| 开发依赖 | 仅构建/测试需要 | vite, typescript |
| 可选依赖 | 缺失不影响运行 | platform-specific packages |

### 5. 构建与发布

#### 构建顺序

由于包之间存在依赖，构建时需要注意顺序：

```bash
# 按依赖顺序构建
pnpm --filter @vite-monorepo/utils build
pnpm --filter @vite-monorepo/shared build
pnpm --filter @vite-monorepo/app build
```

#### 发布配置

```json
// packages/shared/package.json
{
  "name": "@vite-monorepo/shared",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"]
}
```

## 运行项目

### 安装依赖

```bash
cd 14-vite-monorepo
pnpm install
```

### 开发模式

```bash
# 启动主应用（会自动构建依赖包）
pnpm dev

# 或者指定包开发
pnpm --filter @vite-monorepo/app dev
pnpm --filter @vite-monorepo/shared dev --watch
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm build:utils
pnpm build:shared
pnpm build:app
```

### 清理

```bash
pnpm clean
```

## 思考题

### 1. Monorepo 适合什么场景？

Monorepo 适合以下场景：
- 多个项目共享代码和组件
- 需要统一版本和依赖管理
- 团队规模较大，需要统一规范
- 微前端架构下的多应用管理

### 2. pnpm workspace 的优势是什么？

| 优势 | 说明 |
|------|------|
| 磁盘节省 | 依赖提升，避免重复安装 |
| 速度快 | 并行安装，本地包直接链接 |
| 安全性 | 幽灵依赖不可能 |
| 严格性 | 显式声明依赖关系 |

### 3. 如何处理包之间的循环依赖？

最佳实践：
1. 避免循环依赖设计
2. 提取公共接口到独立包
3. 使用接口而非具体实现
4. 合理划分包的职责边界

### 4. Monorepo 中如何实现独立部署？

```bash
# 方式一：分别构建
pnpm --filter @vite-monorepo/app build
pnpm --filter @vite-monorepo/admin build  # 另一个应用

# 方式二：增量构建
pnpm --filter "...@vite-monorepo/shared" build
```

## 下章预告

下一章我们将学习 **综合实战**，整合前面所有章节的知识点，搭建一个完整的 Vite 项目，并集成 Vitest 单元测试、测试覆盖率配置以及 CI/CD 集成。
