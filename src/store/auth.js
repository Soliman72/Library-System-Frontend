import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // current logged-in user: { id, email, role }
    token: null,
    users: [
      { id: 1, email: 'admin@library.com', role: 'admin' },
      { id: 2, email: 'member@library.com', role: 'member' }
    ]
  }),

  actions: {
    async login(credentials) {
      try {
        await axios.post('/api/login', credentials)
      } catch (e) {
        // Fallback for demo
      }
      
      const foundUser = this.users.find(u => u.email === credentials.email)
      if (foundUser) {
        this.user = foundUser
        this.token = 'mock-jwt-token'
      } else {
        const role = credentials.email.includes('admin') ? 'admin' : 'member'
        const newUser = { id: Date.now(), email: credentials.email, role }
        this.users.push(newUser)
        this.user = newUser
        this.token = 'mock-jwt-token'
      }
    },

    async register(data) {
      try {
        await axios.post('/api/register', data)
      } catch(e) {}
      
      const role = data.role || 'member'
      const newUser = { id: Date.now(), email: data.email, role }
      this.users.push(newUser)
    },

    logout() {
      this.user = null
      this.token = null
    }
  }
})
