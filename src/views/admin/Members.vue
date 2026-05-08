<template>
  <div class="members-page">
    <div class="page-header">
      <h1>Library Members</h1>
      <p>View and manage registered users</p>
    </div>

    <div class="members-list glass-panel">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in authStore.users" :key="user.id">
            <td>#{{ user.id }}</td>
            <td class="user-name">
              <div class="avatar-small">{{ user.name ? user.name.substring(0, 2).toUpperCase() : '??' }}</div>
              {{ user.name || 'Anonymous' }}
            </td>
            <td>{{ user.email }}</td>
            <td><span :class="['role-badge', user.role?.toLowerCase() || '']">{{ user.role || 'Unknown' }}</span></td>
            <td>
              <button class="danger-btn" @click="deleteUser(user.id)" :disabled="user.id === authStore.user?.id">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchAllUsers()
})

const deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this member?')) {
    try {
      await authStore.deleteUser(id)
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete user')
    }
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: 1.4rem;
}

.page-header h1 {
  font-size: 2rem;
}

.page-header p {
  color: var(--text-secondary);
}

.members-list {
  padding: 0.8rem 1rem;
  overflow-x: auto;
  background: var(--surface);
}

.user-name {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 500;
}

.avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.16);
  color: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.role-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.role-badge.admin {
  background: rgba(59, 130, 246, 0.16);
  color: var(--accent-primary);
}

.role-badge.member {
  background: rgba(16, 185, 129, 0.16);
  color: var(--success);
}

.danger-btn {
  padding: 0.38rem 0.72rem;
  font-size: 0.8rem;
  background: rgba(239, 68, 68, 0.12);
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.32);
}

.danger-btn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
}
</style>
