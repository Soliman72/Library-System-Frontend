<template>
  <div class="borrows-page">
    <div class="page-header">
      <h1>Borrow Management</h1>
      <p>Track who is currently borrowing books and manage returns</p>
    </div>

    <div class="borrows-list glass-panel">
      <div v-if="loading" class="loading-state">
        Loading borrow records...
      </div>
      <table v-else-if="borrowsStore.allBorrows.length > 0">
        <thead>
          <tr>
            <th>Borrow ID</th>
            <th>Book Title</th>
            <th>Borrower</th>
            <th>Borrow Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="borrow in borrowsStore.allBorrows" :key="borrow.id">
            <td>#{{ borrow.id }}</td>
            <td class="book-title">{{ borrow.bookTitle }}</td>
            <td class="user-info">
              <div class="name">{{ borrow.userName }}</div>
              <div class="email">{{ borrow.userEmail }}</div>
            </td>
            <td>{{ formatDate(borrow.borrowDate) }}</td>
            <td>
              <span :class="['status-badge', borrow.status?.toLowerCase()]">
                {{ borrow.status }}
              </span>
            </td>
            <td>
              <button 
                v-if="borrow.status === 'BORROWED'"
                class="return-btn" 
                @click="returnBook(borrow.id)"
              >
                Manual Return
              </button>
              <span v-else class="returned-date">
                Returned: {{ formatDate(borrow.returnDate) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        No borrow records found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useBorrowsStore } from '../../store/borrows'

const borrowsStore = useBorrowsStore()
const loading = ref(true)

onMounted(async () => {
  try {
    await borrowsStore.fetchAllBorrows()
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString()
}

const returnBook = async (borrowId) => {
  if (confirm('Are you sure you want to manually return this book?')) {
    try {
      await borrowsStore.adminReturnBook(borrowId)
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to return book')
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

.borrows-list {
  padding: 0.8rem 1rem;
  overflow-x: auto;
  background: var(--surface);
}

.book-title {
  font-weight: 600;
  color: var(--text-primary);
}

.user-info .name {
  font-weight: 500;
}

.user-info .email {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.borrowed {
  background: rgba(245, 158, 11, 0.16);
  color: var(--warning);
}

.status-badge.returned {
  background: rgba(16, 185, 129, 0.16);
  color: var(--success);
}

.return-btn {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.return-btn:hover {
  filter: brightness(1.1);
}

.returned-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.loading-state, .empty-state {
  padding: 3rem;
  text-align: center;
  color: var(--text-secondary);
}
</style>
