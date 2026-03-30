<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from './types'

const depInfo = ref<User[]>([])

onMounted(() => {
  depInfo.value = [
    { id: 1, name: '张三', email: 'test@example.com' }
  ]
})
</script>

<template>
  <div class="container">
    <h1>依赖预构建</h1>
    <p>验证 node_modules 中的依赖是否被预构建</p>
    <pre>{{ depInfo }}</pre>
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
h1 {
  color: #333;
}
pre {
  background: #f5f7fa;
  padding: 1rem;
  border-radius: 4px;
}
</style>