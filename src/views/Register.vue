<template>
  <div class="auth-container">
    <div class="auth-card glass-panel">
      <h2>Create Account</h2>
      <p class="subtitle">Join the library system</p>
      
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" placeholder="Enter your email" />
      </div>
      
      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="Enter your password" />
      </div>
      
      <button @click="handleRegister" class="auth-btn">Register</button>
      
      <p class="auth-link">
        Already have an account? <router-link to="/">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

const handleRegister = async () => {
  try {
    await auth.register({ email: email.value, password: password.value })
    router.push('/')
  } catch (error) {
    console.error('Register error:', error)
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 150px);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  text-align: center;
}

h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--accent-primary), #fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.auth-btn {
  width: 100%;
  margin-top: 1rem;
}

.auth-link {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.auth-link a {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 600;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>
