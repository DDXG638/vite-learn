import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProductList, getProductDetail } from '../api/products'

export const useProductStore = defineStore('product', () => {
  const products = ref<any[]>([])
  const currentProduct = ref<any | null>(null)
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
      currentProduct.value = await getProductDetail(id)
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    currentProduct,
    loading,
    fetchProducts,
    fetchProduct
  }
})
