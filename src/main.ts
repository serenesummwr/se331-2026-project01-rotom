import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import '@fontsource-variable/outfit'
import 'nprogress/nprogress.css'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
useAuthStore().restore()
app.use(router)
app.mount('#app')
