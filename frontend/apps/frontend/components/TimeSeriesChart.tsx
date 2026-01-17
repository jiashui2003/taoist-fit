import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MetricHistory } from '../types';

interface TimeSeriesChartProps {
    data: MetricHistory[];
    metricKey: string;
    unit: string;
    color?: string;
    normalRange?: [number, number]; // [min, max] for healthy range
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
    data,
    metricKey,
    unit,
    color = '#9C7D3C',
    normalRange,
}) => {
    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-[#3A3A3A] border-2 border-dashed border-[#D4CEB0] rounded-xl">
                <div className="text-center">
                    <p className="text-sm">📊</p>
                    <p className="text-xs mt-2">暂无历史数据</p>
                    <p className="text-xs text-[#3A3A3A] opacity-70">数据将在下次更新后显示</p>
                </div>
            </div>
        );
    }

    // Format data for Recharts (sort by timestamp, oldest first for chart)
    const chartData = [...data]
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            value: item.value,
            timestamp: item.timestamp,
        }));

    // Calculate Y-axis domain with padding
    const values = chartData.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const padding = (maxValue - minValue) * 0.1 || 1;
    const yMin = Math.max(0, minValue - padding);
    const yMax = maxValue + padding;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E2D0" vertical={false} />

                <XAxis
                    dataKey="time"
                    stroke="#3A3A3A"
                    tick={{ fontSize: 10, fill: '#3A3A3A' }}
                    tickLine={false}
                    axisLine={{ stroke: '#D4CEB0' }}
                />

                <YAxis
                    stroke="#3A3A3A"
                    tick={{ fontSize: 10, fill: '#3A3A3A' }}
                    tickLine={false}
                    axisLine={{ stroke: '#D4CEB0' }}
                    domain={[yMin, yMax]}
                    tickFormatter={(value) => value.toFixed(1)}
                />

                <Tooltip
                    contentStyle={{
                        backgroundColor: '#FDFCF8',
                        border: '1px solid #D4CEB0',
                        borderRadius: '8px',
                        fontSize: '12px',
                    }}
                    labelStyle={{ color: '#1A1A1A', fontWeight: 'bold' }}
                    formatter={(value: number) => [`${value.toFixed(2)} ${unit}`, metricKey]}
                />

                {/* Normal range reference lines if provided */}
                {normalRange && (
                    <>
                        <ReferenceLine
                            y={normalRange[0]}
                            stroke="#A84848"
                            strokeDasharray="5 5"
                            strokeWidth={1}
                            label={{ value: '最低值', fontSize: 10, fill: '#A84848' }}
                        />
                        <ReferenceLine
                            y={normalRange[1]}
                            stroke="#4A6B88"
                            strokeDasharray="5 5"
                            strokeWidth={1}
                            label={{ value: '最高值', fontSize: 10, fill: '#4A6B88' }}
                        />
                    </>
                )}

                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={{ fill: color, r: 3 }}
                    activeDot={{ r: 5, fill: color, stroke: '#FDFCF8', strokeWidth: 2 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
