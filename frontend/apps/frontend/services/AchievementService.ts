import {
    Achievement,
    AchievementCategory,
    AchievementTier,
    AchievementStats,
    MetricHistory,
    CultivationLevel,
    CultivationStage,
    FiveElementsInsight
} from '../types';

/**
 * AchievementService - 成就系统服务
 * 
 * Manages achievement detection, progress tracking, and unlocking.
 * All achievements are cultivation-themed (修仙风格).
 */
export class AchievementService {
    /**
     * All available achievements
     */
    static readonly ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress' | 'currentValue'>[] = [
        // === 修炼勤勉 (Diligence) ===
        {
            id: 'diligence_1',
            name: '初入修途',
            description: '连续记录数据3天',
            category: 'diligence',
            tier: 'bronze',
            icon: '📝',
            requirement: 3,
        },
        {
            id: 'diligence_2',
            name: '修炼有恒',
            description: '连续记录数据7天',
            category: 'diligence',
            tier: 'silver',
            icon: '📆',
            requirement: 7,
        },
        {
            id: 'diligence_3',
            name: '道心坚定',
            description: '连续记录数据30天',
            category: 'diligence',
            tier: 'gold',
            icon: '🏅',
            requirement: 30,
        },

        // === 心脉稳定 (Heart Stability) ===
        {
            id: 'heart_1',
            name: '心气调和',
            description: '心率保持60-100 bpm连续3天',
            category: 'heart',
            tier: 'bronze',
            icon: '❤️',
            requirement: 3,
        },
        {
            id: 'heart_2',
            name: '心脉稳定大师',
            description: '心率保持正常范围14天',
            category: 'heart',
            tier: 'silver',
            icon: '💓',
            requirement: 14,
        },
        {
            id: 'heart_3',
            name: '心如止水',
            description: '心率和HRV同时正常30天',
            category: 'heart',
            tier: 'gold',
            icon: '💖',
            requirement: 30,
        },

        // === 压力克制 (Stress Control) ===
        {
            id: 'stress_1',
            name: '心魔初克',
            description: '压力指数低于50持续1天',
            category: 'stress',
            tier: 'bronze',
            icon: '🧘',
            requirement: 1,
        },
        {
            id: 'stress_2',
            name: '道心稳固',
            description: '压力指数低于50持续7天',
            category: 'stress',
            tier: 'silver',
            icon: '🧘‍♂️',
            requirement: 7,
        },
        {
            id: 'stress_3',
            name: '心魔降伏',
            description: '压力指数低于40持续14天',
            category: 'stress',
            tier: 'gold',
            icon: '👑',
            requirement: 14,
        },

        // === 灵气充沛 (Energy Mastery) ===
        {
            id: 'energy_1',
            name: '灵气初聚',
            description: '身体电量大于70持续1天',
            category: 'energy',
            tier: 'bronze',
            icon: '⚡',
            requirement: 1,
        },
        {
            id: 'energy_2',
            name: '灵气旺盛',
            description: '身体电量大于80持续7天',
            category: 'energy',
            tier: 'silver',
            icon: '🔋',
            requirement: 7,
        },
        {
            id: 'energy_3',
            name: '灵气充盈',
            description: '身体电量大于90持续14天',
            category: 'energy',
            tier: 'gold',
            icon: '✨',
            requirement: 14,
        },

        // === 五行平衡 (Five Elements Balance) ===
        {
            id: 'balance_1',
            name: '五行初调',
            description: '五行平衡分数大于60',
            category: 'balance',
            tier: 'bronze',
            icon: '☯️',
            requirement: 60,
        },
        {
            id: 'balance_2',
            name: '五行和谐',
            description: '五行平衡分数大于80',
            category: 'balance',
            tier: 'silver',
            icon: '🌟',
            requirement: 80,
        },
        {
            id: 'balance_3',
            name: '阴阳合一',
            description: '五行平衡分数大于90持续7天',
            category: 'balance',
            tier: 'gold',
            icon: '💫',
            requirement: 90,
        },

