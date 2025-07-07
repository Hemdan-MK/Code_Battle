import type { AuthResponse } from "@/services/auth";

export const setToken = (token: string): void => {
    localStorage.setItem('authToken', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('authToken');
};

export const removeToken = (): void => {
    localStorage.removeItem('authToken');
};

export const setUser = (user: AuthResponse['user']): void => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): AuthResponse['user'] | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const removeUser = (): void => {
    localStorage.removeItem('user');
};

export const setAdmin = (user: AuthResponse['user']): void => {
    localStorage.setItem('admin', JSON.stringify(user));
};

export const getAdmin = (): AuthResponse['user'] | null => {
    const userStr = localStorage.getItem('admin');
    return userStr ? JSON.parse(userStr) : null;
};

export const removeAdmin = (): void => {
    localStorage.removeItem('admin');
};

export const setTempToken = (token: string): void => {
    localStorage.setItem('tempToken', token);
};

export const getTempToken = (): string | null => {
    return localStorage.getItem('tempToken');
};

export const removeTempToken = (): void => {
    localStorage.removeItem('tempToken');
};

export const setTempUser = (user: AuthResponse['user']): void => {
    localStorage.setItem('tempUser', JSON.stringify(user));
};

export const getTempUser = (): AuthResponse['user'] | null => {
    const userStr = localStorage.getItem('tempUser');
    return userStr ? JSON.parse(userStr) : null;
};

export const removeTempUser = (): void => {
    localStorage.removeItem('tempUser');
};



export const logout = (): void => {
    removeToken();
    removeUser();
    removeTempToken();
    removeTempUser();
};