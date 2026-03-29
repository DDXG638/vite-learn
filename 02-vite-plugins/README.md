# 第2章：Vite 插件系统

## 本章概述

本章将学习 Vite 的插件系统，包括插件机制介绍、Rollup 与 Rolldown 的关系、常用官方插件的使用，以及如何开发自定义插件。

## 依赖包说明

| 依赖包 | 版本 | 说明 |
|-------|------|------|
| vite | ^7.0.5 | 核心构建工具 |
| @vitejs/plugin-vue | ^6.0.5 | Vue 插件，提供 .vue 文件支持 |
| vue | ^3.5.13 | Vue3 框架 |
| typescript | ~5.7.3 | TypeScript 支持 |
| sass | ^1.83.4 | SCSS 预处理器 |

## 运行项目

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 关键配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePluginDemo } from './plugins/demo'

export default defineConfig({
  plugins: [
    vue(),
    vitePluginDemo(),
  ],
})
```

## 知识点

### 1. Vite 插件与 Rollup 插件的关系

Vite 插件**完全兼容** Rollup 插件体系，并在此基础上扩展了 Vite 独有的钩子。

```
Rollup 插件 + Vite 独有钩子 = Vite 插件
```

### 2. Rollup 钩子类型

Rollup 钩子分为四大类：

#### 2.1 Build Hooks（构建阶段钩子）

| 钩子 | 同步/异步 | 说明 | 适用场景 |
|------|----------|------|--------|
| `buildStart` | async | 构建开始时调用 | 初始化插件状态、读取配置 |
| `buildEnd` | sync | 构建结束时调用 | 清理资源、输出统计 |
| `closeBundle` | sync | Bundle 关闭时调用 | 关闭文件句柄、连接等 |

#### 2.2 Module Hooks（模块阶段钩子）

| 钩子 | 同步/异步 | 说明 | 适用场景 |
|------|----------|------|--------|
| `resolveId` | sync/async | 解析模块路径 | 处理别名、虚拟模块 |
| `load` | sync/async | 加载模块内容 | 自定义模块加载逻辑 |
| `transform` | sync/async | 转换代码 | 代码转换、压缩、加密 |
| `moduleParsed` | sync | 模块解析完成 | 分析模块依赖 |

#### 2.3 Output Bundle Hooks（输出阶段钩子）

| 钩子 | 同步/异步 | 说明 | 适用场景 |
|------|----------|------|--------|
| `renderStart` | sync | 开始渲染 bundle | 初始化输出环境 |
| `renderChunk` | sync | 渲染单个 chunk | chunk 修改、代码注入 |
| `generateBundle` | sync | 生成 bundle 文件 | 自定义输出文件 |
| `writeBundle` | sync | 写入文件到磁盘 | 最后的文件处理 |

#### 2.4 Watch Hooks（监听模式钩子）

| 钩子 | 同步/异步 | 说明 | 适用场景 |
|------|----------|------|--------|
| `watchChange` | sync | 文件变化时触发 | 监听特定文件 |
| `closeWatcher` | sync | 关闭监听时调用 | 清理监听资源 |

### 3. Vite 独有钩子

Vite 在 Rollup 基础上扩展了以下钩子：

| 钩子 | 说明 | 适用场景 |
|------|------|--------|
| `config` | 修改 Vite 配置 | 动态配置修改 |
| `configResolved` | 配置解析完成 | 读取最终配置 |
| `configureServer` | 配置开发服务器 | 设置代理、中间件 |
| `transformIndexHtml` | 转换 index.html | HTML 注入、修改 |
| `handleHotUpdate` | 处理热更新 | 自定义 HMR 逻辑 |

### 4. 钩子执行流程图

```
┌─────────────────────────────────────────────────────────────┐
│                    构建流程（Build）                          │
├─────────────────────────────────────────────────────────────┤
│  config ──→ configResolved ──�� buildStart                 │
│    ↑                                       ↓               │
│    │          transform × N (每个模块)                      │
│    │                                       ↓               │
│    │          buildEnd                                     │
│    │                         ↓                             │
│    │          renderStart ──→ renderChunk × N              │
│    │                         ↓                             │
│    │          generateBundle ──→ writeBundle               │
│    │                         ↓                             │
│    └────────── closeBundle                                 │
└─────────────────────────────────────────────────────────────┘
```

### 5. 插件执行顺序控制

使用 `enforce` 属性控制插件执行顺序：

```typescript
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    enforce: 'pre', // 'pre' | 'normal' | 'post'

    // 'pre' - 在其他插件之前执行
    // 'normal' - 默认顺序
    // 'post' - 在其他插件之后执行
  }
}
```

### 6. 虚拟模块

虚拟模块不是真实存在的文件，而是插件在运行时动态生成的代码，是 **Rollup 特有的概念**。

#### 常见用途

| 用途 | 示例 | 说明 |
|------|------|------|
| 别名替换 | `import from 'virtual:config'` | 简短的路径别名 |
| 代码注入 | `import from 'virtual:injected-code'` | 动态注入常量/配置 |
| 多文件合并 | `import from 'virtual:lib'` | 合并多个文件 |
| 内置模块 | `import from 'virtual:vite/client'` | Vite 内置支持 |

#### 实现原理

```typescript
resolveId(source) {
  // 拦截以 virtual: 开头的模块请求
  if (source.startsWith('virtual:')) {
    return { id: source }
  }
  return null
}

load(id) {
  // 提供虚拟模块的内容
  if (id.startsWith('virtual:')) {
    return 'export const CONFIG = { version: "1.0.0" }'
  }
  return null
}
```

#### 使用示例

```typescript
// 源码中直接导入
import { CONFIG } from 'virtual:my-plugin/config'

// 通过 resolveId 和 load 钩子提供内容
```

#### Vite 内置虚拟模块

| 模块 | 说明 |
|------|------|
| `virtual:vite/client` | HMR 客户端 |
| `virtual:rollup/rollup-linux-x64` | 平台特定的 Rollup 二进制 |

### 7. Rollup 与 Rolldown 的关系

- **Rollup**：使用 JavaScript 编写的打包工具，久经考验
- **Rolldown**：Rollup 的 Rust 实现，性能更好

Vite 7 使用 Rolldown 作为生产构建的后端，享受接近原生 Rust 的性能。

### 7. 常用官方插件

| 插件 | 说明 |
|------|------|
| @vitejs/plugin-vue | 提供 Vue 3 单文件组件支持 |
| @vitejs/plugin-vue-jsx | 提供 Vue 3 JSX 支持 |
| @vitejs/plugin-react | 提供 React 支持 |

### 8. 自定义插件示例

运行 `pnpm build` 查看钩子执行顺序：

```bash
[1/Build] config - Vite 配置加载
[2/Build] configResolved - 配置解析完成
[3/Build] buildStart - 构建开始
[6/Module] transform - 转换代码 (.vue 文件)
[11/Build] buildEnd - 构建结束
[7/Output] renderStart - 开始渲染 bundle
[8/Output] renderChunk - 渲染 Chunk
[9/Output] generateBundle - 生成文件
[Vite] transformIndexHtml - 转换 HTML
[10/Output] writeBundle - 写入文件
[12/Build] closeBundle - Bundle 关闭
```

## 思考题

1. Vite 插件和 Rollup 插件有什么区别？
2. Rollup 钩子有哪些类型？分别适合什么场景？
3. 如何在插件中访问 Vite 的配置？
4. 插件的执行顺序如何控制？
5. `transform` 钩子和 `renderChunk` 钩子的区别是什么？