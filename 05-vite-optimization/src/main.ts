import { createApp } from 'vue'
import App from './App.vue'
import { formatDate, debounce, throttle } from './utils/helpers'

console.log('formatDate:', formatDate())
console.log('debounce function:', debounce)
console.log('throttle function:', throttle)

createApp(App).mount('#app')