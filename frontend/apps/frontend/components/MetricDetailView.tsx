import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ExtendedHealthMetrics, MetricConfig, MetricHistory, MetricStatistics } from '../types';
import { db } from '../services/DatabaseService';
import { TimeSeriesChart } from './TimeSeriesChart';
import { InsightCard } from './InsightCard';
import { TrendAnalysisService } from '../services/TrendAnalysisService';
import { AnomalyDetectionService } from '../services/AnomalyDetectionService';
import { HealthRecommendationEngine } from '../services/HealthRecommendationEngine';

interface MetricDetailViewProps {
    metricKey: string;
    metrics: ExtendedHealthMetrics;
    metricConfigs: MetricConfig[];
    onBack: () => void;
}

export const MetricDetailView: React.FC<MetricDetailViewProps> = ({
    metricKey,
    metrics,
    metricConfigs,
    onBack,
}) => {
    const [timeRange, setTimeRange] = useState<1 | 7 | 30 | 99999>(7); // 99999 = all
    const [history, setHistory] = useState<MetricHistory[]>([]);
    const [stats, setStats] = useState<MetricStatistics | null>(null);
    const [loading, setLoading] = useState(true);

    const config = metricConfigs.find((c) => c.key === metricKey);
    const currentValue = metrics[metricKey];

    // Fetch historical data when metric or time range changes
    useEffect(() => {
        const fetchData = async () => {
            if (!config) return;
            setLoading(true);
            try {
                const historyData = await db.getRecentMetricHistory(metricKey as any, timeRange === 99999 ? 365 : timeRange);
                setHistory(historyData);
                const statistics = await db.getMetricStatistics(metricKey as any, timeRange === 99999 ? 365 : timeRange);
                setStats(statistics);
            } catch (error) {
                console.error('Failed to fetch metric history:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [metricKey, timeRange, config]);

    if (!config) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-[#4A4A4A]">指标未找到</p>
            </div>
        );
    }

    // Calculate mock trend (will be replaced with real data later)
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    const trendValue = (Math.random() * 5).toFixed(1);

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
                        <h1 className="text-lg font-bold font-serif text-[#1A1A1A]">
                            {config.label}
                        </h1>
                        <p className="text-sm text-[#3A3A3A]">({config.cultivationName})</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-[#3A3A3A]">{config.element}行</div>
                    </div>
                </div>
            </header>

            {/* Current Value Card */}
            <div className="px-4 pt-6 pb-4">
                <div className="bg-[#FDFCF8] rounded-2xl p-6 shadow-lg border border-[#E6E2D0]">
                    <div className="text-center">
                        <p className="text-sm text-[#3A3A3A] mb-2">当前值</p>
                        <div className="flex items-baseline justify-center gap-2 mb-3">
                            <span className="text-5xl font-bold text-[#9C7D3C]">
                                {typeof currentValue === 'number' ? currentValue.toFixed(1) : currentValue}
                            </span>
                            <span className="text-lg text-[#3A3A3A]">{config.unit}</span>
                        </div>

                        {/* Trend Indicator */}
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${trend === 'up'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            <span>{trend === 'up' ? '↑' : '↓'}</span>
                            <span>{trend === 'up' ? '+' : '-'}{trendValue} {config.unit}</span>
                            <span className="text-xs opacity-70">(较昨日)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Range Tabs */}
            <div className="px-4 pb-4">
                <div className="bg-[#FDFCF8] rounded-xl p-1 shadow-sm border border-[#E6E2D0] flex gap-1">
                    {[
                        { label: '24小时', value: 1 },
                        { label: '7天', value: 7 },
                        { label: '30天', value: 30 },
                        { label: '全部', value: 99999 }
                    ].map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setTimeRange(range.value as any)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${timeRange === range.value
                                ? 'bg-[#9C7D3C] text-white shadow-sm'
                                : 'text-[#3A3A3A] hover:bg-[#F2F0E6]'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Real Chart (Phase 3) */}
            <div className="px-4 pb-4">
                <div className="bg-[#FDFCF8] rounded-2xl p-6 shadow-sm border border-[#E6E2D0]">
                    <h3 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#9C7D3C] rounded-full"></span>
                        趋势图表
                        {loading && <span className="text-xs text-[#3A3A3A]">加载中...</span>}
                    </h3>
                    <TimeSeriesChart
                        data={history}
                        metricKey={config.label}
                        unit={config.unit}
                        color="#9C7D3C"
                    />
                </div>
            </div>

            {/* ML Insights (Phase 4) */}
            <div className="px-4 pb-4">
                <div className="bg-[#FDFCF8] rounded-2xl p-6 shadow-sm border border-[#E6E2D0]">
                    <h3 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#4A6B88] rounded-full"></span>
                        🔮 智能洞察
                    </h3>

                    {history.length >= 5 ? (
                        <div className="space-y-3">
                            {/* Trend Analysis */}
                            {(() => {
                                const trendAnalysis = TrendAnalysisService.analyzeTrend(history);
                                if (trendAnalysis) {
                                    return (
                                        <InsightCard
                                            type="trend"
                                            title="📈 趋势洞察"
                                            content={`${trendAnalysis.description}。过去${timeRange}天${trendAnalysis.changeRate}。`}
                                            severity={
                                                trendAnalysis.direction === 'rising' ? 'info' :
                                                    trendAnalysis.direction === 'falling' ? 'warning' : 'success'
                                            }
                                            icon="📊"
                                        />
                                    );
                                }
                                return null;
                            })()}

                            {/* Anomaly Detection */}
                            {(() => {
                                const anomaly = AnomalyDetectionService.detectAnomaly(
                                    metricKey as any,
                                    currentValue,
                                    stats
                                );
                                if (anomaly.detected) {
                                    return (
                                        <InsightCard
                                            type="anomaly"
                                            title={anomaly.description}
                                            content={anomaly.recommendation}
                                            severity={
                                                anomaly.severity === 'severe' ? 'danger' :
                                                    anomaly.severity === 'moderate' ? 'warning' : 'info'
                                            }
                                            icon={
                                                anomaly.severity === 'severe' ? '🚨' :
                                                    anomaly.severity === 'moderate' ? '⚠️' : 'ℹ️'
                                            }
                                        />
                                    );
                                }
                                return (
                                    <InsightCard
                                        type="anomaly"
                                        title="✅ 指标正常"
                                        content="当前数值在正常范围内，修炼平稳。"
                                        severity="success"
                                        icon="✅"
                                    />
                                );
                            })()}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-[#3A3A3A]">
                            <p className="text-sm mb-2">📊 数据积累中...</p>
                            <p className="text-xs opacity-70">
                                需要至少5个数据点才能进行智能分析
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Real Statistics (Phase 3) */}
            <div className="px-4 pb-4">
                <div className="bg-[#FDFCF8] rounded-2xl p-6 shadow-sm border border-[#E6E2D0]">
                    <h3 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#6B4E23] rounded-full"></span>
                        📊 统计数据
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-[#3A3A3A] mb-1">最高值</p>
                            <p className="font-bold text-[#1A1A1A]">
                                {stats ? stats.max.toFixed(2) : '--'} {config.unit}
                            </p>
                        </div>
                        <div>
                            <p className="text-[#3A3A3A] mb-1">最低值</p>
                            <p className="font-bold text-[#1A1A1A]">
                                {stats ? stats.min.toFixed(2) : '--'} {config.unit}
                            </p>
                        </div>
                        <div>
                            <p className="text-[#3A3A3A] mb-1">平均值</p>
                            <p className="font-bold text-[#1A1A1A]">
                                {stats ? stats.mean.toFixed(2) : '--'} {config.unit}
                            </p>
                        </div>
                        <div>
                            <p className="text-[#3A3A3A] mb-1">标准差</p>
                            <p className="font-bold text-[#1A1A1A]">
                                {stats ? stats.stdDev.toFixed(2) : '--'} {config.unit}
                            </p>
                        </div>
                    </div>
                    {stats && (
                        <div className="mt-4 pt-4 border-t border-[#E6E2D0] text-xs text-[#3A3A3A]">
                            <p>数据点: {stats.count} 个 | 时间段: {stats.period}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Placeholder for Health Advice (Phase 5) */}
            <div className="px-4 pb-6">
                <div className="bg-[#FDFCF8] rounded-2xl p-6 shadow-sm border border-[#E6E2D0]">
                    <h3 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#A84848] rounded-full"></span>
                        🔔 健康建议
                    </h3>
                    <div className="space-y-2 text-sm text-[#3A3A3A]">
                        <p>基于当前{config.label}数据，建议:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>保持规律作息，有助于提升{config.cultivationName}</li>
                            <li>适量运动，增强体质</li>
                            <li>定期监测，及时调整修炼方式</li>
                        </ul>
                        <p className="text-xs text-[#3A3A3A] opacity-70 mt-3">
                            💡 更详细的 AI 建议将在 Phase 5 提供
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
