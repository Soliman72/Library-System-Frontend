<template>
  <div class="home-page">
    <div class="hero glass-panel">
      <div class="hero-content">
        <h1>Welcome back, {{ authStore.user?.name.split(' ')[0] }}!</h1>
        <p>Dive into your next great adventure. Discover new books and manage your reading list seamlessly.</p>
        <button class="success" @click="$router.push('/member/catalog')">Browse Catalog</button>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h2>Your Active Borrows</h2>
        <router-link to="/member/borrows" class="link">View All</router-link>
      </div>
      
      <div v-if="activeBorrows.length === 0" class="empty-state glass-panel">
        <p>You don't have any books currently borrowed.</p>
      </div>
      
      <div v-else class="borrows-grid">
        <div v-for="borrow in activeBorrows.slice(0, 3)" :key="borrow.id" class="borrow-card glass-panel">
          <div class="icon">BK</div>
          <div class="details">
            <h3>{{ borrow.bookTitle }}</h3>
            <p>Borrowed: {{ new Date(borrow.borrowDate).toLocaleDateString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'
import { useBorrowsStore } from '../../store/borrows'

const authStore = useAuthStore()
const borrowsStore = useBorrowsStore()

onMounted(() => {
  borrowsStore.fetchMyBorrows()
})

const activeBorrows = computed(() => {
  return borrowsStore.myBorrows.filter(b => b.status === 'BORROWED')
})
</script>

<style scoped>
.hero {
  padding: 2rem 2.1rem;
  background: linear-gradient(135deg, #1e40af, #3730a3);
  margin-bottom: 1.6rem;
  border: none;
  color: #ffffff;
}

.hero-content {
  max-width: 600px;
}

.hero h1 {
  font-size: 1.85rem;
  margin-bottom: 0.6rem;
  letter-spacing: -0.01em;
}

.hero p {
  font-size: 0.93rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
  max-width: 520px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.3rem;
}

.link {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: var(--text-secondary);
}

.borrows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.borrow-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  background: var(--surface);
}

.borrow-card .icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #93c5fd;
  background: rgba(59, 130, 246, 0.18);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 10px;
}

.borrow-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
}

.borrow-card p {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>
