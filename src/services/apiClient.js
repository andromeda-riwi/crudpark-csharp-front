// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5047',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiClient;
