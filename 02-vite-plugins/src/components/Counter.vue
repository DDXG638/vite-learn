<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<template>
  <div class="counter">
    <button @click="increment">计数: {{ count }}</button>
  </div>
</template>

<style scoped lang="scss">
.counter {
  margin-bottom: 2rem;

  button {
    padding: 12px 24px;
    font-size: 1.4rem;
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