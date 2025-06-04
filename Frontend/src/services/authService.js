import axios from '../config/axios';

const authService = {
    login: async (credentials) => {
        try {
            const response = await axios.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred during login' };
        }
    },

    logout: async () => {
        try {
            await axios.post('/auth/logout');
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
            window.location.href = '/login';
        }
    },

    register: async (userData) => {
        try {
            const response = await axios.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred during registration' };
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await axios.get('/auth/me');
            return response.data;
        } catch (error) {
            return null;
        }
    },

    isAuthenticated: async () => {
        try {
            const user = await authService.getCurrentUser();
            return !!user;
        } catch (error) {
            return false;
        }
    },

    verifyOTP: async (otpData) => {
        try {
            const response = await axios.post('/auth/verify-otp', otpData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred during OTP verification' };
        }
    }
};

export default authService; 