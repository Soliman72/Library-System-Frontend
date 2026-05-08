<template>
  <div class="pdf-viewer-container">
    <div class="header glass-panel">
      <button class="back-btn" @click="goBack">← Back to Dashboard</button>
      <h2>Reading: {{ bookTitle }}</h2>
    </div>

    <div class="viewer-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading your book securely...</p>
      </div>
      
      <div v-else-if="error" class="error-state glass-panel">
        <span class="error-icon">⚠️</span>
        <h3>Failed to load PDF</h3>
        <p>{{ error }}</p>
        <button @click="fetchPdf">Try Again</button>
      </div>
      
      <iframe 
        v-else-if="pdfUrl" 
        :src="pdfUrl" 
        class="pdf-iframe" 
        frameborder="0"
        title="PDF Viewer"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { useBooksStore } from '../store/books'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()

const bookId = route.params.id
const bookTitle = ref('Loading...')
const loading = ref(true)
const error = ref(null)
const pdfUrl = ref(null)

const goBack = () => {
  router.push('/member')
}

const fetchPdf = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Find book title
    const book = booksStore.books.find(b => b.id == bookId)
    if (book) bookTitle.value = book.title
    else bookTitle.value = 'Book ' + bookId

    // Fetch the PDF as a blob
    const response = await api.get(`/books/${bookId}/read`, {
      responseType: 'blob', // Important to handle binary data correctly
      headers: {
        'Accept': 'application/pdf'
      }
    })
    
    // Create a local object URL for the blob
    const blob = new Blob([response.data], { type: 'application/pdf' })
    pdfUrl.value = URL.createObjectURL(blob)
  } catch (err) {
    console.error('PDF Fetch Error:', err)
    if (err.response?.status === 403) {
      error.value = 'You do not have an active borrow for this book. Please borrow it first.'
    } else if (err.response?.status === 404) {
      error.value = 'This book does not have a PDF file uploaded yet.'
    } else {
      error.value = 'An unexpected error occurred while loading the PDF.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (booksStore.books.length === 0) {
    booksStore.fetchBooks().then(() => fetchPdf())
  } else {
    fetchPdf()
  }
})

// Cleanup the object URL when component unmounts to prevent memory leaks
onUnmounted(() => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
  }
})
</script>

<style scoped>
.pdf-viewer-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-primary);
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  border-radius: 0;
  border-bottom: 1px solid var(--glass-border);
  z-index: 10;
}

.back-btn {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--glass-border);
  padding: 0.5rem 1rem;
  margin-right: 2rem;
  font-size: 0.9rem;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.header h2 {
  font-size: 1.25rem;
  margin: 0;
  color: var(--text-primary);
}

.viewer-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #333; /* Typical dark background for PDF viewers */
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--accent-primary);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(16, 185, 129, 0.2);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 3rem;
  max-width: 500px;
}

.error-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: var(--danger);
  margin-bottom: 1rem;
}

.error-state p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.5;
}
</style>
