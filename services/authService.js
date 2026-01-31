import api from '@/lib/api';

const authService = {
    register: async (userData) => {
        const payload = {
            name: userData.name.trim(),
            email: userData.email.toLowerCase(),
            mobile: userData.mobile,
            password: userData.password,
            profile: userData.profile || '',
            role: userData.role,
            profession: userData.profession,
            city: userData.city
        };

        const response = await api.post('/user/register', payload);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/user/login', credentials);
        return response.data;
    },

    getUserInfo: async () => {
        const response = await api.get('/user/userinfo');
        return response.data;
    },

    logout: async () => {
        return { success: true };
    },

    verifyOtp: async (data) => {
        const response = await api.post('/user/verify-otp', data);
        return response.data;
    },

    resendOtp: async (data) => {
        const response = await api.post('/user/resend-otp', data);
        return response.data;
    },

    forgotPassword: async (data) => {
        const response = await api.post('/user/forgot-password', data);
        return response.data;
    },

    resetPassword: async (data) => {
        const response = await api.post('/user/reset-password', data);
        return response.data;
    }
};

export default authService;
