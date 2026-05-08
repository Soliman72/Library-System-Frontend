<template>
  <div class="book-card glass-panel">
    <div class="book-content">
      <h3 class="title">{{ book.title }}</h3>
      <p class="author">by {{ book.author }}</p>
      
      <div class="status" :class="book.availableCopies > 0 ? 'available' : 'unavailable'">
        {{ book.availableCopies > 0 ? 'Available (' + book.availableCopies + ')' : 'Out of Stock' }}
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
  padding: 1.75rem;
  transition: var(--transition);
  height: 100%;
  position: relative;
  overflow: hidden;
}

.book-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  opacity: 0;
  transition: var(--transition);
}

.book-card:hover {
  transform: translateY(-8px);
  border-color: rgba(16, 185, 129, 0.3);
}

.book-card:hover::before {
  opacity: 1;
}

.title {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  color: var(--text-primary);
  line-height: 1.3;
}

.author {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 1rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 1.75rem;
  letter-spacing: 0.02em;
}

.status.available {
  background: rgba(16, 185, 129, 0.1);
  color: var(--accent-primary);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status.unavailable {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.book-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
}

/* Ensure buttons take up full width inside actions */
:deep(.book-actions button) {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
}
</style>
