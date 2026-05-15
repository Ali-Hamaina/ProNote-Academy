import api from './api';

const sessionService = {
    // Formateur: Get all sessions (CRUD)
    async getAll(params = {}) {
        const response = await api.get('/schedule', { params });
        return response.data;
    },

    // Get single session
    async getById(id) {
        const response = await api.get(`/schedule/${id}`);
        return response.data;
    },

    // Formateur: Create session
    async create(data) {
        const response = await api.post('/schedule', data);
        return response.data;
    },

    // Formateur: Update session
    async update(id, data) {
        const response = await api.put(`/schedule/${id}`, data);
        return response.data;
    },

    // Formateur: Delete session
    async delete(id) {
        const response = await api.delete(`/schedule/${id}`);
        return response.data;
    },

    // Common: Get current user's schedule
    async getUserSchedule(params = {}) {
        const response = await api.get('/schedule', { params });
        return response.data;
    },
};

export default sessionService;
