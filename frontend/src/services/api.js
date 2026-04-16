import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Bypass-Tunnel-Reminder': 'true',
        'ngrok-skip-browser-warning': 'true'
    }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const medicineService = {
    getAll: () => api.get('/medicines/'),
    add: (data) => api.post('/medicines/', data),
    update: (id, data) => api.put(`/medicines/${id}`, data),
    delete: (id) => api.delete(`/medicines/${id}`),
};

export const salesService = {
    add: (data) => api.post('/sales/', data),
    getDaily: (date) => api.get(`/sales/daily?sale_date=${date}`),
    getMonthly: () => api.get('/sales/monthly'),
};

export default api;
