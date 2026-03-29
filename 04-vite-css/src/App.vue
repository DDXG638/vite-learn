<script setup lang="ts">
import Button from './components/Button.vue'
import Card from './components/Card.vue'
</script>

<template>
  <div class="app">
    <h1>Vite CSS 处理演示</h1>

    <section>
      <h2>CSS 模块化</h2>
      <Card />
    </section>

    <section>
      <h2>按钮组件</h2>
      <Button>默认按钮</Button>
      <Button variant="primary">主要按钮</Button>
      <Button variant="danger">危险按钮</Button>
    </section>

    <section>
      <h2>PostCSS</h2>
      <p class="postcss-demo">使用 PostCSS 自动添加前缀</p>
    </section>
  </div>
</template>

<style>
.app {
  padding: 2rem;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

h1 {
  color: #333;
}

h2 {
  margin-top: 2rem;
  color: #666;
}

section {
  margin-bottom: 2rem;
}

.postcss-demo {
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 8px;
}
</style>