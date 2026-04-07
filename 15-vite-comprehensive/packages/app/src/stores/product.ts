import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProductList, getProductDetail } from '../api/products'

// SSR 数据缓存 - 独立于 store，用于存储服务端预取的数据
// 数据结构: { '/product/1': { id: 1, name: '...', ... } }
export const ssrDataCache: Record<string, any> = {}

/**
 * 清空 SSR 缓存
 */
export function clearSsrData() {
  Object.keys(ssrDataCache).forEach(key => delete ssrDataCache[key])
}

/**
 * 设置 SSR 预取的数据
 */
export function setSsrData(key: string, data: any) {
  ssrDataCache[key] = data
}

/**
 * 获取 SSR 预取的数据
 */
export function getSsrData(key: string): any {
  return ssrDataCache[key]
}

export const useProductStore = defineStore('product', () => {
  const products = ref<any[]>([])
  const loading = ref(false)

  async function fetchProducts() {
    loading.value = true
    try {
      products.value = await getProductList()
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id: string) {
    loading.value = true
    try {
      // 优先从 SSR 缓存读取，避免重复请求
      const cacheKey = `/product/${id}`
      if (ssrDataCache[cacheKey]) {
        const data = ssrDataCache[cacheKey]
        delete ssrDataCache[cacheKey] // 读取后清除，避免内存泄漏
        return data
      }
      return await getProductDetail(id)
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    fetchProducts,
    fetchProduct
  }
})
