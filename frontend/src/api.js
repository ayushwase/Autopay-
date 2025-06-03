import axios from 'axios';

// Replace with your backend URL
const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
});

export default api;
