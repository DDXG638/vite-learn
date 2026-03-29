# Chapter 1: Vite 基础入门

## 本章概述

本章是 Vite 学习之旅的起点，我们将从零开始创建一个 Vite 项目，了解 Vite 的核心概念、项目结构以及开发服务器的工作原理。通过一个简单的 Vue 3 计数器示例，直观体验 Vite 的热更新（HMR）功能。

## 依赖包说明

| 依赖包 | 版本 | 说明 |
|--------|------|------|
| vite | ^7.0.5 | Vite 核心构建工具，提供开发服务器和构建功能 |
| @vitejs/plugin-vue | ^6.0.5 | Vite 官方 Vue 插件，处理 .vue 单文件组件的编译 |
| vue | ^3.5.13 | Vue 3 渐进式前端框架 |
| typescript | ~5.7.3 | TypeScript JavaScript 超集，提供类型检查 |
| vue-tsc | ^2.2.0 | TypeScript 的 Vue 类型检查工具，基于 vue-tsc |
| sass | ^1.83.4 | CSS 预处理器，支持 SCSS/SASS 语法 |

## 项目结构

```
01-vite-basics/
├── index.html          # 入口 HTML 文件
├── package.json        # 项目配置
├── vite.config.ts      # Vite 配置文件
├── tsconfig.json       # TypeScript 配置
├── src/
│   ├── main.ts         # 入口 JS 文件
│   ├── App.vue         # 根组件
│   ├── style.scss      # 全局样式
│   └── vite-env.d.ts   # Vite 类型定义
└── public/
    └── vite.svg        # 静态资源（可选）
```

## 关键配置

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})
```

- `defineConfig`: Vite 提供的类型化配置函数，提供 IDE 类型提示
- `plugins`: 插件数组，`vue()` 插件负责解析 .vue 文件并转换为 JavaScript

### index.html

```html
<script type="module" src="/src/main.ts"></script>
```

关键点：使用 `type="module"` 使浏览器以 ES Module 方式加载脚本。

## 知识点

### 1. Vite 是什么

Vite 是一个基于浏览器原生 ES Module 的下一代前端构建工具。它的核心优势：

- **极速冷启动**: 利用浏览器原生 ES Module，无需等待打包
- **热更新 (HMR)**: 基于 ES Module 的热更新，速度与项目规模无关
- **构建优化**: 内置 Rollup 进行高效打包，支持代码分割

### 2. ESBuild 的作用

Vite 在开发阶段使用 [ESBuild](https://esbuild.github.io/) 进行：

- **依赖预构建**: 将 node_modules 中的 CommonJS 模块转换为 ES Module
- **代码转译**: 将 TypeScript、JSX 等转换为浏览器可执行的 JavaScript

ESBuild 是用 Go 编写的打包工具，比传统的 webpack/terser 快 10-100 倍。

### 3. 开发服务器原理

```
┌─────────────────────────────────────────────┐
│              浏览器 (ES Module)              │
│    import('./src/App.vue') → 请求模块       │
└──────────────────────┬──────────────────────┘
                       │ HTTP Request
                       ▼
┌─────────────────────────────────────────────┐
│              Vite Dev Server                 │
│    ┌─────────────┐    ┌─────────────┐      │
│    │ 中间件层    │ →  │ ESBuild     │      │
│    │ (处理请求)  │    │ (转译代码)  │      │
│    └─────────────┘    └─────────────┘      │
└─────────────────────────────────────────────┘
```

1. 浏览器发起 ES Module 请求
2. Vite 拦截请求，交给 ESBuild 处理
3. ESBuild 返回转换后的 JavaScript
4. 浏览器执行并渲染

### 4. 热更新 (HMR) 原理

#### 4.1 HMR 整体流程

```
┌─────────────────┐     修改文件      ┌─────────────────┐
│   文件系统      │ ─────────────→   │  Vite Dev Server │
└─────────────────┘                   └────────┬────────┘
                                                │
                                                │ 通知
                                                ▼
                                        ┌─────────────────┐
                                        │  WebSocket      │
                                        └────────┬────────┘
                                                 │
                                                 │ 推送更新消息
                                                 ▼
                                        ┌─────────────────┐
                                        │   浏览器端      │
                                        │  (HMR Client)   │
                                        └────────┬────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │  @vitejs/plugin-vue
                                        │  (处理 Vue 组件) │
                                        └─────────────────┘
