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
      <div class="add-section glass-panel">
        <h3>Register New Member</h3>
        <div class="form-row">
          <div class="input-group">
            <input v-model="newMemberEmail" placeholder="Member Email" />
          </div>
          <button @click="registerMember">Register Member</button>
        </div>
      </div>

      <div class="members-list glass-panel">
        <h3>Registered Users</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in authStore.users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.email }}</td>
              <td><span :class="['role-badge', user.role]">{{ user.role }}</span></td>
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
const newMemberEmail = ref('')
const activeTab = ref('books')

onMounted(() => {
  booksStore.fetchBooks().catch(e => console.error(e))
  
  if (booksStore.books.length === 0) {
    booksStore.books = [
      { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', available: true, borrowedBy: null },
      { id: 2, title: '1984', author: 'George Orwell', available: false, borrowedBy: 2 },
      { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', available: true, borrowedBy: null }
    ]
  }
})

const addBook = () => {
  if (!title.value || !author.value) return;
  booksStore.addBook({
    title: title.value,
    author: author.value
  })
  title.value = '';
  author.value = '';
}

const registerMember = () => {
  if (!newMemberEmail.value) return;
  authStore.register({ email: newMemberEmail.value, password: 'password123', role: 'member' })
  newMemberEmail.value = '';
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

.tabs {
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 1rem;
}

.tabs button {
  background: transparent;
  color: var(--text-secondary);
  box-shadow: none;
  border-radius: 0;
  padding: 0.5rem 1rem;
}

.tabs button.active {
  color: var(--accent-primary);
  border-bottom: 2px solid var(--accent-primary);
}

.tabs button:hover {
  transform: none;
  box-shadow: none;
  color: var(--text-primary);
}

.add-section {
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.add-section h3 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.input-group {
  flex: 1;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.members-list {
  padding: 1.5rem;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--glass-border);
}

th {
  color: var(--text-secondary);
  font-weight: 600;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.admin {
  background: rgba(139, 92, 246, 0.2);
  color: var(--accent-primary);
}

.role-badge.member {
  background: rgba(16, 185, 129, 0.2);
  color: var(--success);
}
</style>
