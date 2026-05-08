<template>
  <div class="profile-page">
    <div class="page-header">
      <h1>Admin Profile</h1>
      <p>Manage your account settings</p>
    </div>

    <div class="profile-card glass-panel">
      <div class="avatar-large">
        {{ initials }}
      </div>
      
      <div class="form-container">
        <div class="form-group">
          <label>Full Name</label>
          <input v-model="form.name" placeholder="Your Name" />
        </div>
        
        <div class="form-group">
          <label>Email Address</label>
          <input v-model="form.email" type="email" placeholder="Your Email" />
        </div>
        
        <div class="form-group">
          <label>New Password (Optional)</label>
          <input v-model="form.password" type="password" placeholder="Leave blank to keep current" />
        </div>

        <div v-if="msg" :class="['msg', msgType]">{{ msg }}</div>
        
        <button @click="updateProfile" class="save-btn" :disabled="isUpdating">
          {{ isUpdating ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '../../store/auth'

const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const msg = ref('')
const msgType = ref('')
const isUpdating = ref(false)

const initials = computed(() => {
  return authStore.user?.name?.substring(0, 2).toUpperCase() || 'AD'
})

onMounted(() => {
  if (authStore.user) {
    form.name = authStore.user.name || ''
    form.email = authStore.user.email || ''
  }
})

watch(() => authStore.user, (newUser) => {
  if (newUser) {
    form.name = newUser.name || ''
    form.email = newUser.email || ''
  }
})

const updateProfile = async () => {
  msg.value = ''
  isUpdating.value = true
  
  const data = {}
  if (form.name && form.name !== authStore.user.name) data.name = form.name
  if (form.email && form.email !== authStore.user.email) data.email = form.email
  if (form.password) data.password = form.password
  
  if (Object.keys(data).length === 0) {
    msg.value = 'No changes made.'
    msgType.value = 'info'
    isUpdating.value = false
    return
  }

  try {
    await authStore.updateProfile(data)
    msg.value = 'Profile updated successfully!'
    msgType.value = 'success'
    form.password = ''
  } catch (e) {
    msg.value = e.response?.data?.message || 'Failed to update profile.'
    msgType.value = 'error'
  } finally {
    isUpdating.value = false
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

.profile-card {
  max-width: 600px;
  padding: 2rem 1.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--surface);
}

.avatar-large {
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.4rem;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.2);
}

.form-container {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.msg {
  font-size: 0.86rem;
  margin-bottom: 0.8rem;
  text-align: left;
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius-sm);
}

.msg.error { color: var(--danger); background: rgba(239, 68, 68, 0.14); }
.msg.success { color: var(--success); background: rgba(16, 185, 129, 0.16); }
.msg.info { color: var(--text-secondary); background: rgba(148, 163, 184, 0.14); }

.save-btn {
  width: 100%;
  margin-top: 1rem;
}

.save-btn:hover {
  filter: brightness(1.1);
}
</style>
