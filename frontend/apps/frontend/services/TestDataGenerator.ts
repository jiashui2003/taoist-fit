import { db } from './DatabaseService';
import { ExtendedHealthMetrics, MetricKey } from '../types';
import { AchievementService } from './AchievementService';

/**
 * TestDataGenerator - 测试数据生成服务
 * 
 * Generates simulated health data for testing achievement unlocks.
 */
export class TestDataGenerator {
    /**
     * Generate consecutive days of health metrics
     */
    static async generateConsecutiveDays(days: number): Promise<void> {
        console.log(`📊 生成 ${days} 天测试数据...`);

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        for (let i = 0; i < days; i++) {
            const date = new Date(now - (days - 1 - i) * oneDay);
            const dateStr = date.toISOString().split('T')[0];

            // Generate realistic health metrics
            const metrics: ExtendedHealthMetrics = {
                heartRate: this.randomInRange(65, 85),
                hrv: this.randomInRange(40, 70),
                stress: this.randomInRange(25, 45), // Low stress for achievement
                sleepHours: this.randomInRange(7, 9),
                calories: this.randomInRange(1800, 2800),
                steps: this.randomInRange(6000, 12000),
                oxygen: this.randomInRange(96, 99),
                temp: this.randomInRange(36.2, 36.8),
                bodyBattery: this.randomInRange(75, 95), // High for achievement
                vo2Max: this.randomInRange(35, 50),
                restingHeartRate: this.randomInRange(55, 70),
                respiratoryRate: this.randomInRange(14, 18)
            };

            // Save to IndexedDB
            await db.saveHealthMetrics(dateStr, metrics);

            // Save metric history for each metric
            const metricKeys: MetricKey[] = [
                'heartRate', 'hrv', 'stress', 'sleepHours', 'calories',
                'steps', 'oxygen', 'temp', 'bodyBattery', 'vo2Max',
                'restingHeartRate', 'respiratoryRate'
            ];

            for (const key of metricKeys) {
                await db.saveMetricHistory(key, metrics[key], 'simulated');
            }
        }

        console.log(`✅ 成功生成 ${days} 天测试数据`);
    }

    /**
     * Generate data specifically for heart rate achievement
     * (60-100 bpm for consecutive days)
     */
    static async generateNormalHeartRateData(days: number): Promise<void> {
        console.log(`❤️ 生成心率正常数据 (${days} 天)...`);

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        for (let i = 0; i < days; i++) {
            const timestamp = now - (days - 1 - i) * oneDay;
            // Normal heart rate: 60-100 bpm
            await db.saveMetricHistory('heartRate', this.randomInRange(65, 85), 'simulated');
        }
    }

    /**
     * Generate data specifically for stress achievement
     * (stress < 50 for consecutive days)
     */
    static async generateLowStressData(days: number): Promise<void> {
        console.log(`🧘 生成低压力数据 (${days} 天)...`);

        for (let i = 0; i < days; i++) {
            // Low stress: < 50
            await db.saveMetricHistory('stress', this.randomInRange(20, 45), 'simulated');
        }
    }

    /**
     * Generate data specifically for energy achievement
     * (bodyBattery > 80 for consecutive days)
     */
    static async generateHighEnergyData(days: number): Promise<void> {
        console.log(`⚡ 生成高能量数据 (${days} 天)...`);

        for (let i = 0; i < days; i++) {
            // High energy: > 80
            await db.saveMetricHistory('bodyBattery', this.randomInRange(82, 98), 'simulated');
        }
    }

    /**
     * Helper: Random number in range
     */
    private static randomInRange(min: number, max: number): number {
        return Math.round((Math.random() * (max - min) + min) * 10) / 10;
    }

    /**
     * One-click test data population
     * Generates 30 days of good data to unlock most achievements
     */
    static async populateAllTestData(): Promise<{
        daysGenerated: number;
        achievementsUnlocked: number;
    }> {
        console.log('🚀 开始生成完整测试数据...');

        // Generate 30 consecutive days
        await this.generateConsecutiveDays(30);

        // Check achievements
        const level = { stage: 'foundation' as const, layer: 1, progress: 0 };
        const history = await db.getRecentHealthMetrics(30);
        const metricHistory = await db.getRecentMetricHistory('heartRate', 30);

        // Initialize and check achievements
        let achievements = AchievementService.initializeAchievements();
        achievements = AchievementService.checkAllAchievements(
            achievements,
            metricHistory,
            level,
            30 // consecutive days
        );

        const unlocked = achievements.filter(a => a.unlocked).length;

        console.log(`✅ 测试数据生成完成`);
        console.log(`📊 生成天数: 30`);
        console.log(`🏆 解锁成就: ${unlocked}/18`);

        return {
            daysGenerated: 30,
            achievementsUnlocked: unlocked
        };
    }

    /**
     * Clear all test data
     */
    static async clearAllTestData(): Promise<void> {
        console.log('🗑️ 清理测试数据...');
        await db.clearAllData();
        console.log('✅ 测试数据已清理');
    }
}
