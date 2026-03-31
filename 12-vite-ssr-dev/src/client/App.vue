<template>
  <div class="container">
    <h1>Vite SSR 开发服务器</h1>
    <div class="card">
      <h2>欢迎体验 SSR</h2>
      <p>当前时间: {{ currentTime }}</p>
      <p>渲染模式: 服务端渲染</p>
      <button @click="refreshTime">刷新时间</button>
    </div>
    <div class="info">
      <h3>SSR vs CSR 对比</h3>
      <ul>
        <li><strong>SSR:</strong> 服务端生成完整 HTML，首屏快 SEO 好</li>
        <li><strong>CSR:</strong> 客户端渲染，首屏慢 需要 JS 执行</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 判断是否在服务端渲染
// const isSSR = import.meta.env.SSR
const currentTime = ref('')

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN')
}

const refreshTime = () => {
  updateTime()
}

onMounted(() => {
  updateTime()
})
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  color: #42b883;
  text-align: center;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  margin: 20px 0;
}

.card h2 {
  margin-top: 0;
}

.card button {
  background: white;
  color: #667eea;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
}

.card button:hover {
  background: #f0f0f0;
}

.info {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
}

.info ul {
  padding-left: 20px;
}

.info li {
  margin: 8px 0;
  line-height: 1.6;
}
</style>