<template>
  <div class="catalog-page">
    <div class="page-header">
      <h1>Library Catalog</h1>
      <p>Discover our vast collection of books</p>
    </div>

    <div class="search-bar glass-panel">
      <span class="icon">🔍</span>
      <input v-model="search" placeholder="Search by title or author..." />
    </div>

    <div class="catalog-grid">
      <div v-for="book in booksStore.books" :key="book.id" class="book-card glass-panel">
        <div class="cover-wrapper">
          <img :src="book.coverImageUrl || 'https://via.placeholder.com/200x300/1e293b/94a3b8?text=No+Cover'" class="cover" />
          <div class="status-badge" :class="book.availableCopies > 0 ? 'available' : 'unavailable'">
            {{ book.availableCopies > 0 ? `Available (${book.availableCopies})` : 'Out of Stock' }}
          </div>
        </div>
        
        <div class="info">
          <h3>{{ book.title }}</h3>
          <p class="author">{{ book.author }}</p>
          <span class="category" v-if="book.category">{{ book.category }}</span>
        </div>

        <div class="actions">
          <template v-if="isBorrowedByMe(book.id)">
            <button class="return-btn" @click="returnBook(book.id)">Return Book</button>
          </template>
          <template v-else-if="book.availableCopies > 0">
            <button class="success borrow-btn" @click="borrow(book.id)">Borrow Book</button>
          </template>
          <template v-else>
            <button class="disabled-btn" disabled>Unavailable</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useBooksStore } from '../../store/books'
import { useBorrowsStore } from '../../store/borrows'

const booksStore = useBooksStore()
const borrowsStore = useBorrowsStore()
const search = ref('')

onMounted(() => {
  booksStore.fetchBooks()
  borrowsStore.fetchMyBorrows()
})

const isBorrowedByMe = (bookId) => {
  return borrowsStore.myBorrows.some(b => b.bookId === bookId && b.status === 'BORROWED')
}

const borrow = async (id) => {
  await borrowsStore.borrowBook(id)
  await booksStore.fetchBooks()
}

const returnBook = async (id) => {
  await borrowsStore.returnBook(id)
  await booksStore.fetchBooks()
}

let searchTimeout;
watch(search, (newVal) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    booksStore.searchBooks(newVal);
  }, 300);
})
</script>

<style scoped>
.page-header {
  margin-bottom: 1.4rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 800;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  margin-bottom: 1.8rem;
  border-radius: var(--radius-md);
  background: #ffffff;
  border: 1px solid #dbe3f1;
  transition: var(--transition);
}

.search-bar:focus-within {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.search-bar .icon {
  font-size: 1.25rem;
  color: var(--accent-primary);
  opacity: 0.8;
}

.search-bar input {
  border: none;
  background: transparent;
  box-shadow: none !important;
  padding: 1rem;
  font-weight: 500;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.book-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
  border-radius: var(--radius-md);
  background: var(--surface);
}

.book-card:hover {
  transform: translateY(-8px);
}

.cover-wrapper {
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.book-card:hover .cover {
  transform: scale(1.05);
}

.status-badge {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  padding: 0.4rem 1rem;
  border-radius: 10px;
  font-size: 0.68rem;
  font-weight: 700;
  backdrop-filter: blur(12px);
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.available {
  background: rgba(5, 150, 105, 0.9);
  color: #ffffff;
}

.status-badge.unavailable {
  background: rgba(239, 68, 68, 0.85);
  color: white;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.info {
  padding: 1rem;
  flex: 1;
}

.info h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  line-height: 1.3;
}

.author {
  font-size: 0.86rem;
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
}

.category {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.actions {
  padding: 1rem;
  padding-top: 0;
}

.actions button {
  width: 100%;
  font-weight: 800;
}

.return-btn {
  background: transparent;
  border: 1px solid rgba(52, 211, 153, 0.3);
  color: var(--accent-secondary);
}

.return-btn:hover {
  background: rgba(52, 211, 153, 0.1);
  border-color: var(--accent-secondary);
  color: white;
}

.disabled-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  color: var(--text-secondary);
  border: 1px solid var(--glass-border);
  opacity: 0.5;
}
</style>
