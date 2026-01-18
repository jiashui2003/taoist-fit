import React, { useState } from 'react';
import { MOCK_INVENTORY } from '../constants';
import { Scroll, Zap, Moon, Sparkles, Download, Trophy, ChevronRight, Sun, Volume2, Upload, Settings } from 'lucide-react';
import { HealthMetrics, ActivityEntry, AchievementStats } from '../types';
import { ActivityTimeline } from './ActivityTimeline';
import { ImportDataModal } from './ImportDataModal';
import { useTheme } from '../contexts/ThemeContext';
import { VoiceService } from '../services/VoiceService';

interface BagViewProps {
  metrics: HealthMetrics;
  activityLog: ActivityEntry[];
  lingQiBalance: number;
  onExport?: () => void;
  onAchievements?: () => void;
  achievementStats?: AchievementStats;
}

export const BagView: React.FC<BagViewProps> = ({ metrics, activityLog, lingQiBalance, onExport, onAchievements, achievementStats }) => {
  const { theme, toggleTheme } = useTheme();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Calculate total from activity log
  const totalCalories = activityLog.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const totalLingQi = activityLog.reduce((sum, a) => sum + a.lingQiGained, 0);
  const totalSteps = activityLog.reduce((sum, a) => sum + (a.steps || 0), 0);

  const handleVoiceSummary = async () => {
    if (isSpeaking) {
      VoiceService.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      await VoiceService.speakDailySummary(totalSteps || 0, totalCalories);
    } catch (error) {
      console.error('语音播报失败:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 pt-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-serif">灵物秘宝</h2>
        <div className="flex items-center gap-3">
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#9C7D3C]/20 hover:bg-[#9C7D3C]/30 text-[#9C7D3C] rounded-full text-sm font-bold transition-colors"
              aria-label="导出报告"
            >
              <Download size={14} />
              <span>导出</span>
            </button>
          )}
          <div className="flex items-center gap-2 bg-[#BFA15F]/10 px-3 py-1.5 rounded-full">
            <Sparkles size={14} className="text-[#BFA15F]" />
            <span className="font-mono font-bold text-[#BFA15F]">{lingQiBalance}</span>
            <span className="text-[10px] text-[#BFA15F]/70">灵气</span>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-[#FDFCF8] rounded-2xl p-4 shadow-sm border border-[#E6E2D0] mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={18} className="text-[#9C7D3C]" />
          <h3 className="font-bold text-[#4A4A4A]">修炼设置</h3>
        </div>

        <div className="space-y-3">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? <Moon size={16} className="text-[#9B6B9E]" /> : <Sun size={16} className="text-[#BFA15F]" />}
              <span className="text-sm text-[#4A4A4A]">{theme === 'dark' ? '玄夜主题' : '白昼主题'}</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-[#9B6B9E]' : 'bg-[#D4CEB0]'
                }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                }`} />
            </button>
          </div>

          {/* Voice Button */}
          <button
            onClick={handleVoiceSummary}
            className="w-full flex items-center justify-between py-2 px-3 bg-[#F9F8F4] rounded-lg hover:bg-[#E6E2D0] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Volume2 size={16} className={isSpeaking ? 'text-[#9C7D3C] animate-pulse' : 'text-[#4A4A4A]'} />
              <span className="text-sm text-[#4A4A4A]">{isSpeaking ? '播放中...' : '语音播报今日总结'}</span>
            </div>
            <ChevronRight size={16} className="text-[#9C7D3C]" />
          </button>

          {/* Import Button */}
          <button
            onClick={() => setIsImportOpen(true)}
            className="w-full flex items-center justify-between py-2 px-3 bg-[#F9F8F4] rounded-lg hover:bg-[#E6E2D0] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Upload size={16} className="text-[#4A4A4A]" />
              <span className="text-sm text-[#4A4A4A]">导入修炼数据</span>
            </div>
            <ChevronRight size={16} className="text-[#9C7D3C]" />
          </button>
        </div>
      </div>

      {/* Efficiency Report Card */}
      <div className="bg-[#FDFCF8] rounded-2xl p-6 shadow-sm border border-[#E6E2D0] mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-gray-500 text-sm">今日运动消耗</span>
          <span className="text-2xl font-mono font-bold">{totalCalories} kcal</span>
        </div>
        <div className="flex justify-end text-[#BFA15F] text-sm font-medium mb-4">
          已转化灵气: {totalLingQi}
        </div>

        <div className="mt-4">
          <span className="text-sm text-gray-500 mb-2 block">当前修炼效率</span>
          <div className="flex items-center justify-around bg-[#F9F8F4] rounded-xl p-4">
            <div className="flex flex-col items-center">
              <Zap size={16} className="text-[#BFA15F] mb-1" />
              <span className="text-xs text-gray-500">道心</span>
              <span className="font-bold text-[#4A4A4A]">×0.8</span>
            </div>
            <span className="text-gray-300">×</span>
            <div className="flex flex-col items-center">
              <Moon size={16} className="text-[#9B6B9E] mb-1" />
              <span className="text-xs text-gray-500">神识</span>
              <span className="font-bold text-[#9B6B9E]">×1.3</span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">综合效率</span>
              <span className="text-xl font-bold text-[#BFA15F]">×1.04</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-[#FDFCF8] rounded-2xl p-4 shadow-sm border border-[#E6E2D0] mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#4A4A4A]">今日修炼记录</h3>
          <span className="text-xs text-gray-400">{activityLog.length} 条</span>
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          <ActivityTimeline activities={activityLog} />
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#4A4A4A]">道具背包</h3>
        <span className="text-sm text-gray-400">{MOCK_INVENTORY.filter(i => i.count > 0).length}/10</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {MOCK_INVENTORY.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-2">
            <div className="w-20 h-24 bg-[#FDFCF8] border border-[#E6E2D0] rounded-lg flex items-center justify-center relative shadow-sm">
              {item.count > 1 && (
                <span className="absolute -top-2 -right-2 bg-[#2C2C2C] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  ×{item.count}
                </span>
              )}
              <Scroll size={32} className="text-[#D4CEB0]" />
            </div>
            <span className="text-sm font-medium text-[#4A4A4A]">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Achievement Entry Card */}
      {onAchievements && (
        <div className="mt-6">
          <button
            onClick={onAchievements}
            className="w-full bg-gradient-to-r from-[#9C7D3C]/20 to-[#FFD700]/10 border border-[#9C7D3C]/30 rounded-2xl p-4 flex items-center justify-between hover:from-[#9C7D3C]/30 hover:to-[#FFD700]/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9C7D3C] to-[#6B5421] flex items-center justify-center">
                <Trophy size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-[#1A1A1A]">我的成就</h3>
                <p className="text-sm text-[#3A3A3A]">
                  {achievementStats ? `已解锁 ${achievementStats.unlocked}/${achievementStats.total}` : '查看修炼成就'}
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-[#9C7D3C]" />
          </button>
        </div>
      )}

      {/* Import Modal */}
      <ImportDataModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
    </div>
  );
};
