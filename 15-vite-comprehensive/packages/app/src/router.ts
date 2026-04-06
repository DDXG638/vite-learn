import { createRouter as createVueRouter, createWebHistory, createMemoryHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/ProductList.vue')
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('./pages/ProductDetail.vue')
  }
]

export function createRouter() {
  const isServer = typeof window === 'undefined'
  return createVueRouter({
    // 服务端没有window，使用内存路由
    history: isServer ? createMemoryHistory('/cool') : createWebHistory('/cool'),
    routes
  })
}
