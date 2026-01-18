import {
    ExtendedHealthMetrics,
    CultivationLevel,
    Achievement,
    FiveElementsInsight,
    MetricHistory,
    MetricStatistics
} from '../types';
import { db } from './DatabaseService';
import { AchievementService } from './AchievementService';

/**
 * ReportGenerator - 修炼报告生成服务
 * 
 * Generates cultivation-themed daily/weekly reports and data exports.
 */
export interface DailyReport {
    date: string;
    level: CultivationLevel;
    metrics: ExtendedHealthMetrics;
    fiveElements: FiveElementsInsight;
    achievements: Achievement[];
    newUnlocks: Achievement[];
    lingQi: number;
    cultivationHours: number;
}

export interface WeeklyReport {
    startDate: string;
    endDate: string;
    level: CultivationLevel;
    avgMetrics: Partial<ExtendedHealthMetrics>;
    fiveElementsTrend: number[];
    achievementsUnlocked: Achievement[];
    totalLingQi: number;
    totalCultivationHours: number;
    dailySummary: { date: string; score: number }[];
}

export class ReportGenerator {
    /**
     * Generate daily cultivation report
     */
    static async generateDailyReport(
        date: string,
        level: CultivationLevel,
        metrics: ExtendedHealthMetrics,
        fiveElements: FiveElementsInsight,
        achievements: Achievement[]
    ): Promise<DailyReport> {
        const newUnlocks = achievements.filter(
            a => a.unlocked && a.unlockedAt &&
                new Date(a.unlockedAt).toISOString().split('T')[0] === date
        );

        // Calculate cultivation hours (based on active time)
        const cultivationHours = Math.round(metrics.calories / 200 * 10) / 10;

        // Calculate lingQi from calories
        const lingQi = Math.floor(metrics.calories * 1.04);

        return {
            date,
            level,
            metrics,
            fiveElements,
            achievements,
            newUnlocks,
            lingQi,
            cultivationHours
        };
    }

    /**
     * Generate weekly cultivation report
     */
    static async generateWeeklyReport(
        startDate: string,
        level: CultivationLevel,
        achievements: Achievement[]
    ): Promise<WeeklyReport> {
        const endDate = new Date();
        endDate.setDate(endDate.getDate());
        const endDateStr = endDate.toISOString().split('T')[0];

        // Get historical data
        const historicalData = await db.getRecentHealthMetrics(7);

        // Calculate averages
        const avgMetrics: Partial<ExtendedHealthMetrics> = {};
        if (historicalData.length > 0) {
            const keys = Object.keys(historicalData[0]).filter(k => typeof (historicalData[0] as any)[k] === 'number');
            keys.forEach(key => {
                const values = historicalData.map(h => (h as any)[key]).filter(v => typeof v === 'number');
                if (values.length > 0) {
                    (avgMetrics as any)[key] = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
                }
            });
        }

        // Weekly achievements unlocked
        const weekStart = new Date(startDate).getTime();
        const achievementsUnlocked = achievements.filter(
            a => a.unlocked && a.unlockedAt && a.unlockedAt >= weekStart
        );

        // Calculate totals
        const totalLingQi = historicalData.reduce((sum, d) => sum + Math.floor(d.calories * 1.04), 0);
        const totalCultivationHours = Math.round(historicalData.reduce((sum, d) => sum + d.calories / 200, 0) * 10) / 10;

        // Daily summary
        const dailySummary = historicalData.map(d => ({
            date: d.date,
            score: Math.round((d.hrv / 100 + (100 - d.stress) / 100 + d.bodyBattery / 100) / 3 * 100)
        }));

        return {
            startDate,
            endDate: endDateStr,
            level,
            avgMetrics,
            fiveElementsTrend: [], // Could add historical five elements data
            achievementsUnlocked,
            totalLingQi,
            totalCultivationHours,
            dailySummary
        };
    }

    /**
     * Export all data as JSON
     */
    static async exportDataAsJSON(): Promise<string> {
        return await db.exportData();
    }

    /**
     * Export metrics history as CSV
     */
    static async exportMetricsAsCSV(days: number = 30): Promise<string> {
        const data = await db.getRecentHealthMetrics(days);

        if (data.length === 0) {
            return '日期,心率,HRV,压力,睡眠,卡路里,步数,血氧,体温,身体电量\n';
        }

        const headers = ['日期', '心率', 'HRV', '压力', '睡眠', '卡路里', '步数', '血氧', '体温', '身体电量'];
        const rows = data.map(d => [
            d.date,
            d.heartRate,
            d.hrv,
            d.stress,
            d.sleepHours,
            d.calories,
            d.steps,
            d.oxygen,
            d.temp,
            d.bodyBattery
        ].join(','));

        return [headers.join(','), ...rows].join('\n');
    }

    /**
     * Get report summary text for sharing
     */
    static getDailyReportText(report: DailyReport): string {
        const { date, level, metrics, fiveElements, lingQi, cultivationHours, newUnlocks } = report;

        let text = `🧘 修炼日报 ${date}\n\n`;
        text += `📍 境界: ${this.getStageName(level.stage)} 第${level.layer}层\n`;
        text += `⏱️ 今日修炼: ${cultivationHours} 小时\n`;
        text += `⚡ 灵气获得: ${lingQi}\n\n`;
        text += `❤️ 心率: ${metrics.heartRate} bpm\n`;
        text += `🧘 压力: ${metrics.stress}\n`;
        text += `💤 睡眠: ${metrics.sleepHours} 小时\n`;
        text += `🔋 身体电量: ${metrics.bodyBattery}%\n\n`;
        text += `☯️ 五行平衡: ${fiveElements.score}%\n`;

        if (newUnlocks.length > 0) {
            text += `\n✨ 今日解锁:\n`;
            newUnlocks.forEach(a => {
                text += `  ${a.icon} ${a.name}\n`;
            });
        }

        text += `\n🔗 Taoist Fit 修仙健身`;
        return text;
    }

    /**
     * Get stage name in Chinese
     */
    private static getStageName(stage: string): string {
        const names: Record<string, string> = {
            'qi-refining': '炼气期',
            'foundation': '筑基期',
            'golden-core': '金丹期',
            'nascent-soul': '元婴期'
        };
        return names[stage] || stage;
    }
}
