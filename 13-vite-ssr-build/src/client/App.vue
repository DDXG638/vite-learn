<template>
  <div class="container">
    <h1>Vite SSR 生产构建</h1>
    <div class="card">
      <h2>生产环境 SSR</h2>
      <p>当前时间: <span id="time">{{ currentTime }}</span></p>
      <p>渲染模式: 服务端渲染 + 客户端 hydrate</p>
      <p>构建类型: <strong>Production</strong></p>
    </div>
    <div class="info">
      <h3>生产构建 vs 开发构建</h3>
      <ul>
        <li><strong>代码压缩:</strong> 生产构建自动压缩代码</li>
        <li><strong>Tree-shaking:</strong> 移除未使用的代码</li>
        <li><strong>Sourcemap:</strong> 生成调试用的源映射</li>
        <li><strong>SSR Bundle:</strong> 服务端独立打包</li>
      </ul>
    </div>
    <div class="bundles">
      <h3>构建产物</h3>
      <div class="bundle-info">
        <div class="bundle-item">
          <span class="label">客户端 JS:</span>
          <code>dist/client/assets/*.js</code>
        </div>
        <div class="bundle-item">
          <span class="label">服务端 JS:</span>
          <code>dist/server/entry-server.js</code>
        </div>
        <div class="bundle-item">
          <span class="label">HTML 模板:</span>
          <code>dist/client/index.html</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentTime = ref('')

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN')
}

onMounted(() => {
  updateTime()
  // 客户端激活后的交互
  const timeEl = document.getElementById('time')
  if (timeEl) {
    timeEl.style.color = '#42b883'
    timeEl.style.fontWeight = 'bold'
  }
})
</script>

<style scoped>
.container {
  max-width: 700px;
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

.info {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
}

.info ul {
  padding-left: 20px;
}

.info li {
  margin: 8px 0;
  line-height: 1.6;
}

.bundles {
  background: #1a1a2e;
  padding: 20px;
  border-radius: 8px;
  color: #eee;
}

.bundles h3 {
  margin-top: 0;
  color: #42b883;
}

.bundle-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bundle-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.label {
  min-width: 100px;
  font-weight: bold;
  color: #667eea;
}

code {
  background: #2d2d44;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
}
</style>
