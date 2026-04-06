import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter } from './router'
import './styles/main.scss'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  const router = createRouter()

  app.use(pinia)
  app.use(router)

  return { app, router }
}

// 客户端激活
if (typeof window !== 'undefined') {
  const { app, router } = createApp()
  router.isReady().then(() => {
    app.mount('#app')
  })
}
