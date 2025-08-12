// hooks/useToast.tsx
import React, { useState, type ReactNode } from 'react';
import CustomToast from '../components/common/CustomToast';
import { ToastContext, type ToastData } from './useToastDefinition';

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