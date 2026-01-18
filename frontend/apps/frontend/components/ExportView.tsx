import React, { useState, useCallback } from 'react';
import { ArrowLeft, Download, FileJson, FileText, Image, Calendar, Share2 } from 'lucide-react';
import {
    ExtendedHealthMetrics,
    CultivationLevel,
    FiveElementsInsight,
    Achievement
} from '../types';
import { ReportGenerator, DailyReport } from '../services/ReportGenerator';
import { ImageExportService } from '../services/ImageExportService';
import { ShareModal } from './ShareModal';

interface ExportViewProps {
    metrics: ExtendedHealthMetrics;
    level: CultivationLevel;
    fiveElements: FiveElementsInsight;
    achievements: Achievement[];
    onBack: () => void;
}

export const ExportView: React.FC<ExportViewProps> = ({
    metrics,
    level,
    fiveElements,
    achievements,
    onBack
}) => {
    const [loading, setLoading] = useState<string | null>(null);
    const [shareModal, setShareModal] = useState<{
        isOpen: boolean;
        imageUrl: string;
        title: string;
        shareText: string;
    }>({ isOpen: false, imageUrl: '', title: '', shareText: '' });

    // Generate today's date
    const today = new Date().toISOString().split('T')[0];

    // Generate and show daily report
    const handleGenerateDailyReport = useCallback(async () => {
        setLoading('daily');
        try {
            const report = await ReportGenerator.generateDailyReport(
                today,
                level,
                metrics,
                fiveElements,
                achievements
            );
            const imageUrl = await ImageExportService.generateDailyCard(report);
            const shareText = ReportGenerator.getDailyReportText(report);

            setShareModal({
                isOpen: true,
                imageUrl,
                title: '修炼日报',
                shareText
            });
        } catch (error) {
            console.error('Failed to generate daily report:', error);
        } finally {
            setLoading(null);
        }
    }, [today, level, metrics, fiveElements, achievements]);

    // Export data as JSON
    const handleExportJSON = useCallback(async () => {
        setLoading('json');
        try {
            const data = await ReportGenerator.exportDataAsJSON();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `taoist-fit-backup-${today}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export JSON:', error);
        } finally {
            setLoading(null);
        }
    }, [today]);

    // Export metrics as CSV
    const handleExportCSV = useCallback(async () => {
        setLoading('csv');
        try {
            const data = await ReportGenerator.exportMetricsAsCSV(30);
            const blob = new Blob(['\uFEFF' + data], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `taoist-fit-metrics-${today}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export CSV:', error);
        } finally {
            setLoading(null);
        }
    }, [today]);

    // Share achievement
    const handleShareAchievement = useCallback(async (achievement: Achievement) => {
        if (!achievement.unlocked) return;

        setLoading(achievement.id);
        try {
            const imageUrl = ImageExportService.generateAchievementCard({
                name: achievement.name,
                icon: achievement.icon,
                description: achievement.description,
                tier: achievement.tier
            });

            setShareModal({
                isOpen: true,
                imageUrl,
                title: achievement.name,
                shareText: `🏆 我在修仙健身中解锁了成就【${achievement.name}】！\n${achievement.icon} ${achievement.description}\n\n#TaoistFit #修仙健身`
            });
        } catch (error) {
            console.error('Failed to generate achievement card:', error);
        } finally {
            setLoading(null);
        }
    }, []);

    const unlockedAchievements = achievements.filter(a => a.unlocked);

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
                            <Download size={20} className="text-[#9C7D3C]" />
                            导出与分享
                        </h1>
                        <p className="text-sm text-[#3A3A3A]">分享你的修炼成果</p>
                    </div>
                </div>
            </header>

            <div className="p-4 space-y-6">
                {/* Report Generation Section */}
                <section>
                    <h2 className="font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#9C7D3C] rounded-full"></span>
                        📊 修炼报告
                    </h2>
                    <div className="space-y-3">
                        <button
                            onClick={handleGenerateDailyReport}
                            disabled={loading === 'daily'}
                            className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-[#E6E2D0] hover:border-[#9C7D3C] transition-all active:scale-[0.98]"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9C7D3C] to-[#6B5421] flex items-center justify-center">
                                <Calendar size={24} className="text-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-bold text-[#1A1A1A]">生成今日日报</p>
                                <p className="text-sm text-[#3A3A3A]">生成可分享的修炼日报卡片</p>
                            </div>
                            {loading === 'daily' && (
                                <div className="animate-spin w-5 h-5 border-2 border-[#9C7D3C] border-t-transparent rounded-full" />
                            )}
                        </button>
                    </div>
                </section>

                {/* Data Export Section */}
                <section>
                    <h2 className="font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#9C7D3C] rounded-full"></span>
                        💾 数据导出
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleExportJSON}
                            disabled={loading === 'json'}
                            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-[#E6E2D0] hover:border-[#9C7D3C] transition-all active:scale-[0.98]"
                        >
                            <FileJson size={28} className="text-[#4A4A4A]" />
                            <span className="font-bold text-sm text-[#1A1A1A]">JSON 完整备份</span>
                            {loading === 'json' && (
                                <div className="animate-spin w-4 h-4 border-2 border-[#9C7D3C] border-t-transparent rounded-full" />
                            )}
                        </button>

                        <button
                            onClick={handleExportCSV}
                            disabled={loading === 'csv'}
                            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-[#E6E2D0] hover:border-[#9C7D3C] transition-all active:scale-[0.98]"
                        >
                            <FileText size={28} className="text-[#4A4A4A]" />
                            <span className="font-bold text-sm text-[#1A1A1A]">CSV 指标数据</span>
                            {loading === 'csv' && (
                                <div className="animate-spin w-4 h-4 border-2 border-[#9C7D3C] border-t-transparent rounded-full" />
                            )}
                        </button>
                    </div>
                </section>

                {/* Achievement Sharing Section */}
                {unlockedAchievements.length > 0 && (
                    <section>
                        <h2 className="font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                            <span className="w-1 h-4 bg-[#FFD700] rounded-full"></span>
                            🏆 分享成就
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {unlockedAchievements.slice(0, 4).map(achievement => (
                                <button
                                    key={achievement.id}
                                    onClick={() => handleShareAchievement(achievement)}
                                    disabled={loading === achievement.id}
                                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E6E2D0] hover:border-[#FFD700] transition-all active:scale-[0.98]"
                                >
                                    <span className="text-2xl">{achievement.icon}</span>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="font-bold text-sm text-[#1A1A1A] truncate">{achievement.name}</p>
                                        <p className="text-xs text-[#3A3A3A] flex items-center gap-1">
                                            <Share2 size={12} />
                                            点击分享
                                        </p>
                                    </div>
                                    {loading === achievement.id && (
                                        <div className="animate-spin w-4 h-4 border-2 border-[#FFD700] border-t-transparent rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal(prev => ({ ...prev, isOpen: false }))}
                imageUrl={shareModal.imageUrl}
                title={shareModal.title}
                shareText={shareModal.shareText}
            />
        </div>
    );
};
