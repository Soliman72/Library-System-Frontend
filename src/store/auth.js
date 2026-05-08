import { defineStore } from 'pinia';
import api from '../services/api';
import router from '../router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null,
        users: [], // List of users for admin management
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.role === 'ADMIN',
        isMember: (state) => state.role === 'MEMBER'
    },

    actions: {
        // ==========================================
        // Login Action
        // ==========================================
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/auth/login', credentials);
                const { token, id, name, email, role } = response.data;

                this.token = token;
                this.role = role;
                this.user = { id, name, email };

                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                localStorage.setItem('user', JSON.stringify(this.user));

                // Redirect based on role
                if (role === 'ADMIN') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/member/home');
                }
            } catch (err) {
                this.error = err.response?.data?.message || 'Login failed';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        // ==========================================
        // Registration Action
        // ==========================================
        async register(userData) {
            this.loading = true;
            this.error = null;
            try {
                await api.post('/auth/register', userData);
                router.push('/login');
            } catch (err) {
                this.error = err.response?.data?.message || 'Registration failed';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        // ==========================================
        // Logout Action
        // ==========================================
        logout() {
            this.token = null;
            this.role = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('user');
            router.push('/login');
        },

        // ==========================================
        // User Management (Admin Only)
        // ==========================================
        async fetchAllUsers() {
            this.loading = true;
            try {
                const { userService } = await import('../services/userService');
                const response = await userService.getUsers();
                if (response.data.content) {
                    this.users = response.data.content;
                } else {
                    this.users = response.data;
                }
            } catch (err) {
                console.error('Failed to fetch users:', err);
            } finally {
                this.loading = false;
            }
        },

        async deleteUser(userId) {
            try {
                const { userService } = await import('../services/userService');
                await userService.deleteUser(userId);
                this.users = this.users.filter(u => u.id !== userId);
            } catch (err) {
                console.error('Failed to delete user:', err);
                throw err;
            }
        }
    }
});
