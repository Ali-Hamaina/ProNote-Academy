import api from './api';

const moduleService = {
    // Get all modules
    async getAll(params = {}) {
        const response = await api.get('/modules', { params });
        return response.data;
    },

    // Get single module
    async getById(id) {
        const response = await api.get(`/modules/${id}`);
        return response.data;
    },

    // Create module
    async create(data) {
        const response = await api.post('/modules', data);
        return response.data;
    },

    // Update module
    async update(id, data) {
        const response = await api.put(`/modules/${id}`, data);
        return response.data;
    },

    // Delete module
    async delete(id) {
        const response = await api.delete(`/modules/${id}`);
        return response.data;
    },

    // Reorder modules
    async reorder(orderedIds) {
        const modules = orderedIds.map((id, order) => ({ id, order }));
        const response = await api.post('/modules/reorder', { modules });
        return response.data;
    },
};

export default moduleService;
