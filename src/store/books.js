import { defineStore } from 'pinia'
import { bookService } from '../services/bookService'

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [],
    totalPages: 0,
    currentPage: 0,
    searchQuery: '',
    loading: false
  }),

  actions: {
    async fetchBooks(page = 0, size = 10) {
      this.loading = true
      try {
        const res = await bookService.getBooks(page, size)
        if (res.data.content) {
          this.books = res.data.content
          this.totalPages = res.data.totalPages
          this.currentPage = res.data.number
        } else {
          this.books = res.data
        }
      } catch (e) {
        console.error('Error fetching books:', e)
      } finally {
        this.loading = false
      }
    },

    async searchBooks(keyword) {
      this.loading = true
      try {
        this.searchQuery = keyword
        if (!keyword) {
          return this.fetchBooks(0)
        }
        const res = await bookService.searchBooks(keyword)
        this.books = res.data
        this.totalPages = 1
        this.currentPage = 0
      } catch (e) {
        console.error('Error searching books:', e)
      } finally {
        this.loading = false
      }
    },

    async addBook(book) {
      try {
        const res = await bookService.addBook(book)
        this.books.push(res.data)
      } catch (e) {
        console.error('Error adding book:', e)
      }
    },

    async updateBook(id, bookData) {
      try {
        const res = await bookService.updateBook(id, bookData)
        const index = this.books.findIndex(b => b.id === id)
        if (index !== -1) {
          this.books[index] = res.data
        }
      } catch (e) {
        console.error('Error updating book:', e)
      }
    },

    async deleteBook(id) {
      try {
        await bookService.deleteBook(id)
        this.books = this.books.filter(b => b.id !== id)
      } catch (e) {
        console.error('Error deleting book:', e)
      }
    }
  }
})
