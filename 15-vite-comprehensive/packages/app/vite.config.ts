import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  base: '/cool',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, '../components/src'),
      '@utils': resolve(__dirname, '../utils/src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  ssr: {
    noExternal: ['@vite-comprehensive/components', '@vite-comprehensive/utils']
  }
})
