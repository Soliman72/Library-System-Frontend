<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>Member Dashboard</h2>
      <p>Browse books and manage your profile</p>
    </div>

    <div class="tabs">
      <button :class="{ active: activeTab === 'books' }" @click="activeTab = 'books'">Books</button>
      <button :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">Profile</button>
    </div>

    <div v-if="activeTab === 'books'">
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
          <template v-if="isBorrowedByMe(book.id)">
            <button @click="returnBook(book.id)">Return Book</button>
          </template>
          <template v-else-if="book.availableCopies > 0">
            <button class="success" @click="borrow(book.id)">Borrow Book</button>
          </template>
          <template v-else>
            <button disabled style="background: var(--bg-secondary); color: var(--text-secondary); box-shadow: none; cursor: not-allowed; border: 1px solid var(--glass-border);">
              Out of Stock
            </button>
          </template>
        </BookCard>
      </div>
    </div>

    <div v-if="activeTab === 'profile'">
      <div class="profile-section glass-panel">
        <h3>Edit Profile</h3>
        <p class="subtitle">Update your personal information</p>
        
        <div class="form-group">
          <label>Name</label>
          <input v-model="profileForm.name" placeholder="Your name" />
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input v-model="profileForm.email" type="email" placeholder="Your email" />
        </div>
        
        <div class="form-group">
          <label>New Password (leave blank to keep current)</label>
          <input v-model="profileForm.password" type="password" placeholder="New password" />
        </div>

        <div v-if="profileMsg" :class="['msg', profileMsgType]">{{ profileMsg }}</div>
        
        <button @click="updateProfile" class="auth-btn" :disabled="isUpdating">
          {{ isUpdating ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useBooksStore } from '../store/books'
import { useBorrowsStore } from '../store/borrows'
import { useAuthStore } from '../store/auth'
import BookCard from '../components/BookCard.vue'

const booksStore = useBooksStore()
const borrowsStore = useBorrowsStore()
const authStore = useAuthStore()
const search = ref('')
const activeTab = ref('books')

const profileForm = reactive({
  name: '',
  email: '',
  password: ''
})

const profileMsg = ref('')
const profileMsgType = ref('')
const isUpdating = ref(false)

onMounted(() => {
  booksStore.fetchBooks().catch(e => console.error("API Error: ", e))
  borrowsStore.fetchMyBorrows().catch(e => console.error("API Error: ", e))

  if (authStore.user) {
    profileForm.name = authStore.user.name || ''
    profileForm.email = authStore.user.email || ''
  }
})

// Update form if user data loads later
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    profileForm.name = newUser.name || ''
    profileForm.email = newUser.email || ''
  }
})

const filteredBooks = computed(() => booksStore.books)

const isBorrowedByMe = (bookId) => {
  return borrowsStore.myBorrows.some(b => b.bookId === bookId && b.status === 'BORROWED')
}

// Use a simple debounce for searching
let searchTimeout;
watch(search, (newVal) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    booksStore.searchBooks(newVal);
  }, 300);
})

const borrow = async (id) => {
  if (!authStore.user) return;
  await borrowsStore.borrowBook(id);
  // Re-fetch books to get updated availability state
  await booksStore.fetchBooks();
}

const returnBook = async (id) => {
  await borrowsStore.returnBook(id);
  // Re-fetch books to get updated availability state
  await booksStore.fetchBooks();
}

const updateProfile = async () => {
  profileMsg.value = ''
  isUpdating.value = true
  
  const data = {}
  if (profileForm.name && profileForm.name !== authStore.user.name) data.name = profileForm.name
  if (profileForm.email && profileForm.email !== authStore.user.email) data.email = profileForm.email
  if (profileForm.password) data.password = profileForm.password
  
  if (Object.keys(data).length === 0) {
    profileMsg.value = 'No changes made.'
    profileMsgType.value = 'info'
    isUpdating.value = false
    return
  }

  try {
    await authStore.updateProfile(data)
    profileMsg.value = 'Profile updated successfully!'
    profileMsgType.value = 'success'
    profileForm.password = '' // clear password field
  } catch (e) {
    console.error('Update profile error:', e)
    profileMsg.value = e.response?.data?.message || 'Failed to update profile.'
    profileMsgType.value = 'error'
  } finally {
    isUpdating.value = false
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.dashboard-header h2 {
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.03em;
}

.dashboard-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 500;
}

.search-section {
  padding: 1rem;
  border-radius: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  padding: 0 1.25rem;
  border: 1px solid var(--glass-border);
  transition: var(--transition);
}

.search-bar:focus-within {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 4px var(--accent-glow);
  background: rgba(0, 0, 0, 0.6);
}

.search-icon {
  font-size: 1.25rem;
  opacity: 0.7;
  color: var(--accent-primary);
}

.search-bar input {
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 14px;
  font-weight: 500;
}

.search-bar input:focus {
  box-shadow: none;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.tabs {
  display: flex;
  gap: 1.5rem;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 0.5rem;
}

.tabs button {
  background: transparent;
  color: var(--text-secondary);
  box-shadow: none;
  border-radius: 0;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  position: relative;
}

.tabs button.active {
  color: var(--accent-primary);
}

.tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--accent-primary);
  border-radius: 3px;
  box-shadow: 0 0 12px var(--accent-primary);
}

.tabs button:hover {
  transform: none;
  box-shadow: none;
  color: var(--text-primary);
}

.profile-section {
  max-width: 550px;
  padding: 3rem;
}

.profile-section h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.75rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.msg {
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: -0.75rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
}

.msg.error {
  color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.msg.success {
  color: var(--success);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.msg.info {
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
}

.auth-btn {
  width: 100%;
  padding: 1rem;
}
</style>
