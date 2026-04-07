import express from 'express'
import { createServer as createViteServer } from 'vite'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = '/cool'

async function createServer() {
  const app = express()

  // 创建 Vite 开发服务器 (SSR 模式)
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: BASE
  })

  // 使用 Vite 的中间件
  app.use(vite.middlewares)

  // SSR 渲染路由
  app.use(async (req, res, next) => {
    const url = req.originalUrl
    try {
      // 1. 加载 index.html 模板
      const templatePath = resolve(__dirname, '../index.html')
      const templateContent = readFileSync(templatePath, 'utf-8')
      let template = await vite.transformIndexHtml(url, templateContent)

      // 2. 加载服务端入口
      const { createApp, fetchSsrData } = await vite.ssrLoadModule('/src/entry-server.ts')

      // 3. 创建 app 实例
      const { app: appInstance, pinia, router } = createApp()

      // 4. 路由跳转并等待完成
      const path = url.slice(BASE.length) || '/'
      await router.push(path)
      await router.isReady()

      // 5. 预取 SSR 数据（路由导航完成后根据路由预取）
      const ssrState = await fetchSsrData(pinia, router)

      // 6. 渲染
      const { renderToString } = await import('vue/server-renderer')
      const appHtml = await renderToString(appInstance)

      // 7. 注入 state 到 HTML
      const stateScript = `<script id="ssr-state" type="application/json">${JSON.stringify(ssrState)}</script>`

      // 5. 注入 HTML
      const html = template
        .replace('<!--app-html-->', appHtml)
        .replace('</body>', `${stateScript}</body>`)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(3000, () => {
    console.log(`SSR Dev Server: http://localhost:3000${BASE}`)
  })
}

createServer()
