import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild, mode }) => {
  console.log('mode', mode)
  console.log('isSsrBuild', isSsrBuild)
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@client': resolve(__dirname, 'src/client'),
        '@server': resolve(__dirname, 'src/server')
      }
    },
    // SSR 开发服务器配置
    server: {
      port: 5173
    },
  }
})