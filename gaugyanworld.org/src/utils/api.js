import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://api.gaugyanworld.org/api';

// Create axios instance with base configuration
const api = axios.create({
    baseURL,
    timeout: 45000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log requests in development
        if (import.meta.env.DEV) {
            console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`, config.data || '');
        }

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
    (response) => {
        // Log responses in development
        if (import.meta.env.DEV) {
            console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const refreshToken = sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(
                        `${(import.meta.env.VITE_API_URL || '').replace(/\/api$/, '')}/api/v1/auth/refresh`,
                        { refreshToken }
                    );

                    const { token } = response.data;
                    // Store based on where we found the refresh token, defaulting to sessionStorage if uncertain but aligning with AuthContext
                    if (sessionStorage.getItem('refreshToken')) {
                        sessionStorage.setItem('token', token);
                    } else {
                        localStorage.setItem('token', token);
                    }

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - logout user
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('refreshToken');
                sessionStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

        if (import.meta.env.DEV) {
            console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, errorMessage);
        }

        // Return user-friendly error
        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data,
        });
    }
);

export default api;
