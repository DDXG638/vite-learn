<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Vite 生产构建演示')
const buildInfo = {
  target: 'es2020',
  minify: 'terser',
  sourcemap: false,
}
</script>

<template>
  <div class="container">
    <h1>{{ message }}</h1>
    <section>
      <h2>构建配置</h2>
      <pre>{{ JSON.stringify(buildInfo, null, 2) }}</pre>
    </section>
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
  font-family: 'PingFang SC', sans-serif;
}
h1 {
  color: #333;
}
section h2 {
  margin-top: 1.5rem;
  color: #666;
}
pre {
  background: #f5f7fa;
  padding: 1rem;
  border-radius: 4px;
}
</style>