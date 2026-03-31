import { createSSRApp } from 'vue'
import App from './App.vue'

// 客户端激活 (hydrate)
const app = createSSRApp(App)
app.mount('#app')