```

#### 4.2 修改 .vue 文件后的详细流程

**Step 1: 文件变更监听**
- Vite 使用 [chokidar](https://github.com/paulmillr/chokidar) 监听项目文件变化
- 当 `.vue` 文件被修改时，Vite 知道需要触发 HMR

**Step 2: 定位模块依赖**
- Vite 通过内部的依赖图（Module Graph）找到受影响的模块
- 例如修改 `App.vue`，Vite 知道它被 `main.ts` 引用

**Step 3: 生成更新后的模块**
- ESBuild 重新编译修改后的 `.vue` 文件
- 生成新的 JavaScript 模块代码

**Step 4: 推送消息到浏览器**
- Vite 通过 WebSocket 向浏览器发送更新消息
- 消息包含：更新的模块路径、是否需要强制刷新等

**Step 5: 浏览器执行 HMR**
- HMR Client 接收消息，调用对应的更新处理器
- 对于 Vue 组件，交给 `@vitejs/plugin-vue` 注入的 runtime 处理

#### 4.3 为什么是组件级更新而非页面刷新

这个功能是vue组件内部实现的，关键在于 `@vitejs/plugin-vue` 插件做了以下事情：

**1. 模板编译阶段注入 HMR 代码**
```javascript
// plugin-vue 编译后的代码大致如下
import { createApp } from 'vue'
import App from './App.vue'

// HMR runtime 注入
if (import.meta.hot) {
  import.meta.hot.accept()
}

// 组件创建时注册 HMR 回调
const app = createApp(App)

// 如果是 HMR 模式，保留组件实例并更新
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // 只更新组件内容，不重建整个应用
    app.component('App', newModule.default)
  })
}
```

**2. Vue 组件的 HMR API**
- `@vitejs/plugin-vue` 在编译时注入了 `__VUE_HMR_RUNTIME__` 对象
- 包含组件的更新方法、接受器等
- Vue 的 runtime 会利用这个对象来执行热更新

```javascript
// 编译后的组件大致结构
export default {
  // ... 组件选项
  __VUE_HMR_RUNTIME__: {
    // 组件实例的更新方法
    rerender() {
      // 根据新的_sfc_render函数，重新渲染
      // 保留组件内部状态，组件的生命周期钩子不会重复执行
      // 只改变<template>部分会走此逻辑
    },
    reload() {
      // 组件重新reload，类似整个组件重新挂载
      // 组件内部状态会重置，生命周期钩子会重新执行
      // 修改了<script>中的代码会走此逻辑
    }
  }
}
```

**3. Vite 客户端（HMR Client）**

Vite 在浏览器中注入的 HMR Client (`vite/dist/client/client.js`) 负责：

核心代码逻辑：
```javascript
// 简化版 HMR 流程
socket.onmessage = async (event) => {
  const { type, path, timestamp } = JSON.parse(event.data)

  if (type === 'update') {
    // 1. 获取新模块
    const newModule = await import(path + '?t=' + timestamp)

    // 2. 查找该模块的 accept 回调
    const accept = acceptedModules.get(path)
    if (accept) {
      // 3. 执行 accept 回调，实现热更新
      accept(newModule)
    }
  }
}
```

@vitejs/plugin-vue 处理后的示例代码，包含热更新部分

``` javascript
import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/Counter.vue");import { defineComponent as _defineComponent } from "/node_modules/.vite/deps/vue.js?v=d006a5be";
import { ref, onMounted } from "/node_modules/.vite/deps/vue.js?v=d006a5be";
import { getUserInfo } from "/src/utils/index.ts?t=1774598776700";
// vue组件<script>模块 @vitejs/plugin-vue编译后的代码
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "Counter",
  setup(__props, { expose: __expose }) {
    __expose();
    const count = ref(0);
    const handleClick = () => {
      const userInfo = getUserInfo();
      console.log("== userInfo ==", userInfo);
      count.value++;
    };
    console.log("=======Counter========++");
    onMounted(() => {
      console.log("== Counter.onMounted ==");
    });
    const __returned__ = { count, handleClick };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "/node_modules/.vite/deps/vue.js?v=d006a5be";
// vue组件<template>模块 @vitejs/plugin-vue编译后的代码
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _openBlock(), _createElementBlock("div", null, [
    _createElementVNode(
      "div",
      null,
      "计数器4：" + _toDisplayString($setup.count),
      1
      /* TEXT */
    ),
    _createElementVNode("button", { onClick: $setup.handleClick }, "点击我增加")
  ]);
}
_sfc_main.__hmrId = "9bd91872";
// __VUE_HMR_RUNTIME__ 由@vitejs/plugin-vue 在编译时注入，包含热更新相关的方法
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main);
// 导出是否 只重新渲染 的标识
export const _rerender_only = __VUE_HMR_RUNTIME__.CHANGED_FILE === "/Users/dori/Documents/code/ai-learn/vite-learn/01-vite-basics/src/components/Counter.vue";
import.meta.hot.on("file-changed", ({ file }) => {
  __VUE_HMR_RUNTIME__.CHANGED_FILE = file;
});
// 为此模块注册accpet函数
import.meta.hot.accept((mod) => {
  if (!mod) return;
  const { default: updated, _rerender_only: _rerender_only2 } = mod;
  if (_rerender_only2) {
    // 如果只rerender，就调rerender方法
    // 根据新的_sfc_render函数，重新渲染
    // 保留组件内部状态，组件的生命周期钩子不会重复执行
    // 只改变<template>部分会走此逻辑
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render);
  } else {
    // 组件重新reload，类似整个组件重新挂载
    // 组件内部状态会重置，生命周期钩子会重新执行
    // 修改了<script>中的代码会走此逻辑
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated);
  }
});
import _export_sfc from "/@id/__x00__plugin-vue:export-helper";
export default /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/dori/Documents/code/ai-learn/vite-learn/01-vite-basics/src/components/Counter.vue"]]);

