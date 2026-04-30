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
        <router-link v-if="authStore.user.role === 'admin'" to="/admin">Admin Dashboard</router-link>
        <router-link v-if="authStore.user.role === 'member'" to="/member">Member Dashboard</router-link>
        <div class="user-info">
          <span class="email">{{ authStore.user.email }}</span>
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
  padding: 1rem 2rem;
  margin: 1rem;
  position: sticky;
  top: 1rem;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo .icon {
  font-size: 1.5rem;
}

.logo h1 {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  position: relative;
}

.links a:hover {
  color: var(--text-primary);
}

.links a.router-link-exact-active {
  color: var(--accent-primary);
}

.links a.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--accent-primary);
  border-radius: 2px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid var(--glass-border);
}

.email {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.logout-btn {
  padding: 6px 12px;
  font-size: 0.8rem;
  background: transparent;
  border: 1px solid var(--glass-border);
  box-shadow: none;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: var(--danger);
  border-color: var(--danger);
}
</style>
