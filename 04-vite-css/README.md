# 第4章：CSS 处理

## 本章概述

本章将学习 Vite 的 CSS 处理机制，包括 CSS 模块化、PostCSS 配置、SCSS 预处理器集成以及 CSS 代码分割。

## 依赖包说明

| 依赖包 | 版本 | 说明 |
|-------|------|------|
| vite | ^7.0.5 | 核心构建工具 |
| @vitejs/plugin-vue | ^6.0.5 | Vue 插件 |
| vue | ^3.5.13 | Vue3 框架 |
| sass | ^1.83.4 | SCSS 预处理器 |
| postcss | ^8.5.3 | CSS 后处理器 |
| autoprefixer | ^10.4.21 | 自动添加浏览器前缀 |

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

### PostCSS 配置

vite 内置了 PostCSS，所以项目不需要安装 PostCSS 的依赖。

PostCSS 的插件的依赖需要安装，比如 autoprefixer 插件。

Autoprefixer 依赖 browserslist 决定兼容范围，如果不配置，会默认兼容最新浏览器，不会加前缀！

```javascript
// postcss.config.js
export default {
  plugins: {
    autoprefixer: {},
  },
}
```

### SCSS 配置

Vite 内置支持 SCSS，无需额外配置。但是需要安装sass依赖，推荐安装 sass-embedded 依赖。

## 知识点

### 1. CSS 模块化

Vue SFC 自动启用 CSS 模块化：

```vue
<style module>
.card { ... }
</style>

<script setup>
import styles from './Component.module.css'
// styles.card
</script>
```

### 2. PostCSS 配置

PostCSS 通过 `postcss.config.js` 配置：

```javascript
export default {
  plugins: {
    autoprefixer: {},
    // 其他插件...
  },
}
```

### 3. SCSS 嵌套

支持 SCSS 嵌套语法：

```scss
.parent {
  .child {
    color: red;
  }
}
```

### 4. CSS 代码分割

Vite 自动将 CSS 提取为单独文件，支持 `injectDynamic` 选项。

### 5. 全局样式

```typescript
// main.ts
import './styles/main.css'
```

### 6. CSS 变量

```css
:root {
  --primary-color: #409eff;
}
```

## 思考题

1. CSS 模块化和普通 CSS 有什么区别？
2. PostCSS 的主要作用是什么？
3. 如何在 Vue 组件中使用 SCSS？
4. Vite 如何处理 CSS 代码分割？