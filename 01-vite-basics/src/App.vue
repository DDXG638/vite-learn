<script setup lang="ts">
import { ref } from 'vue'
import Counter from './components/Counter.vue'
// import { getUserInfo } from './utils'

const message = ref('欢迎学习 Vite 基础入门4')
console.log('123')

const handleClick = () => {
  message.value = 'Hello Vite!'
  // console.log(getUserInfo())
}
</script>

<template>
  <div class="container">
    <counter />
    <h1>{{ message }}</h1>
    <button @click="handleClick">点击体验 HMR5</button>
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

  button {
    padding: 12px 24px;
    font-size: 1rem;
    color: #667eea;
    background: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }
}
</style>