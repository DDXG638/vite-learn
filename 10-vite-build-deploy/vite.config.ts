import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import analyzer from 'vite-bundle-analyzer'
// import legacy from '@vitejs/plugin-legacy'

export default defineConfig(({ mode }) => ({
  base: 'https://cdn.example.com/', // 静态资源放在cdn上
  // vue 预留的全局开关，如果设置为false，构建时将会把对应功能的相关代码移除，从而减少打包体积
  define: {
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  plugins: [
    vue(),
    mode === 'analyze' && analyzer({ analyzerMode: 'static' }),
    // legacy(),
  ],

  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue'],
        },
      },
    },
    manifest: true,
  },
}))