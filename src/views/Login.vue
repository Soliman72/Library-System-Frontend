<template>
  <div class="auth-page">
    <div class="auth-card glass-panel animate-in">
      <div class="auth-header">
        <div class="logo-circle">
          <i class="fas fa-book-reader"></i>
        </div>
        <h1>Library Management System</h1>
        <p>Sign in to access your dashboard</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email Address</label>
          <div class="input-wrapper">
            <i class="fas fa-envelope"></i>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              placeholder="Enter your email" 
              required
              :disabled="auth.loading"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input 
              id="password"
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              required
              :disabled="auth.loading"
            />
            <button 
              type="button" 
              class="toggle-visibility"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <div v-if="auth.error" class="error-banner">
          <i class="fas fa-exclamation-circle"></i>
          <span>{{ auth.error }}</span>
        </div>

        <button type="submit" class="primary-btn" :disabled="auth.loading">
          <span v-if="!auth.loading">Sign In</span>
          <span v-else class="loader"></span>
        </button>
      </form>

      <div class="auth-footer">
        <p>Don't have an account? <router-link to="/register">Create one</router-link></p>
      </div>
    </div>
    
    <!-- Background Elements -->
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const auth = useAuthStore();

const handleLogin = async () => {
  try {
    await auth.login({
      email: email.value,
      password: password.value
    });
  } catch (err) {
    // Error is handled by store
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  padding: 3rem;
  z-index: 10;
  border-radius: 24px;
  background: rgba(30, 41, 59, 0.7);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-circle {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.8rem;
  color: white;
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.5);
}

h1 {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
}

.auth-header p {
  color: #94a3b8;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i:not(.fas-eye) {
  position: absolute;
  left: 1rem;
  color: #64748b;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 2.8rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.8);
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.toggle-visibility {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.primary-btn {
  background: linear-gradient(to right, #3b82f6, #2563eb);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);
}

.primary-btn:active:not(:disabled) {
  transform: translateY(0);
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.error-banner {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.8rem 1rem;
  border-radius: 10px;
  color: #f87171;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

/* Background Blobs */
.bg-blob {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 1;
  opacity: 0.4;
}

.blob-1 {
  background: #3b82f6;
  top: -100px;
  right: -100px;
}

.blob-2 {
  background: #8b5cf6;
  bottom: -100px;
  left: -100px;
}

/* Animations */
.animate-in {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 2rem;
  }
}
</style>
