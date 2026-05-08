<template>
  <div class="catalog-page animate-in">
    <div class="page-header">
      <div class="header-content">
        <h1>Digital Explorer</h1>
        <p>Browse our collection of digital licenses and expand your knowledge.</p>
      </div>
      <div class="search-wrapper glass-panel">
        <i class="fas fa-search"></i>
        <input 
          v-model="search" 
          placeholder="Search by title, author or category..." 
          @input="handleSearch"
        />
      </div>
    </div>

    <div v-if="booksStore.loading" class="loading-state">
      <div class="loader"></div>
      <p>Curating your library...</p>
    </div>

    <div v-else-if="booksStore.books.length === 0" class="empty-state glass-panel">
      <i class="fas fa-book-open"></i>
      <h3>No books found</h3>
      <p>Try adjusting your search or check back later.</p>
    </div>

    <div v-else class="catalog-grid">
      <div v-for="book in booksStore.books" :key="book.id" class="book-card glass-panel">
        <div class="card-media">
          <img 
            :src="book.coverImageUrl || 'https://images.unsplash.com/photo-1543005123-8618e50b16fe?q=80&w=2574&auto=format&fit=crop'" 
            class="cover-img"
            loading="lazy"
          />
          <div class="category-tag">{{ book.category || 'General' }}</div>
          <div class="availability-badge" :class="{ 'out-of-stock': book.availableCopies === 0 }">
            {{ book.availableCopies > 0 ? `${book.availableCopies} Copies Left` : 'Out of Stock' }}
          </div>
        </div>

        <div class="card-body">
          <div class="card-meta">
            <h3 class="title">{{ book.title }}</h3>
            <p class="author">by {{ book.author }}</p>
          </div>

          <div class="card-actions">
            <button 
              v-if="isBorrowed(book.id)" 
              class="action-btn secondary-btn"
              @click="goToMyBooks"
            >
              <i class="fas fa-bookmark"></i>
              Already Borrowed
            </button>
            <button 
              v-else-if="book.availableCopies > 0" 
              class="action-btn primary-btn"
              @click="handleBorrow(book.id)"
              :disabled="borrowingId === book.id"
            >
              <i v-if="borrowingId !== book.id" class="fas fa-hand-holding"></i>
              <span v-if="borrowingId !== book.id">Borrow License</span>
              <span v-else class="loader-sm"></span>
            </button>
            <button v-else class="action-btn disabled-btn" disabled>
              <i class="fas fa-times-circle"></i>
              Waitlist Only
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBooksStore } from '../../store/books';
import { useBorrowsStore } from '../../store/borrows';
import { useRouter } from 'vue-router';

const booksStore = useBooksStore();
const borrowsStore = useBorrowsStore();
const router = useRouter();

const search = ref('');
const borrowingId = ref(null);

onMounted(async () => {
  await Promise.all([
    booksStore.fetchBooks(),
    borrowsStore.fetchMyBorrows()
  ]);
});

const isBorrowed = (bookId) => {
  return borrowsStore.myBorrows.some(b => b.bookId === bookId && b.status === 'BORROWED');
};

const handleSearch = () => {
  // Logic is handled by the store's search action with a debounce
  booksStore.searchBooks(search.value);
};

const handleBorrow = async (id) => {
  borrowingId.value = id;
  try {
    await borrowsStore.borrowBook(id);
    await booksStore.fetchBooks();
  } catch (err) {
    console.error('Borrow failed:', err);
  } finally {
    borrowingId.value = null;
  }
};

const goToMyBooks = () => {
  router.push('/member/borrows');
};
</script>

<style scoped>
.catalog-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  gap: 2rem;
}

.header-content h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.header-content p {
  color: #94a3b8;
  font-size: 1.1rem;
}

.search-wrapper {
  flex: 1;
  max-width: 500px;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-wrapper:focus-within {
  background: rgba(30, 41, 59, 0.8);
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.search-wrapper i {
  color: #64748b;
  margin-right: 1rem;
}

.search-wrapper input {
  width: 100%;
  padding: 1.2rem 0;
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
}

.search-wrapper input:focus {
  outline: none;
}

/* Grid & Cards */
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.book-card {
  background: rgba(30, 41, 59, 0.4);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-10px);
  background: rgba(30, 41, 59, 0.6);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.4);
}

.card-media {
  position: relative;
  height: 380px;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.book-card:hover .cover-img {
  transform: scale(1.05);
}

.category-tag {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.availability-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 2rem 1.25rem 1.25rem;
  color: #10b981;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: right;
}

.availability-badge.out-of-stock {
  color: #f87171;
}

.card-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.4rem;
  line-height: 1.4;
}

.author {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.action-btn {
  width: 100%;
  padding: 0.9rem;
  border-radius: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.primary-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.primary-btn:hover {
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
  transform: scale(1.02);
}

.secondary-btn {
  background: rgba(51, 65, 85, 0.4);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.secondary-btn:hover {
  background: rgba(51, 65, 85, 0.6);
  color: white;
}

.disabled-btn {
  background: rgba(51, 65, 85, 0.2);
  color: #64748b;
  cursor: not-allowed;
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
  width: 48px;
  height: 48px;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 1.5rem;
}

.loader-sm {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-in {
  animation: slideUp 0.5s ease-out forwards;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .search-wrapper {
    max-width: 100%;
  }
}
</style>
