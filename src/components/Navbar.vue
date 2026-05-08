<template>
  <nav class="navbar glass-panel">
    <div class="logo">
      <span class="icon">📚</span>
      <h1>LibrarySys</h1>
    </div>
    <div class="links">
      <template v-if="!authStore.user">
        <router-link to="/">Login</router-link>
        <router-link to="/register">Register</router-link>
      </template>
      <template v-else>
        <router-link v-if="authStore.user.role === 'ADMIN'" to="/admin">Admin Dashboard</router-link>
        <router-link v-if="authStore.user.role === 'MEMBER'" to="/member">Member Dashboard</router-link>
        <div class="user-info">
          <span class="email">{{ authStore.user.name || authStore.user.email }}</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  margin: 1.5rem;
  position: sticky;
  top: 1.5rem;
  z-index: 100;
  border-radius: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo .icon {
  font-size: 1.75rem;
  filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.3));
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
}

.links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
  position: relative;
  font-size: 0.95rem;
}

.links a:hover {
  color: var(--accent-primary);
}

.links a.router-link-exact-active {
  color: var(--accent-primary);
}

.links a.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background-color: var(--accent-primary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent-primary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-left: 1.5rem;
  padding-left: 1.5rem;
  border-left: 1px solid var(--glass-border);
}

.email {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.logout-btn {
  padding: 8px 16px;
  font-size: 0.85rem;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--danger);
  border-radius: 10px;
}

.logout-btn:hover {
  background: var(--danger);
  color: white;
  border-color: var(--danger);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}
</style>
