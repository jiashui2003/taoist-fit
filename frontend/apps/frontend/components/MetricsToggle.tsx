import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Settings } from 'lucide-react';
import { MetricConfig } from '../types';

interface MetricsToggleProps {
    configs: MetricConfig[];
    onToggle: (key: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const ELEMENT_COLORS: Record<string, string> = {
    '金': '#E8D5A3', // Soft gold/cream
    '木': '#A8D5A2', // Soft mint green
    '水': '#A3C4E8', // Soft sky blue
    '火': '#E8A3A3', // Soft coral/pink
    '土': '#D4C4A8', // Soft sand/beige
};

export const MetricsToggle: React.FC<MetricsToggleProps> = ({
    configs,
    onToggle,
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#FDFCF8] rounded-2xl p-6 w-full max-w-sm shadow-xl max-h-[80vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Settings size={20} className="text-[#4A4A4A]" />
                        <h3 className="text-lg font-bold text-[#2C2C2C]">指标设置</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>

                <p className="text-xs text-gray-500 mb-4">选择需要在顿悟页面显示的修炼指标</p>

                <div className="space-y-2">
                    {configs.map((config) => (
                        <motion.div
                            key={config.key}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onToggle(config.key)}
                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${config.enabled
                                ? 'bg-[#F2F0E6] border border-[#D4CEB0]'
                                : 'bg-gray-50 border border-gray-100'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: ELEMENT_COLORS[config.element] }}
                                />
                                <div>
                                    <p className={`text-sm font-medium ${config.enabled ? 'text-[#2C2C2C]' : 'text-gray-400'}`}>
                                        {config.cultivationName}
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        {config.label} ({config.unit || '-'})
                                    </p>
                                </div>
                            </div>
                            {config.enabled ? (
                                <Eye size={18} className="text-[#BFA15F]" />
                            ) : (
                                <EyeOff size={18} className="text-gray-300" />
                            )}
                        </motion.div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 text-center">
                        五行属性:
                        {Object.entries(ELEMENT_COLORS).map(([el, color]) => (
                            <span key={el} className="mx-1" style={{ color }}>{el}</span>
                        ))}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};
