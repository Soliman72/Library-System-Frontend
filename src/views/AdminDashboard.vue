<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>Admin Dashboard</h2>
      <p>Manage your library's collection and members</p>
    </div>

    <!-- Tabs for Books and Members -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'books' }" @click="activeTab = 'books'">Books</button>
      <button :class="{ active: activeTab === 'members' }" @click="activeTab = 'members'">Members</button>
    </div>

    <div v-if="activeTab === 'books'">
      <div class="add-section glass-panel">
        <h3>Add New Book</h3>
        <div class="form-row">
          <div class="input-group">
            <input v-model="title" placeholder="Book Title" />
          </div>
          <div class="input-group">
            <input v-model="author" placeholder="Author Name" />
          </div>
          <div class="input-group">
            <input v-model="totalCopies" type="number" min="1" placeholder="Total Copies" />
          </div>
          <button @click="addBook">Add Book</button>
        </div>
      </div>

      <div class="books-grid">
        <BookCard 
          v-for="book in booksStore.books" 
          :key="book.id" 
          :book="book"
        >
          <button class="danger" @click="booksStore.deleteBook(book.id)">Delete Book</button>
        </BookCard>
      </div>
    </div>

    <div v-if="activeTab === 'members'">
      <div class="members-list glass-panel">
        <h3>Registered Users</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in authStore.users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td><span :class="['role-badge', user.role?.toLowerCase() || '']">{{ user.role || 'Unknown' }}</span></td>
              <td>
                <button class="danger-btn" @click="deleteUser(user.id)" :disabled="user.id === authStore.user?.id">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBooksStore } from '../store/books'
import { useAuthStore } from '../store/auth'
import BookCard from '../components/BookCard.vue'

const booksStore = useBooksStore()
const authStore = useAuthStore()

const title = ref('')
const author = ref('')
const totalCopies = ref(1)
const activeTab = ref('books')

onMounted(() => {
  booksStore.fetchBooks().catch(e => console.error(e))
  authStore.fetchAllUsers().catch(e => console.error("Failed to fetch users", e))
  // Mock data removed.
})

const addBook = () => {
  if (!title.value || !author.value || !totalCopies.value) return;
  booksStore.addBook({
    title: title.value,
    author: author.value,
    totalCopies: totalCopies.value
  })
  title.value = '';
  author.value = '';
  totalCopies.value = 1;
}

const deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await authStore.deleteUser(id)
    } catch (e) {
      console.error('Failed to delete user:', e)
      alert(e.response?.data?.message || 'Failed to delete user')
    }
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

.add-section {
  padding: 2rem;
  margin-bottom: 1rem;
}

.add-section h3 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.form-row {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.input-group {
  flex: 1;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.members-list {
  padding: 2rem;
  overflow-x: auto;
}

.members-list h3 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.75rem;
  margin-top: 0.5rem;
}

th {
  padding: 1rem 1.5rem;
  text-align: left;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--glass-border);
}

td {
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
}

tr td:first-child {
  border-radius: 12px 0 0 12px;
}

tr td:last-child {
  border-radius: 0 12px 12px 0;
}

.role-badge {
  padding: 0.35rem 0.85rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.role-badge.admin {
  background: rgba(16, 185, 129, 0.1);
  color: var(--accent-primary);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.role-badge.member {
  background: rgba(52, 211, 153, 0.1);
  color: var(--accent-secondary);
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.danger-btn {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  background: transparent;
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  transition: var(--transition);
}

.danger-btn:hover:not(:disabled) {
  background: var(--danger);
  color: white;
  border-color: var(--danger);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.danger-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
