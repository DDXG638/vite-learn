import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter } from './router'
import { ssrDataCache, setSsrData } from './stores/product'
import './styles/main.scss'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  const router = createRouter()

  app.use(pinia)
  app.use(router)

  return { app, pinia, router }
}

// 创建 app 实例（只调用一次）
const { app, pinia, router } = createApp()

// 客户端激活时尝试复用 SSR 数据
const restoreSsrState = () => {
  const stateEl = document.getElementById('ssr-state')
  if (stateEl) {
    try {
      const { pinia: piniaState, ssrData } = JSON.parse(stateEl.textContent || '{}')
      // 恢复 pinia 状态
      pinia.state.value = piniaState
      // 恢复 SSR 缓存数据
      if (ssrData) {
        Object.entries(ssrData).forEach(([key, value]) => {
          setSsrData(key, value)
        })
      }
      stateEl.remove()
    } catch (e) {
      console.error('Failed to restore SSR state:', e)
    }
  }
}

restoreSsrState()

router.isReady().then(() => {
  app.mount('#app')
})
