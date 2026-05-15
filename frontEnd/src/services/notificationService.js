import api from './api';

const notificationService = {
    // Get unread notification count
    async getUnreadCount() {
        const response = await api.get('/notifications/unread-count');
        return response.data;
    },
};

export default notificationService;
