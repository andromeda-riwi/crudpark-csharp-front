// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://crudpark-csharp-back-1hes.onrender.com/',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiClient;
