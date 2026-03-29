import type { Plugin } from 'vite'

/**
 * 自定义 Vite 插件示例
 * 展示插件的基本结构和常用钩子函数
 */

/**
 * Rollup 钩子类型说明：
 *
 * 1. Build Hooks（构建阶段）
 *    - buildStart: 开始构建时调用（async）
 *    - buildEnd: 构建结束时调用
 *    - closeBundle: Bundle 关闭时调用
 *
 * 2. Module Hooks（模块阶段）
 *    - resolveId: 解析模块 ID（最重要）
 *    - load: 加载模块内容
 *    - transform: 转换代码
 *
 * 3. Output Bundle Hooks（输出阶段）
 *    - renderStart: 开始渲染 bundle
 *    - renderChunk: 渲染每个 chunk
 *    - generateBundle: 生成 bundle 文件
 *    - writeBundle: 写入 bundle 到文件
 *
 * 4. Watch Hooks（监听模式）
 *    - watchChange: 文件变化时调用
 *    - closeWatcher: 关闭监听时调用
 *
 * Vite 独有钩子：
 *    - config: 修改 Vite 配置
 *    - configResolved: 配置解析完成
 *    - configureServer: 配置开发服务器
 *    - transformIndexHtml: 转换 index.html
 *    - handleHotUpdate: 处理热更新
 */

export function vitePluginDemo(): Plugin {
  return {
    name: 'vite-plugin-demo',
    enforce: 'pre', // 在其他插件之前执行

    // ====== 配置钩子 ======
    config(config, env) {
      console.log('\n[1/Build] config - Vite 配置加载')
      console.log('  root:', config)
      console.log('  mode:', env.mode)
      return null // 不修改配置
    },

    configResolved(_config) {
      console.log('\n[2/Build] configResolved - 配置解析完成')
      console.log('  plugins:', _config.plugins.map((p) => p.name).join(', '))
    },

    // ====== 构建钩子 ======
    buildStart(_options) {
      console.log('\n[3/Build] buildStart - 构建开始')
    },

    // ====== 模块钩子 ======
    resolveId(source, importer, _options) {
      // 处理虚拟模块
      if (source.startsWith('virtual:')) {
        console.log('\n[4/Module] resolveId - 解析模块 ID')
        console.log('  source:', source)
        console.log('  importer:', importer)
        return { id: source }
      } else if (!source.includes('node_modules')) {
        console.log('\n[4/Module] resolveId - 解析模块 ID')
        console.log('  source:', source)
        console.log('  importer:', importer)
      }
      return null // 交给下一个插件处理
    },

    load(id) {
      // 处理虚拟模块
      if (id.startsWith('virtual:')) {
        console.log('\n[5/Module] load - 加载模块')
        console.log('  id:', id)
        return 'export default "Hello from virtual module"'
      } else if (!id.includes('node_modules')) {
        console.log('\n[5/Module] load - 加载模块')
        console.log('  id:', id)
      }
      return null
    },

    transform(code, id) {
      // 转换特定文件
      if (id.endsWith('.vue')) {
        console.log('\n[6/Module] transform - 转换代码')
        console.log('  id:', id.split('/').pop())
        console.log('  code length:', code.length)
      } else if (!id.includes('node_modules')) {
        console.log('\n[6/Module] transform - 转换代码')
        console.log('  id:', id.split('/').pop())
        console.log('  code length:', code.length)
      }

      // 可以返回 { code, map } 来替换代码
      return null
    },

    // ====== 输出钩子 ======
    renderStart(_outputOptions) {
      console.log('\n[7/Output] renderStart - 开始渲染 bundle')
    },

    renderChunk(code, chunkInfo) {
      console.log('\n[8/Output] renderChunk - 渲染 Chunk')
      console.log('  name:', chunkInfo.name)
      console.log('  code size:', code.length)
      return null // 不修改 chunk
    },

    generateBundle(_options, bundle) {
      console.log('\n[9/Output] generateBundle - 生成文件')
      Object.keys(bundle).forEach((key) => {
        console.log('  file:', key)
      })
    },

    writeBundle(_options, bundle) {
      console.log('\n[10/Output] writeBundle - 写入文件')
      console.log('  bundle keys:', Object.keys(bundle).join(', '))
    },

    buildEnd(_error?) {
      console.log('\n[11/Build] buildEnd - 构建结束')
    },

    closeBundle() {
      console.log('\n[12/Build] closeBundle - Bundle 关闭\n')
    },

    // ====== Vite 独有钩子 ======
    configureServer(server) {
      console.log('\n[Vite] configureServer - 配置开发服务器')
      console.log('  port:', server.resolvedUrls?.local?.[0]?.split(':').pop())
    },

    transformIndexHtml(html) {
      console.log('\n[Vite] transformIndexHtml - 转换 HTML')
      console.log('  html length:', html.length)
      return html // 不修改
    },

    handleHotUpdate(ctx) {
      console.log('\n[Vite] handleHotUpdate - 热更新')
      console.log('  file:', ctx.file)
      console.log('  modules:', ctx.modules.map((m) => m.id).join(', '))
      // 可以手动处理热更新，返回修改过的模块
      return undefined
    },
  }
}