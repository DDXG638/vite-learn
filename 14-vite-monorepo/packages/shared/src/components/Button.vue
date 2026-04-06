<template>
  <button
    class="shared-button"
    :class="[`shared-button--${type}`, { 'shared-button--disabled': disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'primary',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<style scoped>
.shared-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.shared-button--primary {
  background-color: #3b82f6;
  color: white;
}

.shared-button--secondary {
  background-color: #6b7280;
  color: white;
}

.shared-button--danger {
  background-color: #ef4444;
  color: white;
}

.shared-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.shared-button:not(.shared-button--disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
