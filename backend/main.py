from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import jieba
from typing import List, Dict, Any, Optional
from collections import Counter
import re
import random
import hashlib
import math
import io
import urllib.parse

app = FastAPI(title="Enterprise Display System API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed", "enterprises.csv")
ATLAS_CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "data.csv")
ATLAS_XLSX_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "data.xlsx")

# Global cache for dataframe
_df_cache = None
_atlas_cache = None

def load_data() -> pd.DataFrame:
    global _df_cache
    if _df_cache is not None:
        return _df_cache

    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Data file not found at {DATA_PATH}")
    
    # Read processed CSV
    try:
        df = pd.read_csv(DATA_PATH)
    except Exception as e:
        print(f"Error reading processed data: {e}")
        # Fallback or empty
        return pd.DataFrame(columns=["id", "name", "region", "category_level_1", "category_level_2", "products"])

    # Fill NaNs
    df = df.fillna("")
    
    _df_cache = df
    return df


def load_atlas_data() -> pd.DataFrame:
    global _atlas_cache
    if _atlas_cache is not None:
        return _atlas_cache

    if os.path.exists(ATLAS_CSV_PATH):
        df = pd.read_csv(ATLAS_CSV_PATH, encoding="utf-8-sig", skiprows=2)
    elif os.path.exists(ATLAS_XLSX_PATH):
        df = pd.read_excel(ATLAS_XLSX_PATH, header=2)
    else:
        return pd.DataFrame(columns=[
            "一级分类", "二级分类", "三级分类", "证书编号", "企业名称", "注册地", "主要代表性技术/产品/服务"
        ])

    df = df.rename(columns={"Unnamed: 2": "三级分类"})
    expected_cols = ["一级分类", "二级分类", "三级分类", "证书编号", "企业名称", "注册地", "主要代表性技术/产品/服务"]
    for col in expected_cols:
        if col not in df.columns:
            df[col] = ""
    df = df[expected_cols]

    for col in expected_cols:
        df[col] = df[col].fillna("").astype(str).str.strip()

    df = df[(df["证书编号"] != "") & (df["企业名称"] != "")]

    cleaned_rows = []
    current_level_1 = ""
    current_level_2 = ""
    current_level_3 = ""
    for _, row in df.iterrows():
        level_1 = row["一级分类"]
        level_2 = row["二级分类"]
        level_3 = row["三级分类"]
        if level_1:
            current_level_1 = level_1
            current_level_2 = ""
            current_level_3 = ""
        if level_2:
            current_level_2 = level_2
            current_level_3 = ""
        if level_3:
            current_level_3 = level_3
        row["一级分类"] = current_level_1
        row["二级分类"] = current_level_2
        row["三级分类"] = current_level_3
        cleaned_rows.append(row)

    cleaned_df = pd.DataFrame(cleaned_rows)
    _atlas_cache = cleaned_df
    return cleaned_df


@app.get("/")
def read_root():
    return {"message": "Welcome to Enterprise Display System API", "docs_url": "/docs"}

@app.get("/api")
def read_api_root():
    return {
        "message": "API is running",
        "docs_url": "/docs",
        "endpoints": [
            "/api/enterprises",
            "/api/stats/region", 
            "/api/stats/category",
            "/api/stats/region-category",
            "/api/infra/stats",
            "/api/stats/innovation"
        ]
    }

