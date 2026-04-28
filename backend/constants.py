# Enterprise Display System Constants

# --- 2025 MANDATORY DATA INJECTION (REQ-037) ---
MANDATORY_ENTERPRISES = [
    {"name": "优必选", "region": "东湖高新区", "category_level_1": "应用层", "category_level_2": "智能机器人", "products": "人形机器人, Walker S, 具身智能"},
    {"name": "小米科技（武汉）有限公司", "region": "东湖高新区", "category_level_1": "应用层", "category_level_2": "智能终端", "products": "智能手机, AIoT, 小爱同学"},
    {"name": "东风汽车集团有限公司", "region": "武汉经开区", "category_level_1": "应用层", "category_level_2": "智能驾驶", "products": "智能网联汽车, 自动驾驶, 车路云一体化"},
    {"name": "长飞光纤光缆股份有限公司", "region": "东湖高新区", "category_level_1": "基础层", "category_level_2": "光通信", "products": "光纤, 光缆, 工业互联网"},
    {"name": "黑芝麻智能科技有限公司", "region": "东湖高新区", "category_level_1": "基础层", "category_level_2": "AI芯片", "products": "自动驾驶芯片, 华山二号, 车规级芯片"},
    {"name": "武汉兰丁智能医学股份有限公司", "region": "东湖高新区", "category_level_1": "应用层", "category_level_2": "智慧医疗", "products": "宫颈癌筛查, AI病理诊断, 医疗机器人"},
    {"name": "华中师范大学（小雅平台）", "region": "洪山区", "category_level_1": "应用层", "category_level_2": "智慧教育", "products": "小雅平台, 教育大模型, 知识图谱"}
]

# --- Target Statistics for Mock/Scaling ---
REGION_TARGET_STATS = {
    "东湖高新区": 950,
    "洪山区": 125,
    "武汉经开区": 115,
    "江岸区": 50,
    "武昌区": 30,
    "江汉区": 20,
    "东西湖区": 20,
    "汉阳区": 16
}

CATEGORY_TARGET_STATS = {
    "应用层": 1042,
    "技术层": 191,
    "基础资源类": 93
}

TARGET_TOTAL_ENTERPRISES = 1326
