import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Home, BarChart2, ScrollText, Users, ShoppingBag, Trophy } from 'lucide-react';
import { CultivationView } from './components/CultivationView';
import { DataAnalysisView } from './components/DataAnalysisView';
import { BagView } from './components/BagView';
import { ShopView } from './components/ShopView';
import { SocialView } from './components/SocialView';
import { OfflineBanner } from './components/OfflineBanner';
import { MetricDetailView } from './components/MetricDetailView';
import { AchievementView } from './components/AchievementView';
import { ExportView } from './components/ExportView';
import {
  CultivationStage,
  CultivationLevel,
  ActivityEntry,
  ShopItem,
  ExtendedHealthMetrics,
  MetricConfig,
  MentorshipStatus,
  CultivatorUser,
  Achievement,
  AchievementStats
} from './types';
import {
  MOCK_ACTIVITY_LOG,
  MOCK_SHOP_ITEMS,
  MOCK_CULTIVATORS,
  METRIC_CONFIGS,
  DEFAULT_EXTENDED_METRICS
} from './constants';
import { PredictionModel } from './services/PredictionModel';
import { calculateFiveElementsInsight } from './services/HealthInsightService';
import { AchievementService } from './services/AchievementService';
import { db } from './services/DatabaseService';
import { useOnlineStatus } from './hooks/usePersistence';


