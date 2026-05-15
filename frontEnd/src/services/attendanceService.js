import api from './api';

const attendanceService = {
    // Formateur: Get all attendance records
    async getAll(params = {}) {
        const response = await api.get('/attendance', { params });
        return response.data;
    },

    // Formateur: Mark attendance
    async mark(data) {
        const response = await api.post('/attendance', data);
        return response.data;
    },

    // Formateur: Get class attendance rate
    async getClassRate(classId) {
        const response = await api.get(`/attendance/class/${classId}/rate`);
        return response.data;
    },

    // Stagiaire: Get own attendance
    async getStudentAttendance() {
        const response = await api.get('/stagiaire/attendance');
        return response.data;
    },

    // Common: Get attendance for a specific user
    async getUserAttendance(userId) {
        const response = await api.get(`/attendance/user/${userId}`);
        return response.data;
    },
};

export default attendanceService;
