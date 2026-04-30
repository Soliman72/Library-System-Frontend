import { defineStore } from 'pinia'
import axios from 'axios'

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: []
  }),

  actions: {
    async fetchBooks() {
      try {
        const res = await axios.get('/api/books')
        this.books = res.data
      } catch(e) {}
    },

    async addBook(book) {
      try {
        await axios.post('/api/books', book)
      } catch(e) {}
      this.books.push({
        id: Date.now(),
        ...book,
        available: true,
        borrowedBy: null
      })
    },

    async deleteBook(id) {
      try {
        await axios.delete(`/api/books/${id}`)
      } catch(e) {}
      this.books = this.books.filter(b => b.id !== id)
    },

    async borrowBook(id, userId) {
      try {
        await axios.post(`/api/borrow/${id}`, { userId })
      } catch(e) {}
      const book = this.books.find(b => b.id === id)
      if (book) {
        book.available = false
        book.borrowedBy = userId
      }
    },

    async returnBook(id) {
      try {
        await axios.post(`/api/return/${id}`)
      } catch(e) {}
      const book = this.books.find(b => b.id === id)
      if (book) {
        book.available = true
        book.borrowedBy = null
      }
    }
  }
})
