import { defineStore } from 'pinia'
import { authService } from '../services/authService'
import { userService } from '../services/userService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // { id, name, email, role }
    token: localStorage.getItem('token') || null,
    users: [], // for admin view
    totalUsersPage: 0,
    currentUsersPage: 0
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    init() {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')
      if (token && !this.user) {
        this.token = token
        // Optimistically set the role so router guards work immediately
        this.user = { role }
        this.fetchProfile().catch(() => {
          this.logout()
        })
      }
    },

    async login(credentials) {
      const res = await authService.login(credentials)
      const data = res.data
      
      this.token = data.token
      this.user = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      }
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
    },

    async register(data) {
      await authService.register(data)
      // Login must be done separately after register per spec
    },

    async fetchProfile() {
      const res = await userService.getProfile()
      this.user = { ...this.user, ...res.data }
    },

    async updateProfile(data) {
      const res = await userService.updateProfile(data)
      this.user = { ...this.user, ...res.data }
    },

    async fetchAllUsers(page = 0, size = 10) {
      const res = await userService.getUsers(page, size)
      if (res.data.content) {
        this.users = res.data.content // Spring Boot Page object
        this.totalUsersPage = res.data.totalPages
        this.currentUsersPage = res.data.number
      } else {
        this.users = res.data // Fallback
      }
    },

    async deleteUser(id) {
      await userService.deleteUser(id)
      this.users = this.users.filter(u => u.id !== id)
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    }
  }
})
