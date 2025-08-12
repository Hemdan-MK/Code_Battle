import axios from "axios";
import { getToken } from "@/utils/tokenUtils";

const API_BASE_URL = 'http://localhost:3000/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        // const admin = getAdmin();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await api.post('/auth/refresh-token');
                localStorage.setItem('token', data.token);
                originalRequest.headers.Authorization = `Bearer ${data.token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure (e.g., redirect to login)
                console.error("Refresh token failed", refreshError);
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        if (error.response && error.response.status === 403) {
            window.location.href = "/banned";
        }
        return Promise.reject(error);
    }
);

export default api;
