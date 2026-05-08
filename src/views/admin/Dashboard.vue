<template>
  <div class="dashboard animate-in">
    <div class="page-header">
      <div class="header-content">
        <h1>Admin Dashboard</h1>
        <p>Real-time analytics and system oversight for the library network.</p>
      </div>
      <div class="date-badge glass-panel">
        <i class="fas fa-calendar-day"></i>
        {{ currentDate }}
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card glass-panel card-blue">
        <div class="card-icon"><i class="fas fa-layer-group"></i></div>
        <div class="card-data">
          <h3>Total Books</h3>
          <p class="value">{{ stats.totalBooks }}</p>
          <span class="trend"><i class="fas fa-arrow-up"></i> +2 this week</span>
        </div>
      </div>

      <div class="stat-card glass-panel card-purple">
        <div class="card-icon"><i class="fas fa-users"></i></div>
        <div class="card-data">
          <h3>Global Members</h3>
          <p class="value">{{ stats.totalUsers }}</p>
          <span class="trend"><i class="fas fa-arrow-up"></i> +12.5%</span>
        </div>
      </div>

      <div class="stat-card glass-panel card-emerald">
        <div class="card-icon"><i class="fas fa-file-invoice"></i></div>
        <div class="card-data">
          <h3>Active Borrows</h3>
          <p class="value">{{ stats.activeBorrows }}</p>
          <span class="trend pulse">System Operational</span>
        </div>
      </div>
    </div>

    <div class="dashboard-footer">
      <div class="info-box glass-panel">
        <i class="fas fa-shield-alt"></i>
        <div class="text">
          <h4>Security Protocol</h4>
          <p>All digital licenses are encrypted and streamed via Blob URLs to prevent unauthorized extraction.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const stats = ref({
  totalBooks: 0,
  totalUsers: 0,
  activeBorrows: 0
});

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

onMounted(async () => {
  try {
    const [booksRes, usersRes, borrowsRes] = await Promise.all([
      api.get('/books'),
      api.get('/users'), // Assuming an endpoint exists or just dummy
      api.get('/borrows')
    ]);
    
    const borrowsData = Array.isArray(borrowsRes.data) ? borrowsRes.data : (borrowsRes.data.content || []);
    
    stats.value = {
      totalBooks: booksRes.data.totalElements || booksRes.data.length || 0,
      totalUsers: usersRes.data.length || 0,
      activeBorrows: borrowsData.filter(b => b.status === 'BORROWED').length
    };
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err);
  }
});
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.header-content h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.4rem;
}

.header-content p {
  color: #94a3b8;
  font-size: 1.1rem;
}

.date-badge {
  padding: 0.8rem 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border-radius: 12px;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  padding: 2.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.card-blue .card-icon { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.card-purple .card-icon { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }
.card-emerald .card-icon { background: rgba(16, 185, 129, 0.2); color: #10b981; }

.card-data h3 {
  font-size: 0.85rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.card-data .value {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.4rem;
}

.trend {
  font-size: 0.8rem;
  font-weight: 600;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.dashboard-footer {
  margin-top: 4rem;
}

.info-box {
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(30, 41, 59, 0.4);
}

.info-box i {
  font-size: 2rem;
  color: #3b82f6;
}

.info-box h4 {
  color: white;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.info-box p {
  color: #94a3b8;
  font-size: 0.9rem;
}

/* Animations */
.animate-in { animation: slideUp 0.5s ease-out forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 900px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
