import { CultivationStage, InventoryItem } from './types';

export const COLORS = {
  bg: '#F2F0E6',
  ink: '#2C2C2C',
  inkLight: '#4A4A4A',
  gold: '#BFA15F',
  goldDark: '#8B5E3C',
  accentBlue: '#6B8EAD',
  accentRed: '#C96C6C',
  paper: '#FDFCF8'
};

export const LEVEL_DATA = {
  [CultivationStage.QiRefining]: Array.from({ length: 13 }, (_, i) => ({
    layer: i + 1,
    maxExp: 200 + i * 300 + (i * i * 100), // Exponential growth
  })),
  [CultivationStage.Foundation]: [{ layer: 1, maxExp: 20000 }, { layer: 2, maxExp: 40000 }, { layer: 3, maxExp: 80000 }],
  // ... simplified for demo
};

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: '聚灵符', count: 2, description: '提升灵气转化效率', effect: 'efficiency +20%' },
  { id: '2', name: '清心丹', count: 5, description: '稳定道心，降低压力', effect: 'stress -10' },
  { id: '3', name: '筑基丹', count: 0, description: '突破筑基期必备神物', effect: 'breakthrough' },
];

// Mock historical data for charts
export const STRESS_DATA = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: Math.floor(Math.random() * 40) + 20 + (i > 8 && i < 18 ? 20 : 0), // Higher stress during work hours
  type: 'stress'
}));

export const HRV_DATA = Array.from({ length: 12 }, (_, i) => ({
  time: `${i * 2}:00`,
  value: Math.floor(Math.random() * 50) + 20,
  type: 'hrv'
}));
