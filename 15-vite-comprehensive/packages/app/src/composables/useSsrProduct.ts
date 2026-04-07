import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore, getSsrData, setSsrData } from '../stores/product'

/**
 * 商品详情数据获取
 * - SSR 期间：从预取缓存同步读取
 * - 客户端导航：从 API 异步获取
 */
export function useSsrProduct() {
  const route = useRoute()
  const id = route.params.id as string
  const productStore = useProductStore()
  const product = ref<any | null>(null)
  const loading = ref(false)

  if (product.value && product.value.id === id) {
    product.value = getSsrData(`/product/${id}`)
    setSsrData(`/product/${id}`, null)
  }

  // const fetchProduct = async (id: string) => {
  //   loading.value = true
  //   try {
  //     // 优先从 SSR 缓存读取（仅 SSR 场景有效）
  //     const cached = getSsrData(`/product/${id}`)
  //     if (cached) {
  //       product.value = cached
  //       return
  //     }
  //     // 客户端：正常请求
  //     product.value = await productStore.fetchProduct(id)
  //   } finally {
  //     loading.value = false
  //   }
  // }

  // SSR 期间执行（onServerPrefetch 在 SSR 时同步调用）
  // onServerPrefetch(async () => {
  //   const id = route.params.id as string
  //   await fetchProduct(id)
  // })

  // 客户端挂载后执行（客户端导航时不会触发 onServerPrefetch）
  onMounted(async () => {
    // 如果 product 已有值（SSR 已填充），跳过
    if (!product.value) {
      product.value = await productStore.fetchProduct(id)
    }
  })

  return {
    product,
    loading,
    // fetchProduct
  }
}
