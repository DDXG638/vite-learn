<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserInfo } from '../utils/index'

const count = ref(0)

console.log('== Counter.setup ==')

const handleClick = () => {
  const userInfo = getUserInfo()
  console.log('== userInfo ==', userInfo)
  count.value++
}
onMounted(() => {
  console.log('== Counter.onMounted ==')
})
</script>
<template>
  <div>
    <div>计数器6：{{ count }}</div>
    <button @click="handleClick">点击我增加</button>
  </div>
</template>
<style lang="scss" scoped>
.count-wrapper {
  color: red;
}
</style>
