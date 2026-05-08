<template>
  <div class="admin-books animate-in">
    <div class="page-header">
      <div class="header-info">
        <h1>Inventory Control</h1>
        <p>Manage digital licenses, track availability, and upload manuscript PDFs.</p>
      </div>
      <button @click="openAddModal" class="primary-btn">
        <i class="fas fa-plus"></i>
        Add New Manuscript
      </button>
    </div>

    <div class="stats-overview">
      <div class="stat-card glass-panel">
        <span class="label">Total Manuscripts</span>
        <span class="value">{{ booksStore.books.length }}</span>
      </div>
      <div class="stat-card glass-panel">
        <span class="label">Total Licenses</span>
        <span class="value">{{ totalLicenses }}</span>
      </div>
      <div class="stat-card glass-panel">
        <span class="label">Available Now</span>
        <span class="value success">{{ totalAvailable }}</span>
      </div>
    </div>

    <div class="inventory-table-container glass-panel">
      <table class="inventory-table">
        <thead>
          <tr>
            <th>Manuscript</th>
            <th>Category</th>
            <th>Licenses</th>
            <th>Digital Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in booksStore.books" :key="book.id">
            <td>
              <div class="book-cell">
                <img :src="book.coverImageUrl || 'https://via.placeholder.com/40x60'" class="mini-cover" />
                <div class="book-meta">
                  <span class="title">{{ book.title }}</span>
                  <span class="author">{{ book.author }}</span>
                </div>
              </div>
            </td>
            <td><span class="tag">{{ book.category || 'General' }}</span></td>
            <td>
              <div class="license-info">
                <span class="count">{{ book.availableCopies }} / {{ book.totalCopies }}</span>
                <div class="mini-progress">
                  <div class="fill" :style="{ width: (book.availableCopies / book.totalCopies * 100) + '%' }"></div>
                </div>
              </div>
            </td>
            <td>
              <div class="pdf-status">
                <span v-if="book.pdfUrl" class="status-yes">
                  <i class="fas fa-check-circle"></i> Encrypted PDF
                </span>
                <span v-else class="status-no">
                  <i class="fas fa-exclamation-triangle"></i> No PDF
                </span>
                <button class="upload-link" @click="triggerUpload(book.id)">
                  {{ book.pdfUrl ? 'Replace' : 'Upload' }}
                </button>
              </div>
            </td>
            <td>
              <div class="table-actions">
                <button @click="openEditModal(book)" class="icon-btn edit" title="Edit Info">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="handleDelete(book.id)" class="icon-btn delete" title="Remove Manuscript">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Hidden File Input for PDF Upload -->
    <input 
      type="file" 
      ref="fileInput" 
      style="display: none" 
      accept=".pdf" 
      @change="handleFileUpload"
    />

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay animate-fade">
      <div class="modal-card glass-panel">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Manuscript' : 'Add New Manuscript' }}</h2>
          <button @click="showModal = false" class="close-btn"><i class="fas fa-times"></i></button>
        </div>
        <form @submit.prevent="saveBook" class="modal-form">
          <div class="form-group">
            <label>Manuscript Title</label>
            <input v-model="form.title" placeholder="e.g. Beyond the Horizon" required />
          </div>
          <div class="form-group">
            <label>Author / Publisher</label>
            <input v-model="form.author" placeholder="e.g. John Doe" required />
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Category</label>
              <select v-model="form.category">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>License Count</label>
              <input v-model="form.totalCopies" type="number" min="1" required />
            </div>
          </div>
          <div class="form-group">
            <label>Cover Art URL</label>
            <input v-model="form.coverImageUrl" placeholder="https://..." />
          </div>
          
          <div class="modal-footer">
            <button type="button" @click="showModal = false" class="secondary-btn">Cancel</button>
            <button type="submit" class="primary-btn" :disabled="loading">
              {{ loading ? 'Processing...' : 'Save Manuscript' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useBooksStore } from '../../store/books';
import api from '../../services/api';

const booksStore = useBooksStore();
const showModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const currentBookId = ref(null);
const fileInput = ref(null);

const categories = ['Programming', 'Design', 'Science', 'History', 'Fiction', 'Biography', 'Other'];

const form = reactive({
  id: null,
  title: '',
  author: '',
  category: 'Programming',
  totalCopies: 5,
  coverImageUrl: ''
});

onMounted(() => {
  booksStore.fetchBooks();
});

const totalLicenses = computed(() => {
  return booksStore.books.reduce((acc, b) => acc + b.totalCopies, 0);
});

const totalAvailable = computed(() => {
  return booksStore.books.reduce((acc, b) => acc + b.availableCopies, 0);
});

const openAddModal = () => {
  isEditing.value = false;
  Object.assign(form, { id: null, title: '', author: '', category: 'Programming', totalCopies: 5, coverImageUrl: '' });
  showModal.value = true;
};

const openEditModal = (book) => {
  isEditing.value = true;
  Object.assign(form, { ...book });
  showModal.value = true;
};

const saveBook = async () => {
  loading.value = true;
  try {
    if (isEditing.value) {
      await booksStore.updateBook(form.id, { ...form });
    } else {
      await booksStore.addBook({ ...form });
    }
    showModal.value = false;
    booksStore.fetchBooks();
  } catch (err) {
    console.error('Save failed:', err);
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to remove this manuscript and all its digital licenses?')) {
    await booksStore.deleteBook(id);
    booksStore.fetchBooks();
  }
};

const triggerUpload = (id) => {
  currentBookId.value = id;
  fileInput.value.click();
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    loading.value = true;
    await api.post(`/books/${currentBookId.value}/upload-pdf`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('PDF uploaded and encrypted successfully!');
    booksStore.fetchBooks();
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Failed to upload PDF.');
  } finally {
    loading.value = false;
    event.target.value = '';
  }
};
</script>

<style scoped>
.admin-books {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

/* Stats */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  padding: 1.5rem;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-card .label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-card .value {
  font-size: 2rem;
  font-weight: 800;
  color: white;
}

.value.success { color: #10b981; }

/* Table */
.inventory-table-container {
  background: rgba(30, 41, 59, 0.4);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 1.25rem 1.5rem;
  background: rgba(15, 23, 42, 0.4);
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
}

.book-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mini-cover {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.book-meta {
  display: flex;
  flex-direction: column;
}

.book-meta .title {
  font-weight: 700;
  color: white;
  font-size: 0.95rem;
}

.book-meta .author {
  font-size: 0.8rem;
  color: #94a3b8;
}

.tag {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
}

.license-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 120px;
}

.license-info .count {
  font-size: 0.85rem;
  font-weight: 600;
}

.mini-progress {
  height: 6px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 3px;
  overflow: hidden;
}

.mini-progress .fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 3px;
}

.pdf-status {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.status-yes { color: #10b981; font-size: 0.8rem; font-weight: 600; }
.status-no { color: #f87171; font-size: 0.8rem; font-weight: 600; }

.upload-link {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  padding: 0;
  text-decoration: underline;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: rgba(15, 23, 42, 0.4);
  color: #94a3b8;
}

.icon-btn.edit:hover { background: #3b82f6; color: white; }
.icon-btn.delete:hover { background: #ef4444; color: white; }

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-card {
  width: 100%;
  max-width: 550px;
  padding: 2.5rem;
  background: #1e293b;
  border-radius: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

label { font-size: 0.85rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }

input, select {
  padding: 0.9rem 1.2rem;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.primary-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

/* Animations */
.animate-in { animation: slideUp 0.5s ease-out forwards; }
.animate-fade { animation: fadeIn 0.3s ease-out forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

@media (max-width: 768px) {
  .stats-overview { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  th:nth-child(2), td:nth-child(2), th:nth-child(4), td:nth-child(4) { display: none; }
}
</style>
