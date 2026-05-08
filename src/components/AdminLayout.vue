<template>
  <div class="layout">
    <aside class="sidebar glass-panel">
      <div class="brand">
        <h2>LibSystem<span class="dot">.</span></h2>
      </div>
      <nav class="nav-menu">
        <router-link to="/admin/dashboard" class="nav-item">Dashboard</router-link>
        <router-link to="/admin/books" class="nav-item">Manage Books</router-link>
        <router-link to="/admin/members" class="nav-item">Members</router-link>
        <router-link to="/admin/borrows" class="nav-item">Borrows</router-link>
        <router-link to="/admin/profile" class="nav-item">Profile</router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="avatar">{{ initials }}</div>
          <div class="details">
            <span class="name">{{ authStore.user?.name }}</span>
            <span class="role">Admin</span>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">Logout</button>
      </div>
    </aside>
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()
const router = useRouter()

const initials = computed(() => {
  return authStore.user?.name?.substring(0, 2).toUpperCase() || 'AD'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: transparent;
}

.sidebar {
  width: 276px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  border-left: none;
  z-index: 10;
  background: rgba(15, 23, 42, 0.94);
}

.brand {
  padding: 1.8rem 1.5rem 1.3rem;
}

.brand h2 {
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.dot {
  color: var(--accent-secondary);
}

.nav-menu {
  display: flex;
  flex-direction: column;
  padding: 0 0.9rem;
  gap: 0.35rem;
  flex: 1;
}

.nav-item {
  padding: 0.85rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: var(--transition);
  font-weight: 600;
  border: 1px solid transparent;
}

.nav-item:hover {
  background: rgba(59, 130, 246, 0.14);
  color: var(--text-primary);
  border-color: rgba(99, 102, 241, 0.28);
}

.nav-item.router-link-active {
  background: linear-gradient(90deg, rgba(37, 99, 235, 0.14), rgba(79, 70, 229, 0.1));
  color: var(--accent-primary);
  border-color: rgba(37, 99, 235, 0.25);
}

.sidebar-footer {
  padding: 1.2rem;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
}

.details {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 600;
  font-size: 0.9rem;
}

.role {
  font-size: 0.78rem;
  color: var(--text-tertiary);
}

.logout-btn {
  width: 100%;
  background: rgba(148, 163, 184, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.24);
  color: var(--text-secondary);
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.12);
  color: var(--danger);
  border-color: var(--danger);
}

.main-content {
  flex: 1;
  padding: 1.8rem 2rem;
  overflow-y: auto;
  height: 100vh;
}

@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    border-radius: 0;
  }

  .nav-menu {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  }

  .main-content {
    height: auto;
    padding: 1.2rem;
  }
}
</style>
