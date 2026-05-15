import api from './api';

const profileService = {
    // Get current user profile
    async get() {
        const response = await api.get('/profile');
        return response.data;
    },

    // Update profile
    async update(data) {
        const response = await api.put('/profile', data);
        return response.data;
    },

    // Upload avatar
    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await api.post('/profile/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // Change password
    async changePassword(currentPassword, newPassword, confirmation) {
        const response = await api.put('/user/password', {
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: confirmation,
        });
        return response.data;
    },
};

export default profileService;
