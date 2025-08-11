// hooks/useToast.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import CustomToast from '../components/common/CustomToast';

interface ToastData {
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

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = (
        message: string,
        type: ToastData['type'],
        options?: { duration?: number; title?: string }
    ) => {
        const id = Date.now().toString();
        const newToast: ToastData = {
            id,
            message,
            type,
            duration: options?.duration || 5000,
            title: options?.title
        };

        setToasts(prev => [...prev, newToast]);
    };

    const hideToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const hideAllToasts = () => {
        setToasts([]);
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast, hideAllToasts }}>
            {children}

            {/* Render Toasts */}
            {toasts.map(toast => (
                <CustomToast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    title={toast.title}
                    onClose={() => hideToast(toast.id)}
                />
            ))}
        </ToastContext.Provider>
    );
};

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