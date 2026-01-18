export enum CultivationStage {
  QiRefining = '炼气期',
  Foundation = '筑基期',
  GoldenCore = '金丹期',
  NascentSoul = '元婴期',
}

export interface CultivationLevel {
  stage: CultivationStage;
  layer: number;
  currentExp: number;
  maxExp: number;
  title: string;
}

export interface HealthMetrics {
  calories: number; // 灵气 (Energy)
  hrv: number;      // 道心 (Dao Xin) - ms
  stress: number;   // 压力 (Pressure) - 0-100
  sleepHours: number; // 神识 (Shen Shi) - hours
  heartRate: number; // 心率 - bpm
  oxygen: number;   // 血氧
  temp: number;     // 体温
}

export interface DailyRecord {
  time: string;
  value: number;
  type: 'stress' | 'hrv';
}

export interface InventoryItem {
  id: string;
  name: string;
  count: number;
  description: string;
  effect: string;
}

// Activity log entry with timestamp
export interface ActivityEntry {
  id: string;
  timestamp: string; // e.g., "08:48"
  description: string; // e.g., "Walked 500 steps"
  caloriesBurned: number; // Raw kcal
  lingQiGained: number; // After efficiency conversion
  type: 'walk' | 'run' | 'meditation' | 'exercise';
}

// Shop item for the marketplace
export interface ShopItem {
  id: string;
  name: string; // 宝典名 or 秘籍名
  category: 'baodian' | 'miji'; // Manual or Secret Technique
  price: number; // LingQi cost
  description: string;
  content: string; // The actual tip/wisdom revealed upon purchase
  owned: boolean;
}

// ==================== Social/Mentorship System ====================

export interface CultivatorUser {
  id: string;
  name: string;
  avatar: string; // Emoji avatar
  stage: CultivationStage;
  layer: number;
  title: string; // e.g., "散修", "内门弟子"
  isMentor: boolean;
  specialty: string; // e.g., "呼吸法", "力量训练"
  advice?: string; // Mentor's advice when consulted
}

export interface MentorshipStatus {
  hasMentor: boolean;
  mentorId?: string;
  requestPending: boolean;
}

// ==================== Extended Health Metrics ====================

export interface ExtendedHealthMetrics {
  // Core metrics (from HealthMetrics)
  calories: number;     // 灵气 (Energy)
  hrv: number;          // 道心 (Dao Xin) - ms
  stress: number;       // 压力 (Pressure) - 0-100
  sleepHours: number;   // 神识 (Shen Shi) - hours
  heartRate: number;    // 心率 - bpm
  oxygen: number;       // 血氧
  temp: number;         // 体温
  // Extended metrics
  steps: number;            // 步数
  vo2Max: number;           // 最大摄氧量
  restingHeartRate: number; // 静息心率
  respiratoryRate: number;  // 呼吸频率
  bodyBattery: number;      // 身体电量 (0-100)
}

export type MetricKey = keyof ExtendedHealthMetrics;

export interface MetricConfig {
  key: MetricKey;
  label: string;
  unit: string;
  cultivationName: string; // e.g., "灵气" for calories
  enabled: boolean;
  element: '金' | '木' | '水' | '火' | '土'; // Five elements mapping
}

// Five Elements balance insight from ML coupling
export interface FiveElementsInsight {
  score: number; // 0-100
  dominant: '金' | '木' | '水' | '火' | '土';
  weak: '金' | '木' | '水' | '火' | '土';
  balance: {
    金: number; // 0-100
    木: number;
    水: number;
    火: number;
    土: number;
  };
  advice: string;
}

// ==================== Metric History (Phase 2) ====================

export interface MetricHistory {
  id: string;              // `${timestamp}_${metricKey}`
  metricKey: MetricKey;
  value: number;
  timestamp: number;       // Unix timestamp (ms)
  date: string;            // ISO date (YYYY-MM-DD)
  source: 'manual' | 'sensor' | 'simulated';
}

export interface MetricStatistics {
  metricKey: MetricKey;
  count: number;
  max: number;
  min: number;
  mean: number;
  median: number;
  stdDev: number;
  variance: number;
  latest: number;
  period: string; // e.g., "7 days", "30 days"
}

// ==================== Phase 4: ML Insights Types ====================

export type InsightType = 'trend' | 'anomaly' | 'recommendation' | 'prediction';
export type InsightSeverity = 'info' | 'warning' | 'danger' | 'success';
export type TrendDirection = 'rising' | 'falling' | 'stable';
export type AnomalySeverity = 'mild' | 'moderate' | 'severe';
export type RecommendationPriority = 'high' | 'medium' | 'low';
export type RecommendationCategory = 'exercise' | 'rest' | 'nutrition' | 'meditation';

export interface TrendAnalysis {
  direction: TrendDirection;
  slope: number; // Rate of change per day
  confidence: number; // 0-1 score (R² value)
  prediction: number; // Next expected value
  description: string; // Cultivation-themed description
  changeRate: string; // e.g., "+2.3 bpm/天"
}

export interface AnomalyAlert {
  detected: boolean;
  severity: AnomalySeverity | null;
  metric: MetricKey;
  currentValue: number;
  expectedRange: [number, number];
  description: string;
  recommendation: string;
  zScore?: number; // Standard deviations from mean
}

export interface HealthRecommendation {
  id: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  category: RecommendationCategory;
  icon: string;
  relatedMetrics: MetricKey[];
  action?: string;
}

export interface PredictiveInsight {
  metricKey: MetricKey;
  currentValue: number;
  predictedValue: number;
  predictionDays: number; // Days into future
  confidence: number; // 0-1
  description: string;
}

export interface MetricInsight {
  type: InsightType;
  title: string;
  content: string;
  severity: InsightSeverity;
  icon: string;
  timestamp: number;
  data?: TrendAnalysis | AnomalyAlert | HealthRecommendation | PredictiveInsight;
}

// ==================== Phase 5: Achievement System ====================

export type AchievementCategory =
  | 'diligence'    // 修炼勤勉
  | 'heart'        // 心脉稳定
  | 'stress'       // 压力克制
  | 'energy'       // 灵气充沛
  | 'balance'      // 五行平衡
  | 'breakthrough'; // 境界突破

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'special';

export interface Achievement {
  id: string;
  name: string;           // 修仙风格名称
  description: string;    // 获取条件描述
  category: AchievementCategory;
  tier: AchievementTier;
  icon: string;           // Emoji图标
  unlocked: boolean;
  unlockedAt?: number;    // 解锁时间戳
  progress: number;       // 0-100 进度
  requirement: number;    // 需要的天数/分数
  currentValue: number;   // 当前值
}

export interface AchievementStats {
  total: number;
  unlocked: number;
  byCategory: Record<AchievementCategory, { total: number; unlocked: number }>;
  recentUnlocks: Achievement[];
}