        // === 境界突破 (Cultivation Breakthroughs) ===
        {
            id: 'breakthrough_1',
            name: '筑基成功',
            description: '达到筑基期境界',
            category: 'breakthrough',
            tier: 'special',
            icon: '🏛️',
            requirement: 2, // Stage index
        },
        {
            id: 'breakthrough_2',
            name: '金丹已成',
            description: '达到金丹期境界',
            category: 'breakthrough',
            tier: 'special',
            icon: '🟡',
            requirement: 3,
        },
        {
            id: 'breakthrough_3',
            name: '元婴出窍',
            description: '达到元婴期境界',
            category: 'breakthrough',
            tier: 'special',
            icon: '👶',
            requirement: 4,
        },
    ];

    /**
     * Initialize achievements with default state
     */
    static initializeAchievements(): Achievement[] {
        return this.ACHIEVEMENTS.map(a => ({
            ...a,
            unlocked: false,
            progress: 0,
            currentValue: 0,
        }));
    }

    /**
     * Check and update all achievements based on current data
     */
    static checkAllAchievements(
        currentAchievements: Achievement[],
        consecutiveDays: number,
        heartHistory: MetricHistory[],
        stressHistory: MetricHistory[],
        energyHistory: MetricHistory[],
        fiveElementsScore: number,
        cultivationLevel: CultivationLevel
    ): { achievements: Achievement[]; newUnlocks: Achievement[] } {
        const updated = [...currentAchievements];
        const newUnlocks: Achievement[] = [];

        updated.forEach((achievement, index) => {
            const wasUnlocked = achievement.unlocked;

            switch (achievement.category) {
                case 'diligence':
                    updated[index] = this.checkDiligence(achievement, consecutiveDays);
                    break;
                case 'heart':
                    updated[index] = this.checkHeart(achievement, heartHistory);
                    break;
                case 'stress':
                    updated[index] = this.checkStress(achievement, stressHistory);
                    break;
                case 'energy':
                    updated[index] = this.checkEnergy(achievement, energyHistory);
                    break;
                case 'balance':
                    updated[index] = this.checkBalance(achievement, fiveElementsScore);
                    break;
                case 'breakthrough':
                    updated[index] = this.checkBreakthrough(achievement, cultivationLevel);
                    break;
            }

            if (!wasUnlocked && updated[index].unlocked) {
                newUnlocks.push(updated[index]);
            }
        });

        return { achievements: updated, newUnlocks };
    }

    /**
     * Check diligence achievements
     */
    private static checkDiligence(achievement: Achievement, consecutiveDays: number): Achievement {
        const progress = Math.min(100, (consecutiveDays / achievement.requirement) * 100);
        const unlocked = consecutiveDays >= achievement.requirement;

        return {
            ...achievement,
            currentValue: consecutiveDays,
            progress,
            unlocked: achievement.unlocked || unlocked,
            unlockedAt: unlocked && !achievement.unlocked ? Date.now() : achievement.unlockedAt,
        };
    }

    /**
     * Check heart stability achievements
     */
    private static checkHeart(achievement: Achievement, history: MetricHistory[]): Achievement {
        const normalDays = this.countConsecutiveNormalDays(history, 60, 100);
        const progress = Math.min(100, (normalDays / achievement.requirement) * 100);
        const unlocked = normalDays >= achievement.requirement;

        return {
            ...achievement,
            currentValue: normalDays,
            progress,
            unlocked: achievement.unlocked || unlocked,
            unlockedAt: unlocked && !achievement.unlocked ? Date.now() : achievement.unlockedAt,
        };
    }

    /**
     * Check stress control achievements
     */
    private static checkStress(achievement: Achievement, history: MetricHistory[]): Achievement {
        const threshold = achievement.id === 'stress_3' ? 40 : 50;
        const lowStressDays = this.countConsecutiveLowDays(history, threshold);
        const progress = Math.min(100, (lowStressDays / achievement.requirement) * 100);
        const unlocked = lowStressDays >= achievement.requirement;

        return {
            ...achievement,
            currentValue: lowStressDays,
            progress,
            unlocked: achievement.unlocked || unlocked,
            unlockedAt: unlocked && !achievement.unlocked ? Date.now() : achievement.unlockedAt,
        };
    }

    /**
     * Check energy mastery achievements
     */
    private static checkEnergy(achievement: Achievement, history: MetricHistory[]): Achievement {
        const threshold = achievement.id === 'energy_1' ? 70 : achievement.id === 'energy_2' ? 80 : 90;
        const highEnergyDays = this.countConsecutiveHighDays(history, threshold);
        const progress = Math.min(100, (highEnergyDays / achievement.requirement) * 100);
        const unlocked = highEnergyDays >= achievement.requirement;

        return {
            ...achievement,
            currentValue: highEnergyDays,
            progress,
            unlocked: achievement.unlocked || unlocked,
            unlockedAt: unlocked && !achievement.unlocked ? Date.now() : achievement.unlockedAt,
        };
    }

    /**
     * Check five elements balance achievements
     */
    private static checkBalance(achievement: Achievement, score: number): Achievement {
        const progress = Math.min(100, (score / achievement.requirement) * 100);
        const unlocked = score >= achievement.requirement;

        return {
            ...achievement,
            currentValue: Math.round(score),
            progress,
            unlocked: achievement.unlocked || unlocked,
            unlockedAt: unlocked && !achievement.unlocked ? Date.now() : achievement.unlockedAt,
        };
    }

    /**
     * Check cultivation breakthrough achievements
     */
    private static checkBreakthrough(achievement: Achievement, level: CultivationLevel): Achievement {
        const stageOrder = [
            CultivationStage.QiRefining,    // 1
            CultivationStage.Foundation,    // 2
            CultivationStage.GoldenCore,    // 3
            CultivationStage.NascentSoul,   // 4
        ];
        const currentStageIndex = stageOrder.indexOf(level.stage) + 1;
        const unlocked = currentStageIndex >= achievement.requirement;
        const progress = Math.min(100, (currentStageIndex / achievement.requirement) * 100);

        return {
            ...achievement,
            currentValue: currentStageIndex,
            progress,
            unlocked: achievement.unlocked || unlocked,
            unlockedAt: unlocked && !achievement.unlocked ? Date.now() : achievement.unlockedAt,
        };
    }

    /**
     * Count consecutive days with values in normal range
     */
    private static countConsecutiveNormalDays(
        history: MetricHistory[],
        min: number,
        max: number
    ): number {
        if (history.length === 0) return 0;

        const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);
        const dailyValues = this.aggregateByDay(sorted);

        let count = 0;
        for (const avg of dailyValues) {
            if (avg >= min && avg <= max) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }

    /**
     * Count consecutive days with values below threshold
     */
    private static countConsecutiveLowDays(history: MetricHistory[], threshold: number): number {
        if (history.length === 0) return 0;

        const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);
        const dailyValues = this.aggregateByDay(sorted);

        let count = 0;
        for (const avg of dailyValues) {
            if (avg < threshold) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }

    /**
     * Count consecutive days with values above threshold
     */
    private static countConsecutiveHighDays(history: MetricHistory[], threshold: number): number {
        if (history.length === 0) return 0;

        const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);
        const dailyValues = this.aggregateByDay(sorted);

        let count = 0;
        for (const avg of dailyValues) {
            if (avg > threshold) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }

    /**
     * Aggregate history by day, returning daily averages (most recent first)
     */
    private static aggregateByDay(history: MetricHistory[]): number[] {
        const dailyMap = new Map<string, number[]>();

        history.forEach(h => {
            const day = h.date;
            if (!dailyMap.has(day)) {
                dailyMap.set(day, []);
            }
            dailyMap.get(day)!.push(h.value);
        });

        const days = Array.from(dailyMap.keys()).sort().reverse();
        return days.map(day => {
            const values = dailyMap.get(day)!;
            return values.reduce((a, b) => a + b, 0) / values.length;
        });
    }

    /**
     * Get tier color for styling
     */
    static getTierColor(tier: AchievementTier): string {
        switch (tier) {
            case 'bronze': return '#CD7F32';
            case 'silver': return '#C0C0C0';
            case 'gold': return '#FFD700';
            case 'special': return '#9C27B0';
        }
    }

    /**
     * Get category name in Chinese
     */
    static getCategoryName(category: AchievementCategory): string {
        const names: Record<AchievementCategory, string> = {
            diligence: '修炼勤勉',
            heart: '心脉稳定',
            stress: '压力克制',
            energy: '灵气充沛',
            balance: '五行平衡',
            breakthrough: '境界突破',
        };
        return names[category];
    }

    /**
     * Calculate achievement statistics
     */
    static getStats(achievements: Achievement[]): AchievementStats {
        const byCategory: Record<AchievementCategory, { total: number; unlocked: number }> = {
            diligence: { total: 0, unlocked: 0 },
            heart: { total: 0, unlocked: 0 },
            stress: { total: 0, unlocked: 0 },
            energy: { total: 0, unlocked: 0 },
            balance: { total: 0, unlocked: 0 },
            breakthrough: { total: 0, unlocked: 0 },
        };

        achievements.forEach(a => {
            byCategory[a.category].total++;
            if (a.unlocked) byCategory[a.category].unlocked++;
        });

        const recentUnlocks = achievements
            .filter(a => a.unlocked && a.unlockedAt)
            .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
            .slice(0, 3);

        return {
            total: achievements.length,
            unlocked: achievements.filter(a => a.unlocked).length,
            byCategory,
            recentUnlocks,
        };
    }
}
