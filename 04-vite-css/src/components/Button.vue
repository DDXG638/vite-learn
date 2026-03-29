<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'primary' | 'danger'
}>()
</script>

<template>
  <button :class="['btn', `btn-${variant || 'default'}`]">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  transform: scale(1.05);
}

.btn-default {
  background: #fff;
}

.btn-primary {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.btn-danger {
  background: #f56c6c;
  color: #fff;
  border-color: #f56c6c;
}
</style>