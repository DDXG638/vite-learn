import type { Plugin } from 'vite'

export function vitePluginDemo(): Plugin {
  return {
    name: 'vite-plugin-demo',
    enforce: 'pre', // 在其他插件之前执行

    configResolved(_config) {
      console.log('\n[2/Build] configResolved - 配置解析完成')
      console.log(JSON.stringify(_config.build, null, 2))
    }
  }
}
