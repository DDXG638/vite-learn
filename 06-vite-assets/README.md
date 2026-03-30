# 第6章：静态资源处理

## 本章概述

本章将学习 Vite 的静态资源处理机制，包括 public 目录、导入图片/视频/字体、base64 内联以及资源路径处理。更多查看：https://cn.vite.dev/guide/features#static-assets

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

### public 目录

```
项目根目录/
├── public/          # 静态资源目录
│   ├── icons/
│   └── fonts/
└── src/
```

配置项：

```typescript
export default defineConfig({
  publicDir: 'public', // 默认值
})
```

### 资源导入方式

| 方式 | 说明 | 示例 |
|------|------|------|
| `?url` | 返回 URL 字符串 | `import img from './a.png?url'` |
| `?raw` | 返回原始字符串 | `import txt from './a.txt?raw'` |
| `?base64` | 返回 base64 | `import img from './a.png?base64'` |

## 知识点

### 1. public 目录

- 不会被 bundler 处理
- 直接复制到 dist 目录
- 通过绝对路径访问：`/icons/logo.svg`

### 2. 导入静态资源

```typescript
// src/assets/image.png
import imgUrl from './assets/image.png?url'
```

### 3. base64 内联

小文件（< 4KB）默认 base64 内联：

```typescript
assetsInlineLimit: 4096 // 默认 4KB
```

### 4. 资源路径处理

- 绝对路径：`/images/logo.png`（相对于 public）
- 相对路径：`./images/logo.png`（相对于当前文件）

## 思考题

1. public 目录和 src/assets 目录有什么区别？
2. 什么时候使用 base64 内联？
3. 如何导入文本文件的原始内容？