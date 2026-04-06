<template>
  <div class="shared-card">
    <div v-if="$slots.header" class="shared-card__header">
      <slot name="header" />
    </div>
    <div class="shared-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="shared-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.shared-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.shared-card__header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.shared-card__body {
  padding: 16px;
}

.shared-card__footer {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}
</style>
