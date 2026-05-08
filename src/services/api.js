import axios from 'axios';
import router from '../router';

/**
 * Axiose Instance with Global Configuration
 */
const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

// ==========================================
// Request Interceptor: Inject JWT Token
// ==========================================
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ==========================================
// Response Interceptor: Handle Errors (401, 403)
// ==========================================
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                // Unauthorized: Clear session and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('user');
                router.push('/login');
            } else if (status === 403) {
                // Forbidden: User doesn't have required role
                console.error('Permission Denied:', error.response.data.message);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
