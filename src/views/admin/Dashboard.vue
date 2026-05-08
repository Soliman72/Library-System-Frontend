<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h1>Admin Analytics</h1>
      <p>Overview of the library system</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card glass-panel">
        <div class="icon books">BK</div>
        <div class="info">
          <h3>Total Books</h3>
          <p class="value">{{ stats.totalBooks }}</p>
        </div>
      </div>
      <div class="stat-card glass-panel">
        <div class="icon members">MB</div>
        <div class="info">
          <h3>Total Members</h3>
          <p class="value">{{ stats.totalUsers }}</p>
        </div>
      </div>
      <div class="stat-card glass-panel">
        <div class="icon borrows">BR</div>
        <div class="info">
          <h3>Active Borrows</h3>
          <p class="value">{{ stats.activeBorrows }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { analyticsService } from '../../services/analyticsService'

const stats = ref({
  totalBooks: 0,
  totalUsers: 0,
  activeBorrows: 0
})

onMounted(async () => {
  try {
    const res = await analyticsService.getSummary()
    stats.value = res.data
  } catch (e) {
    console.error('Failed to fetch analytics', e)
  }
})
</script>

<style scoped>
.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 2rem;
}

.page-header p {
  color: var(--text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.35rem;
  gap: 1rem;
  background: var(--surface);
  min-height: 112px;
}

.icon {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  border-radius: 12px;
  border: 1px solid transparent;
}

.icon.books {
  color: #93c5fd;
  background: rgba(59, 130, 246, 0.18);
  border-color: rgba(59, 130, 246, 0.3);
}

.icon.members {
  color: #5eead4;
  background: rgba(20, 184, 166, 0.18);
  border-color: rgba(45, 212, 191, 0.3);
}

.icon.borrows {
  color: #fcd34d;
  background: rgba(245, 158, 11, 0.16);
  border-color: rgba(245, 158, 11, 0.3);
}

.info h3 {
  font-size: 0.86rem;
  color: var(--text-secondary);
  margin-bottom: 0.35rem;
}

.value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
}
</style>
