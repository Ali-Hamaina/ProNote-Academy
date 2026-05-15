import api from './api';

const classService = {
    // Get all classes
    async getAll(params = {}) {
        const response = await api.get('/classes', { params });
        return response.data;
    },

    // Get single class
    async getById(id) {
        const response = await api.get(`/classes/${id}`);
        return response.data;
    },

    // Create class
    async create(data) {
        const response = await api.post('/classes', data);
        return response.data;
    },

    // Update class
    async update(id, data) {
        const response = await api.put(`/classes/${id}`, data);
        return response.data;
    },

    // Delete class
    async delete(id) {
        const response = await api.delete(`/classes/${id}`);
        return response.data;
    },

    // Get modules for a class
    async getModules(classId) {
        const response = await api.get(`/classes/${classId}/modules`);
        return response.data;
    },

    // Get formateur's own classes
    async getFormateurClasses() {
        const response = await api.get('/formateur/classes');
        return response.data;
    },
};

export default classService;
