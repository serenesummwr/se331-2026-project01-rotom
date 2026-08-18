import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useExamStore } from './stores/exam'
import { useLevelStore } from './stores/levels'
import { useUserStore } from './stores/users'
import { loadMockData } from './services/mockData'
import '@fontsource-variable/outfit'
import 'nprogress/nprogress.css'
import './assets/main.css'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)

  const database = await loadMockData()
  useUserStore(pinia).hydrate(database.users)
  useLevelStore(pinia).hydrate(database)
  useExamStore(pinia).hydrate(database)
  useAuthStore(pinia).restore()

  app.use(router)
  app.mount('#app')
}

void bootstrap().catch((error: unknown) => console.error('Unable to load mock data', error))
