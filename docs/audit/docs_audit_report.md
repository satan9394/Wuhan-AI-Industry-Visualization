# 文档一致性审计

## 权威文档
- `docs/requirements.md`
- `docs/design_document.md`
- `docs/Deployment_Guide.md`
- `docs/User_Manual.md`
- `docs/2025_integration_changelog.md`
- `docs/audit/data_usage_report.md`

## 一致性检查结论
- 数据源口径统一为 `data/processed/enterprises.csv`
- 接口名称统一为 `/api/enterprises` + `search`
- 双模界面要求已写入需求与设计文档

## 风险提示
- 地图 GeoJSON 依赖外部资源，断网时地图降级
- 部分指标为展示口径，需与 CSV 数据区分
