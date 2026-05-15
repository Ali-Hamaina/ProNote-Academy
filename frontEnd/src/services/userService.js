import api from './api';

const userService = {
    // Get all users with optional filters
    async getAll(params = {}) {
        const response = await api.get('/users', { params });
        return response.data;
    },

    // Get single user
    async getById(id) {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // Create user
    async create(data) {
        const response = await api.post('/users', data);
        return response.data;
    },

    // Update user
    async update(id, data) {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    // Delete user
    async delete(id) {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
};

export default userService;
