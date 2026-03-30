<script setup lang="ts">
import { ref } from 'vue'

const apiResult = ref('')
const fooResult = ref('')

const fetchApi = async () => {
  try {
    const res = await fetch('/api/users')
    apiResult.value = await res.text()
  } catch (e) {
    apiResult.value = `Error: ${e}`
  }
}

const fetchFoo = async () => {
  try {
    const res = await fetch('/foo/api/test')
    fooResult.value = await res.text()
  } catch (e) {
    fooResult.value = `Error: ${e}`
  }
}
</script>

<template>
  <div class="container">
    <h1>代理与 HTTP 配置</h1>

    <section>
      <h2>API 代理</h2>
      <p>将 /api 请求代理到 http://localhost:3000</p>
      <button @click="fetchApi">请求 /api/users</button>
      <pre>{{ apiResult }}</pre>
    </section>

    <section>
      <h2>HTTPS 代理</h2>
      <p>将 /foo 请求代理到 https://example.com</p>
      <button @click="fetchFoo">请求 /foo/api/test</button>
      <pre>{{ fooResult }}</pre>
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

button {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

pre {
  margin-top: 0.5rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 4px;
  max-width: 400px;
  word-break: break-all;
}
</style>