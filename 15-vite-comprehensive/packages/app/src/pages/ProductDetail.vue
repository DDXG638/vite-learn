<template>
  <div class="product-detail">
    <router-link to="/" class="product-detail__back">&larr; 返回列表</router-link>

    <div v-if="productStore.loading" class="product-detail__loading">
      加载中...
    </div>
    <div v-else-if="productStore.currentProduct" class="product-detail__content">
      <div class="product-detail__image">
        <LazyImage
          :src="productStore.currentProduct.image"
          :alt="productStore.currentProduct.name"
          :first-screen="true"
          aspect-ratio="1:1"
        />
      </div>
      <div class="product-detail__info">
        <h1 class="product-detail__name">{{ productStore.currentProduct.name }}</h1>
        <p class="product-detail__category">{{ productStore.currentProduct.category }}</p>
        <p class="product-detail__price">{{ formatPrice(productStore.currentProduct.price) }}</p>
        <p class="product-detail__description">{{ productStore.currentProduct.description }}</p>
        <p class="product-detail__stock">库存: {{ productStore.currentProduct.stock }}</p>
        <button class="product-detail__buy">立即购买</button>
      </div>
    </div>
    <div v-else class="product-detail__not-found">
      商品不存在
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/product'
import { LazyImage } from '@vite-comprehensive/components'
import { formatPrice } from '@vite-comprehensive/utils'

const route = useRoute()
const productStore = useProductStore()

onMounted(() => {
  const id = route.params.id as string
  productStore.fetchProduct(id)
})
</script>

<style scoped lang="scss">
.product-detail {
  &__back {
    display: inline-block;
    margin-bottom: 20px;
    color: #007aff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__loading,
  &__not-found {
    text-align: center;
    padding: 60px;
    color: #666;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__image {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &__info {
    padding: 20px 0;
  }

  &__name {
    font-size: 28px;
    margin: 0 0 8px;
    color: #333;
  }

  &__category {
    font-size: 14px;
    color: #999;
    margin: 0 0 16px;
  }

  &__price {
    font-size: 32px;
    color: #ff4d4f;
    font-weight: bold;
    margin: 0 0 20px;
  }

  &__description {
    font-size: 16px;
    color: #666;
    line-height: 1.6;
    margin: 0 0 16px;
  }

  &__stock {
    font-size: 14px;
    color: #999;
    margin: 0 0 24px;
  }

  &__buy {
    width: 100%;
    padding: 16px;
    background-color: #ff4d4f;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #ff7875;
    }
  }
}
</style>
