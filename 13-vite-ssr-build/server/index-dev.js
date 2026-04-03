import express from 'express'
import { createServer as createViteServer } from 'vite'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

async function createServer() {
  const app = express()

  // 创建 Vite 开发服务器 (SSR 模式)
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // 使用 Vite 的中间件
  app.use(vite.middlewares)

  // SSR 渲染路由
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl
    try {
      // 1. 加载 index.html 模板
      const templatePath = resolve(root, 'index.html')
      const templateContent = readFileSync(templatePath, 'utf-8')
      let template = await vite.transformIndexHtml(url, templateContent)

      // 2. 加载服务端入口
      const { createApp } = await vite.ssrLoadModule('/src/server/entry-server.ts')

      // 3. 渲染应用
      const { app: appInstance } = createApp()
      const { renderToString } = await import('vue/server-renderer')
      const appHtml = await renderToString(appInstance)

      // 4. 注入 HTML
      const html = template.replace('<!--app-html-->', appHtml)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(3000, () => {
    console.log('SSR Dev Server: http://localhost:3000')
  })
}

createServer()
