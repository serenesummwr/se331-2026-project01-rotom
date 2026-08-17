import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import LandingView from '@/views/LandingView.vue'
import { useAuthStore } from '@/stores/auth'
import type { Role } from '@/types'

NProgress.configure({ showSpinner: false })

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    role?: Role
    title?: string
    subtitle?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
      meta: { public: true },
    },
       {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { public: true, title: 'Register' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { public: true },
    },
  ],

  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

router.beforeEach(() => {
  NProgress.start()
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.public) {
    const isEntryPage = to.name === 'landing' || to.name === 'login' || to.name === 'register'
    return auth.isAuthenticated && isEntryPage ? { name: auth.homeRoute } : true
  }
  if (!auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.role && to.meta.role !== auth.role) {
    return { name: auth.homeRoute }
  }
  return true
})

router.afterEach((to) => {
  const title = to.meta.title
  document.title = title ? `${title} · CAT Passport` : 'The CAT Passport · SE331'
  NProgress.done()
})
router.onError(() => NProgress.done())
export default router