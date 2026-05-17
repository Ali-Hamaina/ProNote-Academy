import api from './api';

const sessionService = {
    // Formateur: Get all sessions (CRUD)
    async getAll(params = {}) {
        const response = await api.get('/formateur/schedule', { params });
        return response.data;
    },

    // Get single session
    async getById(id) {
        const response = await api.get(`/formateur/schedule/${id}`);
        return response.data;
    },

    // Formateur: Create session
    async create(data) {
        const response = await api.post('/formateur/schedule', data);
        return response.data;
    },

    // Formateur: Update session
    async update(id, data) {
        const response = await api.put(`/formateur/schedule/${id}`, data);
        return response.data;
    },

    // Formateur: Delete session
    async delete(id) {
        const response = await api.delete(`/formateur/schedule/${id}`);
        return response.data;
    },

    // Common: Get current user's schedule
    async getUserSchedule(params = {}) {
        const response = await api.get('/schedule', { params });
        return response.data;
    },
};

export default sessionService;
