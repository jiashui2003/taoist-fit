import React, { useState } from 'react';
import { ArrowLeft, Trophy, Star, Target } from 'lucide-react';
import { Achievement, AchievementCategory, AchievementStats } from '../types';
import { AchievementService } from '../services/AchievementService';
import { AchievementCard } from './AchievementCard';

interface AchievementViewProps {
    achievements: Achievement[];
    stats: AchievementStats;
    onBack: () => void;
}

export const AchievementView: React.FC<AchievementViewProps> = ({
    achievements,
    stats,
    onBack,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

    const categories: (AchievementCategory | 'all')[] = [
        'all',
        'diligence',
        'heart',
        'stress',
        'energy',
        'balance',
        'breakthrough',
    ];

    const getCategoryLabel = (cat: AchievementCategory | 'all'): string => {
        if (cat === 'all') return '全部';
        return AchievementService.getCategoryName(cat);
    };

    const filteredAchievements = selectedCategory === 'all'
        ? achievements
        : achievements.filter(a => a.category === selectedCategory);

    const unlockedCount = stats.unlocked;
    const totalCount = stats.total;
    const progressPercent = Math.round((unlockedCount / totalCount) * 100);

    return (
        <div className="flex flex-col h-full bg-[#F2F0E6] overflow-y-auto pb-24">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-[#F2F0E6]/95 backdrop-blur-md border-b border-[#D4CEB0] px-4 py-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        aria-label="返回"
                        className="p-2 hover:bg-[#E6E2D0] rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-[#1A1A1A]" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold font-serif text-[#1A1A1A] flex items-center gap-2">
                            <Trophy size={20} className="text-[#9C7D3C]" />
                            修炼成就
                        </h1>
                        <p className="text-sm text-[#3A3A3A]">记录你的修仙历程</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-[#9C7D3C]">{unlockedCount}/{totalCount}</div>
                        <div className="text-xs text-[#3A3A3A]">已解锁</div>
                    </div>
                </div>
            </header>

            {/* Overall Progress */}
            <div className="px-4 pt-6 pb-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E6E2D0]">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#9C7D3C] to-[#6B5421] flex items-center justify-center">
                            <Star size={28} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-[#1A1A1A]">修炼进度</p>
                            <p className="text-sm text-[#3A3A3A]">
                                已完成 {progressPercent}% 的成就
                            </p>
                        </div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#9C7D3C] to-[#FFD700] rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Recent Unlocks */}
            {stats.recentUnlocks.length > 0 && (
                <div className="px-4 pb-4">
                    <h2 className="font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#FFD700] rounded-full"></span>
                        ✨ 最近解锁
                    </h2>
                    <div className="space-y-2">
                        {stats.recentUnlocks.map(achievement => (
                            <AchievementCard
                                key={achievement.id}
                                achievement={achievement}
                                compact
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Category Tabs */}
            <div className="px-4 pb-4">
                <div className="overflow-x-auto">
                    <div className="flex gap-2 min-w-max pb-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                        ? 'bg-[#9C7D3C] text-white shadow-md'
                                        : 'bg-white text-[#3A3A3A] border border-[#E6E2D0]'
                                    }`}
                            >
                                {getCategoryLabel(cat)}
                                {cat !== 'all' && (
                                    <span className="ml-1 opacity-70">
                                        ({stats.byCategory[cat].unlocked}/{stats.byCategory[cat].total})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Achievement Grid */}
            <div className="px-4 pb-6">
                <div className="grid grid-cols-2 gap-3">
                    {filteredAchievements.map(achievement => (
                        <AchievementCard
                            key={achievement.id}
                            achievement={achievement}
                        />
                    ))}
                </div>

                {filteredAchievements.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <Target size={48} className="mx-auto mb-3 opacity-50" />
                        <p>此类别暂无成就</p>
                    </div>
                )}
            </div>
        </div>
    );
};
