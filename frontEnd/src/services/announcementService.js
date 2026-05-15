import api from './api';

const announcementService = {
    // Get all announcements
    async getAll(params = {}) {
        const response = await api.get('/announcements', { params });
        return response.data;
    },

    // Admin/Formateur: Create announcement
    async create(data) {
        const response = await api.post('/announcements', data);
        return response.data;
    },

    // Admin: Update announcement
    async update(id, data) {
        const response = await api.put(`/announcements/${id}`, data);
        return response.data;
    },

    // Admin: Delete announcement
    async delete(id) {
        const response = await api.delete(`/announcements/${id}`);
        return response.data;
    },

    // Mark single announcement as read
    async markAsRead(id) {
        const response = await api.put(`/announcements/${id}/read`);
        return response.data;
    },

    // Mark all announcements as read
    async markAllAsRead() {
        const response = await api.put('/announcements/mark-all-read');
        return response.data;
    },
};

export default announcementService;
