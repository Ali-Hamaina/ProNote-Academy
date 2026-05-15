import api from './api';

const gradeService = {
    // Formateur: Get all grades
    async getAll(params = {}) {
        const response = await api.get('/grades', { params });
        return response.data;
    },

    // Formateur: Get grades for a specific module
    async getModuleGrades(moduleId) {
        const response = await api.get(`/grades/module/${moduleId}`);
        return response.data;
    },

    // Formateur: Get ungraded count
    async getUngraded() {
        const response = await api.get('/grades/ungraded');
        return response.data;
    },

    // Formateur: Create grade
    async create(data) {
        const response = await api.post('/grades', data);
        return response.data;
    },

    // Formateur: Update grade
    async update(id, data) {
        const response = await api.put(`/grades/${id}`, data);
        return response.data;
    },

    // Stagiaire: Get own grades
    async getStudentGrades() {
        const response = await api.get('/stagiaire/grades');
        return response.data;
    },

    // Stagiaire: Get grade statistics
    async getStudentStatistics() {
        const response = await api.get('/grades/statistics');
        return response.data;
    },

    // Common: Get grades for a specific user
    async getUserGrades(userId) {
        const response = await api.get(`/grades/user/${userId}`);
        return response.data;
    },
};

export default gradeService;
