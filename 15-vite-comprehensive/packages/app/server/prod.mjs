import express from 'express'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, existsSync } from 'fs'
import compression from 'compression'
import sirv from 'sirv'
import { pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const BASE = '/cool'

async function createServer() {
  const app = express()

  // 构建产物路径
  const clientDist = resolve(root, 'dist')
  const serverDist = resolve(root, 'dist', 'server')

  // 检查构建产物是否存在
  if (!existsSync(serverDist)) {
    console.error('错误: 构建产物不存在，请先运行 npm run ssr:build')
    process.exit(1)
  }

  // 生产环境：使用 compression 和 sirv 处理静态资源
  app.use(compression())

  // 使用 sirv 服务静态文件
  app.use(BASE + '/assets', sirv(clientDist + '/assets', {
    etag: true,
    maxAge: 31536000,
    immutable: true
  }))

  // SSR 渲染路由
  app.use(async (req, res, next) => {
    const url = req.originalUrl

    try {
      // 1. 读取 index.html 模板
      const templatePath = resolve(clientDist, 'index.html')
      let template = readFileSync(templatePath, 'utf-8')

      // 2. 加载服务端 bundle
      const entryServerPath = pathToFileURL(resolve(serverDist, 'entry-server.js')).href
      const { createApp, fetchSsrData } = await import(entryServerPath)

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
      console.error(e)
      next(e)
    }
  })

  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`SSR Production Server: http://localhost:${port}${BASE}`)
  })
}

createServer()
