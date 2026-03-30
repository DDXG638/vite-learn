import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import analyzer from 'vite-bundle-analyzer'
import { vitePluginDemo } from './plugins/demo'

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  const isAnalyzeMode = mode === 'analyze'
  
  return {
    plugins: [
      vue(),
      isAnalyzeMode && analyzer({
        analyzerMode: 'static',
      }),
      isAnalyzeMode && vitePluginDemo(),
    ],

    build: {
      target: 'ES2020',
      sourcemap: 'hidden',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue'],
            'vendor-lodash': ['lodash-es'],
          },
          // manualChunks(id) {
          //   if (id.includes('node_modules')) {
          //     return 'vendor';
          //   }

          //   return null;
          // }
        },
      },
    },
  }
})