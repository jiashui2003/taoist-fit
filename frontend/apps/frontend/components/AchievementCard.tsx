import React from 'react';
import { Achievement, AchievementTier } from '../types';
import { AchievementService } from '../services/AchievementService';
import { Lock, CheckCircle } from 'lucide-react';

interface AchievementCardProps {
    achievement: Achievement;
    compact?: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
    achievement,
    compact = false
}) => {
    const tierColor = AchievementService.getTierColor(achievement.tier);
    const { unlocked, progress, icon, name, description, currentValue, requirement } = achievement;

    if (compact) {
        return (
            <div
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${unlocked
                        ? 'bg-white border-opacity-100'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                style={{ borderColor: unlocked ? tierColor : undefined }}
            >
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${unlocked ? 'bg-opacity-20' : 'bg-gray-200'
                        }`}
                    style={{ backgroundColor: unlocked ? `${tierColor}33` : undefined }}
                >
                    {unlocked ? icon : <Lock size={16} className="text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${unlocked ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                        {name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{description}</p>
                </div>
                {unlocked && <CheckCircle size={18} style={{ color: tierColor }} />}
            </div>
        );
    }

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border-2 p-4 transition-all duration-300 ${unlocked
                    ? 'bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-gray-50 border-gray-200'
                }`}
            style={{
                borderColor: unlocked ? tierColor : undefined,
                animation: unlocked ? 'none' : undefined,
            }}
        >
            {/* Tier Badge */}
            <div
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{ backgroundColor: tierColor, color: 'white' }}
            >
                {achievement.tier === 'bronze' && '🥉'}
                {achievement.tier === 'silver' && '🥈'}
                {achievement.tier === 'gold' && '🥇'}
                {achievement.tier === 'special' && '🏆'}
            </div>

            {/* Icon */}
            <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-3 ${unlocked ? '' : 'grayscale opacity-50'
                    }`}
                style={{
                    backgroundColor: unlocked ? `${tierColor}20` : '#E5E7EB',
                    border: `3px solid ${unlocked ? tierColor : '#D1D5DB'}`,
                }}
            >
                {unlocked ? icon : <Lock size={24} className="text-gray-400" />}
            </div>

            {/* Name */}
            <h3 className={`text-center font-bold mb-1 ${unlocked ? 'text-[#1A1A1A]' : 'text-gray-400'
                }`}>
                {name}
            </h3>

            {/* Description */}
            <p className="text-center text-xs text-gray-500 mb-3">
                {description}
            </p>

            {/* Progress Bar */}
            {!unlocked && (
                <div className="mb-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: tierColor,
                            }}
                        />
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-1">
                        {currentValue} / {requirement}
                    </p>
                </div>
            )}

            {/* Unlock Status */}
            {unlocked && (
                <div className="flex items-center justify-center gap-1 text-sm" style={{ color: tierColor }}>
                    <CheckCircle size={14} />
                    <span>已解锁</span>
                </div>
            )}
        </div>
    );
};
