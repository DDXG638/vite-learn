<template>
  <div class="lazy-image" :style="placeholderStyle">
    <img
      v-if="isLoaded || firstScreen"
      :src="src"
      :alt="alt"
      @load="onLoad"
      @error="onError"
    />
    <div v-if="showError" class="lazy-image__error">
      <span>加载失败</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  src: string
  alt?: string
  aspectRatio?: string
  firstScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  aspectRatio: '4:3',
  firstScreen: false
})

const isLoaded = ref(false)
const showError = ref(false)
let observer: IntersectionObserver | null = null

const placeholderStyle = computed(() => {
  const [width, height] = props.aspectRatio.split(':')
  return {
    paddingBottom: `${(Number(height) / Number(width)) * 100}%`
  }
})

const onLoad = () => {
  isLoaded.value = true
  showError.value = false
}

const onError = () => {
  showError.value = true
}

const setupObserver = () => {
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isLoaded.value = true
          observer?.disconnect()
        }
      })
    },
    { rootMargin: '100px' }
  )

  const el = document.querySelector('.lazy-image')
  if (el) {
    observer.observe(el)
  }
}

onMounted(() => {
  if (!props.firstScreen && !isLoaded.value) {
    setupObserver()
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

watch(() => props.src, () => {
  isLoaded.value = props.firstScreen
  showError.value = false
})
</script>

<style scoped lang="scss">
.lazy-image {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #f5f5f5;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    color: #999;
    font-size: 14px;
  }
}
</style>
