import api from './api';

/**
 * Book API Service
 */
export const bookService = {
  /**
   * Get all active books with pagination
   * @param {number} page - Page number (default: 0)
   * @param {number} size - Page size (default: 10)
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getBooks(page = 0, size = 10) {
    return api.get('/books', { params: { page, size } });
  },

  /**
   * Search books by title or author
   * @param {string} keyword - Search keyword
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  searchBooks(keyword) {
    return api.get('/books/search', { params: { keyword } });
  },

  /**
   * Add a new book to the library
   * @param {Object} book - Book details
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  addBook(book) {
    return api.post('/books', book);
  },

  /**
   * Update an existing book's details
   * @param {number|string} id - Book ID
   * @param {Object} book - Updated book details
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  updateBook(id, book) {
    return api.put(`/books/${id}`, book);
  },

  /**
   * Soft-delete a book from the system
   * @param {number|string} id - Book ID
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  deleteBook(id) {
    return api.delete(`/books/${id}`);
  }
};
