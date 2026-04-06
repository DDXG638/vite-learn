import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import analyzer from 'vite-bundle-analyzer'

export default defineConfig(({ mode }) => {
  return {
    base: '/cool',
    plugins: [
      vue(),
      mode === 'analyze' && analyzer({ analyzerMode: 'static' }),
    ],
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
    define: {
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        },
        output: {
          manualChunks(id) {
            // 把依赖都打到vendor chunk中
            if (id.includes('node_modules')) {
              return 'vendor'
            }

            return null
          },
        }
      },
    },
    ssr: {
      noExternal: ['@vite-comprehensive/components', '@vite-comprehensive/utils']
    }
  }
})
