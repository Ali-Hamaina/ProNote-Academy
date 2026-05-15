import api from './api';

const dashboardService = {
    // Admin dashboard
    async getAdminStatistics() {
        const response = await api.get('/admin/statistics');
        return response.data;
    },

    async getEnrollmentTrends(params = {}) {
        const response = await api.get('/admin/enrollment-trends', { params });
        return response.data;
    },

    async getRecentActivities() {
        const response = await api.get('/admin/recent-activities');
        return response.data;
    },

    async getAdminClasses(params = {}) {
        const response = await api.get('/admin/classes', { params });
        return response.data;
    },

    // Formateur dashboard
    async getFormateurDashboard() {
        const response = await api.get('/formateur/dashboard');
        return response.data;
    },

    async getFormateurStudents(params = {}) {
        const response = await api.get('/formateur/students', { params });
        return response.data;
    },

    // Stagiaire dashboard
    async getStudentDashboard() {
        const response = await api.get('/stagiaire/dashboard');
        return response.data;
    },

    async getStudentModules() {
        const response = await api.get('/stagiaire/modules');
        return response.data;
    },
};

export default dashboardService;
