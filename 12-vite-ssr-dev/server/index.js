import express from 'express'
import fs from 'node:fs'
import path from 'node:path'

const __dirname = import.meta.dirname

/**
 * 收集模块及其所有依赖中的 CSS
 * @param {object} vite - Vite 开发服务器实例
 * @param {string} entryUrl - 入口模块 URL
 * @returns {Promise<string>} 内联的 CSS 内容
 */
async function collectInlineCSS(vite, entryUrl) {
  const cssUrls = new Set()
  const vueStyleUrls = new Set()
  const visited = new Set()

  // 判断是否为纯 CSS 模块
  const isPureCSSModule = (url) => {
    return url.endsWith('.css') && !url.includes('type=style')
  }

  // 判断是否为 Vue 组件的 style
  const isVueStyleModule = (url) => {
    return url.includes('type=style') && url.includes('.vue')
  }

  // 获取模块的实际路径（去掉查询参数）
  const resolveUrl = (url) => {
    return url.split('?')[0]
  }

  // 递归遍历模块图，收集所有 CSS 模块
  const traverse = async (url) => {
    if (!url || visited.has(url)) return
    visited.add(url)

    const mod = await vite.moduleGraph.getModuleByUrl(url)
    if (!mod) return

    // 遍历该模块导入的所有模块
    for (const importedMod of mod.importedModules) {
      const importedUrl = importedMod.url

      // 检查是否为 CSS 文件
      if (isPureCSSModule(importedUrl)) {
        cssUrls.add(resolveUrl(importedUrl))
      } else if (isVueStyleModule(importedUrl)) {
        // 记录 Vue 组件的 style URL
        vueStyleUrls.add(importedUrl)
      }

      // 继续递归遍历
      await traverse(importedUrl)
    }
  }

  await traverse(entryUrl)

  let cssContent = ''

  // 处理纯 CSS 文件
  for (const cssUrl of cssUrls) {
    try {
      const cssPath = path.resolve(__dirname, '..', cssUrl)
      if (fs.existsSync(cssPath)) {
        const content = fs.readFileSync(cssPath, 'utf-8')
        cssContent += content + '\n'
      }
    } catch (e) {
      console.warn(`Failed to load CSS: ${cssUrl}`, e.message)
    }
  }

  // 处理 Vue 组件的 style
  for (const vueStyleUrl of vueStyleUrls) {
    try {
      // 使用 Vite 加载 Vue 组件的 style 模块
      const cssModule = await vite.ssrLoadModule(vueStyleUrl)
      if (typeof cssModule === 'string') {
        cssContent += cssModule + '\n'
      }
    } catch (e) {
      console.warn(`Failed to load Vue style: ${vueStyleUrl}`, e.message)
    }
  }

  return cssContent
}

async function createServer() {
  const app = express()

  // 加载 Vite
  const { createServer: createViteServer } = await import('vite')

  // 创建 Vite 开发服务器 (SSR 模式)
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // 使用 Vite 的中间件处理静态资源和 HMR
  app.use(vite.middlewares)

  // SSR 流式渲染路由
  app.use('/stream', async (req, res, next) => {
    const url = req.originalUrl

    console.log('流式渲染')

    try {
      // 1. 读取 index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, '../index.html'),
        'utf-8',
      )
      template = await vite.transformIndexHtml(url, template)

      // 2. 加载服务端入口模块
      const { createApp } = await vite.ssrLoadModule('/src/server/entry-server.ts')

      // 3. 创建 SSR 应用
      const { app: appInstance } = createApp()

      // 4. 流式渲染
      const { renderToNodeStream } = await import('vue/server-renderer')

      // 设置响应头
      res.status(200).set({
        'Content-Type': 'text/html',
        'Transfer-Encoding': 'chunked'
      })

      // 拆分 HTML 为开始部分和结束部分
      const htmlStart = template.split('<!--app-html-->')[0]
      const htmlEnd = template.split('<!--app-html-->')[1]

      // 发送 HTML 开始部分
      res.write(htmlStart)

      // 创建流并 pipe 到响应
      const stream = renderToNodeStream(appInstance)

      stream.on('data', (chunk) => {
        res.write(chunk.toString())
      })

      stream.on('end', () => {
        res.write(htmlEnd)
        res.end()
      })

      stream.on('error', (err) => {
        console.error('Stream error:', err)
        res.status(500).end('Stream error')
      })
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  // SSR 渲染路由（普通模式）- 放在 /stream 之后
  // 需要确保 /stream 不匹配到 /
  app.use('/', async (req, res, next) => {
    const url = req.originalUrl

    // 跳过 /stream 路由
    if (url === '/stream') {
      return next()
    }

    console.log('普通模式')

    try {
      // 1. 读取 index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, '../index.html'),
        'utf-8',
      )
      template = await vite.transformIndexHtml(url, template)

      // 2. 加载服务端入口模块
      const { createApp } = await vite.ssrLoadModule('/src/server/entry-server.ts')

      // 3. 创建 SSR 应用
      const { app: appInstance } = createApp()

      // 4. 服务端渲染
      const { renderToString } = await import('vue/server-renderer')
      const appHtml = await renderToString(appInstance)

      // 5. 注入渲染结果到 HTML
      const html = template.replace('<!--app-html-->', appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(3000, () => {
    console.log('SSR Dev Server: http://localhost:3000')
    console.log('  - 普通模式: http://localhost:3000/')
    console.log('  - 流式渲染: http://localhost:3000/stream')
  })
}

createServer()