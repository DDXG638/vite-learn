<script setup lang="ts">
import { ref } from 'vue'
import Counter from './components/Counter.vue'

const message = ref('欢迎学习 Vite 插件系统')
</script>

<template>
  <div class="container">
    <Counter />
    <h1>{{ message }}</h1>
    <p>打开控制台查看插件输出的信息</p>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  h1 {
    color: #fff;
    font-size: 4rem;
    margin-bottom: 2rem;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
  }
}
</style>