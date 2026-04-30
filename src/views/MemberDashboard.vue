<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>Member Dashboard</h2>
      <p>Browse and borrow books</p>
    </div>

    <div class="search-section glass-panel">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input v-model="search" placeholder="Search for books by title..." />
      </div>
    </div>

    <div class="books-grid">
      <BookCard 
        v-for="book in filteredBooks" 
        :key="book.id" 
        :book="book"
      >
        <button v-if="book.available" class="success" @click="borrow(book.id)">
          Borrow Book
        </button>
        <template v-else>
          <button v-if="book.borrowedBy === authStore.user?.id" @click="returnBook(book.id)">
            Return Book
          </button>
          <button v-else disabled style="background: var(--bg-secondary); color: var(--text-secondary); box-shadow: none; cursor: not-allowed; border: 1px solid var(--glass-border);">
            Borrowed by User #{{ book.borrowedBy }}
          </button>
        </template>
      </BookCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBooksStore } from '../store/books'
import { useAuthStore } from '../store/auth'
import BookCard from '../components/BookCard.vue'

const booksStore = useBooksStore()
const authStore = useAuthStore()
const search = ref('')

onMounted(() => {
  booksStore.fetchBooks().catch(e => console.error("API Error: ", e))
  
  if (booksStore.books.length === 0) {
    booksStore.books = [
      { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', available: true, borrowedBy: null },
      { id: 2, title: '1984', author: 'George Orwell', available: false, borrowedBy: 2 },
      { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', available: true, borrowedBy: null }
    ]
  }
})

const filteredBooks = computed(() =>
  booksStore.books.filter(b =>
    b.title.toLowerCase().includes(search.value.toLowerCase())
  )
)

const borrow = (id) => {
  if (!authStore.user) return;
  booksStore.borrowBook(id, authStore.user.id);
}

const returnBook = (id) => {
  booksStore.returnBook(id);
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-header h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--accent-primary), #fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dashboard-header p {
  color: var(--text-secondary);
}

.search-section {
  padding: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 8px;
  padding: 0 1rem;
  border: 1px solid var(--glass-border);
  transition: var(--transition);
}

.search-bar:focus-within {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.search-icon {
  font-size: 1.2rem;
  opacity: 0.7;
}

.search-bar input {
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 12px;
}

.search-bar input:focus {
  box-shadow: none;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
</style>
