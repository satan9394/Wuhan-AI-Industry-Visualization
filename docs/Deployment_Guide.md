# 部署指南

## 1. 环境要求
- Python 3.9+
- Node.js 16+

## 2. 后端部署
```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt

# 生成处理后的数据文件
python scripts/clean_data.py --in_file data/data.xlsx --out_file data/processed/enterprises.csv

# 启动服务
uvicorn backend.main:app --reload --port 8000
```
访问：`http://localhost:8000/api`

## 3. 前端部署
```bash
cd frontend
npm install
npm run dev
```
访问：`http://localhost:5173`

## 4. 生产构建
```bash
cd frontend
npm run build
```
产物目录：`frontend/dist`

## 5. 验证
```bash
python tests/e2e_test.py
```
