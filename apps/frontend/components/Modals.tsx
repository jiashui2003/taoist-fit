import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wind, Zap, Brain, Activity } from 'lucide-react';
import { COLORS } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, icon }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2C2C2C] z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div className="bg-[#FDFCF8] w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-[#D4CEB0] pointer-events-auto">
              <div className="p-6 relative">
                <div className="flex flex-col items-center mb-6">
                  {icon && <div className="text-[#BFA15F] mb-3 scale-125">{icon}</div>}
                  <h3 className="text-xl font-bold text-[#4A4A4A] font-serif tracking-widest">{title}</h3>
                </div>

                <div className="space-y-4">
                  {children}
                </div>

                <button
                  onClick={onClose}
                  className="mt-8 w-full py-3 rounded-xl border border-[#D4CEB0] text-[#4A4A4A] hover:bg-[#F2F0E6] transition-colors font-medium"
                >
                  关闭
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const LingQiModal = ({ isOpen, onClose, calories }: { isOpen: boolean; onClose: () => void; calories: number }) => (
  <BaseModal isOpen={isOpen} onClose={onClose} title="丹田 · 灵气" icon={<Wind size={32} />}>
    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
      <span className="text-gray-500">状态</span>
      <span className="text-[#BFA15F] font-bold">灵气充盈</span>
    </div>
    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
      <span className="text-gray-500">总活动能量</span>
      <span className="font-mono font-bold">{calories} kcal</span>
    </div>
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-500">今日转化</span>
      <span className="font-mono font-bold">{calories} 灵气</span>
    </div>
    <p className="text-xs text-gray-400 mt-4 leading-relaxed text-justify">
      气海丹田，性命之本。今日通过运动消耗的能量已转化为修行根基，灵气随之增长。量化模型显示转化效率稳定。
    </p>
  </BaseModal>
);

export const DaoXinModal = ({ isOpen, onClose, hrv }: { isOpen: boolean; onClose: () => void; hrv: number }) => (
  <BaseModal isOpen={isOpen} onClose={onClose} title="膻中 · 道心" icon={<Activity size={32} />}>
    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
      <span className="text-gray-500">状态</span>
      <span className={`font-bold ${hrv < 30 ? 'text-[#C96C6C]' : 'text-[#6B8EAD]'}`}>
        {hrv < 30 ? '心浮气躁' : '道心稳固'}
      </span>
    </div>
    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
      <span className="text-gray-500">压力指数</span>
      <span className="font-mono font-bold">检测中...</span>
    </div>
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-500">HRV 数值</span>
      <span className="font-mono font-bold">{hrv} ms</span>
    </div>
    <p className="text-xs text-gray-400 mt-4 leading-relaxed text-justify">
      膻中穴为气之海，心包之募。道心稳固则万魔不侵。HRV指标作为道心模型的核心参数，当前数值显示{hrv < 30 ? '波动较大，需及时调息' : '状态良好，适宜突破'}。
    </p>
  </BaseModal>
);

export const ShenShiModal = ({ isOpen, onClose, sleep }: { isOpen: boolean; onClose: () => void; sleep: number }) => (
  <BaseModal isOpen={isOpen} onClose={onClose} title="百会 · 神识" icon={<Brain size={32} />}>
    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
      <span className="text-gray-500">状态</span>
      <span className="text-[#9B6B9E] font-bold">神识饱满</span>
    </div>
    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
      <span className="text-gray-500">睡眠评分</span>
      <span className="font-mono font-bold">85 分</span>
    </div>
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-500">睡眠时长</span>
      <span className="font-mono font-bold">{Math.floor(sleep)}小时 {Math.round((sleep % 1) * 60)}分钟</span>
    </div>
    <p className="text-xs text-gray-400 mt-4 leading-relaxed text-justify">
      百会穴通达阴阳，神识之主宰。夜卧安稳则神识清明，睡眠充足可提升神识境界，增加修炼倍率。
    </p>
  </BaseModal>
);

export const MasterAdviceModal = ({ isOpen, onClose, advice, loading, onRetry }: { isOpen: boolean; onClose: () => void; advice: string; loading: boolean; onRetry: () => void }) => (
  <BaseModal isOpen={isOpen} onClose={onClose} title="师尊 · 指点" icon={<Zap size={32} />}>
    <div className="min-h-[100px] flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#BFA15F] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">师尊正在推演天机...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-base text-[#4A4A4A] leading-relaxed text-justify font-serif italic border-l-4 border-[#BFA15F] pl-4 py-2 bg-[#F9F8F4]">
            {advice || "暂无指点，请稍后再试。"}
          </p>
          {/* Show retry if it looks like a fallback or error */}
          <div className="flex justify-center mt-2">
            <button onClick={onRetry} className="text-xs text-[#BFA15F] hover:underline flex items-center gap-1">
              <Zap size={12} /> 重新推演
            </button>
          </div>
        </div>
      )}
    </div>
    <div className="mt-4 flex justify-end">
      <span className="text-xs text-gray-400">来自 Google Gemini 模型推演</span>
    </div>
  </BaseModal>
);

