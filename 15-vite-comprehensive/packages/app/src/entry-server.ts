import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter } from './router'
import { useProductStore, ssrDataCache, clearSsrData } from './stores/product'
import './styles/main.scss'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  const router = createRouter()

  app.use(pinia)
  app.use(router)

  return { app, pinia, router }
}

// SSR 数据预取 - 根据路由预取所需数据
export async function fetchSsrData(
  pinia: ReturnType<typeof createPinia>,
  router: ReturnType<typeof createRouter>
) {
  // 清空上一次的 SSR 缓存
  clearSsrData()

  const productStore = useProductStore(pinia)
  const route = router.currentRoute.value

  // 预取商品列表
  await productStore.fetchProducts()

  // 如果是详情页，预取详情数据并存储到 SSR 缓存
  if (route.name === 'ProductDetail' && route.params.id) {
    const id = route.params.id as string
    const product = await productStore.fetchProduct(id)
    // 存储到 SSR 缓存，供客户端复用
    ssrDataCache[`/product/${id}`] = product
  }

  // 返回序列化的状态（包含 pinia state 和 SSR 缓存）
  return {
    pinia: pinia.state.value,
    ssrData: { ...ssrDataCache }
  }
}
