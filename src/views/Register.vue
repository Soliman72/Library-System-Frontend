<template>
  <div class="auth-container">
    <div class="auth-shell glass-panel">
      <section class="auth-aside">
        <p class="eyebrow">Library System</p>
        <h1>Create your professional workspace</h1>
        <p class="aside-text">
          Register to start managing your reading operations with secure, role-based access.
        </p>
      </section>

      <section class="auth-card">
        <h2>Create Account</h2>
        <p class="subtitle">Set up your account in a few steps</p>

        <div class="form-group">
          <label>Full Name</label>
          <input
            v-model="name"
            autocomplete="name"
            placeholder="John Doe"
          />
        </div>

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
              autocomplete="new-password"
              placeholder="Minimum 8 characters"
              @keyup.enter="handleRegister"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p class="field-hint">Password strength: <span :class="['strength', strengthLevel]">{{ strengthLabel }}</span></p>
        </div>

        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>

        <button @click="handleRegister" class="auth-btn" :disabled="isLoading">
          {{ isLoading ? 'Creating account...' : 'Create Account' }}
        </button>

        <p class="auth-link">
          Already have an account? <router-link to="/">Sign In</router-link>
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const isLoading = ref(false)
const auth = useAuthStore()
const router = useRouter()

const strengthLevel = computed(() => {
  const value = password.value
  if (!value) return 'none'
  if (value.length < 8) return 'weak'
  if (/[A-Z]/.test(value) && /[0-9]/.test(value) && /[^a-zA-Z0-9]/.test(value)) return 'strong'
  return 'medium'
})

const strengthLabel = computed(() => {
  if (strengthLevel.value === 'none') return 'Not set'
  if (strengthLevel.value === 'weak') return 'Weak'
  if (strengthLevel.value === 'medium') return 'Medium'
  return 'Strong'
})

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    errorMsg.value = 'Please fill in all fields'
    return
  }
  if (password.value.length < 8) {
    errorMsg.value = 'Password must be at least 8 characters'
    return
  }

  errorMsg.value = ''
  successMsg.value = ''
  isLoading.value = true

  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
    successMsg.value = 'Registration successful. Redirecting to login...'
    setTimeout(() => {
      router.push('/')
    }, 1200)
  } catch (error) {
    console.error('Register error:', error)
    errorMsg.value = error.response?.data?.message || 'Failed to register. Please try again.'
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
  width: min(500px, 100%);
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
  color: #99f6e4;
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

.strength {
  font-weight: 700;
}

.strength.weak {
  color: var(--danger);
}

.strength.medium {
  color: var(--warning);
}

.strength.strong {
  color: var(--success);
}

.strength.none {
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

.error-msg,
.success-msg {
  font-size: 0.84rem;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
  text-align: left;
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius-sm);
}

.error-msg {
  color: var(--danger);
  background: rgba(239, 68, 68, 0.14);
  border: 1px solid rgba(239, 68, 68, 0.35);
}

.success-msg {
  color: var(--success);
  background: rgba(16, 185, 129, 0.16);
  border: 1px solid rgba(16, 185, 129, 0.35);
}

@media (max-width: 900px) {
  .auth-container {
    padding: 0.9rem;
  }
}
</style>
