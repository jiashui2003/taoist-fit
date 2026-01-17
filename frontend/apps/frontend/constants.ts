import { CultivationStage, InventoryItem, ActivityEntry, ShopItem, CultivatorUser, MetricConfig } from './types';

export const COLORS = {
  bg: '#F2F0E6',
  ink: '#1A1A1A', // Darkened from #2C2C2C for better contrast
  inkLight: '#3A3A3A', // Darkened from #4A4A4A for better contrast
  gold: '#9C7D3C', // Darkened from #BFA15F for WCAG AA compliance (4.5:1 ratio)
  goldDark: '#6B4E23', // Darkened from #8B5E3C for even better contrast
  accentBlue: '#4A6B88', // Darkened from #6B8EAD for better contrast
  accentRed: '#A84848', // Darkened from #C96C6C for better contrast
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

// Mock activity log with timestamps
export const MOCK_ACTIVITY_LOG: ActivityEntry[] = [
  { id: '1', timestamp: '06:30', description: '晨起冥想 15分钟', caloriesBurned: 12, lingQiGained: 18, type: 'meditation' },
  { id: '2', timestamp: '07:15', description: '晨跑 2.5km', caloriesBurned: 180, lingQiGained: 187, type: 'run' },
  { id: '3', timestamp: '08:48', description: '步行上班', caloriesBurned: 45, lingQiGained: 47, type: 'walk' },
  { id: '4', timestamp: '12:30', description: '午间散步', caloriesBurned: 30, lingQiGained: 31, type: 'walk' },
  { id: '5', timestamp: '14:00', description: '办公室拉伸', caloriesBurned: 20, lingQiGained: 21, type: 'exercise' },
  { id: '6', timestamp: '18:20', description: '步行回家', caloriesBurned: 50, lingQiGained: 52, type: 'walk' },
  { id: '7', timestamp: '19:30', description: '力量训练 30分钟', caloriesBurned: 200, lingQiGained: 208, type: 'exercise' },
  { id: '8', timestamp: '21:00', description: '睡前打坐', caloriesBurned: 8, lingQiGained: 12, type: 'meditation' },
];

// Shop items - 宝典 (Manuals) and 秘籍 (Secret Techniques)
export const MOCK_SHOP_ITEMS: ShopItem[] = [
  {
    id: 's1',
    name: '五禽戏心得',
    category: 'baodian',
    price: 150,
    description: '华佗古法养生功',
    content: '虎戏：双手如爪，眼神凝聚，呼吸深沉，模拟猛虎扑食之势。鹿戏：颈部缓慢旋转，如鹿回首，活络颈椎。熊戏：双臂下垂摆动，步伐沉稳。猿戏：灵活跳跃，锻炼敏捷。鸟戏：双臂展开如翅，深呼吸吐纳。',
    owned: false
  },
  {
    id: 's2',
    name: '呼吸三要诀',
    category: 'miji',
    price: 80,
    description: '调息入门心法',
    content: '一曰深：吸气时腹部隆起，气沉丹田。二曰细：呼吸绵密如丝，不闻其声。三曰长：一呼一吸，缓慢悠长，心随息定。每日晨起、午休、睡前各练十分钟，三月可见功效。',
    owned: false
  },
  {
    id: 's3',
    name: '大道至简',
    category: 'baodian',
    price: 200,
    description: '修行人生感悟',
    content: '修行如登山，急者先累，缓者先达。不争朝夕之功，但求日积月累。身体是修行的根基，健康是长寿的资本。每日运动，不在多少，贵在坚持。心若安定，气自和顺，气顺则百病不生。',
    owned: false
  },
  {
    id: 's4',
    name: '跑步要义',
    category: 'miji',
    price: 60,
    description: '有氧运动指南',
    content: '跑前热身五分钟，活动关节防受伤。跑时呼吸要均匀，三步一吸三步一呼。速度不必求快，心率保持在最大心率的60-70%为宜。跑后拉伸勿忽略，放松肌肉助恢复。',
    owned: false
  },
  {
    id: 's5',
    name: '静心咒',
    category: 'miji',
    price: 100,
    description: '冥想入门口诀',
    content: '端坐闭目，舌抵上腭。意守丹田，摒除杂念。若有念起，不追不拒，任其自去。心如止水，波澜不惊。初学者每次五分钟即可，渐进增加，切勿强求。',
    owned: false
  },
  {
    id: 's6',
    name: '睡眠养生录',
    category: 'baodian',
    price: 120,
    description: '提升睡眠质量',
    content: '子时（23:00-01:00）乃肝胆造血之时，此时需熟睡。睡前一小时远离手机，室内温度以18-22度为宜。右侧卧有助消化，心脏负担较轻。梦多则眠浅，梦少则眠深，深睡方能真休息。',
    owned: false
  },
];

// ==================== Social System Mock Data ====================

export const MOCK_CULTIVATORS: CultivatorUser[] = [
  {
    id: 'u1',
    name: '清风道人',
    avatar: '🧙',
    stage: CultivationStage.Foundation,
    layer: 2,
    title: '内门长老',
    isMentor: true,
    specialty: '呼吸调息',
    advice: '修行之道，先修心，后修身。每日静坐一刻钟，心无杂念，自然灵气充盈。切记：欲速则不达。'
  },
  {
    id: 'u2',
    name: '铁牛',
    avatar: '💪',
    stage: CultivationStage.QiRefining,
    layer: 9,
    title: '外门弟子',
    isMentor: true,
    specialty: '力量训练',
    advice: '力量训练需循序渐进。先从自重开始，再逐步加重。每组动作保持匀速，感受肌肉发力。休息与训练同样重要。'
  },
  {
    id: 'u3',
    name: '小灵儿',
    avatar: '🧘',
    stage: CultivationStage.QiRefining,
    layer: 7,
    title: '散修',
    isMentor: false,
    specialty: '冥想入定'
  },
  {
    id: 'u4',
    name: '云游客',
    avatar: '🏃',
    stage: CultivationStage.QiRefining,
    layer: 6,
    title: '散修',
    isMentor: false,
    specialty: '有氧跑步'
  },
  {
    id: 'u5',
    name: '玄元子',
    avatar: '📿',
    stage: CultivationStage.GoldenCore,
    layer: 1,
    title: '宗门真传',
    isMentor: true,
    specialty: '全面养生',
    advice: '修行如烹小鲜，急不得，躁不得。饮食有节，起居有常，形劳而不倦，气从以顺，各从其欲，皆得所愿。'
  },
  {
    id: 'u6',
    name: '青竹',
    avatar: '🎋',
    stage: CultivationStage.QiRefining,
    layer: 3,
    title: '新入门',
    isMentor: false,
    specialty: '拉伸柔韧'
  },
];

// ==================== Metrics Configuration ====================

export const METRIC_CONFIGS: MetricConfig[] = [
  { key: 'calories', label: '卡路里消耗', unit: 'kcal', cultivationName: '灵气', enabled: true, element: '火' },
  { key: 'hrv', label: '心率变异性HRV', unit: 'ms', cultivationName: '道心', enabled: true, element: '木' },
  { key: 'stress', label: '压力指数', unit: '', cultivationName: '心魔', enabled: true, element: '火' },
  { key: 'sleepHours', label: '睡眠时长', unit: '小时', cultivationName: '神识', enabled: true, element: '水' },
  { key: 'heartRate', label: '实时心率', unit: 'bpm', cultivationName: '心脉', enabled: true, element: '火' },
  { key: 'oxygen', label: '血氧饱和度', unit: '%', cultivationName: '气血', enabled: true, element: '金' },
  { key: 'temp', label: '体温', unit: '°C', cultivationName: '命火', enabled: false, element: '火' },
  { key: 'steps', label: '步数', unit: '步', cultivationName: '行功', enabled: true, element: '土' },
  { key: 'vo2Max', label: '最大摄氧量VO2 Max', unit: 'ml/kg/min', cultivationName: '纳气', enabled: true, element: '金' },
  { key: 'restingHeartRate', label: '静息心率', unit: 'bpm', cultivationName: '静心', enabled: false, element: '木' },
  { key: 'respiratoryRate', label: '呼吸频率', unit: '次/分', cultivationName: '吐纳', enabled: true, element: '金' },
  { key: 'bodyBattery', label: '身体电量', unit: '%', cultivationName: '精元', enabled: true, element: '土' },
];

// Default extended metrics values
export const DEFAULT_EXTENDED_METRICS = {
  calories: 1600,
  hrv: 24,
  stress: 71,
  sleepHours: 7.6,
  heartRate: 87,
  oxygen: 96,
  temp: 36.7,
  steps: 8500,
  vo2Max: 42,
  restingHeartRate: 62,
  respiratoryRate: 16,
  bodyBattery: 75,
};
