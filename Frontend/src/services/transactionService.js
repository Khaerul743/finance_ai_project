import axios from '../config/axios';

export const transactionService = {
    getAllTransactions: async (walletId) => {
        const response = await axios.get(`/wallet/${walletId}/transactions?limit=1000`);
        return response.data.data;
    },

    createTransaction: async (transactionData) => {
        const response = await axios.post('/transaction', transactionData);
        return response.data;
    },

    updateTransaction: async (transactionId, transactionData) => {
        const response = await axios.put(`/transaction/${transactionId}`, transactionData);
        return response.data;
    },

    deleteTransaction: async (transactionId) => {
        const response = await axios.delete(`/transaction/${transactionId}`);
        return response.data;
    },

    getTransactionSummary: async (walletId) => {
        const response = await axios.get(`/transaction/summary/${walletId}`);
        return response.data.data;
    },

    fetchEmailsFromTransactions: async (walletId) => {
        const response = await axios.post('/email/fetch-emails', { wallet_id: walletId });
        return response.data;
    }
};
