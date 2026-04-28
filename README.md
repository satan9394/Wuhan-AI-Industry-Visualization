# 企业展示系统（武汉 AI 2025）

## 项目简介
本项目为武汉市人工智能产业生态可视化分析平台，基于 React + FastAPI + ECharts 构建，展示产业规模、企业分布、算力基础设施与战略布局。

## 功能概览
- 战略情报与战略全景展示
- 产业数据看板与企业名录
- 创新生态与典型应用案例
- 算力基建与数据要素看板
- 行业分析与产业链图谱
- 区域-产业矩阵分析

## 文档入口
- `docs/User_Manual.md`（用户手册）
- `docs/Deployment_Guide.md`（部署指南）
- `docs/requirements.md`（需求文档）
- `docs/design_document.md`（系统设计）
- `docs/2025_integration_changelog.md`（变更记录）

## 快速启动

### 后端
```bash
# 1. 生成处理后的数据文件
python scripts/clean_data.py --in_file data/data.xlsx --out_file data/processed/enterprises.csv

# 2. 启动后端服务
uvicorn backend.main:app --reload --port 8000
```

### 前端
```bash
cd frontend
npm install
npm run dev
```
访问地址：`http://localhost:5173`

## 测试
```bash
python tests/e2e_test.py
```
