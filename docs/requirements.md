# 项目需求文档

## 1. 项目目标
建设“湖北省人工智能产业生态大脑”可视化平台，支持多维统计展示、企业查询与图表联动，形成可用于汇报与运营的产业看板。

## 2. 数据与口径
- **原始数据**：`data/data.xlsx`
- **处理链路**：`scripts/clean_data.py` -> `data/processed/enterprises.csv`
- **运行时数据源**：后端只读取 `data/processed/enterprises.csv`
- **展示口径**：宏观 KPI（如 1000 亿、1326 家）可用于展示，但列表与统计必须与 CSV 一致

## 3. 接口需求
- `GET /api/enterprises`：分页/筛选/搜索
- `GET /api/enterprises/export`：导出 CSV
- `GET /api/stats/region`：区域统计
- `GET /api/stats/category`：产业链统计
- `GET /api/stats/chain`：产业链层级
- `GET /api/stats/region-category`：区域-产业交叉统计
- `GET /api/stats/keywords`：关键词/词云
- `GET /api/infra/stats`：算力与数据要素
- `GET /api/stats/innovation`：创新指标
- `GET /api/cases`：典型案例

## 4. 前端功能
- 战略情报、战略全景、创新生态、产业数据看板、行业分析、产业链图谱、企业画像、算力基建、数据要素、区域-产业矩阵
- **双模界面**：支持 V1 经典模式与 V2 体验模式，一键切换且无需刷新

## 5. 交互需求
- 图表联动筛选
- 搜索与筛选组合
- 导出当前筛选结果
- DataZoom（柱状/折线）

## 6. 验证方式
- 后端：`uvicorn backend.main:app --reload --port 8000`
- 前端：`npm run dev` / `npm run build`
- 测试：`python tests/e2e_test.py`
