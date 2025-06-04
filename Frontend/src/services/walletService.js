import axios from '../config/axios';

const walletService = {
    getWalletById: async (id) => {
        try {
            const response = await axios.get(`/wallet/${id}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch wallet' };
        }
    },

    getMyWallets: async () => {
        try {
            const response = await axios.get('/wallet/my_wallet');
            return response.data.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch wallets' };
        }
    },

    createWallet: async (walletData) => {
        try {
            const response = await axios.post('/wallet', walletData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create wallet' };
        }
    },

    updateWallet: async (walletId, walletData) => {
        try {
            const response = await axios.put(`/wallet/${walletId}`, walletData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update wallet' };
        }
    },

    deleteWallet: async (walletId) => {
        try {
            const response = await axios.delete(`/wallet/${walletId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete wallet' };
        }
    },

    getWalletBalance: async (walletId) => {
        try {
            const response = await axios.get(`/wallet/${walletId}/balance`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch wallet balance' };
        }
    }
};

export default walletService; 