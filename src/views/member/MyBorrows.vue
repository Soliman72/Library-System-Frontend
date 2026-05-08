<template>
  <div class="library-page animate-in">
    <div class="page-header">
      <h1>My Digital Library</h1>
      <p>Manage your active digital licenses and continue reading.</p>
    </div>

    <div v-if="borrowsStore.loading" class="loading-state">
      <div class="loader"></div>
      <p>Synchronizing your shelf...</p>
    </div>

    <div v-else-if="activeBorrows.length === 0" class="empty-state glass-panel">
      <i class="fas fa-book"></i>
      <h3>Your shelf is empty</h3>
      <p>Head over to the catalog to borrow your first digital book.</p>
      <router-link to="/member/catalog" class="browse-link">Browse Catalog</router-link>
    </div>

    <div v-else class="borrows-list">
      <div v-for="borrow in activeBorrows" :key="borrow.id" class="borrow-item glass-panel">
        <div class="item-main">
          <div class="book-info">
            <h3 class="title">{{ borrow.bookTitle }}</h3>
            <div class="timeline">
              <span class="date-badge">
                <i class="fas fa-calendar-check"></i>
                Borrowed: {{ formatDate(borrow.borrowDate) }}
              </span>
              <span class="date-badge warning" :class="{ 'danger': isOverdue(borrow.dueDate) }">
                <i class="fas fa-hourglass-half"></i>
                Expires: {{ formatDate(borrow.dueDate) }}
              </span>
            </div>
          </div>
          
          <div class="item-actions">
            <button class="action-btn read-btn" @click="openReader(borrow.bookId)">
              <i class="fas fa-book-open"></i>
              Read Now
            </button>
            <button class="action-btn return-btn" @click="handleReturn(borrow.bookId)" :disabled="returningId === borrow.bookId">
              <span v-if="returningId !== borrow.bookId">Return License</span>
              <span v-else class="loader-sm"></span>
            </button>
          </div>
        </div>

        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: calculateProgress(borrow.borrowDate, borrow.dueDate) + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- PDF Reader Modal/Overlay -->
    <div v-if="showReader" class="reader-overlay animate-fade">
      <div class="reader-container glass-panel">
        <div class="reader-header">
          <h2>Digital Reader</h2>
          <button @click="closeReader" class="close-btn"><i class="fas fa-times"></i></button>
        </div>
        <div class="reader-body">
          <iframe 
            v-if="currentBookPdfUrl" 
            :src="currentBookPdfUrl" 
            class="pdf-frame"
            frameborder="0"
          ></iframe>
          <div v-else class="loading-pdf">
            <div class="loader"></div>
            <p>Loading document stream...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBorrowsStore } from '../../store/borrows';
import { useBooksStore } from '../../store/books';
import api from '../../services/api';

const borrowsStore = useBorrowsStore();
const booksStore = useBooksStore();

const returningId = ref(null);
const showReader = ref(false);
const currentBookPdfUrl = ref(null);

onMounted(async () => {
  await borrowsStore.fetchMyBorrows();
});

const activeBorrows = computed(() => {
  return borrowsStore.myBorrows.filter(b => b.status === 'BORROWED');
});

const handleReturn = async (bookId) => {
  returningId.value = bookId;
  try {
    await borrowsStore.returnBook(bookId);
    await borrowsStore.fetchMyBorrows();
  } catch (err) {
    console.error('Return failed:', err);
  } finally {
    returningId.value = null;
  }
};

const openReader = async (bookId) => {
  showReader.value = true;
  currentBookPdfUrl.value = null;
  try {
    const response = await api.get(`/books/${bookId}/read`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    currentBookPdfUrl.value = URL.createObjectURL(blob);
  } catch (err) {
    console.error('Failed to load PDF:', err);
    alert('Failed to load PDF. Please ensure you have an active borrow for this book.');
    showReader.value = false;
  }
};

const closeReader = () => {
  showReader.value = false;
  if (currentBookPdfUrl.value) {
    URL.revokeObjectURL(currentBookPdfUrl.value);
  }
  currentBookPdfUrl.value = null;
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const isOverdue = (dateStr) => {
  return new Date(dateStr) < new Date();
};

const calculateProgress = (start, end) => {
  const total = new Date(end) - new Date(start);
  const current = new Date() - new Date(start);
  return Math.min(100, Math.max(0, (current / total) * 100));
};
</script>

<style scoped>
.library-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #94a3b8;
  font-size: 1.1rem;
}

.borrows-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.borrow-item {
  padding: 1.8rem;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

.item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.book-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.8rem;
}

.timeline {
  display: flex;
  gap: 1rem;
}

.date-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  padding: 0.4rem 0.8rem;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 8px;
}

.date-badge.warning {
  color: #fbbf24;
}

.date-badge.danger {
  color: #f87171;
}

.item-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.read-btn {
  background: #3b82f6;
  color: white;
}

.read-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -5px rgba(59, 130, 246, 0.4);
}

.return-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.return-btn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.2);
  color: white;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(15, 23, 42, 0.5);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  transition: width 0.3s ease;
}

/* Reader Overlay */
.reader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.reader-container {
  width: 100%;
  max-width: 1200px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  background: #1e293b;
  border-radius: 24px;
  overflow: hidden;
}

.reader-header {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.reader-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.reader-body {
  flex: 1;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-frame {
  width: 100%;
  height: 100%;
}

.loading-pdf {
  text-align: center;
  color: #94a3b8;
}

/* Common states */
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

.loader-sm {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-top-color: #f87171;
  border-radius: 50%;
  animation: spin 0.8s infinite linear;
}

.browse-link {
  margin-top: 1.5rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 700;
  padding: 0.8rem 1.5rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  transition: all 0.2s;
}

.browse-link:hover {
  background: #3b82f6;
  color: white;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.animate-in { animation: slideUp 0.5s ease-out forwards; }
.animate-fade { animation: fadeIn 0.3s ease-out forwards; }

@media (max-width: 768px) {
  .item-main {
    flex-direction: column;
    align-items: flex-start;
  }
  .item-actions {
    width: 100%;
  }
  .action-btn {
    flex: 1;
  }
}
</style>
