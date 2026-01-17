import {
    MetricKey,
    ExtendedHealthMetrics,
    MetricStatistics,
    HealthRecommendation,
    RecommendationPriority,
    RecommendationCategory,
    FiveElementsInsight
} from '../types';

/**
 * HealthRecommendationEngine - 健康推荐引擎
 * 
 * Generates personalized health recommendations based on:
 * - Current metric values
 * - Trend analysis results
 * - Anomaly detection findings
 * - Five Elements balance
 */
export class HealthRecommendationEngine {
    /**
     * Generate health recommendations based on current metrics and stats
     */
    static generateRecommendations(
        metrics: ExtendedHealthMetrics,
        stats: Map<MetricKey, MetricStatistics | null>,
        fiveElementsInsight?: FiveElementsInsight
    ): HealthRecommendation[] {
        const recommendations: HealthRecommendation[] = [];

        // Check for high stress
        if (metrics.stress > 70) {
            recommendations.push({
                id: 'stress-high',
                title: '心魔侵扰，需要静心',
                description: '压力值偏高，建议通过冥想和深呼吸来调节心神，稳定道心。',
                priority: 'high',
                category: 'meditation',
                icon: '🧘',
                relatedMetrics: ['stress', 'hrv'],
                action: '打坐冥想30分钟'
            });
        }

        // Check for low HRV (poor recovery)
        if (metrics.hrv < 30) {
            recommendations.push({
                id: 'hrv-low',
                title: '道心不稳，需要调整',
                description: '心率变异性偏低，表明身体恢复不佳。建议增加休息时间,避免过度修炼。',
                priority: 'high',
                category: 'rest',
                icon: '💤',
                relatedMetrics: ['hrv', 'bodyBattery'],
                action: '增加1-2小时睡眠'
            });
        }

        // Check for low body battery
        if (metrics.bodyBattery < 30) {
            recommendations.push({
                id: 'battery-low',
                title: '灵气不足，急需休养',
                description: '身体电量过低，建议暂停剧烈修炼，补充营养和睡眠。',
                priority: 'high',
                category: 'rest',
                icon: '🔋',
                relatedMetrics: ['bodyBattery', 'sleepHours'],
                action: '早睡休息，补充能量'
            });
        }

        // Check for low steps (sedentary)
        if (metrics.steps < 5000) {
            recommendations.push({
                id: 'steps-low',
                title: '活动不足，气血不畅',
                description: '日常步数偏少，建议增加轻度活动，促进气血循环。',
                priority: 'medium',
                category: 'exercise',
                icon: '🚶',
                relatedMetrics: ['steps', 'calories'],
                action: '每小时起身走动5分钟'
            });
        }

        // Check for high heart rate + high stress combo
        if (metrics.heartRate > 90 && metrics.stress > 60) {
            recommendations.push({
                id: 'stress-heartrate-combo',
                title: '心魔与心脉共振，危险',
                description: '心率和压力同时偏高，可能走火入魔。立即调息凝神！',
                priority: 'high',
                category: 'meditation',
                icon: '🚨',
                relatedMetrics: ['heartRate', 'stress'],
                action: '立即停止修炼，深呼吸调息'
            });
        }

        // Check for insufficient sleep
        if (metrics.sleepHours < 6) {
            recommendations.push({
                id: 'sleep-low',
                title: '神识虚弱，修炼效果差',
                description: '睡眠时间不足，影响修炼效果和身体恢复。建议调整作息。',
                priority: 'medium',
                category: 'rest',
                icon: '🌙',
                relatedMetrics: ['sleepHours', 'bodyBattery'],
                action: '保证7-8小时睡眠'
            });
        }

        // Check for excellent body battery + good HRV
        if (metrics.bodyBattery > 80 && metrics.hrv > 50) {
            recommendations.push({
                id: 'excellent-condition',
                title: '状态极佳，可尝试突破',
                description: '灵气充沛，道心稳定，适合进行高强度修炼或冲击瓶颈。',
                priority: 'low',
                category: 'exercise',
                icon: '⚡',
                relatedMetrics: ['bodyBattery', 'hrv'],
                action: '增加修炼强度'
            });
        }

        // Five Elements imbalance recommendation
        if (fiveElementsInsight && fiveElementsInsight.score < 70) {
            const weakElement = fiveElementsInsight.weak;
            recommendations.push({
                id: 'five-elements-balance',
                title: `${weakElement}元素虚弱，需要补充`,
                description: fiveElementsInsight.advice,
                priority: 'medium',
                category: this.getElementCategory(weakElement),
                icon: this.getElementIcon(weakElement),
                relatedMetrics: this.getElementMetrics(weakElement),
                action: `增强${weakElement}元素修炼`
            });
        }

        // Sort by priority
        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    /**
     * Get recommendation category based on weak element
     */
    private static getElementCategory(element: string): RecommendationCategory {
        const mapping: Record<string, RecommendationCategory> = {
            '木': 'exercise',
            '火': 'exercise',
            '土': 'nutrition',
            '金': 'rest',
            '水': 'meditation'
        };
        return mapping[element] || 'exercise';
    }

    /**
     * Get icon for element
     */
    private static getElementIcon(element: string): string {
        const icons: Record<string, string> = {
            '木': '🌳',
            '火': '🔥',
            '土': '🏔️',
            '金': '⚙️',
            '水': '💧'
        };
        return icons[element] || '✨';
    }

    /**
     * Get related metrics for element
     */
    private static getElementMetrics(element: string): MetricKey[] {
        const mapping: Record<string, MetricKey[]> = {
            '木': ['steps', 'calories'],
            '火': ['heartRate', 'respiratoryRate'],
            '土': ['stress', 'bodyBattery'],
            '金': ['hrv', 'sleepHours'],
            '水': ['oxygen', 'respiratoryRate']
        };
        return mapping[element] || [];
    }

    /**
     * Get priority color for UI
     */
    static getPriorityColor(priority: RecommendationPriority): string {
        switch (priority) {
            case 'high':
                return '#D32F2F'; // Red
            case 'medium':
                return '#F57C00'; // Orange
            case 'low':
                return '#388E3C'; // Green
        }
    }

    /**
     * Get category color for UI
     */
    static getCategoryColor(category: RecommendationCategory): string {
        switch (category) {
            case 'exercise':
                return '#1976D2'; // Blue
            case 'rest':
                return '#7B1FA2'; // Purple
            case 'nutrition':
                return '#388E3C'; // Green
            case 'meditation':
                return '#00796B'; // Teal
        }
    }
}
