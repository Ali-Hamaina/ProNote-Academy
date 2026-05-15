import api from './api';

const enrollmentService = {
    // Get all enrollments
    async getAll(params = {}) {
        const response = await api.get('/enrollments', { params });
        return response.data;
    },

    // Get single enrollment
    async getById(id) {
        const response = await api.get(`/enrollments/${id}`);
        return response.data;
    },

    // Create enrollment
    async create(data) {
        const response = await api.post('/enrollments', data);
        return response.data;
    },

    // Update enrollment
    async update(id, data) {
        const response = await api.put(`/enrollments/${id}`, data);
        return response.data;
    },

    // Delete enrollment
    async delete(id) {
        const response = await api.delete(`/enrollments/${id}`);
        return response.data;
    },
};

export default enrollmentService;
