import api from './api';

const resourceService = {
    // Stagiaire: Get all resources
    async getAll(params = {}) {
        const response = await api.get('/resources', { params });
        return response.data;
    },

    // Stagiaire: Get single resource
    async getById(id) {
        const response = await api.get(`/resources/${id}`);
        return response.data;
    },

    // Formateur: Upload resource
    async upload(formData) {
        const response = await api.post('/resources', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};

export default resourceService;
