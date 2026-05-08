import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

import AdminLayout from '../components/AdminLayout.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminBooks from '../views/admin/Books.vue'
import AdminMembers from '../views/admin/Members.vue'
import AdminBorrows from '../views/admin/Borrows.vue'
import AdminProfile from '../views/admin/Profile.vue'

import MemberLayout from '../components/MemberLayout.vue'
import MemberHome from '../views/member/Home.vue'
import MemberCatalog from '../views/member/Catalog.vue'
import MemberBorrows from '../views/member/MyBorrows.vue'
import MemberProfile from '../views/member/Profile.vue'

const routes = [
  { path: '/', component: Login, meta: { requiresGuest: true } },
  { path: '/register', component: Register, meta: { requiresGuest: true } },
  { 
    path: '/admin', 
    component: AdminLayout, 
    meta: { requiresAuth: true, role: 'ADMIN' },
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'books', component: AdminBooks },
      { path: 'members', component: AdminMembers },
      { path: 'borrows', component: AdminBorrows },
      { path: 'profile', component: AdminProfile },
      { path: '', redirect: '/admin/dashboard' }
    ]
  },
  { 
    path: '/member', 
    component: MemberLayout, 
    meta: { requiresAuth: true, role: 'MEMBER' },
    children: [
      { path: 'home', component: MemberHome },
      { path: 'catalog', component: MemberCatalog },
      { path: 'borrows', component: MemberBorrows },
      { path: 'profile', component: MemberProfile },
      { path: '', redirect: '/member/home' }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  const isAuthenticated = !!authStore.token
  const userRole = authStore.role

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next(userRole === 'ADMIN' ? '/admin/dashboard' : '/member/home')
  } else if (to.meta.requiresAuth && to.meta.role && userRole !== to.meta.role) {
    next(userRole === 'ADMIN' ? '/admin/dashboard' : '/member/home')
  } else {
    next()
  }
})

export default router
