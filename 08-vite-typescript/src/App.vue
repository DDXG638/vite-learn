<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from './types'

const users = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
])

const userCount = computed(() => users.value.length)
</script>

<template>
  <div class="container">
    <h1>TypeScript 支持</h1>

    <section>
      <h2>用户列表</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }} - {{ user.email }}
        </li>
      </ul>
      <p>共 {{ userCount }} 个用户</p>
    </section>

    <section>
      <h2>类型支持</h2>
      <p>打开控制台查看类型提示</p>
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

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
</style>