import axios from 'axios';
import { BACKEND_URL } from '../constants';

const api = axios.create();

api.defaults.baseURL = BACKEND_URL;

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;