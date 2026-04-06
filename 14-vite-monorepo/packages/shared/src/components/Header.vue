<template>
  <header class="shared-header">
    <div class="shared-header__container">
      <h1 class="shared-header__title">{{ title }}</h1>
      <nav v-if="$slots.default" class="shared-header__nav">
        <slot />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Vite Monorepo'
})
</script>

<style scoped>
.shared-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 0;
}

.shared-header__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.shared-header__title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.shared-header__nav {
  display: flex;
  gap: 16px;
}
</style>
