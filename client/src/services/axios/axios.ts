import axios from "axios";
import { getAdmin, getToken } from "@/utils/tokenUtils";

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
        const admin = getAdmin();
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
    (error) => {
        if (error.response && error.response.status === 403) {
            window.location.href = "/banned"; 
        }
        return Promise.reject(error);
    }
);

export default api;
