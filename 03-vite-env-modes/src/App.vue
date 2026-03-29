<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// 导入环境变量
const envMessage = ref('')

// 在模板中使用的计算属性
const appTitle = computed(() => import.meta.env.VITE_APP_TITLE || 'Vite App')

onMounted(() => {
  // 打印环境变量到控制台查看
  console.log('VITE_APP_TITLE:', import.meta.env.VITE_APP_TITLE)
  console.log('VITE_APP_VERSION:', import.meta.env.VITE_APP_VERSION)
  console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
  console.log('MODE:', import.meta.env.MODE)
  console.log('DEV:', import.meta.env.DEV)
  console.log('PROD:', import.meta.env.PROD)

  envMessage.value = `环境: ${import.meta.env.MODE}, 版本: ${import.meta.env.VITE_APP_VERSION}`
})

const handleClick = () => {
  console.log('API URL:', import.meta.env.VITE_API_BASE_URL)
}
</script>

<template>
  <div class="container">
    <h1>{{ appTitle }}</h1>
    <p>{{ envMessage }}</p>
    <button @click="handleClick">查看 API 地址</button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container h1 {
  color: #fff;
  font-size: 3rem;
  margin-bottom: 1rem;
}

.container p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.container button {
  padding: 12px 24px;
  font-size: 1rem;
  color: #667eea;
  background: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.container button:hover {
  transform: scale(1.05);
}
</style>