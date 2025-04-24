import axios from 'axios';

const api = axios.create({
    baseURL: 'https://full-activity.onrender.com/api',
});

export default api;
