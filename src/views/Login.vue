<template>
  <div class="auth-container">
    <div class="auth-shell glass-panel">
      <section class="auth-aside">
        <p class="eyebrow">Library System</p>
        <h1>Secure access for your workspace</h1>
        <p class="aside-text">
          Sign in to manage books, members, and borrows from one professional dashboard.
        </p>
      </section>

      <section class="auth-card">
        <h2>Welcome Back</h2>
        <p class="subtitle">Login to continue to your account</p>

        <div class="form-group">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="name@company.com"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <div class="password-field">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Enter your password"
              @keyup.enter="handleLogin"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p class="field-hint">Use at least 8 characters for strong security.</p>
        </div>

        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

        <button @click="handleLogin" class="auth-btn" :disabled="isLoading">
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>

        <p class="auth-link">
          New here? <router-link to="/register">Create an account</router-link>
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMsg = ref('')
const isLoading = ref(false)
const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMsg.value = 'Please enter both email and password'
    return
  }

  errorMsg.value = ''
  isLoading.value = true

  try {
    await auth.login({ email: email.value, password: password.value })

    if (auth.user && auth.user.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/member')
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMsg.value = error.response?.data?.message || 'Failed to login. Please check your credentials.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 1.2rem;
}

.auth-shell {
  width: min(480px, 100%);
  min-height: auto;
  display: block;
  overflow: visible;
  margin: 0 auto;
}

.auth-aside {
  display: none;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 1rem;
  color: #bfdbfe;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.auth-aside h1 {
  font-size: 2rem;
  line-height: 1.25;
  margin-bottom: 1rem;
}

.aside-text {
  color: var(--text-secondary);
  max-width: 34ch;
}

.auth-card {
  padding: 2rem 1.8rem;
}

h2 {
  font-size: 1.65rem;
  margin-bottom: 0.35rem;
  color: var(--text-primary);
}

.subtitle {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.92rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.45rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 5.2rem;
}

.toggle-password {
  position: absolute;
  right: 0.35rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.38rem 0.6rem;
  font-size: 0.78rem;
  background: rgba(148, 163, 184, 0.12);
  color: var(--text-secondary);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.toggle-password:hover {
  background: rgba(148, 163, 184, 0.2);
  color: var(--text-primary);
}

.field-hint {
  margin-top: 0.45rem;
  font-size: 0.78rem;
  color: var(--text-tertiary);
}

.auth-btn {
  width: 100%;
  margin-top: 0.65rem;
  padding: 0.82rem;
}

.auth-link {
  margin-top: 1.05rem;
  font-size: 0.88rem;
  color: var(--text-secondary);
  text-align: center;
}

.auth-link a {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 700;
  transition: var(--transition);
}

.auth-link a:hover {
  color: var(--accent-secondary);
}

.error-msg {
  color: var(--danger);
  font-size: 0.84rem;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
  text-align: left;
  padding: 0.6rem 0.8rem;
  background: rgba(239, 68, 68, 0.14);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(239, 68, 68, 0.35);
}

@media (max-width: 900px) {
  .auth-container {
    padding: 0.9rem;
  }
}
</style>
