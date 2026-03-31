import { createSSRApp } from 'vue'
import App from '../client/App.vue'

// 服务端渲染入口
export function createApp(context = {}) {
  const app = createSSRApp(App, context)
  return {
    app
  }
}