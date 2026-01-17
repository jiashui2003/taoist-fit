import React from 'react';
import { InsightType, InsightSeverity } from '../types';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Activity } from 'lucide-react';

interface InsightCardProps {
    type: InsightType;
    title: string;
    content: string;
    severity: InsightSeverity;
    icon?: string; // Custom emoji icon
    timestamp?: number;
    actionLabel?: string;
    onAction?: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({
    type,
    title,
    content,
    severity,
    icon,
    timestamp,
    actionLabel,
    onAction
}) => {
    // Get background color based on severity
    const getBgColor = () => {
        switch (severity) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            case 'warning':
                return 'bg-orange-50 border-orange-200';
            case 'danger':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    // Get icon color
    const getIconColor = () => {
        switch (severity) {
            case 'success':
                return 'bg-green-100 text-green-600';
            case 'info':
                return 'bg-blue-100 text-blue-600';
            case 'warning':
                return 'bg-orange-100 text-orange-600';
            case 'danger':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    // Get default icon if no emoji provided
    const getDefaultIcon = () => {
        switch (type) {
            case 'trend':
                return <TrendingUp size={18} />;
            case 'anomaly':
                return <AlertTriangle size={18} />;
            case 'recommendation':
                return <Lightbulb size={18} />;
            case 'prediction':
                return <Activity size={18} />;
            default:
                return <TrendingUp size={18} />;
        }
    };

    return (
        <div
            className={`border ${getBgColor()} rounded-xl p-4 mb-3 transition-all duration-300 hover:shadow-md`}
            style={{ animation: 'fadeInUp 0.4s ease-out' }}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`${getIconColor()} rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0`}>
                    {icon ? (
                        <span className="text-lg">{icon}</span>
                    ) : (
                        getDefaultIcon()
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h4 className="font-bold text-[#2C2C2C] mb-1 text-sm">
                        {title}
                    </h4>
                    <p className="text-[#4A4A4A] text-xs leading-relaxed mb-2">
                        {content}
                    </p>

                    {/* Action Button */}
                    {actionLabel && onAction && (
                        <button
                            onClick={onAction}
                            className="text-xs font-medium text-[#BFA15F] hover:text-[#2C2C2C] transition-colors mt-2"
                        >
                            {actionLabel} →
                        </button>
                    )}

                    {/* Timestamp */}
                    {timestamp && (
                        <p className="text-[10px] text-gray-400 mt-2">
                            {new Date(timestamp).toLocaleString('zh-CN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Add fade-in animation via inline style tag
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    if (!document.head.querySelector('[data-insight-animation]')) {
        style.setAttribute('data-insight-animation', 'true');
        document.head.appendChild(style);
    }
}
