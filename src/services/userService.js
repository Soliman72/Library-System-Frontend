import api from './api';

/**
 * User API Service
 */
export const userService = {
  /**
   * View the current user's profile information
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getProfile() {
    return api.get('/users/me');
  },

  /**
   * Update the current user's profile
   * @param {Object} data - Update payload
   * @param {string} [data.name] - User's name
   * @param {string} [data.email] - User's email
   * @param {string} [data.password] - User's password
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  updateProfile(data) {
    return api.patch('/users/me', data);
  },

  /**
   * Get all registered users (Admin only)
   * @param {number} page - Page number (default: 0)
   * @param {number} size - Page size (default: 10)
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getUsers(page = 0, size = 10) {
    return api.get('/users', { params: { page, size } });
  },

  /**
   * Get details of a specific user by ID (Admin only)
   * @param {number|string} id - User ID
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getUser(id) {
    return api.get(`/users/${id}`);
  },

  /**
   * Delete a user from the system (Admin only)
   * @param {number|string} id - User ID
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  deleteUser(id) {
    return api.delete(`/users/${id}`);
  }
};
