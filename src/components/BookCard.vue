<template>
  <div class="book-card glass-panel">
    <div class="book-content">
      <h3 class="title">{{ book.title }}</h3>
      <p class="author">by {{ book.author }}</p>
      
      <div class="status" :class="book.available ? 'available' : 'unavailable'">
        {{ book.available ? 'Available' : 'Checked Out' }}
      </div>
    </div>
    <div class="book-actions">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.book-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
  transition: var(--transition);
  height: 100%;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
  border-color: rgba(139, 92, 246, 0.3);
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.author {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.status.available {
  background: rgba(16, 185, 129, 0.2);
  color: var(--success);
}

.status.unavailable {
  background: rgba(239, 68, 68, 0.2);
  color: var(--danger);
}

.book-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

/* Ensure buttons take up full width inside actions */
:deep(.book-actions button) {
  flex: 1;
}
</style>
