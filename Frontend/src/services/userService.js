import axios from '../config/axios';

const userService = {
    getProfile: async () => {
        try {
            const response = await axios.get('/user/profile');
            return response.data.data;
        } catch (error) {
            if (error.response?.status === 401) {
                window.location.href = '/auth/login';
                return null;
            }
            throw error.response?.data || { message: 'Failed to fetch user profile' };
        }
    },

    isAuthenticated: async () => {
        try {
            // Try to get profile, if successful then user is authenticated
            const response = await axios.get('/user/profile');
            return response.status === 200;
        } catch (_error) {
            return false;
        }
    },

    logout: async () => {
        try {
            await axios.post('/auth/logout');
            window.location.href = '/auth/login';
        } catch (error) {
            throw error.response?.data || { message: 'Failed to logout' };
        }
    }
};

export default userService;
