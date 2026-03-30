<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref('speed')

const comparisons = computed(() => [
  {
    category: '构建速度',
    vite: '使用 esbuild 进行依赖预构建，速度极快',
    webpack: '使用 babel-loader 或 ts-loader，速度较慢',
  },
  {
    category: '热更新 (HMR)',
    vite: '基于 ESM，热更新只更新变化模块',
    webpack: '需要重新构建，热更新较慢',
  },
  {
    category: '配置复杂度',
    vite: '配置简洁，默认已满足大部分需求',
    webpack: '配置复杂，需要大量手动配置',
  },
  {
    category: '构建原理',
    vite: '开发时使用 ESM，生产使用 Rollup',
    webpack: '全程使用 Bundless 打包',
  },
  {
    category: '生态',
    vite: '较新，插件生态正在发展中',
    webpack: '成熟稳定，插件丰富',
  },
  {
    category: '适用场景',
    vite: '现代化前端项目，中大型项目',
    webpack: '老项目迁移，复杂构建需求',
  },
])
</script>

<template>
  <div class="container">
    <h1>Vite vs Webpack 对比</h1>

    <div class="tabs">
      <button
        :class="{ active: activeTab === 'speed' }"
        @click="activeTab = 'speed'"
      >
        构建速度对比
      </button>
      <button
        :class="{ active: activeTab === 'features' }"
        @click="activeTab = 'features'"
      >
        特性对比
      </button>
    </div>

    <div v-if="activeTab === 'speed'" class="comparison-section">
      <div class="comparison-card vite">
        <h2>Vite</h2>
        <ul>
          <li>依赖预构建使用 esbuild</li>
          <li>开发时原生 ESM</li>
          <li>按需加载模块</li>
          <li>热更新高效</li>
        </ul>
      </div>
      <div class="comparison-card webpack">
        <h2>Webpack</h2>
        <ul>
          <li>全部代码打包</li>
          <li>Bundle 模式</li>
          <li>全量编译</li>
          <li>热更新较慢</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'features'" class="features-table">
      <table>
        <thead>
          <tr>
            <th>对比项</th>
            <th>Vite</th>
            <th>Webpack</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in comparisons" :key="item.category">
            <td>{{ item.category }}</td>
            <td>{{ item.vite }}</td>
            <td>{{ item.webpack }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
  font-family: 'PingFang SC', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}
h1 {
  color: #333;
  margin-bottom: 2rem;
}
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.tabs button {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}
.tabs button.active {
  background: #42b883;
  color: #fff;
  border-color: #42b883;
}
.comparison-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}
.comparison-card {
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.comparison-card.vite {
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  color: #fff;
}
.comparison-card.webpack {
  background: linear-gradient(135deg, #1d78c8 0%, #0f2d52 100%);
  color: #fff;
}
.comparison-card h2 {
  margin-top: 0;
}
.comparison-card ul {
  padding-left: 1.2rem;
}
.comparison-card li {
  margin-bottom: 0.5rem;
}
.features-table {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}
th {
  background: #f5f7fa;
  font-weight: 600;
}
</style>
