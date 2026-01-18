# 🧘 Taoist Fit (修仙健身)

<div align="center">

![Version](https://img.shields.io/badge/version-1.5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-PWA-orange.svg)

**将现代健身追踪与东方修仙文化巧妙融合的创新健康应用**

*Transform your fitness journey into a cultivation path*

🔗 **[Live Demo](https://jiashui2003.github.io/taoist-fit/)**

</div>

---

## 📖 项目简介

**Taoist Fit** 是一款独特的健身追踪应用，将传统的健康数据（如心率、卡路里、睡眠）重新诠释为修仙世界中的"灵气"、"道心"、"神识"等概念。通过游戏化的方式激励用户坚持健身，让枯燥的健康管理变得有趣。

### ✨ 核心特色

- 🎮 **游戏化设计**: 卡路里转化为"灵气"，压力指数变成"心魔"
- 📊 **五行平衡系统**: 基于机器学习的健康指标耦合模型
- 🔮 **ML智能洞察**: 趋势分析、异常检测、个性化建议
- 🏆 **成就系统**: 18个修仙主题徽章，激励持续运动
- 📈 **指标详情**: 历史数据可视化与深度分析
- 📱 **PWA支持**: 完全离线可用，可安装到手机

---

## 🏗️ 技术栈

| 类别 | 技术 |
|------|------|
| **前端框架** | React 19 + TypeScript |
| **构建工具** | Vite 6 |
| **图表库** | Recharts |
| **图标库** | Lucide React |
| **样式** | Tailwind CSS |
| **存储** | IndexedDB (idb) |
| **PWA** | Vite PWA Plugin + Workbox |

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/jiashui2003/taoist-fit.git
cd taoist-fit

# 进入前端目录
cd frontend/apps/frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

应用将在 `http://localhost:3000` 运行

---

## 📱 功能模块

### 1. 🏠 修炼主页 (Home)
- 境界等级显示（炼气期 → 筑基期 → 金丹期 → 元婴期）
- 实时健康数据转化展示
- AI 大师建议功能
- 冥想入定按钮

### 2. 📊 顿悟分析 (Analysis)
- **五行平衡卡片**: 金木水火土五维健康评估
- **指标详情视图**: 点击任意指标查看历史数据
- **时序图表**: 24小时/7天/30天/全部时间范围
- **ML智能洞察**: 趋势分析、异常检测

### 3. 📦 百宝库 (Inventory)
- **活动时间轴**: 带时间戳的运动记录
- **灵气转化**: 卡路里到灵气的实时转换

### 4. 🛒 灵气商城 (Shop)
- **宝典分类**: 养生智慧和生活建议
- **秘籍分类**: 具体的运动技巧
- **灵气支付**: 使用运动获得的灵气兑换

### 5. 🏆 修炼成就 (Achievements) - NEW!
- **18个成就徽章**: 6个类别，青铜/白银/黄金/特殊四个等级
- **类别筛选**: 修炼勤勉、心脉稳定、压力克制、灵气充沛、五行平衡、境界突破
- **进度追踪**: 实时显示达成进度

---

## 🔬 ML智能分析

### 趋势分析 (TrendAnalysisService)
- 线性回归检测趋势方向
- R²置信度评分
- 修仙风格描述："修炼渐进，气脉渐强"

### 异常检测 (AnomalyDetectionService)
- Z-score和IQR两种检测方法
- 严重程度分级（轻度/中度/严重）
- 警告示例："心脉急促，疑似走火入魔征兆"

### 健康推荐 (HealthRecommendationEngine)
- 基于规则的专家系统
- 结合五行平衡给出建议
- 示例："心魔侵扰，需要静心（打坐冥想30分钟）"

---

## 🏆 成就系统

| 类别 | 成就示例 | 条件 |
|------|----------|------|
| 修炼勤勉 | 🥉初入修途 | 连续记录3天 |
| 心脉稳定 | 🥈心脉稳定大师 | 心率正常14天 |
| 压力克制 | 🥇心魔降伏 | 压力<40持续14天 |
| 灵气充沛 | ✨灵气充盈 | 电量>90持续14天 |
| 五行平衡 | 💫阴阳合一 | 平衡>90持续7天 |
| 境界突破 | 🏛️筑基成功 | 达到筑基期 |

---

## 📁 项目结构

```
taoist-fit/
├── frontend/apps/frontend/
│   ├── components/          # React 组件 (17个)
│   │   ├── AchievementCard.tsx
│   │   ├── AchievementView.tsx
│   │   ├── InsightCard.tsx
│   │   ├── MetricDetailView.tsx
│   │   ├── TimeSeriesChart.tsx
│   │   └── ...
│   ├── services/            # 业务逻辑 (9个)
│   │   ├── AchievementService.ts
│   │   ├── TrendAnalysisService.ts
│   │   ├── AnomalyDetectionService.ts
│   │   ├── HealthRecommendationEngine.ts
│   │   ├── DatabaseService.ts
│   │   └── ...
│   ├── App.tsx
│   ├── types.ts
│   └── constants.ts
└── README.md
```

---

## 🗺️ 版本历史

### ✅ v1.5 (Current)
- [x] **成就系统**: 18个修仙主题徽章
- [x] **进度追踪**: 类别筛选和进度条
- [x] trophy导航标签

### ✅ v1.4
- [x] **指标详情视图**: 点击指标查看历史
- [x] **时序图表**: Recharts数据可视化
- [x] **ML智能洞察**: 趋势/异常/建议
- [x] **IndexedDB v2**: 指标历史存储

### ✅ v1.3
- [x] **无障碍性改进**: ARIA标签优化
- [x] **性能优化**: Lighthouse 95+分

### ✅ v1.1
- [x] **PWA离线支持**: 完全离线可用
- [x] **IndexedDB持久化**: 本地数据存储
- [x] **离线AI建议**: 50+条本地建议库

### ✅ v1.0
- [x] 修仙主题UI设计
- [x] 境界等级系统
- [x] 五行平衡ML模型
- [x] 灵气商城

---

## 📄 许可证

MIT License

---

## 👤 作者

**jiashui2003** - [@jiashui2003](https://github.com/jiashui2003)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！**

*修行之道，先修心，后修身。愿每一位修炼者都能达到身心合一的境界。*

</div>
