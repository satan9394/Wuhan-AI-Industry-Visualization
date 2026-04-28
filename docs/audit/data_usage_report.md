# 数据口径审计报告

## 1. 数据清单
| 文件 | 状态 | 说明 |
| --- | --- | --- |
| `data/data.xlsx` | 原始数据 | 需要清洗后使用 |
| `data/processed/enterprises.csv` | 运行时 | 后端实际读取 |
| `data/data.csv` | 备用 | 当前未使用 |

## 2. 运行时口径
- `/api/enterprises` 与统计接口仅基于 `data/processed/enterprises.csv`
- 宏观 KPI 为前端展示口径，不作为真实统计数据源

## 3. 更新记录
- 2025-12-29：文档整合为中文版本，口径未变更
