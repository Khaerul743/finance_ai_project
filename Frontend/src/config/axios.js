import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Enable sending cookies with requests
});

// Add a response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance; 