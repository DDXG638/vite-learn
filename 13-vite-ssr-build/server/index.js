import express from 'express'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, existsSync, readdirSync } from 'fs'
import compression from 'compression'
import sirv from 'sirv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const BASE = process.env.BASE || '/test'

// 动态查找服务端入口文件
function findServerEntry(serverDist) {
  // SSR 构建产物可能在 dist/server/assets/ 目录下
  const assetsDir = resolve(serverDist, 'assets')
  if (existsSync(assetsDir)) {
    const files = readdirSync(assetsDir)
    const entryFile = files.find(f => f.startsWith('entry-server-') && f.endsWith('.js'))
    if (entryFile) {
      return resolve(assetsDir, entryFile)
    }
  }
  // fallback: 直接在 serverDist 下查找
  const files = readdirSync(serverDist)
  const entryFile = files.find(f => f.startsWith('entry-server-') && f.endsWith('.js'))
  return entryFile ? resolve(serverDist, entryFile) : resolve(serverDist, 'entry-server.js')
}

async function createServer() {
  const app = express()

  // 构建产物路径
  const clientDist = resolve(root, 'dist', 'client')
  const serverDist = resolve(root, 'dist', 'server')

  // 检查构建产物是否存在
  if (!existsSync(clientDist) || !existsSync(serverDist)) {
    console.error('错误: 构建产物不存在，请先运行 npm run build')
    console.error('构建命令: npm run build')
    process.exit(1)
  }

  // 动态获取服务端入口
  const serverEntryPath = resolve(serverDist, 'entry-server.js')
  console.log('服务端入口:', serverEntryPath)
  console.log('BASE:', BASE)

  // 生产环境：使用 compression 和 sirv 处理静态资源
  // 注意：这里不使用 vite.middlewares，因为它是用于开发阶段的
  // 使用 Accept-Encoding/Content-Encoding Header查看是否支持压缩和是否开启压缩
  app.use(compression())

  // 使用 sirv 服务静态文件（dist/client 目录）
  // 仅处理 /assets/* 等路径
  app.use(BASE, sirv(clientDist, {
    etag: true,
    maxAge: 31536000,
    immutable: true
  }))

  // SSR 渲染路由必须放在静态文件服务之前
  // 这样 / 路由会先被 SSR 处理，其他路由（如 /assets/*）才会被 sirv 处理
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    // 跳过静态资源请求，让 sirv 处理
    // if (url.startsWith('/assets/') || url.startsWith('/@')) {
    //   return next()
    // }

    try {
      // 1. 读取 index.html 模板
      const templatePath = resolve(clientDist, 'index.html')
      const template = readFileSync(templatePath, 'utf-8')

      // 2. 加载服务端 bundle
      const { createApp } = await import(serverEntryPath)

      // 3. 渲染应用
      const { app: appInstance } = createApp({ url })
      const { renderToString } = await import('vue/server-renderer')
      const appHtml = await renderToString(appInstance)

      // 4. 注入 HTML
      const html = template.replace('<!--app-html-->', appHtml)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      console.error(e)
      next(e)
    }
  })

  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`SSR Production Server: http://localhost:${port}`)
    console.log(`静态资源路径: ${clientDist}`)
    console.log(`服务端 bundle: ${serverDist}`)
  })
}

createServer()
