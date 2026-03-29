import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePluginDemo } from './plugins/demo'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vitePluginDemo(),
  ],
})