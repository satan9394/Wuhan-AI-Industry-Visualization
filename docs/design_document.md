# 系统设计说明书

## 1. 架构概览
- **前端**：React + Vite + Ant Design + ECharts
- **后端**：FastAPI
- **数据**：`data/data.xlsx` 清洗为 `data/processed/enterprises.csv`，后端运行时只读取 CSV

## 2. 双模自适应设计
系统采用“**双模自适应系统**”，通过 React Context 在同一套组件上切换两种视觉语言：
- **V1 经典管理模式**：容器化、高密度、卡片边框清晰
- **V2 体验模式**：去容器化、留白增强、杂志化标题与微质感背景

实现方式：
- `UiModeContext` 统一管理模式状态
- 根节点添加 `ui-mode-v1` / `ui-mode-v2` 类名
- 通过 CSS 变量控制颜色、阴影、间距与字体

## 3. 主要模块
- 战略情报 / 战略全景
- 产业数据看板 / 行业分析 / 产业链图谱
- 企业画像 / 创新生态 / 典型案例
- 算力基建 / 数据要素 / 区域-产业矩阵

## 4. 接口与数据流
- 前端通过 `frontend/src/api.js` 调用 FastAPI 接口
- 数据流：CSV -> FastAPI -> React 组件 -> ECharts 渲染

## 5. 安全与性能
- CSV 数据加载后在内存缓存，减少 IO
- 前端图表按需渲染，避免不必要的重复初始化
