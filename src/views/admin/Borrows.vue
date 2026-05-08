<template>
  <div class="borrows-page animate-in">
    <div class="page-header">
      <div class="header-info">
        <h1>License Tracking</h1>
        <p>Monitor global digital license activity and manage active borrows.</p>
      </div>
    </div>

    <div class="table-card glass-panel">
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Fetching transaction records...</p>
      </div>

      <div v-else-if="borrowsStore.allBorrows.length === 0" class="empty-state">
        <i class="fas fa-history"></i>
        <h3>No active licenses</h3>
        <p>There are no recorded borrowing activities in the system yet.</p>
      </div>

      <table v-else class="borrows-table">
        <thead>
          <tr>
            <th>Reference ID</th>
            <th>Digital Asset</th>
            <th>Borrower</th>
            <th>Acquisition Date</th>
            <th>Expiration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="borrow in borrowsStore.allBorrows" :key="borrow.id">
            <td><span class="ref-id">#{{ borrow.id }}</span></td>
            <td>
              <div class="asset-info">
                <i class="fas fa-file-pdf"></i>
                <span>{{ borrow.bookTitle }}</span>
              </div>
            </td>
            <td>
              <div class="user-cell">
                <span class="name">{{ borrow.userName }}</span>
                <span class="email">{{ borrow.userEmail }}</span>
              </div>
            </td>
            <td>{{ formatDate(borrow.borrowDate) }}</td>
            <td>{{ formatDate(borrow.dueDate) }}</td>
            <td>
              <span class="status-pill" :class="borrow.status?.toLowerCase()">
                <i :class="borrow.status === 'BORROWED' ? 'fas fa-clock' : 'fas fa-check-circle'"></i>
                {{ borrow.status }}
              </span>
            </td>
            <td>
              <button 
                v-if="borrow.status === 'BORROWED'"
                class="admin-btn return-btn" 
                @click="handleManualReturn(borrow.id)"
              >
                Recall License
              </button>
              <span v-else class="finish-tag">Completed</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useBorrowsStore } from '../../store/borrows';

const borrowsStore = useBorrowsStore();
const loading = ref(true);

onMounted(async () => {
  try {
    await borrowsStore.fetchAllBorrows();
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const handleManualReturn = async (borrowId) => {
  if (confirm('Are you sure you want to forcefully recall this digital license? This will revoke user access immediately.')) {
    try {
      await borrowsStore.adminReturnBook(borrowId);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to return book');
    }
  }
};
</script>

<style scoped>
.borrows-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2.5rem;
}

.header-info h1 {
  font-size: 2.2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.4rem;
}

.header-info p {
  color: #94a3b8;
  font-size: 1rem;
}

.table-card {
  background: rgba(30, 41, 59, 0.4);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.borrows-table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 1.25rem 1.5rem;
  background: rgba(15, 23, 42, 0.4);
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
  font-size: 0.9rem;
}

.ref-id {
  font-family: monospace;
  color: #94a3b8;
  font-weight: 600;
}

.asset-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: white;
  font-weight: 600;
}

.asset-info i {
  color: #f87171;
}

.user-cell {
  display: flex;
  flex-direction: column;
}

.user-cell .name {
  font-weight: 700;
  color: white;
}

.user-cell .email {
  font-size: 0.75rem;
  color: #64748b;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-pill.borrowed {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
}

.status-pill.returned {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.admin-btn {
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.return-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.return-btn:hover {
  background: #ef4444;
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.finish-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

/* States */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  text-align: center;
  color: #94a3b8;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 1.5rem;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.animate-in { animation: slideUp 0.5s ease-out forwards; }
</style>
