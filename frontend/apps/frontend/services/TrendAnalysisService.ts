import { MetricKey, MetricHistory, MetricStatistics, TrendAnalysis, TrendDirection } from '../types';

/**
 * TrendAnalysisService - 趋势分析服务
 * 
 * Analyzes time-series metric data to detect trends using:
 * - Linear regression for trend direction and slope
 * - Exponential moving average for noise filtering
 * - R² coefficient for confidence scoring
 */
export class TrendAnalysisService {
    /**
     * Analyze metric history to detect trends
     * @param history - Array of metric history records
     * @returns TrendAnalysis object or null if insufficient data
     */
    static analyzeTrend(history: MetricHistory[]): TrendAnalysis | null {
        if (history.length < 5) {
            return null; // Need at least 5 data points for reliable trend
        }

        // Sort by timestamp ascending
        const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);

        // Extract values and calculate days from start
        const values = sorted.map(h => h.value);
        const timestamps = sorted.map(h => h.timestamp);
        const startTime = timestamps[0];
        const days = timestamps.map(t => (t - startTime) / (1000 * 60 * 60 * 24));

        // Calculate linear regression
        const n = values.length;
        const sumX = days.reduce((a, b) => a + b, 0);
        const sumY = values.reduce((a, b) => a + b, 0);
        const sumXY = days.reduce((sum, x, i) => sum + x * values[i], 0);
        const sumX2 = days.reduce((sum, x) => sum + x * x, 0);
        const sumY2 = values.reduce((sum, y) => sum + y * y, 0);

        // Slope (rate of change per day)
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

        // Intercept
        const intercept = (sumY - slope * sumX) / n;

        // R² (coefficient of determination) for confidence
        const meanY = sumY / n;
        const ssTotal = values.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
        const ssResidual = values.reduce((sum, y, i) => {
            const predicted = slope * days[i] + intercept;
            return sum + Math.pow(y - predicted, 2);
        }, 0);
        const rSquared = 1 - (ssResidual / ssTotal);
        const confidence = Math.max(0, Math.min(1, rSquared)); // Clamp to [0, 1]

        // Predict next value (1 day ahead)
        const lastDay = days[days.length - 1];
        const prediction = slope * (lastDay + 1) + intercept;

        // Determine trend direction
        const threshold = 0.1; // Minimum slope to consider as rising/falling
        let direction: TrendDirection;
        if (Math.abs(slope) < threshold) {
            direction = 'stable';
        } else if (slope > 0) {
            direction = 'rising';
        } else {
            direction = 'falling';
        }

        // Generate cultivation-themed description
        const description = this.generateTrendDescription(direction, slope, values[values.length - 1]);

        // Format change rate
        const changeRate = slope >= 0
            ? `+${Math.abs(slope).toFixed(1)}/天`
            : `-${Math.abs(slope).toFixed(1)}/天`;

        return {
            direction,
            slope,
            confidence,
            prediction,
            description,
            changeRate
        };
    }

    /**
     * Generate cultivation-themed trend description
     */
    private static generateTrendDescription(
        direction: TrendDirection,
        slope: number,
        currentValue: number
    ): string {
        const absSlope = Math.abs(slope);

        if (direction === 'stable') {
            return '修炼平稳，气息稳定';
        }

        if (direction === 'rising') {
            if (absSlope > 5) {
                return '心脉急速上升，需注意调息';
            } else if (absSlope > 2) {
                return '修炼渐进，气脉渐强';
            } else {
                return '缓缓上升，修炼有序';
            }
        } else {
            // Falling
            if (absSlope > 5) {
                return '急速下降，需调整修炼方式';
            } else if (absSlope > 2) {
                return '渐渐回落，进入调息期';
            } else {
                return '缓缓下降，状态放松';
            }
        }
    }

    /**
     * Calculate exponential moving average for smoothing
     * @param history - Metric history
     * @param alpha - Smoothing factor (0-1), default 0.3
     */
    static calculateEMA(history: MetricHistory[], alpha: number = 0.3): number[] {
        if (history.length === 0) return [];

        const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);
        const values = sorted.map(h => h.value);
        const ema: number[] = [values[0]];

        for (let i = 1; i < values.length; i++) {
            ema[i] = alpha * values[i] + (1 - alpha) * ema[i - 1];
        }

        return ema;
    }

    /**
     * Detect short-term changes by comparing current value to EMA
     */
    static detectShortTermChange(
        currentValue: number,
        history: MetricHistory[]
    ): 'increasing' | 'decreasing' | 'stable' {
        if (history.length < 3) return 'stable';

        const ema = this.calculateEMA(history);
        const recentEMA = ema[ema.length - 1];
        const threshold = 0.05 * recentEMA; // 5% threshold

        if (currentValue > recentEMA + threshold) {
            return 'increasing';
        } else if (currentValue < recentEMA - threshold) {
            return 'decreasing';
        } else {
            return 'stable';
        }
    }
}
