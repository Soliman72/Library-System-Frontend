import api from './api';

/**
 * Borrow API Service
 */
export const borrowService = {
  /**
   * Borrow a specific book
   * @param {number|string} bookId - Book ID
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  borrowBook(bookId) {
    return api.post(`/borrows/${bookId}`);
  },

  /**
   * Return a borrowed book
   * @param {number|string} bookId - Book ID
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  returnBook(bookId) {
    return api.post(`/borrows/${bookId}/return`);
  },

  /**
   * View the current user's personal borrow history
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getMyBorrows() {
    return api.get('/borrows/me');
  },

  /**
   * View all borrowing records across the system (Admin only)
   * @param {number} page - Page number (default: 0)
   * @param {number} size - Page size (default: 10)
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getAllBorrows(page = 0, size = 10) {
    return api.get('/borrows', { params: { page, size } });
  },

  /**
   * View the borrowing history of a specific user (Admin only)
   * @param {number|string} userId - User ID
   * @param {number} page - Page number (default: 0)
   * @param {number} size - Page size (default: 10)
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getUserBorrows(userId, page = 0, size = 10) {
    return api.get(`/borrows/users/${userId}`, { params: { page, size } });
  },

  /**
   * Return a book on behalf of a user (Admin only)
   * @param {number|string} borrowId - Borrow ID
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  adminReturnBook(borrowId) {
    return api.post(`/borrows/${borrowId}/admin-return`);
  }
};
