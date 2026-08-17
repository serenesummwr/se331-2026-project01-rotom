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
      path: '/app',
      component: () => import('@/layouts/UserLayout.vue'),
      meta: { role: 'user' },
      children: [
        {
          path: '',
          name: 'user-dashboard',
          component: () => import('@/views/user/UserDashboardView.vue'),
          meta: { title: 'My passport', subtitle: 'Your level and what it unlocks' },
        },{
          path: 'profile',
          component: () => import('@/views/user/UserProfileView.vue'),
          children: [
            {
              path: '',
              name: 'user-profile-details',
              component: () => import('@/views/user/UserProfileDetailsView.vue'),
              meta: { title: 'Profile' },
            },
            {
              path: 'history',
              name: 'user-profile-history',
              component: () => import('@/views/user/UserProfileHistoryView.vue'),
              meta: { title: 'Profile' },
            },
            {
              path: 'badges',
              name: 'user-profile-badges',
              component: () => import('@/views/user/UserProfileBadgesView.vue'),
              meta: { title: 'Profile' },
            },
            {
              path: 'services',
              name: 'user-profile-services',
              component: () => import('@/views/user/UserProfileServicesView.vue'),
              meta: { title: 'Profile' },
            },
          ],
        },
        {
          path: 'elearning',
          name: 'user-elearning',
          component: () => import('@/views/user/ELearningView.vue'),
          meta: { title: 'eLearning', subtitle: 'The track for the level you hold' },
        },
        {
          path: 'exam',
          name: 'user-exam',
          component: () => import('@/views/user/ExamView.vue'),
          meta: { title: 'Exam', subtitle: 'What the paper is before you sit it' },
        },
        {
          path: 'exam/result/:attemptId',
          name: 'user-exam-result',
          component: () => import('@/views/user/ExamResultView.vue'),
          props: true,
          meta: { title: 'Exam result' },
        },
      ],
    },
    {
      path: '/exam/room',
      name: 'user-exam-room',
      component: () => import('@/views/user/ExamRoomView.vue'),
      meta: { role: 'user', title: 'Exam room' },
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