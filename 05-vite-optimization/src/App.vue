<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { chunk } from 'lodash-es'

const cardComp = defineAsyncComponent(() => import('./components/Card.vue'))
const buttonComp = defineAsyncComponent(() => import('./components/Button.vue'))

const message = ref('Vite 代码分割演示')
const chunkInfo = ref('')

onMounted(() => {
  // 使用 lodash
  const arr = [1, 2, 3, 4, 5]
  chunkInfo.value = `lodash chunk: ${JSON.stringify(chunk(arr, 2))}`
})
</script>

<template>
  <div class="container">
    <h1>{{ message }}</h1>
    <p>{{ chunkInfo }}</p>
    <card-comp />
    <button-comp />
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
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

h1 {
  color: #fff;
  font-size: 3rem;
}

p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
}
</style>