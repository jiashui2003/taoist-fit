import React from 'react';
import { MOCK_INVENTORY } from '../constants';
import { Scroll, Zap, Moon, Sparkles } from 'lucide-react';
import { HealthMetrics, ActivityEntry } from '../types';
import { ActivityTimeline } from './ActivityTimeline';

interface BagViewProps {
  metrics: HealthMetrics;
  activityLog: ActivityEntry[];
  lingQiBalance: number;
}

export const BagView: React.FC<BagViewProps> = ({ metrics, activityLog, lingQiBalance }) => {
  // Calculate total from activity log
  const totalCalories = activityLog.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const totalLingQi = activityLog.reduce((sum, a) => sum + a.lingQiGained, 0);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 pt-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-serif">灵物秘宝</h2>
        <div className="flex items-center gap-2 bg-[#BFA15F]/10 px-3 py-1.5 rounded-full">
          <Sparkles size={14} className="text-[#BFA15F]" />
          <span className="font-mono font-bold text-[#BFA15F]">{lingQiBalance}</span>
          <span className="text-[10px] text-[#BFA15F]/70">灵气</span>
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
    </div>
  );
};
