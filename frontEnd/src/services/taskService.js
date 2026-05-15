import api from './api';

const taskService = {
    // Get all tasks for formateur
    async getAll(params = {}) {
        const response = await api.get('/formateur/tasks', { params });
        return response.data;
    },

    // Get single task
    async getById(id) {
        const response = await api.get(`/formateur/tasks/${id}`);
        return response.data;
    },

    // Create task
    async create(data) {
        const response = await api.post('/formateur/tasks', data);
        return response.data;
    },

    // Update task
    async update(id, data) {
        const response = await api.put(`/formateur/tasks/${id}`, data);
        return response.data;
    },

    // Delete task
    async delete(id) {
        const response = await api.delete(`/formateur/tasks/${id}`);
        return response.data;
    },
};

export default taskService;
