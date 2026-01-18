import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Brain, Wind, Activity } from 'lucide-react';
import { MeditatorIcon } from './Icons';
import { StatCard } from './StatCard';
import { HealthMetrics, CultivationLevel } from '../types';
import { LingQiModal, DaoXinModal, ShenShiModal, MasterAdviceModal } from './Modals';
import { AICoachService } from '../services/AICoachService';


interface CultivationViewProps {
  metrics: HealthMetrics;
  level: CultivationLevel;
  predictedMinutes?: number;
}

export const CultivationView: React.FC<CultivationViewProps> = ({ metrics, level, predictedMinutes }) => {
  const [modalOpen, setModalOpen] = useState<'lingqi' | 'daoxin' | 'shenshi' | 'advice' | null>(null);
  const [isMeditating, setIsMeditating] = useState(false);
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const handleSeekAdvice = async () => {
    setModalOpen('advice');
    if (!advice) { // Only fetch if empty to save API calls, or force refresh if needed
      setLoadingAdvice(true);
      const result = await AICoachService.getMasterAdvice(metrics);
      setAdvice(result);
      setLoadingAdvice(false);
    }
  };

  // Status text based on HRV
  const mentalState = metrics.hrv < 30 ? '心浮气躁' : '道心稳固';
  const mentalColor = metrics.hrv < 30 ? 'text-[#C96C6C] border-[#C96C6C]' : 'text-[#6B8EAD] border-[#6B8EAD]';

  return (
    <div className="flex flex-col h-full relative overflow-y-auto pb-24">

      {/* Header Level Info */}
      <div className="pt-12 pb-4 text-center z-10">
        <h1 className="text-3xl font-bold text-[#2C2C2C] font-serif tracking-wider mb-2">
          {level.stage}
        </h1>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">第 {level.layer} 层</span>
          <span className={`text-xs px-2 py-0.5 border rounded opacity-80 ${mentalColor}`}>
            {mentalState}
          </span>
          {/* Prediction Display */}
          {predictedMinutes !== undefined && predictedMinutes > 0 && (
            <span className="text-[10px] text-[#BFA15F] mt-1 bg-[#BFA15F]/10 px-2 py-0.5 rounded-full">
              预计突破: {predictedMinutes} 分钟后
            </span>
          )}
        </div>
      </div>


      {/* Main Visual - Cultivation Circle */}
      <div className="flex-1 flex items-center justify-center relative my-4 min-h-[350px]">
        {/* Animated Rings */}
        <div className="relative w-72 h-72">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-[1px] border-[#D4CEB0] rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border-[1px] border-[#D4CEB0] opacity-60 rounded-full border-dashed"
          />

          {/* Progress Arc (Simulated) */}
          <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
            <circle
              cx="144" cy="144" r="140"
              stroke="#E6E2D0"
              strokeWidth="2"
              fill="none"
            />
            <motion.circle
              initial={{ strokeDasharray: "0 1000" }}
              animate={{ strokeDasharray: `${(level.currentExp / level.maxExp) * 880} 1000` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="144" cy="144" r="140"
              stroke="#4A4A4A"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="opacity-80"
            />
          </svg>

          {/* Meditator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={isMeditating ? { y: [0, -5, 0], opacity: [0.8, 1, 0.8] } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <MeditatorIcon className="w-48 h-48 text-[#2C2C2C]" />
            </motion.div>
          </div>

          {/* Particles/Qi if meditating */}
          {isMeditating && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.5, 0], scale: 1.2 }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-full h-full bg-[#BFA15F] rounded-full blur-2xl opacity-20"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
            <button
              onClick={() => setIsMeditating(!isMeditating)}
              className={`
                  px-8 py-2 rounded-full text-[#FDFCF8] font-medium shadow-lg transition-all duration-300
                  ${isMeditating ? 'bg-[#BFA15F] ring-4 ring-[#BFA15F]/20' : 'bg-[#2C2C2C]'}
                `}
            >
              {isMeditating ? '入定中...' : '入定'}
            </button>
          </div>
        </div>
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={handleSeekAdvice}
            className="bg-[#FDFCF8] border border-[#D4CEB0] text-[#2C2C2C] p-2 rounded-full shadow-md hover:bg-[#F2F0E6] transition-colors"
          >
            <Brain size={20} className="text-[#BFA15F]" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}

      <div className="px-6 grid grid-cols-2 gap-4 mb-8">
        <StatCard
          label="道心 (HRV)"
          value={metrics.hrv}
          unit="ms"
          icon={<Activity size={14} />}
          onClick={() => setModalOpen('daoxin')}
        />
        <StatCard
          label="心率 (HR)"
          value={metrics.heartRate}
          unit="bpm"
        />
        <StatCard
          label="丹田 (灵气)"
          value={`${(metrics.calories / 1000).toFixed(1)}k`}
          subValue={`/${(level.maxExp / 1000).toFixed(1)}k 目标`}
          icon={<Play size={14} className="rotate-[-90deg]" />}
          onClick={() => setModalOpen('lingqi')}
        />
        <StatCard
          label="神识 (睡眠)"
          value={metrics.sleepHours}
          unit="小时"
          onClick={() => setModalOpen('shenshi')}
        />
      </div>

      {/* Modals */}
      <LingQiModal
        isOpen={modalOpen === 'lingqi'}
        onClose={() => setModalOpen(null)}
        calories={metrics.calories}
      />
      <DaoXinModal
        isOpen={modalOpen === 'daoxin'}
        onClose={() => setModalOpen(null)}
        hrv={metrics.hrv}
      />
      <ShenShiModal
        isOpen={modalOpen === 'shenshi'}
        onClose={() => setModalOpen(null)}
        sleep={metrics.sleepHours}
      />
      <MasterAdviceModal
        isOpen={modalOpen === 'advice'}
        onClose={() => setModalOpen(null)}
        advice={advice}
        loading={loadingAdvice}
        onRetry={() => { setAdvice(''); handleSeekAdvice(); }}
      />
    </div >
  );
};

