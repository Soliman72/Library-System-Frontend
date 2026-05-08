<template>
  <div class="borrows-page">
    <div class="page-header">
      <h1>My Borrow History</h1>
      <p>Keep track of the books you've read</p>
    </div>

    <div class="borrows-list glass-panel">
      <div v-if="borrowsStore.myBorrows.length === 0" class="empty">
        <p>You have no borrowing history yet.</p>
        <button class="success mt-4" @click="$router.push('/member/catalog')">Browse Catalog</button>
      </div>
      
      <table v-else>
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Borrowed On</th>
            <th>Returned On</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="borrow in borrowsStore.myBorrows" :key="borrow.id">
            <td class="book-title">
              <span class="icon">BK</span>
              {{ borrow.bookTitle }}
            </td>
            <td>{{ new Date(borrow.borrowDate).toLocaleDateString() }}</td>
            <td>{{ borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : '-' }}</td>
            <td>
              <span :class="['status-badge', borrow.status.toLowerCase()]">
                {{ borrow.status }}
              </span>
            </td>
            <td>
              <button 
                v-if="borrow.status === 'BORROWED'" 
                class="return-btn" 
                @click="returnBook(borrow.bookId)"
              >
                Return
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
import { useBorrowsStore } from '../../store/borrows'

const borrowsStore = useBorrowsStore()

onMounted(() => {
  borrowsStore.fetchMyBorrows()
})

const returnBook = async (bookId) => {
  await borrowsStore.returnBook(bookId)
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

.empty {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-secondary);
}

.mt-4 {
  margin-top: 1rem;
}

.book-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  color: var(--text-primary);
}

.book-title .icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #93c5fd;
  background: rgba(59, 130, 246, 0.18);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.borrowed {
  background: rgba(16, 185, 129, 0.16);
  color: var(--success);
}

.status-badge.returned {
  background: rgba(148, 163, 184, 0.14);
  color: var(--text-secondary);
}

.return-btn {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  background: rgba(59, 130, 246, 0.16);
  color: var(--accent-primary);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.return-btn:hover {
  background: rgba(59, 130, 246, 0.24);
}
</style>
