import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import MemberDashboard from '../views/MemberDashboard.vue'

const routes = [
  { path: '/', component: Login, meta: { requiresGuest: true } },
  { path: '/register', component: Register, meta: { requiresGuest: true } },
  { path: '/admin', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/member', component: MemberDashboard, meta: { requiresAuth: true, role: 'member' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.user) {
    next('/')
  } else if (to.meta.requiresGuest && authStore.user) {
    next(authStore.user.role === 'admin' ? '/admin' : '/member')
  } else if (to.meta.requiresAuth && to.meta.role && authStore.user.role !== to.meta.role) {
    next(authStore.user.role === 'admin' ? '/admin' : '/member')
  } else {
    next()
  }
})

export default router
