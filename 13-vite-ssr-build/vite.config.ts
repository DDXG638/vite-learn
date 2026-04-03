import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/test',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@client': resolve(__dirname, 'src/client'),
      '@server': resolve(__dirname, 'src/server')
    }
  },
  // 生产构建配置 (客户端)
  build: {
    // outDir: 'dist/client', // outDir 已经在cli命令中指定了
    sourcemap: true,
    // rollupOptions: {
    //   output: {
    //     entryFileNames: 'assets/[name]-[hash].js',
    //     chunkFileNames: 'assets/[name]-[hash].js',
    //     assetFileNames: 'assets/[name]-[hash][extname]'
    //   }
    // }
  },
  // SSR 构建配置
  ssr: {
    // noExternal 配置仅用于生产构建，开发模式不需要
  }
})
