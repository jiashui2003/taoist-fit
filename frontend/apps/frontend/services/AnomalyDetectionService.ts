import { MetricKey, MetricHistory, MetricStatistics, AnomalyAlert, AnomalySeverity } from '../types';

/**
 * AnomalyDetectionService - 异常检测服务
 * 
 * Detects unusual metric values using statistical methods:
 * - Z-score (standard deviations from mean)
 * - IQR (Interquartile Range) method
 * - Predefined normal ranges for health metrics
 */
export class AnomalyDetectionService {
    /**
     * Normal ranges for health metrics (cultivation-themed)
     */
    private static readonly NORMAL_RANGES: Record<MetricKey, [number, number]> = {
        heartRate: [60, 100],
        steps: [5000, 15000],
        calories: [1200, 3000],
        sleepHours: [6, 9],
        stress: [20, 60],
        hrv: [20, 80],
        respiratoryRate: [12, 20],
        bodyBattery: [30, 100],
        oxygen: [95, 100],
        temp: [36, 37.5],
        vo2Max: [30, 60],
        restingHeartRate: [50, 80],
    };

    /**
     * Detect anomalies in current metric value
     * @param metricKey - Metric to analyze
     * @param currentValue - Current metric value
     * @param stats - Statistical summary of recent history
     * @returns AnomalyAlert object
     */
    static detectAnomaly(
        metricKey: MetricKey,
        currentValue: number,
        stats: MetricStatistics | null
    ): AnomalyAlert {
        // Default: no anomaly detected
        const noAnomaly: AnomalyAlert = {
            detected: false,
            severity: null,
            metric: metricKey,
            currentValue,
            expectedRange: this.NORMAL_RANGES[metricKey] || [0, 100],
            description: '指标正常，修炼平稳',
            recommendation: '继续保持当前修炼节奏'
        };

        // Check against predefined normal range
        const normalRange = this.NORMAL_RANGES[metricKey];
        if (normalRange) {
            if (currentValue < normalRange[0] || currentValue > normalRange[1]) {
                return this.createAnomalyAlert(
                    metricKey,
                    currentValue,
                    normalRange,
                    'range'
                );
            }
        }

        // Statistical anomaly detection (requires history)
        if (stats && stats.count >= 10) {
            const zScore = (currentValue - stats.mean) / stats.stdDev;

            // Z-score thresholds
            if (Math.abs(zScore) > 2.5) {
                return this.createAnomalyAlert(
                    metricKey,
                    currentValue,
                    [stats.mean - 2 * stats.stdDev, stats.mean + 2 * stats.stdDev],
                    'statistical',
                    zScore
                );
            }

            // IQR method for additional validation
            const iqr = this.calculateIQR(stats);
            const lowerBound = stats.median - 1.5 * iqr;
            const upperBound = stats.median + 1.5 * iqr;

            if (currentValue < lowerBound || currentValue > upperBound) {
                return this.createAnomalyAlert(
                    metricKey,
                    currentValue,
                    [lowerBound, upperBound],
                    'iqr'
                );
            }
        }

        return noAnomaly;
    }

    /**
     * Create anomaly alert with cultivation-themed messages
     */
    private static createAnomalyAlert(
        metricKey: MetricKey,
        currentValue: number,
        expectedRange: [number, number],
        detectionMethod: 'range' | 'statistical' | 'iqr',
        zScore?: number
    ): AnomalyAlert {
        const isHigh = currentValue > expectedRange[1];
        const isLow = currentValue < expectedRange[0];

        // Calculate severity
        let severity: AnomalySeverity;
        const deviation = isHigh
            ? (currentValue - expectedRange[1]) / expectedRange[1]
            : (expectedRange[0] - currentValue) / expectedRange[0];

        if (deviation > 0.3) {
            severity = 'severe';
        } else if (deviation > 0.15) {
            severity = 'moderate';
        } else {
            severity = 'mild';
        }

        // Generate cultivation-themed description and recommendation
        const { description, recommendation } = this.generateAnomalyMessage(
            metricKey,
            isHigh,
            severity
        );

        return {
            detected: true,
            severity,
            metric: metricKey,
            currentValue,
            expectedRange,
            description,
            recommendation,
            zScore
        };
    }

