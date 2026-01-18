import React, { useState, useEffect } from 'react';
import { Home, BarChart2, ScrollText, User } from 'lucide-react';
import { CultivationView } from './components/CultivationView';
import { DataAnalysisView } from './components/DataAnalysisView';
import { BagView } from './components/BagView';
import { HealthMetrics, CultivationStage, CultivationLevel } from './types';
import { LEVEL_DATA } from './constants';
import { PredictionModel } from './services/PredictionModel';


const App = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'analysis' | 'bag' | 'profile'>('home');

  // Simulation of User State
  const [metrics, setMetrics] = useState<HealthMetrics>({
    calories: 1600,
    hrv: 24,
    stress: 71,
    sleepHours: 7.6,
    heartRate: 87,
    oxygen: 96,
    temp: 36.7
  });

  const [level, setLevel] = useState<CultivationLevel>({
    stage: CultivationStage.QiRefining,
    layer: 5,
    currentExp: 1600,
    maxExp: 2300,
    title: '初入道途'
  });

  // Simple simulation effect to update energy slightly over time
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newCalories = prev.calories + Math.floor(Math.random() * 2);
        // Track for ML Prediction
        PredictionModel.track(newCalories);
        return {
          ...prev,
          calories: newCalories,
          heartRate: 85 + Math.floor(Math.random() * 5)
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate prediction every render
  const predictedMinutes = PredictionModel.predictTimeToBreakthrough(level);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <CultivationView metrics={metrics} level={level} predictedMinutes={predictedMinutes} />;

      case 'analysis':
        return <DataAnalysisView />;
      case 'bag':
        return <BagView metrics={metrics} />;
      default:
        return <CultivationView metrics={metrics} level={level} predictedMinutes={predictedMinutes} />;
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-[#F2F0E6] relative shadow-2xl overflow-hidden flex flex-col">

      {/* Dynamic Background Texture (Paper Grain) */}
      <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-multiply z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <main className="flex-1 relative z-10 overflow-hidden">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-[#FDFCF8]/90 backdrop-blur-md border-t border-[#D4CEB0] pb-6 pt-3 px-6 z-20">
        <div className="flex justify-between items-center">
          <NavButton
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
            icon={<Home size={24} />}
            label="修炼"
          />
          <NavButton
            active={activeTab === 'analysis'}
            onClick={() => setActiveTab('analysis')}
            icon={<BarChart2 size={24} />}
            label="顿悟"
          />
          {/* Floating Action Button Placeholder - or decorative center */}
          <div className="w-12"></div>

          <NavButton
            active={activeTab === 'bag'}
            onClick={() => setActiveTab('bag')}
            icon={<ScrollText size={24} />}
            label="百宝"
          />
          <NavButton
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            icon={<User size={24} />}
            label="道友"
          />
        </div>

        {/* Center Decorative Button (e.g., Quick Meditate or Menu) */}
        <div className="absolute left-1/2 -top-6 transform -translate-x-1/2">
          <button className="w-14 h-14 bg-[#2C2C2C] rounded-full flex items-center justify-center shadow-lg border-4 border-[#F2F0E6]">
            <div className="w-2 h-2 bg-[#BFA15F] rounded-full"></div>
          </button>
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors duration-300 ${active ? 'text-[#2C2C2C]' : 'text-gray-400'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
