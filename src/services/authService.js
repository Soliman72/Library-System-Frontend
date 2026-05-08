import api from './api';

/**
 * Authentication API Service
 */
export const authService = {
  /**
   * Register a new user
   * @param {Object} data - User registration details
   * @param {string} data.name - User's name
   * @param {string} data.email - User's email
   * @param {string} data.password - User's password
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  register(data) {
    return api.post('/auth/register', data);
  },

  /**
   * Login with existing credentials
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  login(credentials) {
    return api.post('/auth/login', credentials);
  }
};
