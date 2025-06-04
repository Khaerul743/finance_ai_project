import axios from '../config/axios';

const assistantService = {
    chat: async (walletId, message) => {
        const response = await axios.post('/AI/chat-bot', {
            wallet_id: walletId,
            message: message
        });
        return response.data;
    },

    getChatHistory: async (walletId) => {
        const response = await axios.get('/AI/chat-bot', {
            params: {
                wallet_id: walletId
            }
        });
        return response.data;
    }
};

export default assistantService;
