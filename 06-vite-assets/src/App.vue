<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 导入静态资源
import logoSvg from './assets/logo.svg?url'
import logoPng from './assets/logo.svg?url'
import txtFile from './assets/data.txt?raw'

const assetsInfo = ref('')

onMounted(() => {
  assetsInfo.value = `
    SVG: ${logoSvg}
    PNG: ${logoPng}
    文本: ${txtFile.slice(0, 50)}...
  `
})

const publicImg = '/icons/favicon.svg'
</script>

<template>
  <div class="container">
    <h1>静态资源处理</h1>

    <section>
      <h2>导入资源 (src/assets)</h2>
      <img :src="logoSvg" alt="SVG Logo" width="100" />
    </section>

    <section>
      <h2>public 目录资源</h2>
      <img :src="publicImg" alt="favicon" width="50" />
    </section>

    <section>
      <h2>资源信息</h2>
      <pre>{{ assetsInfo }}</pre>
    </section>
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

h1 {
  color: #333;
}

h2 {
  margin-top: 1.5rem;
  color: #666;
}

section img {
  margin-right: 1rem;
}

pre {
  background: #f5f7fa;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}
</style>