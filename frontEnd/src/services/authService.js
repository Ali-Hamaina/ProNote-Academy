import api from './api';

const authService = {
    // Get CSRF cookie (required for Sanctum)
    async getCsrfCookie() {
        await api.get('/sanctum/csrf-cookie', {
            baseURL: import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000',
        });
    },

    // Login
    async login(email, password) {
        await this.getCsrfCookie();
        const response = await api.post('/login', { email, password });
        return response.data;
    },

    // Logout
    async logout() {
        try {
            await api.post('/logout');
        } finally {
            localStorage.removeItem('pronote_user');
            localStorage.removeItem('pronote_token');
        }
    },

    // Get current user
    async getCurrentUser() {
        const response = await api.get('/user');
        return response.data;
    },

    // Forgot password
    async forgotPassword(email) {
        const response = await api.post('/forgot-password', { email });
        return response.data;
    },

    // Reset password
    async resetPassword(token, email, password, passwordConfirmation) {
        const response = await api.post('/reset-password', {
            token,
            email,
            password,
            password_confirmation: passwordConfirmation,
        });
        return response.data;
    },

    // Change password
    async changePassword(currentPassword, newPassword, newPasswordConfirmation) {
        const response = await api.put('/user/password', {
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: newPasswordConfirmation,
        });
        return response.data;
    },

    // Check if authenticated
    isAuthenticated() {
        return !!localStorage.getItem('pronote_token');
    },

    // Get stored token
    getToken() {
        return localStorage.getItem('pronote_token');
    },
};

export default authService;
