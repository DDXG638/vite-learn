<template>
  <div class="product-list">
    <h2 class="product-list__title">商品列表</h2>
    <div v-if="productStore.loading" class="product-list__loading">
      加载中...
    </div>
    <div v-else class="product-list__grid">
      <router-link
        v-for="(product, index) in productStore.products"
        :key="product.id"
        :to="`/product/${product.id}`"
        class="product-card"
      >
        <LazyImage
          :src="product.image"
          :alt="product.name"
          :first-screen="index < 6"
          aspect-ratio="1:1"
        />
        <div class="product-card__info">
          <h3 class="product-card__name">{{ product.name }}</h3>
          <p class="product-card__category">{{ product.category }}</p>
          <p class="product-card__price">{{ formatPrice(product.price) }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductStore } from '../stores/product'
import { LazyImage } from '@vite-comprehensive/components'
import { formatPrice } from '@vite-comprehensive/utils'

const productStore = useProductStore()

onMounted(() => {
  // 只有在数据为空时才请求（避免 SSR 场景下重复请求）
  if (productStore.products.length === 0) {
    productStore.fetchProducts()
  }
})
</script>

<style scoped lang="scss">
.product-list {
  &__title {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
  }

  &__loading {
    text-align: center;
    padding: 40px;
    color: #666;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &__info {
    padding: 12px;
  }

  &__name {
    font-size: 16px;
    margin: 0 0 4px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__category {
    font-size: 12px;
    color: #999;
    margin: 0 0 8px;
  }

  &__price {
    font-size: 18px;
    color: #ff4d4f;
    font-weight: bold;
    margin: 0;
  }
}
</style>
