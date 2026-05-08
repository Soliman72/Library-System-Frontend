import { defineStore } from 'pinia'
import { borrowService } from '../services/borrowService'

export const useBorrowsStore = defineStore('borrows', {
  state: () => ({
    myBorrows: [],
    allBorrows: [], // for admin
    totalPages: 0,
    currentPage: 0,
    loading: false
  }),

  actions: {
    async borrowBook(bookId) {
      try {
        await borrowService.borrowBook(bookId)
        // Refresh my borrows list if needed
        this.fetchMyBorrows()
      } catch (e) {
        console.error('Error borrowing book:', e)
      }
    },

    async returnBook(bookId) {
      try {
        await borrowService.returnBook(bookId)
        this.fetchMyBorrows()
      } catch (e) {
        console.error('Error returning book:', e)
      }
    },

    async fetchMyBorrows() {
      this.loading = true
      try {
        const res = await borrowService.getMyBorrows()
        this.myBorrows = res.data
      } catch (e) {
        console.error('Error fetching my borrows:', e)
      } finally {
        this.loading = false
      }
    },

    async fetchAllBorrows(page = 0, size = 10) {
      this.loading = true
      try {
        const res = await borrowService.getAllBorrows(page, size)
        if (res.data.content) {
          this.allBorrows = res.data.content
          this.totalPages = res.data.totalPages
          this.currentPage = res.data.number
        } else {
          this.allBorrows = res.data
        }
      } catch (e) {
        console.error('Error fetching all borrows:', e)
      } finally {
        this.loading = false
      }
    },

    async fetchUserBorrows(userId, page = 0, size = 10) {
      try {
        const res = await borrowService.getUserBorrows(userId, page, size)
        if (res.data.content) {
          this.allBorrows = res.data.content
          this.totalPages = res.data.totalPages
          this.currentPage = res.data.number
        } else {
          this.allBorrows = res.data // Fallback
        }
      } catch (e) {
        console.error('Error fetching user borrows:', e)
      }
    },

    async adminReturnBook(borrowId) {
      try {
        await borrowService.adminReturnBook(borrowId)
        // Refresh the list after return
        this.fetchAllBorrows(this.currentPage)
      } catch (e) {
        console.error('Error in admin return:', e)
        throw e
      }
    }
  }
})
