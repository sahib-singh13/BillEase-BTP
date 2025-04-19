// src/services/api.js
import axios from 'axios';

// Get the base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/billease"; // Fallback

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json', // Default Content-Type
    },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Important: If sending FormData, let Axios set the Content-Type
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Add a response interceptor to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
    (response) => response, // Simply return response on success
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access - e.g., logout user
            console.error("Unauthorized access - logging out");
            localStorage.removeItem('authToken');
            // You might want to redirect the user to the login page
            // window.location.href = '/customerLogin'; // Hard redirect
            // Or use a state management solution to trigger logout behavior
        }
        return Promise.reject(error); // Important: Reject the promise so components can handle specific errors
    }
);


export default api;