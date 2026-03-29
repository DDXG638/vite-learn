<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div :class="$style.card">
    <h3 :class="$style.title">卡片标题</h3>
    <p :class="$style.content">计数: {{ count }}</p>
    <button :class="$style.button" @click="count++">增加</button>
  </div>
</template>

<style module>
.card {
  padding: 1.5rem;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0 0 1rem;
  color: #333;
}

.content {
  color: #666;
  margin-bottom: 1rem;
}

.button {
  padding: 0.5rem 1rem;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>