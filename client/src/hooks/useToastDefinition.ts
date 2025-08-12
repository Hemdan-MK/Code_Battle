import { createContext, useContext } from 'react';

export interface ToastData {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    title?: string;
}

interface ToastContextType {
    showToast: (message: string, type: ToastData['type'], options?: { duration?: number; title?: string }) => void;
    hideToast: (id: string) => void;
    hideAllToasts: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Utility functions for easier usage
export const toast = {
    success: () => {
        // This will be set up in your main app
    },
    error: () => {
        // This will be set up in your main app
    },
    info: () => {
        // This will be set up in your main app
    },
    warning: () => {
        // This will be set up in your main app
    }
};
