import React from 'react';
import { motion } from 'framer-motion';
import { FiveElementsInsight } from '../types';

interface FiveElementsCardProps {
    insight: FiveElementsInsight;
}

const ELEMENT_COLORS: Record<string, string> = {
    '金': '#E8D5A3', // Soft gold/cream
    '木': '#A8D5A2', // Soft mint green
    '水': '#A3C4E8', // Soft sky blue
    '火': '#E8A3A3', // Soft coral/pink
    '土': '#D4C4A8', // Soft sand/beige
};

const ELEMENT_NAMES: Record<string, string> = {
    '金': '金 (肺)',
    '木': '木 (肝)',
    '水': '水 (肾)',
    '火': '火 (心)',
    '土': '土 (脾)',
};

export const FiveElementsCard: React.FC<FiveElementsCardProps> = ({ insight }) => {
    const elements = ['金', '木', '水', '火', '土'] as const;

    return (
        <div className="bg-[#FDFCF8] rounded-2xl p-4 shadow-sm border border-[#E6E2D0]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="flex items-center gap-2 font-bold text-[#4A4A4A]">
                    <span className="w-1 h-4 bg-gradient-to-b from-[#BFA15F] to-[#9B6B9E] rounded-full"></span>
                    五行平衡
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold" style={{ color: ELEMENT_COLORS[insight.dominant] }}>
                        {insight.score}
                    </span>
                    <span className="text-xs text-gray-400">/ 100</span>
                </div>
            </div>

            {/* Pentagon visualization (simplified as bars) */}
            <div className="space-y-2 mb-4">
                {elements.map((el) => (
                    <div key={el} className="flex items-center gap-2">
                        <span className="text-xs w-16" style={{ color: ELEMENT_COLORS[el] }}>
                            {ELEMENT_NAMES[el]}
                        </span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${insight.balance[el]}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: ELEMENT_COLORS[el] }}
                            />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">
                            {insight.balance[el]}
                        </span>
                    </div>
                ))}
            </div>

            {/* Dominant/Weak indicators */}
            <div className="flex gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1">
                    <span className="text-gray-400">偏盛:</span>
                    <span className="font-bold" style={{ color: ELEMENT_COLORS[insight.dominant] }}>
                        {insight.dominant}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-gray-400">偏虚:</span>
                    <span className="font-bold" style={{ color: ELEMENT_COLORS[insight.weak] }}>
                        {insight.weak}
                    </span>
                </div>
            </div>

            {/* Advice */}
            <div className="bg-[#F2F0E6] rounded-xl p-3 border border-dashed border-[#D4CEB0]">
                <p className="text-sm text-[#4A4A4A] leading-relaxed font-serif">
                    {insight.advice}
                </p>
            </div>
        </div>
    );
};
