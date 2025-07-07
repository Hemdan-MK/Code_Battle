// components/CustomToast.tsx
import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

interface CustomToastProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose: () => void;
    title?: string;
}

const CustomToast: React.FC<CustomToastProps> = ({
    message,
    type,
    duration = 3000,
    onClose,
    title
}) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 100) {
                    onClose();
                    return 0;
                }
                return prev - 100;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [isPaused, onClose]);

    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: CheckCircle,
                    iconBg: 'bg-green-900/30',
                    iconColor: 'text-green-400',
                    title: title || 'Success',
                    borderColor: 'border-green-800/50',
                    progressColor: 'bg-green-500'
                };
            case 'error':
                return {
                    icon: AlertCircle,
                    iconBg: 'bg-red-900/30',
                    iconColor: 'text-red-400',
                    title: title || 'Error',
                    borderColor: 'border-red-800/50',
                    progressColor: 'bg-red-500'
                };
            case 'warning':
                return {
                    icon: AlertTriangle,
                    iconBg: 'bg-orange-900/30',
                    iconColor: 'text-orange-400',
                    title: title || 'Warning',
                    borderColor: 'border-orange-800/50',
                    progressColor: 'bg-orange-500'
                };
            case 'info':
                return {
                    icon: Info,
                    iconBg: 'bg-blue-900/30',
                    iconColor: 'text-blue-400',
                    title: title || 'Info',
                    borderColor: 'border-blue-800/50',
                    progressColor: 'bg-blue-500'
                };
            default:
                return {
                    icon: Info,
                    iconBg: 'bg-gray-900/30',
                    iconColor: 'text-gray-400',
                    title: title || 'Notification',
                    borderColor: 'border-gray-800/50',
                    progressColor: 'bg-gray-500'
                };
        }
    };

    const config = getToastConfig();
    const Icon = config.icon;
    const progress = ((duration - timeLeft) / duration) * 100;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className={`bg-gray-900 border ${config.borderColor} rounded-xl p-6 max-w-md w-full mx-4 animate-in fade-in duration-300 slide-in-from-bottom-4 relative overflow-hidden`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-1 bg-gray-800 w-full">
                    <div
                        className={`h-full ${config.progressColor} transition-all duration-100 ease-linear`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 ${config.iconBg} rounded-lg`}>
                            <Icon className={`w-5 h-5 ${config.iconColor}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">{config.title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400 hover:text-white" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="mb-4">
                    <p className="text-gray-300">
                        {message}
                    </p>
                </div>

                {/* Timer Display */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{isPaused ? 'Paused' : 'Auto-closing...'}</span>
                    <span>{Math.ceil(timeLeft / 1000)}s</span>
                </div>
            </div>
        </div>
    );
};

export default CustomToast;