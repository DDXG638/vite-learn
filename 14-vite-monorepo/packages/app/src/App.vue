<template>
  <div class="app">
    <Header title="Vite Monorepo Demo">
      <Button type="secondary" @click="handleAction('首页')">首页</Button>
      <Button type="secondary" @click="handleAction('关于')">关于</Button>
    </Header>

    <main class="app__main">
      <Card>
        <template #header>
          <h2>Monorepo 特性演示</h2>
        </template>

        <div class="demo-section">
          <h3>跨包引用 - @vite-monorepo/utils</h3>
          <p>数学运算: add(2, 3) = {{ addResult }}</p>
          <p>数值限制: clamp(15, 0, 10) = {{ clampResult }}</p>
          <p>随机数: randomInt(1, 100) = {{ randomResult }}</p>
        </div>

        <div class="demo-section">
          <h3>跨包引用 - @vite-monorepo/shared</h3>
          <p>日期格式化: {{ formattedDate }}</p>
          <p>货币格式化: {{ formattedPrice }}</p>
        </div>

        <div class="demo-section">
          <h3>组件复用</h3>
          <Button type="primary" @click="handlePrimary">主要按钮</Button>
          <Button type="secondary" @click="handleSecondary">次要按钮</Button>
          <Button type="danger" @click="handleDanger">危险按钮</Button>
          <Button type="primary" disabled>禁用按钮</Button>
        </div>

        <template #footer>
          <p>底部插槽内容 - 由子包提供</p>
        </template>
      </Card>

      <Card>
        <template #header>
          <h2>Monorepo 架构说明</h2>
        </template>

        <div class="architecture">
          <div class="arch-item">
            <strong>@vite-monorepo/utils</strong>
            <p>纯 TypeScript 工具函数包，提供数学运算、防抖节流、本地存储等工具函数</p>
          </div>
          <div class="arch-item">
            <strong>@vite-monorepo/shared</strong>
            <p>Vue 组件库，提供 Button、Card、Header 等可复用组件及格式化工具</p>
          </div>
          <div class="arch-item">
            <strong>@vite-monorepo/app</strong>
            <p>主应用，依赖其他两个包，展示 Monorepo 跨包引用能力</p>
          </div>
        </div>
      </Card>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '../../shared/src/components/Header.vue'
import Button from '../../shared/src/components/Button.vue'
import Card from '../../shared/src/components/Card.vue'
import { formatDate, formatCurrency } from '../../shared/src/utils/format'
import { add, clamp, randomInt } from '../../utils/src/math'

// 数学运算示例
const addResult = add(2, 3)
const clampResult = clamp(15, 0, 10)
const randomResult = randomInt(1, 100)

// 格式化示例
const formattedDate = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
const formattedPrice = formatCurrency(1234567.89, '$')

function handleAction(name: string) {
  console.log(`导航到: ${name}`)
}

function handlePrimary() {
  console.log('点击了主要按钮')
}

function handleSecondary() {
  console.log('点击了次要按钮')
}

function handleDanger() {
  console.log('点击了危险按钮')
}
</script>

<style scoped>
.app {
  min-height: 100vh;
}

.app__main {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.demo-section {
  margin-bottom: 24px;
}

.demo-section:last-child {
  margin-bottom: 0;
}

.demo-section h3 {
  font-size: 16px;
  color: #374151;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.demo-section p {
  margin: 8px 0;
  color: #6b7280;
}

.demo-section .shared-button {
  margin-right: 8px;
}

.architecture {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.arch-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.arch-item strong {
  display: block;
  color: #3b82f6;
  margin-bottom: 4px;
}

.arch-item p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}
</style>
