import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    // timeout: 10000, // 10 seconds timeout
    withCredentials: true, // Include credentials (cookies) in requests
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

// REQUEST INTERCEPTORS
axiosInstance.interceptors.request.use(
    (config) => {
        // Add authorization token to headers if available
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTORS
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle errors globally
        if (error.response) {
            // Server responded with a status other than 200 range
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            // Request was made but no response received
            console.error('Error request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;

