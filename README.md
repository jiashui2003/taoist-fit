# 🧘 Taoist Fit (修仙健身)

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20PWA-orange.svg)

**将现代健身追踪与东方修仙文化巧妙融合的创新健康应用**

*Transform your fitness journey into a cultivation path*

</div>

---

## 📖 项目简介

**Taoist Fit** 是一款独特的健身追踪应用，将传统的健康数据（如心率、卡路里、睡眠）重新诠释为修仙世界中的"灵气"、"道心"、"神识"等概念。通过游戏化的方式激励用户坚持健身，让枯燥的健康管理变得有趣。

### ✨ 核心特色

- 🎮 **游戏化设计**: 卡路里转化为"灵气"，压力指数变成"心魔"，让健身如同修仙
- 📊 **五行平衡系统**: 基于机器学习的健康指标耦合模型，给出"心火过旺"等修仙风格的健康建议
- 👥 **社交拜师系统**: 向前辈请教，获取运动和养生建议
- 🛒 **灵气商城**: 使用运动获得的"灵气"兑换养生秘籍和运动宝典

---

## 🏗️ 技术栈

| 类别 | 技术 |
|------|------|
| **前端框架** | React 18 + TypeScript |
| **构建工具** | Vite 6 |
| **动画库** | Framer Motion |
| **图表库** | Recharts |
| **图标库** | Lucide React |
| **样式** | Tailwind CSS |
| **后端 (开发中)** | NestJS |

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
cd APP/sport_app/frontend/apps/frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

应用将在 `http://localhost:3000` 运行（如果端口被占用会自动选择其他端口）

---

## 📱 功能模块

### 1. 修炼主页 (Home)
- 境界等级显示（炼气期、筑基期等）
- 实时健康数据转化展示
- AI 大师建议功能
- 冥想入定按钮

### 2. 顿悟分析 (Analysis)
- **五行平衡卡片**: 金木水火土五维健康评估
- **ML 耦合模型**: 综合分析选中的健康指标
- **可选指标**: 可自由开关显示的健康指标
- **压力/HRV 图表**: 实时压力和心率变异性可视化

### 3. 百宝库 (Inventory)
- **活动时间轴**: 带时间戳的运动记录
- **灵气转化**: 卡路里到灵气的实时转换
- **物品栏**: 已拥有的丹药和法器

### 4. 灵气商城 (Shop)
- **宝典分类**: 养生智慧和生活建议
- **秘籍分类**: 具体的运动技巧
- **灵气支付**: 使用运动获得的灵气兑换

### 5. 道友圈 (Social)
- **我的师父**: 显示当前师父及其建议
- **拜师系统**: 向高级前辈发起拜师请求
- **请教功能**: 获取师父的运动养生建议
- **同道中人**: 查看其他修炼者

---

## 🔬 五行平衡模型

应用内置了一个客户端 ML 耦合模型，根据用户选择的健康指标计算五行平衡:

| 五行 | 对应器官 | 相关指标 |
|------|----------|----------|
| 金 | 肺 | 血氧、VO2 Max、呼吸频率 |
| 木 | 肝 | HRV、静息心率 |
| 水 | 肾 | 睡眠时长 |
| 火 | 心 | 卡路里、压力、心率 |
| 土 | 脾 | 步数、身体电量 |

模型会根据指标偏差给出如下建议：
- "心火过旺，宜静心调息"
- "肾水不足，需增加深度睡眠"
- "五行相对平衡，保持现有修炼节奏"

---

## 📁 项目结构

```
taoist-fit/
├── APP/sport_app/
│   ├── frontend/
│   │   └── apps/
│   │       ├── frontend/          # 主前端应用
│   │       │   ├── components/    # React 组件
│   │       │   │   ├── ActivityTimeline.tsx
│   │       │   │   ├── BagView.tsx
│   │       │   │   ├── CultivationView.tsx
│   │       │   │   ├── DataAnalysisView.tsx
│   │       │   │   ├── FiveElementsCard.tsx
│   │       │   │   ├── MetricsToggle.tsx
│   │       │   │   ├── ShopView.tsx
│   │       │   │   ├── SocialView.tsx
│   │       │   │   └── StatCard.tsx
│   │       │   ├── services/      # 业务逻辑
│   │       │   │   ├── AICoachService.ts
│   │       │   │   ├── HealthInsightService.ts
│   │       │   │   └── PredictionModel.ts
│   │       │   ├── App.tsx        # 主应用入口
│   │       │   ├── constants.ts   # 常量和模拟数据
│   │       │   └── types.ts       # TypeScript 类型定义
│   │       └── backend/           # 后端 (开发中)
│   └── docker-compose.yml
└── README.md
```

---

## 🗺️ 开发路线图

### ✅ 已完成 (v1.0)
- [x] 修仙主题 UI 设计
- [x] 境界等级系统
- [x] 健康数据可视化
- [x] 活动时间轴
- [x] 灵气商城系统
- [x] 社交拜师功能
- [x] 五行平衡 ML 模型
- [x] 可选指标开关
- [x] 淡色系 UI 优化

### ✅ 已完成 (v1.1)
- [x] **PWA 离线支持**
  - 修仙主题图标 (太极莲花设计)
  - Service Worker 自动更新
  - 离线缓存策略 (1.68 MB)
- [x] **IndexedDB 本地持久化**
  - 7 个数据表 (健康、境界、商城等)
  - 自动保存 (防抖 1-2 秒)
  - 数据导出功能
- [x] **离线功能增强**
  - 网络状态提示
  - 50+ 条离线 AI 建议库
  - 完全离线可用

### 🚧 进行中 (v1.2)
- [ ] Lighthouse PWA 优化 (目标 >95 分)
- [ ] 更多秘籍内容

### 📋 计划中 (v2.0)
- [ ] **后端 API 开发**
  - 用户认证系统
  - 数据云端同步
  - 真实社交功能

- [ ] **健康设备集成**
  - Apple Health / Google Fit 接入
  - 智能手环数据同步
  - 第三方运动 App 数据导入

- [ ] **增强 ML 功能**
  - 个性化训练建议
  - 长期趋势预测
  - 异常健康状态预警

- [ ] **社区功能**
  - 真实用户拜师系统
  - 修炼成就排行榜
  - 门派/群组功能

- [ ] **多平台支持**
  - iOS/Android 原生应用
  - 微信小程序
  - 智能手表 App

---

## 🤝 贡献指南

欢迎任何形式的贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 👤 作者

**jiashui2003**

- GitHub: [@jiashui2003](https://github.com/jiashui2003)

---

## 🙏 致谢

- 感谢所有为本项目做出贡献的开发者
- 灵感来源于中国传统修仙文化与现代健康科技的结合

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！**

*修行之道，先修心，后修身。愿每一位修炼者都能达到身心合一的境界。*

</div>
