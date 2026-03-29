import { createApp } from 'vue'
import App from './App.vue'
import './style.scss'
import { getBaseData } from './utils/log'

console.log('getBaseData', getBaseData())

createApp(App).mount('#app')