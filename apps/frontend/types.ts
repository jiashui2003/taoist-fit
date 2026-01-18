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