@app.get("/api/enterprises", response_model=Dict[str, Any])
def get_enterprises(
    page: int = 1, 
    limit: int = 10, 
    search: Optional[str] = None,
    region: Optional[str] = None,
    category: Optional[str] = None,
    subcategory: Optional[str] = None
):
    """Get enterprises with pagination and filtering."""
    try:
        df = load_data()
        
        # Filtering
        if search:
            mask = df.apply(lambda x: search.lower() in str(x.values).lower(), axis=1)
            df = df[mask]
        if region:
            if "region" in df.columns:
                df = df[df["region"] == region]
        if category:
            if "category_level_1" in df.columns:
                df = df[df["category_level_1"] == category]
        if subcategory:
            if "category_level_2" in df.columns:
                df = df[df["category_level_2"] == subcategory]
        
        real_count = len(df)
        display_total = real_count
        
        # Pagination Logic
        start = (page - 1) * limit
        end = start + limit
        
        items = []
        
        # 1. Real Data Phase
        if start < real_count:
            # Slice real data
            real_slice_end = min(end, real_count)
            items = df.iloc[start:real_slice_end].to_dict(orient="records")

        return {
            "total": display_total,
            "page": page,
            "limit": limit,
            "items": items
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/enterprises/export")
def export_enterprises(
    search: Optional[str] = None,
    region: Optional[str] = None,
    category: Optional[str] = None,
    subcategory: Optional[str] = None
):
    """Export enterprises to CSV based on filters."""
    try:
        df = load_data()
        
        # Filtering (Same logic as get_enterprises)
        if search:
            mask = df.apply(lambda x: search.lower() in str(x.values).lower(), axis=1)
            df = df[mask]
        if region:
            if "region" in df.columns:
                df = df[df["region"] == region]
        if category:
            if "category_level_1" in df.columns:
                df = df[df["category_level_1"] == category]
        if subcategory:
            if "category_level_2" in df.columns:
                df = df[df["category_level_2"] == subcategory]
        
        # Select and rename columns for export
        export_df = df.copy()
        column_mapping = {
            "id": "证书编号",
            "name": "企业名称",
            "region": "区域",
            "category_level_1": "一级分类",
            "category_level_2": "二级分类",
            "products": "核心业务"
        }
        
        # Filter existing columns
        existing_cols = [c for c in column_mapping.keys() if c in export_df.columns]
        export_df = export_df[existing_cols]
        export_df = export_df.rename(columns=column_mapping)
        
        # Create CSV in memory
        stream = io.StringIO()
        # Add BOM for Excel compatibility
        stream.write('\ufeff')
        export_df.to_csv(stream, index=False)
        response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
        
        # Set filename
        filename = f"wuhan_ai_enterprises_{random.randint(1000,9999)}.csv"
        # Encode filename for header
        encoded_filename = urllib.parse.quote(filename)
        response.headers["Content-Disposition"] = f"attachment; filename={encoded_filename}; filename*=utf-8''{encoded_filename}"
        
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats/region")
def get_region_stats():
    """Stats for Map/Bar Chart (Real Data Only)"""
    try:
        df = load_data()
        
        # Real stats
        if "region" in df.columns:
            real_counts = df["region"].value_counts().to_dict()
        else:
            real_counts = {}
            
        final_stats = []
        for name, val in real_counts.items():
            final_stats.append({"name": name, "value": val})
                
        final_stats.sort(key=lambda x: x["value"], reverse=True)
        return final_stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats/category")
def get_category_stats():
    """Stats for Pie Chart (Real Data Only)"""
    try:
        df = load_data()
        
        if "category_level_1" in df.columns:
            counts = df["category_level_1"].value_counts().to_dict()
            return [{"name": k, "value": v} for k, v in counts.items()]
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats/region-category")
def get_region_category_stats():
    """Region x Category matrix for heatmap views."""
    try:
        df = load_data()

        if "region" not in df.columns or "category_level_1" not in df.columns:
            return {
                "regions": [],
                "categories": [],
                "matrix": [],
                "top_pairs": [],
                "totals": {"overall": 0, "regions": {}, "categories": {}}
            }

        working = df.copy()
        working["region"] = working["region"].fillna("").astype(str).str.strip()
        working["category_level_1"] = working["category_level_1"].fillna("").astype(str).str.strip()
        working = working[(working["region"] != "") & (working["category_level_1"] != "")]

        if working.empty:
            return {
                "regions": [],
                "categories": [],
                "matrix": [],
                "top_pairs": [],
                "totals": {"overall": 0, "regions": {}, "categories": {}}
            }

        region_totals = working["region"].value_counts().to_dict()
        category_totals = working["category_level_1"].value_counts().to_dict()

        regions = sorted(region_totals.keys(), key=lambda r: region_totals[r], reverse=True)
        categories = sorted(category_totals.keys(), key=lambda c: category_totals[c], reverse=True)
        region_index = {name: idx for idx, name in enumerate(regions)}
        category_index = {name: idx for idx, name in enumerate(categories)}

        counts = working.groupby(["region", "category_level_1"]).size().reset_index(name="value")
        matrix = [
            [category_index[row["category_level_1"]], region_index[row["region"]], int(row["value"])]
            for _, row in counts.iterrows()
        ]
        top_pairs = counts.sort_values("value", ascending=False).head(8).to_dict(orient="records")

        return {
            "regions": regions,
            "categories": categories,
            "matrix": matrix,
            "top_pairs": top_pairs,
            "totals": {
                "overall": int(len(working)),
                "regions": region_totals,
                "categories": category_totals
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/atlas/summary")
def get_atlas_summary():
    try:
        df = load_atlas_data()
        total = int(len(df))

        def build_counts(group_cols):
            counts = df.groupby(group_cols).size().reset_index(name="count")
            return counts.sort_values("count", ascending=False)

        level_1 = build_counts(["一级分类"])
        if total > 0:
            level_1["ratio"] = (level_1["count"] / total * 100).round(1)
        else:
            level_1["ratio"] = 0

        level_2 = build_counts(["一级分类", "二级分类"])

        level_3_df = df.copy()
        level_3_df["三级分类"] = level_3_df["三级分类"].replace("", "未细分")
        level_3 = level_3_df.groupby(["一级分类", "二级分类", "三级分类"]).size().reset_index(name="count")
        level_3 = level_3.sort_values("count", ascending=False)

        regions = build_counts(["注册地"])

        return {
            "total": total,
            "level1": level_1.to_dict(orient="records"),
            "level2": level_2.to_dict(orient="records"),
            "level3": level_3.to_dict(orient="records"),
            "regions": regions.to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/atlas/enterprises")
def get_atlas_enterprises():
    try:
        df = load_atlas_data()
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/infra/stats")
def get_infra_stats():
    """REQ-040: Infrastructure Stats (Updated based on Data_All.md & mita_data.md)"""
    return {
        "computing_power": {
            "total": 5100, # PFlops
            "unit": "PFlops",
            "growth_rate": 25,
            "utilization": 74,
            "centers": [
                {"name": "中国移动智算中心", "value": 2200, "type": "智算"},
                {"name": "中国电信中部智算中心", "value": 2000, "type": "智算"},
                {"name": "网安基地智算中心", "value": 500, "type": "智算"},
                {"name": "武汉人工智能计算中心", "value": 400, "type": "智算"},
                {"name": "中国联通华中智·云", "value": 300, "type": "智算"},
                {"name": "武汉超算中心", "value": 250, "type": "超算"}
            ]
        },
        "data_elements": {
            "catalogs": 1651,
            "datasets": 2599,
            "records": 4566, # 万条
            "api_calls": 7.3 # 亿次
        },
        "trading_platform": {
            "name": "汉数通",
            "merchants": 697, # 入驻数商
            "products": 1239, # 挂牌产品
            "cities": 29, # 互联互通城市
            "transaction_volume": 4353 # 万元 (撮合交易额)
        },
        "assetization": {
            "pilot_name": "医疗数据资产入表+融资",
            "enterprises": 7, # 获授信企业数
            "credit_amount": 1.26 # 亿元
        },
        "network": {
            "5g_base_stations": 45000,
            "iot_terminals": 800 # 万
        }
    }

@app.get("/api/stats/innovation")
def get_innovation_stats():
    """REQ-NEW: Innovation Stats"""
    return {
        "rankings": {
            "talent_global": 6,
            "forbes_china": 4,
            "city_competitiveness": 8
        },
        "resources": {
            "key_labs": 41,
            "high_tech_enterprises": 1017,
            "little_giants": 121
        }
    }

# --- MD Unused Sections Extraction ---
@app.get("/api/md/unused")
def get_md_unused():
    """Extract unused sections from project markdown files.
       Rule: any heading containing '【已用】' is considered used and will be excluded."""
    try:
        base_dir = os.path.dirname(os.path.dirname(__file__))
        md_files = [
            os.path.join(base_dir, "Supplement", "mita_data.md"),
            os.path.join(base_dir, "Supplement", "Data_All.md"),
            os.path.join(base_dir, "Supplement", "qwen.md"),
        ]
        items = []
        for path in md_files:
            if not os.path.exists(path):
                continue
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read().splitlines()
            except Exception as e:
                print(f"Error reading {path}: {e}")
                continue
            current = None
            current_lines = []
            current_used = False
            current_level = 0
            def flush():
                if current and not current_used:
                    excerpt = "\n".join(current_lines).strip()
                    # Trim overly long excerpts
                    if len(excerpt) > 800:
                        excerpt = excerpt[:800] + "..."
                    items.append({
                        "source": os.path.basename(path),
                        "title": current,
                        "level": current_level,
                        "excerpt": excerpt
                    })
            for line in content:
                m = re.match(r"^\s{0,3}(#{2,6})\s+(.*)$", line)
                if m:
                    # New heading
                    flush()
                    hashes, title = m.group(1), m.group(2)
                    current = title.replace("【已用】", "").strip()
                    current_used = "【已用】" in title
                    current_level = len(hashes)
                    current_lines = []
                else:
                    if current is not None:
                        current_lines.append(line)
            # final flush
            flush()
        # If nothing found, return empty list
        return {"items": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- EXISTING ENDPOINTS (KEPT FOR COMPATIBILITY) ---

@app.get("/api/stats/chain")
def get_chain_stats():
    try:
        df = load_data()
        if "category_level_1" not in df.columns or "category_level_2" not in df.columns:
            return []
        data = []
        # Calculate sizes for sorting
        category_counts = df["category_level_1"].value_counts()
        sorted_categories = category_counts.index.tolist()
        
        for cat_name in sorted_categories:
            group = df[df["category_level_1"] == cat_name]
            children = []
            sub_counts = group["category_level_2"].value_counts().reset_index()
            sub_counts.columns = ["name", "value"]
            for _, row in sub_counts.iterrows():
                children.append({"name": row["name"], "value": row["value"]})
            data.append({"name": cat_name, "children": children})
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats/keywords")
def get_keywords_stats(limit: int = 50):
    try:
        df = load_data()
        if "products" in df.columns and not df["products"].empty:
            text = " ".join(df["products"].astype(str).tolist())
            stop_words = {"的", "和", "与", "等", "及", "主要", "包括", "提供", "在", "了", "是", "为", "基于", "系列", "技术", "产品", "服务", "研发", "应用", "系统", "平台", "解决方案", "nan", "NaN"}
            words = jieba.cut(text)
            filtered_words = [w for w in words if len(w) > 1 and w not in stop_words]
            counter = Counter(filtered_words)
            most_common = counter.most_common(limit)
            if most_common:
                return [{"name": word, "value": count} for word, count in most_common]
        return []
    except Exception as e:
        print(f"Error: {e}")
        return []

@app.get("/api/chain/graph")
def get_chain_graph():
    """REQ-NEW: Supply Chain Graph from Real Data"""
    try:
        df = load_data()
        
        nodes = []
        links = []
        categories = [{"name": "基础层"}, {"name": "技术层"}, {"name": "应用层"}]
        
        # Helper to track existing nodes to avoid duplicates
        existing_nodes = set()
        
        def add_node(name, category, size):
            if name not in existing_nodes:
                nodes.append({
                    "name": name,
                    "symbolSize": size,
                    "category": category,
                    "draggable": True
                })
                existing_nodes.add(name)

        # 1. Level 1 Categories (Roots)
        # Map CSV Level 1 to our 3 Graph Categories
        # 基础资源类 -> 0
        # 技术类 -> 1
        # 产品应用服务类 -> 2
        
        l1_map = {
            "基础资源类": 0,
            "技术类": 1,
            "产品应用服务类": 2
        }
        
        # Add Level 1 Nodes
        for l1_name, cat_id in l1_map.items():
            add_node(l1_name, cat_id, 60)
            
        # 2. Process Data
        if "category_level_1" in df.columns and "category_level_2" in df.columns and "name" in df.columns:
            for _, row in df.iterrows():
                l1 = row["category_level_1"]
                l2 = row["category_level_2"]
                ent_name = row["name"]
                
                if not l1 or l1 not in l1_map:
                    continue
                    
                cat_id = l1_map[l1]
                
                # Add Level 2 Node
                # Level 2 nodes belong to the same category color as their parent
                if l2:
                    add_node(l2, cat_id, 40)
                    # Link L1 -> L2
                    if {"source": l1, "target": l2} not in links:
                        links.append({"source": l1, "target": l2})
                    
                    # Add Enterprise Node
                    if ent_name:
                        add_node(ent_name, cat_id, 20)
                        # Link L2 -> Enterprise
                        if {"source": l2, "target": ent_name} not in links:
                            links.append({"source": l2, "target": ent_name})
                            
        return {
            "nodes": nodes,
            "links": links,
            "categories": categories
        }
    except Exception as e:
        print(f"Error generating graph: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/enterprise/{name}/detail")
def get_enterprise_detail(name: str):
    try:
        df = load_data()
        enterprise = df[df["name"] == name]
        if enterprise.empty:
             mask = df["name"].astype(str).str.contains(name, regex=False)
             if mask.any():
                 enterprise = df[mask].iloc[[0]]
             else:
                 raise HTTPException(status_code=404, detail="Enterprise not found")
        
        ent_data = enterprise.iloc[0].to_dict()
        
        # Mock Charts Data
        seed_str = ent_data.get("name", "") + "salt123"
        seed_int = int(hashlib.sha256(seed_str.encode("utf-8")).hexdigest(), 16) % 10**8
        rng = random.Random(seed_int)
        
        return {
            "info": ent_data,
            "radar": {
                "indicator": [{"name": k, "max": 100} for k in ["研发", "市场", "资金", "团队", "成长"]],
                "values": [rng.randint(60, 95) for _ in range(5)]
            },
            "revenue": {
                "years": ["2019", "2020", "2021", "2022", "2023"],
                "values": [rng.randint(500, 5000) * (1.1**i) for i in range(5)]
            },
            "network": {
                "nodes": [{"name": ent_data["name"], "symbolSize": 30, "category": 0}],
                "links": [],
                "categories": [{"name": "核心"}]
            }
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/industry/analysis")
def get_industry_analysis():
    # Return structure for scatter/funnel/gauge
    rng = random.Random(42)
    return {
        "scatter": [[rng.randint(100, 5000), rng.randint(50, 99), rng.randint(10, 50), "Group"] for _ in range(50)],
        "terminals": [
            {"name": "AI+机器人", "value": 85, "max": 100},
            {"name": "AI+汽车", "value": 92, "max": 100},
            {"name": "AI+PC/服务器", "value": 78, "max": 100},
            {"name": "AI+手机", "value": 88, "max": 100},
            {"name": "AI+眼镜(XR)", "value": 75, "max": 100}
        ],
        "funnel": [
            {"value": 100, "name": "基础研究"},
            {"value": 80, "name": "技术攻关"},
            {"value": 60, "name": "产品开发"},
            {"value": 40, "name": "场景落地"},
            {"value": 20, "name": "规模应用"}
        ],
        "gauge": 92
    }

@app.get("/api/cases")
def get_application_cases():
    return [
        {
            "title": "智能制造",
            "org": "烽火通信、长飞光纤、京东方等",
            "desc": "武汉入选工信部2025年度卓越级智能工厂项目数量全省第一。长飞光纤实现数百种光缆并行生产；武汉京东方构建AI缺陷管理系统，产品综合良率超98%。",
            "tags": ["智能工厂", "标杆", "电子信息"]
        },
        {
            "title": "智慧医疗",
            "org": "武汉市卫健委",
            "desc": "发布人工智能医疗应用共享服务平台，首批上线72款AI产品，覆盖'1+8'城市圈。AI超声辅助诊断准确率超95%，实现跨区域检查检验结果互认共享。",
            "tags": ["AI医疗平台", "辅助诊断", "共享服务"]
        },
        {
            "title": "智慧教育",
            "org": "华中师范大学、武汉商学院",
            "desc": "华中师大'小雅'平台服务师生超80万人次，实现全流程智能化。武汉商学院打造AI+VR智慧烹饪教室。理工数传AI产品覆盖全国近70%出版机构。",
            "tags": ["小雅平台", "AI+VR", "智慧教学"]
        },
        {
            "title": "智能交通",
            "org": "百度(萝卜快跑)、东风",
            "desc": "建成3487公里智能道路，位居全国第一。萝卜快跑成为城市名片。东风投入200辆自动驾驶示范车。'车路云一体化'试点推进，定位精度达厘米级。",
            "tags": ["车路云一体化", "自动驾驶", "萝卜快跑"]
        },
        {
            "title": "智慧城市",
            "org": "武汉市、华为",
            "desc": "打造全国首个超大型城市运行管理智能体，基于数字孪生构建'智慧中枢'。实现27个部门数据实时更新，燃气事故率下降60%，交通拥堵指数降低15%。",
            "tags": ["城市智能体", "数字孪生", "智慧中枢"]
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
