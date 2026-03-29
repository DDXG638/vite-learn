# Vite v7 学习计划

## 项目概述

- **学习目标**: 由浅入深学习 Vite v7
- **技术栈**: TypeScript + Vue3 + SCSS + Vite v7

---

## 章节规划

### 第1章: Vite 基础入门
**Demo工程**: `01-vite-basics`

学习内容:
- Vite 是什么及核心优势
- 创建第一个 Vite 项目
- 项目目录结构解析
- vite.config.ts 基础配置
- 开发服务器与热更新原理
- ESBuild 在 Vite 中的作用

### 第2章: 插件系统与构建
**Demo工程**: `02-vite-plugins`

学习内容:
- Vite 插件机制介绍
- Rollup 与 Rolldown 的关系
- 常用官方插件 (@vitejs/plugin-vue, @vitejs/plugin-react)
- 插件配置与执行顺序
- 自定义插件开发

### 第3章: 环境变量与模式
**Demo工程**: `03-vite-env-modes`

学习内容:
- .env 文件配置
- 环境变量类型 (public/private)
- Vite 模式 (development/production/custom)
- 变量在代码中的使用

### 第4章: CSS 处理
**Demo工程**: `04-vite-css`

学习内容:
- CSS 模块化 (CSS Modules)
- PostCSS 配置
- SCSS/LESS 预处理器的集成
- CSS 代码分割

### 第5章: 代码分割与优化
**Demo工程**: `05-vite-optimization`

学习内容:
- manualChunks 手动分包
- 动态导入 (import())
- 预构建依赖 (deps.inline)
- 构建产物分析

### 第6章: 静态资源处理
**Demo工程**: `06-vite-assets`

学习内容:
- 公共目录 (public)
- 导入图片、视频、字体
- base64 内联
- 资源路径处理

### 第7章: 代理与 HTTP 配置
**Demo工程**: `07-vite-proxy`

学习内容:
- 开发服务器代理配置
- HTTPS 配置
- CORS 设置
- 请求重写

### 第8章: 类型定义与 TS 支持
**Demo工程**: `08-vite-typescript`

学习内容:
- tsconfig.json 配置
- 类型定义文件 (.d.ts)
- Vite 客户端类型
- 热更新类型支持

### 第9章: 依赖预构建
**Demo工程**: `09-vite-deps-optimization`

学习内容:
- node_modules 预构建原理
- optimizeDeps 配置
- 依赖缓存机制
- 大型依赖处理

### 第10章: 生产构建与部署
**Demo工程**: `10-vite-build-deploy`

学习内容:
- 生产环境构建配置
- Rollup 选项配置
- 输出产物分析
- 部署注意事项

### 第11章: Vite 与 Webpack 对比
**Demo工程**: `11-vite-vs-webpack`

学习内容:
- 构建速度对比
- 热更新机制对比
- 配置复杂度对比
- 适用场景分析
- 迁移注意事项

### 第12章: SSR 开发服务器
**Demo工程**: `12-vite-ssr-dev`

学习内容:
- SSR 基础概念
- Vite SSR 开发服务器配置
- 客户端与服务端代码组织
- 流式渲染入门

### 第13章: SSR 生产环境构建
**Demo工程**: `13-vite-ssr-build`

学习内容:
- SSR 生产构建配置
- 服务端 bundle 生成
- 客户端 bundle 生成
- 部署到 Node 服务

### 第14章: Monorepo 配置
**Demo工程**: `14-vite-monorepo`

学习内容:
- Monorepo 概念与优势
- 使用 pnpm workspace
- Vite 在 Monorepo 中的配置
- 跨包引用与依赖管理
- 构建与发布

### 第15章: 综合实战
**Demo工程**: `15-vite-comprehensive`

学习内容:
- 项目需求分析
- 完整项目搭建
- Vitest 单元测试集成
- 测试覆盖率配置
- CI/CD 集成

---

## 示例 README.md 结构

每个 Demo 工程的 README.md 将包含以下结构:

```markdown
# Chapter X: [章节标题]

## 本章概述
[简要介绍本章学习内容]

## 依赖包说明

| 依赖包 | 版本 | 说明 |
|--------|------|------|
| vite | ^7.3.1 | 核心构建工具 |
| @vitejs/plugin-vue | ^6.0.5 | Vue 插件，提供 .vue 文件支持 |
| vue | ^3.5.0 | Vue3 框架 |
| typescript | ^5.7.0 | TypeScript 支持 |
| sass | ^1.83.0 | SCSS 预处理器 |

## 关键配置
[展示关键配置文件内容]

## 知识点
[详细说明本章节的知识点]
```

---

## 注意事项

- 每个 Demo 都是独立可运行的项目
- 所有 Demo 使用 Vite v7 版本
- 代码保持简洁明了，突出学习重点
- README.md 详细说明每个依赖包的作用

---

*创建时间: 2026-03-27*
*更新时间: 2026-03-27*