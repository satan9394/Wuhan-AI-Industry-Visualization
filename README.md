# 武汉人工智能产业生态可视化平台

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![ECharts](https://img.shields.io/badge/ECharts-5.x-AA344D.svg)](https://echarts.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

湖北省人工智能产业生态大脑可视化平台。基于 **React + FastAPI + ECharts** 构建，展示 AI 产业规模、企业分布、算力基础设施、产业链图谱与战略布局。

## ✨ 核心功能

- **战略情报** — AI 产业态势感知，宏观 KPI 展示（产业规模 / 1300+ 企业）
- **产业数据看板** — 企业名录、区域分布、产业链分类，支持多维度筛选与搜索
- **产业链图谱** — 基础层→技术层→应用层，上下游关系可视化
- **企业画像** — 单企业详细信息、技术栈、融资阶段
- **创新生态** — 专利/论文/平台等创新指标
- **算力基建** — 数据中心、算力资源、数据要素监控
- **区域-产业矩阵** — 15 区 x 产业链交叉热力图分析
- **典型案例** — AI 应用场景展示
- **双模界面** — V1 经典模式 + V2 体验模式，一键切换无需刷新

## 🏗 技术架构

```
┌────────────────────┐     REST API     ┌────────────────────┐
│   React Frontend   │ ◄─────────────► │   FastAPI Backend  │
│   (Vite + ECharts) │  /api/stats/*   │   (Python 3.10+)   │
│                    │  /api/enterprises│                    │
│   ┌─────────────┐  │                 │   ┌─────────────┐  │
│   │  ECharts    │  │                 │   │   Pandas    │  │
│   │  Dashboard  │  │                 │   │   数据层    │  │
│   └─────────────┘  │                 │   └─────────────┘  │
│   ┌─────────────┐  │                 │   ┌─────────────┐  │
│   │ Ant Design  │  │                 │   │  CSV/Excel  │  │
│   │    UI       │  │                 │   │   数据源    │  │
│   └─────────────┘  │                 │   └─────────────┘  │
└────────────────────┘                  └────────────────────┘
```

## 🚀 快速开始

### 环境要求
- Python 3.10+
- Node.js 18+
- npm 9+

### 1. 数据处理
```bash
python scripts/clean_data.py --in_file data/data.xlsx --out_file data/processed/enterprises.csv
```

### 2. 启动后端
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API 文档：http://localhost:8000/docs

### 3. 启动前端
```bash
cd frontend
npm install
npm run dev
```

访问：http://localhost:5173

## 📊 API 接口

| 端点 | 说明 |
|------|------|
| `GET /api/enterprises` | 企业列表（分页/筛选/搜索） |
| `GET /api/enterprises/export` | 导出 CSV |
| `GET /api/stats/region` | 区域统计 |
| `GET /api/stats/category` | 产业链统计 |
| `GET /api/stats/chain` | 产业链层级 |
| `GET /api/stats/region-category` | 区域-产业交叉统计 |
| `GET /api/stats/keywords` | 关键词/词云 |
| `GET /api/stats/innovation` | 创新指标 |
| `GET /api/infra/stats` | 算力与数据要素 |
| `GET /api/cases` | 典型案例 |

## 📁 项目结构

```
Wuhan-AI-Industry-Visualization/
├── backend/
│   ├── main.py              # FastAPI 应用 + 全部 API
│   ├── constants.py         # 常量配置
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/      # 16 个 React 组件
│       │   ├── Dashboard.jsx
│       │   ├── StrategyView.jsx
│       │   ├── IndustryAnalysis.jsx
│       │   ├── SupplyChainMap.jsx
│       │   ├── EnterprisePortrait.jsx
│       │   ├── InnovationView.jsx
│       │   ├── InfraMonitor.jsx
│       │   ├── DataElementView.jsx
│       │   ├── MapComponent.jsx
│       │   ├── RegionCategoryMatrix.jsx
│       │   ├── ApplicationCases.jsx
│       │   ├── StrategicIntelligenceView.jsx
│       │   ├── PolicyModule.jsx
│       │   ├── Landing.jsx
│       │   └── ErrorBoundary.jsx
│       ├── api.js           # API 调用层
│       ├── theme.js         # 主题配置
│       ├── context/         # UI 模式 Context
│       └── App.jsx          # 路由 + 布局
├── data/
│   ├── data.xlsx            # 原始企业数据
│   └── processed/           # 处理后的 CSV
├── scripts/
│   ├── clean_data.py        # 数据清洗
│   └── verification/        # 验证脚本
├── tests/
│   └── e2e_test.py          # 端到端测试
├── docs/                    # 需求、设计、部署文档
├── Supplement/              # 补充数据说明
└── 论文图片/                # 系统架构图 + 流程图
```

## 📝 文档

- `docs/requirements.md` — 需求文档
- `docs/design_document.md` — 系统设计文档
- `docs/Deployment_Guide.md` — 部署指南
- `docs/User_Manual.md` — 用户手册

## 📝 License

MIT
