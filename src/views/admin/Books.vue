<template>
  <div class="books-page">
    <div class="page-header">
      <div>
        <h1>Manage Books</h1>
        <p>Add, edit, or remove books from the library</p>
      </div>
      <button @click="showModal = true" class="add-btn">+ Add New Book</button>
    </div>

    <div class="books-grid">
      <div v-for="book in booksStore.books" :key="book.id" class="book-row glass-panel">
        <div class="book-info">
          <img :src="book.coverImageUrl || 'https://via.placeholder.com/60x90/1e293b/94a3b8?text=No+Cover'" class="thumb" />
          <div class="details">
            <h3>{{ book.title }}</h3>
            <p class="author">by {{ book.author }}</p>
            <span class="category-badge">{{ book.category || 'Uncategorized' }}</span>
          </div>
        </div>
        <div class="book-stats">
          <p>Available: <strong>{{ book.availableCopies }}</strong> / {{ book.totalCopies }}</p>
        </div>
        <div class="book-actions">
          <button class="danger" @click="booksStore.deleteBook(book.id)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Add Book Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal glass-panel">
        <h2>Add New Book</h2>
        <div class="form-group">
          <label>Title</label>
          <input v-model="form.title" placeholder="Book Title" />
        </div>
        <div class="form-group">
          <label>Author</label>
          <input v-model="form.author" placeholder="Author Name" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Category</label>
            <input v-model="form.category" placeholder="e.g. Fiction" />
          </div>
          <div class="form-group">
            <label>Total Copies</label>
            <input v-model="form.totalCopies" type="number" min="1" />
          </div>
        </div>
        <div class="form-group">
          <label>Cover Image URL (Optional)</label>
          <input v-model="form.coverImageUrl" placeholder="https://..." />
        </div>
        
        <div class="modal-actions">
          <button @click="showModal = false" style="background: transparent; border: 1px solid var(--glass-border)">Cancel</button>
          <button @click="addBook" class="success">Save Book</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useBooksStore } from '../../store/books'

const booksStore = useBooksStore()
const showModal = ref(false)

const form = reactive({
  title: '',
  author: '',
  category: '',
  totalCopies: 1,
  coverImageUrl: ''
})

onMounted(() => {
  booksStore.fetchBooks()
})

const addBook = async () => {
  if (!form.title || !form.author) return
  await booksStore.addBook({ ...form })
  showModal.value = false
  // Reset form
  form.title = ''
  form.author = ''
  form.category = ''
  form.totalCopies = 1
  form.coverImageUrl = ''
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.page-header h1 {
  font-size: 2rem;
}

.page-header p {
  color: var(--text-secondary);
}

.books-grid {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.book-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--surface);
}

.book-info {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  width: 50%;
}

.thumb {
  width: 52px;
  height: 74px;
  object-fit: cover;
  border-radius: 8px;
}

.details h3 {
  font-size: 1rem;
  margin-bottom: 0.2rem;
}

.author {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.category-badge {
  font-size: 0.72rem;
  background: rgba(59, 130, 246, 0.16);
  color: var(--accent-primary);
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
}

.book-stats {
  color: var(--text-secondary);
}

.book-stats strong {
  color: var(--text-primary);
  font-size: 1.2rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.32);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
  background: var(--surface);
}

.modal h2 {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  margin-top: 1.4rem;
}

@media (max-width: 900px) {
  .book-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.7rem;
  }

  .book-info {
    width: 100%;
  }
}
</style>