const App = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'analysis' | 'bag' | 'shop' | 'social' | 'achievements' | 'export'>('home');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Network status
  const isOnline = useOnlineStatus();

  // Extended Health Metrics State
  const [metrics, setMetrics] = useState<ExtendedHealthMetrics>(DEFAULT_EXTENDED_METRICS);

  // Track if we've completed initial load to prevent premature saves
  const initialLoadComplete = React.useRef(false);

  const [level, setLevel] = useState<CultivationLevel>({
    stage: CultivationStage.QiRefining,
    layer: 5,
    currentExp: 1600,
    maxExp: 2300,
    title: '初入道途'
  });

  // Activity log state
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>(MOCK_ACTIVITY_LOG);

  // Shop items state
  const [shopItems, setShopItems] = useState<ShopItem[]>(MOCK_SHOP_ITEMS);

  // LingQi balance (derived from calories with efficiency multiplier)
  const [lingQiBalance, setLingQiBalance] = useState<number>(Math.floor(metrics.calories * 1.04));

  // Metric configs for toggle
  const [metricConfigs, setMetricConfigs] = useState<MetricConfig[]>(METRIC_CONFIGS);

  // Mentorship state
  const [mentorshipStatus, setMentorshipStatus] = useState<MentorshipStatus>({
    hasMentor: false,
    mentorId: undefined,
    requestPending: false,
  });

  // Cultivators list
  const [cultivators] = useState<CultivatorUser[]>(MOCK_CULTIVATORS);

  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>(
    AchievementService.initializeAchievements()
  );
  const [consecutiveDays, setConsecutiveDays] = useState(1);

  // Calculate achievement statistics
  const achievementStats: AchievementStats = useMemo(
    () => AchievementService.getStats(achievements),
    [achievements]
  );

  // Calculate Five Elements insight using only enabled metrics
  const enabledConfigs = metricConfigs.filter((c) => c.enabled);
  const fiveElementsInsight = useMemo(() => calculateFiveElementsInsight(metrics, enabledConfigs), [metrics, enabledConfigs]);

  // ==================== IndexedDB Initialization ====================

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('🔄 初始化数据库...');
        await db.init();
        await loadPersistedData();
        initialLoadComplete.current = true; // Mark initial load as complete
        setIsLoading(false);
        console.log('✅ 数据加载完成');
      } catch (error) {
        console.error('❌ 数据库初始化失败:', error);
        setIsLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  const loadPersistedData = async () => {
    try {
      // 加载今日健康数据
      const today = new Date().toISOString().split('T')[0];
      const savedMetrics = await db.getHealthMetrics(today);
      if (savedMetrics) {
        setMetrics(savedMetrics);
        console.log('📊 加载健康数据:', savedMetrics);
      }

      // 加载境界等级
      const savedLevel = await db.getCultivationLevel();
      if (savedLevel) {
        setLevel(savedLevel);
        console.log('🎯 加载境界等级:', savedLevel);
      }

      // 加载商城物品
      const savedShopItems = await db.getAllShopItems();
      if (savedShopItems.length > 0) {
        setShopItems(savedShopItems);
        console.log(`🛒 加载商城物品: ${savedShopItems.length} 个`);
      } else {
        // 首次使用，保存默认数据
        await db.saveShopItems(MOCK_SHOP_ITEMS);
      }

      // 加载活动日志
      const savedActivities = await db.getRecentActivities(20);
      if (savedActivities.length > 0) {
        setActivityLog(savedActivities);
        console.log(`📝 加载活动日志: ${savedActivities.length} 条`);
      }

      // 加载拜师状态
      const savedMentorship = await db.getMentorshipStatus();
      if (savedMentorship) {
        setMentorshipStatus(savedMentorship);
        console.log('👥 加载拜师状态:', savedMentorship);
      }

      // 加载指标配置
      const savedConfigs = await db.getMetricConfigs();
      if (savedConfigs.length > 0) {
        setMetricConfigs(savedConfigs);
        console.log(`⚙️ 加载指标配置: ${savedConfigs.length} 个`);
      } else {
        // 首次使用，保存默认配置
        await db.saveMetricConfigs(METRIC_CONFIGS);
      }
    } catch (error) {
      console.error('❌ 加载数据失败:', error);
    }
  };

  // ==================== Auto-Save Effects ====================

  // 保存今日健康数据（使用防抖）
  useEffect(() => {
    if (isLoading) return;

    const timeoutId = setTimeout(async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        await db.saveHealthMetrics(today, metrics);
        console.log('💾 自动保存健康数据');
      } catch (error) {
        console.error('❌ 保存健康数据失败:', error);
      }
    }, 2000); // 2秒防抖

    return () => clearTimeout(timeoutId);
  }, [metrics, isLoading]);

  // 保存境界等级
  useEffect(() => {
    if (isLoading) return;

    const timeoutId = setTimeout(async () => {
      try {
        await db.saveCultivationLevel(level);
        console.log('💾 自动保存境界等级');
      } catch (error) {
        console.error('❌ 保存境界等级失败:', error);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [level, isLoading]);

  // 保存商城物品
  useEffect(() => {
    if (isLoading) return;

    const timeoutId = setTimeout(async () => {
      try {
        await db.saveShopItems(shopItems);
        console.log('💾 自动保存商城物品');
      } catch (error) {
        console.error('❌ 保存商城物品失败:', error);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [shopItems, isLoading]);

  // 保存拜师状态
  useEffect(() => {
    if (isLoading) return;

    const timeoutId = setTimeout(async () => {
      try {
        await db.saveMentorshipStatus(mentorshipStatus);
        console.log('💾 自动保存拜师状态');
      } catch (error) {
        console.error('❌ 保存拜师状态失败:', error);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [mentorshipStatus, isLoading]);

  // 保存指标配置
  useEffect(() => {
    if (isLoading) return;

    const timeoutId = setTimeout(async () => {
      try {
        await db.saveMetricConfigs(metricConfigs);
        console.log('💾 自动保存指标配置');
      } catch (error) {
        console.error('❌ 保存指标配置失败:', error);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [metricConfigs, isLoading]);

  // NEW: Phase 2 - 自动保存指标历史 (用于详情页图表)
  useEffect(() => {
    // Only save metric history after initial load is complete
    if (isLoading || !initialLoadComplete.current) return;

    const timeoutId = setTimeout(async () => {
      try {
        // 为每个启用的指标保存历史记录
        const enabledKeys = metricConfigs.filter(c => c.enabled).map(c => c.key);
        if (enabledKeys.length === 0) return;

        for (const key of enabledKeys) {
          const value = metrics[key];
          if (typeof value === 'number' && !isNaN(value)) {
            await db.saveMetricHistory(key, value, 'simulated');
          }
        }
        console.log(`📈 自动保存 ${enabledKeys.length} 个指标历史`);
      } catch (error) {
        console.error('❌ 保存指标历史失败:', error);
      }
    }, 5000); // 5秒防抖,避免频繁写入

    return () => clearTimeout(timeoutId);
  }, [metrics, metricConfigs, isLoading]);

  // ==================== Simulation & Business Logic ====================

  // Simple simulation effect to update energy slightly over time
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newCalories = prev.calories + Math.floor(Math.random() * 2);
        const newSteps = prev.steps + Math.floor(Math.random() * 10);
        // Track for ML Prediction
        PredictionModel.track(newCalories);
        return {
          ...prev,
          calories: newCalories,
          steps: newSteps,
          heartRate: 85 + Math.floor(Math.random() * 5),
          bodyBattery: Math.max(0, Math.min(100, prev.bodyBattery + (Math.random() > 0.5 ? 1 : -1))),
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Update LingQi balance when calories change
  useEffect(() => {
    setLingQiBalance(Math.floor(metrics.calories * 1.04));
  }, [metrics.calories]);

  // Handle shop purchase
  const handlePurchase = useCallback((itemId: string) => {
    const item = shopItems.find((i) => i.id === itemId);
    if (item && !item.owned && lingQiBalance >= item.price) {
      setLingQiBalance((prev) => prev - item.price);
      setShopItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, owned: true } : i))
      );
    }
  }, [shopItems, lingQiBalance]);

  // Handle metric toggle
  const handleToggleMetric = useCallback((key: string) => {
    setMetricConfigs((prev) =>
      prev.map((c) => (c.key === key ? { ...c, enabled: !c.enabled } : c))
    );
  }, []);

  // Handle mentor request
  const handleRequestMentor = useCallback((mentorId: string) => {
    setMentorshipStatus({
      hasMentor: true,
      mentorId,
      requestPending: false,
    });
  }, []);

  // Handle achievement refresh - recalculate all achievements from historical data
  const refreshAchievements = useCallback(async (): Promise<Achievement[]> => {
    console.log('🔄 刷新成就...');
    try {
      // 获取最近30天的指标历史
      const heartHistory = await db.getRecentMetricHistory('heartRate', 30);
      const stressHistory = await db.getRecentMetricHistory('stress', 30);
      const energyHistory = await db.getRecentMetricHistory('bodyBattery', 30);

      // 计算连续天数 (从历史数据推断)
      const uniqueDays = new Set(heartHistory.map(h =>
        new Date(h.timestamp).toISOString().split('T')[0]
      ));
      const calculatedDays = uniqueDays.size;

      // 检测所有成就
      const result = AchievementService.checkAllAchievements(
        achievements,
        calculatedDays,
        heartHistory,
        stressHistory,
        energyHistory,
        fiveElementsInsight.score,
        level
      );

      // 更新状态
      setAchievements(result.achievements);
      setConsecutiveDays(calculatedDays);

      console.log(`✅ 成就刷新完成: ${result.newUnlocks.length} 个新解锁`);

      return result.achievements;
    } catch (error) {
      console.error('❌ 刷新成就失败:', error);
      return achievements;
    }
  }, [achievements, level, fiveElementsInsight.score]);

  // Calculate prediction every render
  const predictedMinutes = PredictionModel.predictTimeToBreakthrough(level);

  // NEW: If a metric is selected, show detail view instead
  if (selectedMetric) {
    return (
      <MetricDetailView
        metricKey={selectedMetric}
        metrics={metrics}
        metricConfigs={metricConfigs}
        onBack={() => setSelectedMetric(null)}
      />
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#BFA15F] border-t-transparent mb-4"></div>
            <p className="text-[#4A4A4A] font-serif">初始化修炼环境...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <CultivationView metrics={metrics} level={level} predictedMinutes={predictedMinutes} />;
      case 'analysis':
        return (
          <DataAnalysisView
            metrics={metrics}
            insight={fiveElementsInsight}
            metricConfigs={metricConfigs}
            onToggleMetric={handleToggleMetric}
            onMetricClick={setSelectedMetric} // NEW: Enable navigation to detail view
          />
        );
      case 'bag':
        return (
          <BagView
            metrics={metrics}
            activityLog={activityLog}
            lingQiBalance={lingQiBalance}
            onExport={() => setActiveTab('export')}
          />
        );
      case 'shop':
        return <ShopView items={shopItems} lingQiBalance={lingQiBalance} onPurchase={handlePurchase} />;
      case 'social':
        return (
          <SocialView
            cultivators={cultivators}
            currentLevel={level}
            mentorshipStatus={mentorshipStatus}
            onRequestMentor={handleRequestMentor}
          />
        );
      case 'achievements':
        return (
          <AchievementView
            achievements={achievements}
            stats={achievementStats}
            onBack={() => setActiveTab('home')}
            onRefresh={refreshAchievements}
          />
        );
      case 'export':
        return (
          <ExportView
            metrics={metrics}
            level={level}
            fiveElements={fiveElementsInsight}
            achievements={achievements}
            onBack={() => setActiveTab('bag')}
          />
        );
      default:
        return <CultivationView metrics={metrics} level={level} predictedMinutes={predictedMinutes} />;
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-[#F2F0E6] relative shadow-2xl overflow-hidden flex flex-col">

      {/* Offline Banner */}
      <OfflineBanner isOnline={isOnline} />

      {/* Dynamic Background Texture (Paper Grain) */}
      <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-multiply z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <main className="flex-1 relative z-10 overflow-hidden">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-[#FDFCF8]/90 backdrop-blur-md border-t border-[#D4CEB0] pb-6 pt-3 px-4 z-20" role="navigation" aria-label="主要导航">
        <div className="flex justify-between items-center" role="tablist">
          <NavButton
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
            icon={<Home size={20} />}
            label="修炼"
          />
          <NavButton
            active={activeTab === 'analysis'}
            onClick={() => setActiveTab('analysis')}
            icon={<BarChart2 size={20} />}
            label="顿悟"
          />
          {/* Center Decorative Button */}
          <div className="w-10"></div>

          <NavButton
            active={activeTab === 'bag'}
            onClick={() => setActiveTab('bag')}
            icon={<ScrollText size={20} />}
            label="百宝"
          />
          <NavButton
            active={activeTab === 'achievements'}
            onClick={() => setActiveTab('achievements')}
            icon={<Trophy size={20} />}
            label="成就"
          />
        </div>

        {/* Center Decorative Button - Opens Shop */}
        <div className="absolute left-1/2 -top-6 transform -translate-x-1/2">
          <button
            onClick={() => setActiveTab('shop')}
            aria-label="商店洞府"
            aria-pressed={activeTab === 'shop'}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-[#F2F0E6] transition-colors ${activeTab === 'shop' ? 'bg-[#BFA15F]' : 'bg-[#2C2C2C]'
              }`}
          >
            <ShoppingBag size={20} className="text-white" />
          </button>
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    aria-label={label}
    aria-current={active ? 'page' : undefined}
    role="tab"
    aria-selected={active}
    className={`flex flex-col items-center gap-1 transition-colors duration-300 ${active ? 'text-[#2C2C2C]' : 'text-gray-400'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