```

#### 4.4 热更新边界

热更新边界是vue组件，vue组件 -> utils.ts -> user.ts. 如果修改了user.ts，vue组件会更新，vue组件的编译结果中，utils.ts?t=xxx，t参数会变化，更新vue组件的时候，会一并请求最新的 utils.ts 文件

如果是 main.ts -> log.ts， log.ts文件修改后，应为log.ts的importers没有vue组件，那无法实现组件级别热更新，会刷新页面。

**依赖链传递更新**：

- 当 js 更新时，Vite 底层会自动向上传递更新信号到引用它的边界模块(Vue 组件)
- Vue 插件直接重新执行组件脚本、更新导入的变量、触发重渲染

**变量替换**：靠 ESM 活绑定，指针不变，Vite 替换指针指向的值

#### 4.5 Vite 的核心突破思路

Vite 不试图 “修改” 浏览器原生 Module Map，而是通过两个关键技术绕开限制，实现模块热替换：

- 自定义运行时：在浏览器端注入 Vite 自己的模块加载器（Vite 7 使用 Rolldown 运行时）
- URL 指纹策略：为每个模块生成唯一 URL（添加时间戳或版本号），让浏览器认为是新模块
- ESM 活绑定：利用 ES Module 导出的 “只读引用” 特性，实现变量的自动更新Vite

#### 4.6 Rolldown 运行时 如何接管浏览器的Module Map

1. 模块加载拦截：所有模块导入都通过 Vite 运行时处理，而非直接使用浏览器原生加载器
2. 缓存管理控制：运行时维护自己的模块缓存，决定何时加载新模块、何时使用缓存
3. URL 生成策略：运行时控制模块 URL 的生成，确保浏览器加载最新版本

## 5. 项目启动命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 思考题

### 1. Vite 为什么能实现快速的冷启动？

Vite 实现快速冷启动的核心原因是**利用浏览器原生 ES Module 支持**，无需像 Webpack 那样进行完整的 bundling：

- **不打包源码**：开发环境下不对源码进行打包，而是通过原生 ES Module 直接加载源文件
- **按需加载**：只有当浏览器请求某个模块时才进行转换和提供，而不是预先处理整个项目
- **预构建依赖**：对 `node_modules` 中的 CommonJS 依赖进行预构建为 ES Module 格式，避免了大量小模块的请求开销
- **并行处理**：利用 ESBuild 的高并行性快速处理模块转换

### 2. ESBuild 和 Rollup 在 Vite 中分别扮演什么角色？

| 角色 | ESBuild | Rollup |
|------|--------|--------|
| **开发阶段** | 负责模块转换（.ts/.vue 等 → JS）、依赖预构建 | 不参与 |
| **生产阶段** | 负责 `.ts` 文件的转译 | 负责最终 bundle 生成 |
| **定位** | 快速的转译工具（transform） | 专业的大规模代码打包工具 |

简单来说：ESBuild 负责"快"（转译），Rollup 负责"好"（高质量打包）。

### 3. 浏览器是如何加载 ES Module 的？

1. **解析入口文件**：浏览器解析 `<script type="module">` 的 `src` 属性或内联代码
2. **发现依赖**：通过静态分析 `import` 语句找到所有依赖模块
3. **发起请求**：浏览器发起 HTTP 请求获取每个依赖模块
4. **递归处理**：对每个依赖模块重复步骤 2-3，直到所有模块加载完成
5. **构建模块图**：浏览器将所有模块链接成完整的模块依赖图
6. **执行代码**：按照依赖顺序依次执行各模块代码

关键点：ES Module 使用 `import` 和 `export` 进行静态导入/导出，浏览器可以在解析阶段就确定依赖关系，实现并行加载。

## 下章预告

下一章我们将学习 Vite 的插件系统，了解常用官方插件的使用，以及如何开发自定义插件。