    /**
     * Generate cultivation-themed anomaly messages
     */
    private static generateAnomalyMessage(
        metricKey: MetricKey,
        isHigh: boolean,
        severity: AnomalySeverity
    ): { description: string; recommendation: string } {
        const severityEmoji = severity === 'severe' ? '🚨' : severity === 'moderate' ? '⚠️' : 'ℹ️';

        const messages: Record<MetricKey, { high: string; low: string; rec: string }> = {
            heartRate: {
                high: `${severityEmoji} 心脉急促，疑似走火入魔征兆`,
                low: `${severityEmoji} 心脉缓慢，灵气运转不畅`,
                rec: isHigh ? '立即停止修炼，打坐调息' : '增加轻度运动，活络气血'
            },
            stress: {
                high: `${severityEmoji} 心魔侵扰，压力过载`,
                low: `${severityEmoji} 道心平静，无忧无虑`,
                rec: isHigh ? '暂停修炼，冥想静心1小时' : '继续保持平和心境'
            },
            hrv: {
                high: `${severityEmoji} 道心波动过大`,
                low: `${severityEmoji} 道心不稳，需要调整`,
                rec: isHigh ? '适当休息，避免过度修炼' : '深呼吸练习，稳定心神'
            },
            bodyBattery: {
                high: `${severityEmoji} 灵气充盈，状态极佳`,
                low: `${severityEmoji} 灵气不足，急需休养`,
                rec: isHigh ? '适合冲击修炼瓶颈' : '增加睡眠，补充营养灵食'
            },
            sleepHours: {
                high: `${severityEmoji} 睡眠过多，可能气滞`,
                low: `${severityEmoji} 睡眠不足，元气虚损`,
                rec: isHigh ? '增加日间活动' : '调整作息，确保7-8小时睡眠'
            },
            steps: {
                high: `${severityEmoji} 运动过度，消耗灵气`,
                low: `${severityEmoji} 活动不足，气血不畅`,
                rec: isHigh ? '适当休息，避免过劳' : '增加日常步行，活络筋骨'
            },
            respiratoryRate: {
                high: `${severityEmoji} 呼吸急促，内息不稳`,
                low: `${severityEmoji} 呼吸缓慢，可能气虚`,
                rec: isHigh ? '调整呼吸节奏，深呼吸练习' : '增强心肺功能训练'
            },
            calories: {
                high: `${severityEmoji} 能量摄入过多`,
                low: `${severityEmoji} 能量不足，难以支撑修炼`,
                rec: isHigh ? '控制饮食，增加运动' : '增加营养摄入'
            },
            oxygen: {
                high: `${severityEmoji} 血氧充足`,
                low: `${severityEmoji} 血氧不足，需要通风`,
                rec: isHigh ? '状态良好' : '深呼吸，到户外活动'
            },
            temp: {
                high: `${severityEmoji} 体温偏高`,
                low: `${severityEmoji} 体温偏低`,
                rec: isHigh ? '注意降温休息' : '注意保暖'
            },
            vo2Max: {
                high: `${severityEmoji} 有氧能力优秀`,
                low: `${severityEmoji} 有氧能力需提升`,
                rec: isHigh ? '保持训练强度' : '增加有氧训练'
            },
            restingHeartRate: {
                high: `${severityEmoji} 静息心率偏高`,
                low: `${severityEmoji} 静息心率偏低`,
                rec: isHigh ? '增加休息，减少压力' : '状态良好'
            }
        };

        const msg = messages[metricKey];
        return {
            description: isHigh ? msg.high : msg.low,
            recommendation: msg.rec
        };
    }

    /**
     * Calculate Interquartile Range (IQR) from statistics
     */
    private static calculateIQR(stats: MetricStatistics): number {
        // Approximation: IQR ≈ 1.35 * stdDev for normal distribution
        return 1.35 * stats.stdDev;
    }

    /**
     * Get severity color for UI
     */
    static getSeverityColor(severity: AnomalySeverity | null): string {
        switch (severity) {
            case 'severe':
                return '#D32F2F'; // Red
            case 'moderate':
                return '#F57C00'; // Orange
            case 'mild':
                return '#FBC02D'; // Yellow
            default:
                return '#388E3C'; // Green
        }
    }
}
