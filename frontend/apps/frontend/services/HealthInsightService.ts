import { ExtendedHealthMetrics, FiveElementsInsight, MetricConfig, MetricKey } from '../types';
import { METRIC_CONFIGS } from '../constants';

/**
 * Health Insight Service - Selective ML Coupling Model
 * 
 * Implements a Five Elements (五行) balance model that analyzes
 * relationships between ENABLED health metrics only.
 * 
 * Element Mapping:
 * - 金 (Metal): Lung function - oxygen, vo2Max, respiratoryRate
 * - 木 (Wood): Liver/Emotional - hrv, restingHeartRate
 * - 水 (Water): Kidney/Recovery - sleepHours
 * - 火 (Fire): Heart/Energy - calories, stress, heartRate, temp
 * - 土 (Earth): Spleen/Stability - steps, bodyBattery
 */

// Metric to element mapping
const METRIC_ELEMENT_MAP: Record<MetricKey, string> = {
    calories: '火',
    hrv: '木',
    stress: '火',
    sleepHours: '水',
    heartRate: '火',
    oxygen: '金',
    temp: '火',
    steps: '土',
    vo2Max: '金',
    restingHeartRate: '木',
    respiratoryRate: '金',
    bodyBattery: '土',
};

// Normalization ranges for each metric
const METRIC_RANGES: Record<MetricKey, { min: number; max: number; inverse: boolean }> = {
    calories: { min: 0, max: 2500, inverse: false },
    hrv: { min: 10, max: 60, inverse: false },
    stress: { min: 0, max: 100, inverse: true },
    sleepHours: { min: 4, max: 9, inverse: false },
    heartRate: { min: 50, max: 120, inverse: true },
    oxygen: { min: 90, max: 100, inverse: false },
    temp: { min: 35, max: 38, inverse: false },
    steps: { min: 0, max: 12000, inverse: false },
    vo2Max: { min: 20, max: 60, inverse: false },
    restingHeartRate: { min: 50, max: 80, inverse: true },
    respiratoryRate: { min: 12, max: 20, inverse: true },
    bodyBattery: { min: 0, max: 100, inverse: false },
};

// Normalize a value to 0-100 scale
const normalize = (value: number, min: number, max: number, inverse: boolean = false): number => {
    const normalized = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    return inverse ? 100 - normalized : normalized;
};

// Calculate element scores using ONLY enabled metrics
const calculateElementScoresSelective = (
    metrics: ExtendedHealthMetrics,
    enabledConfigs: MetricConfig[]
): Record<string, { score: number; count: number }> => {
    const scores: Record<string, { total: number; count: number }> = {
        '金': { total: 0, count: 0 },
        '木': { total: 0, count: 0 },
        '水': { total: 0, count: 0 },
        '火': { total: 0, count: 0 },
        '土': { total: 0, count: 0 },
    };

    // Only process enabled metrics
    for (const config of enabledConfigs) {
        const key = config.key;
        const element = METRIC_ELEMENT_MAP[key];
        const range = METRIC_RANGES[key];
        const value = metrics[key];

        if (element && range && typeof value === 'number') {
            const normalizedScore = normalize(value, range.min, range.max, range.inverse);
            scores[element].total += normalizedScore;
            scores[element].count += 1;
        }
    }

    // Calculate averages
    const result: Record<string, { score: number; count: number }> = {};
    for (const [el, data] of Object.entries(scores)) {
        result[el] = {
            score: data.count > 0 ? data.total / data.count : 50, // Default to 50 if no metrics
            count: data.count,
        };
    }

    return result;
};

// Generate advice based on element imbalance
const generateAdvice = (
    dominant: string,
    weak: string,
    scores: Record<string, { score: number; count: number }>
): string => {
    const adviceMap: Record<string, Record<string, string>> = {
        '火': {
            high: '心火过旺，宜静心调息。建议增加冥想时间，减少剧烈运动。',
            low: '心火不足，精力欠佳。适当增加有氧运动，激活身体能量。',
        },
        '水': {
            high: '肾水充盈，休息充足。保持良好作息习惯。',
            low: '肾水不足，神识恍惚。需增加深度睡眠，建议子时前入睡。',
        },
        '木': {
            high: '肝木调和，情绪稳定。继续保持良好心态。',
            low: '肝木失调，压力较大。建议进行舒缓的拉伸运动，调节情绪。',
        },
        '金': {
            high: '肺金饱满，呼吸深长。气血运行通畅。',
            low: '肺金亏虚，呼吸浅促。建议练习腹式呼吸，多做户外活动。',
        },
        '土': {
            high: '脾土厚实，根基稳固。日常活动充足。',
            low: '脾土虚弱，行动不足。需增加日常步行，培养运动习惯。',
        },
    };

    if (scores[weak]?.score < 40) {
        return adviceMap[weak]?.low || '五行失衡，需综合调理。';
    } else if (scores[dominant]?.score > 80) {
        return adviceMap[dominant]?.high || '五行偏盛，宜调和平衡。';
    }

    return '五行相对平衡，保持现有修炼节奏。';
};

/**
 * Main function to calculate Five Elements balance insight
 * Uses ONLY enabled metrics for the coupling model
 */
export function calculateFiveElementsInsight(
    metrics: ExtendedHealthMetrics,
    enabledConfigs?: MetricConfig[]
): FiveElementsInsight {
    // Use provided configs or default to all METRIC_CONFIGS that are enabled
    const configs = enabledConfigs || METRIC_CONFIGS.filter((c) => c.enabled);
    const scoresData = calculateElementScoresSelective(metrics, configs);

    // Find dominant and weak elements (only among those with metrics)
    const elements = ['金', '木', '水', '火', '土'] as const;
    type ElementType = typeof elements[number];
    let dominant: ElementType = elements[0];
    let weak: ElementType = elements[0];

    for (const el of elements) {
        if (scoresData[el].count > 0) {
            if (scoresData[el].score > scoresData[dominant].score) dominant = el;
            if (scoresData[el].score < scoresData[weak].score) weak = el;
        }
    }

    // Calculate overall balance score (100 = perfect balance)
    const activeScores = Object.values(scoresData).filter((d) => d.count > 0).map((d) => d.score);
    const avg = activeScores.length > 0 ? activeScores.reduce((a, b) => a + b, 0) / activeScores.length : 50;
    const variance = activeScores.length > 0
        ? activeScores.reduce((acc, s) => acc + Math.pow(s - avg, 2), 0) / activeScores.length
        : 0;
    const balanceScore = Math.max(0, Math.min(100, 100 - Math.sqrt(variance)));

    const advice = generateAdvice(dominant, weak, scoresData);

    return {
        score: Math.round(balanceScore),
        dominant,
        weak,
        balance: {
            '金': Math.round(scoresData['金'].score),
            '木': Math.round(scoresData['木'].score),
            '水': Math.round(scoresData['水'].score),
            '火': Math.round(scoresData['火'].score),
            '土': Math.round(scoresData['土'].score),
        },
        advice,
    };
}

/**
 * Get enabled metrics based on config
 */
export function getEnabledMetrics(configs: MetricConfig[]): MetricConfig[] {
    return configs.filter((c) => c.enabled);
}
