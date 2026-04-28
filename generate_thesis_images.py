"""
论文图片生成程序
生成论文中所需的所有架构图、流程图、界面图等
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, FancyArrowPatch
from matplotlib.font_manager import FontProperties
import numpy as np

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

# 图片保存目录
IMAGE_DIR = '论文图片'
os.makedirs(IMAGE_DIR, exist_ok=True)


def save_figure(fig, filename):
    """保存图片到指定目录"""
    filepath = os.path.join(IMAGE_DIR, filename)
    fig.savefig(filepath, dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close(fig)
    print(f"[OK] Generated: {filename}")


def create_architecture_diagram():
    """图3-1 系统总体架构图"""
    fig, ax = plt.subplots(figsize=(12, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 12)
    ax.axis('off')

    # 三层架构 - 增加垂直间距
    layers = [
        ('展示层\n(Presentation Layer)', 1.5, 9.5, 7, 1.3, '#E3F2FD', '#1976D2'),
        ('应用层\n(Application Layer)', 1.5, 6.5, 7, 1.3, '#E8F5E9', '#388E3C'),
        ('数据层\n(Data Layer)', 1.5, 3.5, 7, 1.3, '#FFF3E0', '#F57C00'),
    ]

    for title, x, y, w, h, bg_color, border_color in layers:
        box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1",
                            facecolor=bg_color, edgecolor=border_color,
                            linewidth=2, zorder=2)
        ax.add_patch(box)
        ax.text(x + w/2, y + h/2, title, ha='center', va='center',
               fontsize=13, fontweight='bold', zorder=3)

    # 详细内容 - 调整位置避免重叠
    details = [
        ('React组件\nECharts图表\n用户界面', 2.2, 7.8, 5.6, 1.0),
        ('FastAPI服务\n业务逻辑处理\n数据验证', 2.2, 4.8, 5.6, 1.0),
        ('CSV文件\nJSON配置\n文件系统', 2.2, 1.8, 5.6, 1.0),
    ]

    for text, x, y, w, h in details:
        box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05",
                            facecolor='white', edgecolor='gray',
                            linewidth=1, alpha=0.8, zorder=1)
        ax.add_patch(box)
        ax.text(x + w/2, y + h/2, text, ha='center', va='center',
               fontsize=10, zorder=3)

    # 箭头连接 - 调整位置
    arrows = [
        (5, 7.5, 5, 6.8),      # 应用层到展示层
        (5, 4.5, 5, 3.8),      # 数据层到应用层
    ]

    for x1, y1, x2, y2 in arrows:
        arrow = FancyArrowPatch((x1, y1), (x2, y2),
                              arrowstyle='->', mutation_scale=20,
                              linewidth=2, color='#666', zorder=1)
        ax.add_patch(arrow)

    # 标注
    ax.text(5, 0.5, '前后端分离架构 | 数据流向: 展示层 ← 应用层 ← 数据层',
           ha='center', fontsize=10, style='italic', color='#666')

    save_figure(fig, '图3-1 系统总体架构图.png')


def create_frontend_architecture():
    """图3-2 前端技术架构图"""
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # 技术栈层级
    tech_stack = [
        ('UI组件层', 'Ant Design\nAnt Design Icons', 2, 7.5, '#BBDEFB'),
        ('数据可视化层', 'ECharts 5.x', 2, 6, '#90CAF9'),
        ('核心框架层', 'React 18\nReact Router\nReact Context', 2, 4.5, '#64B5F6'),
        ('网络通信层', 'Axios', 2, 3, '#42A5F5'),
        ('构建工具层', 'Vite\nRollup', 2, 1.5, '#2196F3'),
    ]

    for i, (layer, tech, y, height, color) in enumerate(tech_stack):
        # 层级框
        box = FancyBboxPatch((1, y), 12, height, boxstyle="round,pad=0.1",
                            facecolor=color, edgecolor='#1976D2',
                            linewidth=2, alpha=0.6)
        ax.add_patch(box)

        # 层级标题
        ax.text(1.5, y + height/2, layer, ha='left', va='center',
               fontsize=11, fontweight='bold')

        # 技术名称
        ax.text(7, y + height/2, tech, ha='center', va='center',
               fontsize=10, bbox=dict(boxstyle='round,pad=0.5',
                                      facecolor='white', alpha=0.8))

    # 添加说明
    ax.text(7, 0.3, '前端技术栈：React 18 + Vite + Ant Design + ECharts + React Router + Axios',
           ha='center', fontsize=10, style='italic', color='#666')

    save_figure(fig, '图3-2 前端技术架构图.png')


def create_backend_architecture():
    """图3-3 后端技术架构图"""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # 技术栈层级
    tech_stack = [
        ('核心框架层', 'FastAPI 0.100+', 1.5, 7, '#C8E6C9'),
        ('ASGI服务器层', 'Uvicorn', 1.5, 5.5, '#A5D6A7'),
        ('数据处理层', 'Pandas 2.0+\nNumPy', 1.5, 4, '#81C784'),
        ('数据验证层', 'Pydantic', 1.5, 2.5, '#66BB6A'),
        ('文件处理层', 'Python标准库\ncsv, json', 1.5, 1, '#4CAF50'),
    ]

    for layer, tech, y, height, color in tech_stack:
        # 层级框
        box = FancyBboxPatch((1, y), 10, height, boxstyle="round,pad=0.1",
                            facecolor=color, edgecolor='#388E3C',
                            linewidth=2, alpha=0.3)
        ax.add_patch(box)

        # 层级标题
        ax.text(1.8, y + height/2, layer, ha='left', va='center',
               fontsize=11, fontweight='bold')

        # 技术名称
        ax.text(6.5, y + height/2, tech, ha='center', va='center',
               fontsize=10, bbox=dict(boxstyle='round,pad=0.5',
                                      facecolor=color, alpha=0.8))

    # 添加说明
    ax.text(6, 0.3, '后端技术栈：FastAPI + Uvicorn + Pandas + Pydantic',
           ha='center', fontsize=10, style='italic', color='#666')

    save_figure(fig, '图3-3 后端技术架构图.png')


def create_module_structure():
    """图3-4 功能模块结构图"""
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # 九大功能模块
    modules = [
        ('战略情报模块', 1, 7.5, '#FFE0B2'),
        ('产业数据看板', 5, 7.5, '#FFE0B2'),
        ('产业链图谱', 9, 7.5, '#FFE0B2'),
        ('企业画像', 1, 5.5, '#FFCC80'),
        ('创新生态', 5, 5.5, '#FFCC80'),
        ('算力基建', 9, 5.5, '#FFCC80'),
        ('区域-产业矩阵', 1, 3.5, '#FFB74D'),
        ('双模界面切换', 5, 3.5, '#FFB74D'),
        ('交互功能', 9, 3.5, '#FFB74D'),
    ]

    for module, x, y, color in modules:
        box = FancyBboxPatch((x, y), 3.5, 1.2, boxstyle="round,pad=0.15",
                            facecolor=color, edgecolor='#F57C00',
                            linewidth=2, alpha=0.7)
        ax.add_patch(box)
        ax.text(x + 1.75, y + 0.6, module, ha='center', va='center',
               fontsize=10, fontweight='bold')

    # 添加边框
    border = FancyBboxPatch((0.5, 2.5), 13, 7, boxstyle="round,pad=0.3",
                          facecolor='none', edgecolor='#F57C00',
                          linewidth=3, linestyle='--')
    ax.add_patch(border)
    ax.text(7, 10.5, '企业展示系统', ha='center', fontsize=14,
            fontweight='bold', color='#E65100')

    save_figure(fig, '图3-4 功能模块结构图.png')


def create_data_flow_diagram():
    """图3-5 数据处理流程图"""
    fig, ax = plt.subplots(figsize=(14, 6))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 6)
    ax.axis('off')

    # 流程步骤
    steps = [
        ('Excel原始数据', 1, 3),
        ('数据清洗', 3.5, 3),
        ('数据转换', 5.5, 3),
        ('数据验证', 7.5, 3),
        ('CSV文件', 10, 3),
        ('系统加载', 12, 3),
    ]

    # 绘制流程框
    for step, x, y in steps:
        box = FancyBboxPatch((x, y-0.4), 2, 0.8,
                            boxstyle="round,pad=0.1",
                            facecolor='#E3F2FD',
                            edgecolor='#1976D2', linewidth=2)
        ax.add_patch(box)
        ax.text(x + 1, y, step, ha='center', va='center',
               fontsize=10, fontweight='bold')

    # 绘制箭头
    for i in range(len(steps)-1):
        x1, y1 = steps[i][1] + 2, steps[i][2]
        x2, y2 = steps[i+1][1], steps[i+1][2]
        arrow = FancyArrowPatch((x1, y1), (x2, y2),
                              arrowstyle='->', mutation_scale=20,
                              linewidth=2, color='#1976D2')
        ax.add_patch(arrow)

    # 添加说明
    ax.text(7, 1, '数据处理流程：数据采集 → 清洗 → 转换 → 验证 → 存储 → 加载',
           ha='center', fontsize=10, style='italic', color='#666')

    save_figure(fig, '图3-5 数据处理流程图.png')


def create_api_sequence_diagram():
    """图3-6 API接口时序图"""
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # 参与者
    actors = [
        ('用户', 1),
        ('前端', 4),
        ('后端API', 8),
        ('CSV数据', 11),
    ]

    for actor, x in actors:
        ax.axvline(x=x, ymin=0.15, ymax=0.95, color='#999',
                 linewidth=2, linestyle='--')
        ax.text(x, 9.5, actor, ha='center', fontsize=11,
               fontweight='bold', bbox=dict(boxstyle='round,pad=0.5',
                                             facecolor='#E3F2FD'))

    # 时序步骤
    sequences = [
        ('用户操作', 1, 4, 8.5),
        ('调用API', 4, 8, 7.5),
        ('读取数据', 8, 11, 6.5),
        ('返回数据', 11, 8, 5.5),
        ('返回JSON', 8, 4, 4.5),
        ('渲染界面', 4, 1, 3.5),
    ]

    for label, x1, x2, y in sequences:
        # 水平箭头
        arrow = FancyArrowPatch((x1, y), (x2, y),
                              arrowstyle='->', mutation_scale=15,
                              linewidth=2, color='#1976D2',
                              connectionstyle="arc3,rad=0")
        ax.add_patch(arrow)
        ax.text((x1+x2)/2, y+0.3, label, ha='center', fontsize=9)

    save_figure(fig, '图3-6 API接口时序图.png')


def create_industry_situation_flow_diagram():
    """图2-1 产业态势感知业务流程图"""
    fig, ax = plt.subplots(figsize=(12, 10))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 12)
    ax.axis('off')

    # 流程步骤
    steps = [
        ('用户登录系统', 2, 10, '#E3F2FD'),
        ('进入战略情报页面', 4, 10, '#BBDEFB'),
        ('查看关键指标卡片\n了解产业总体情况', 6, 10, '#90CAF9'),
        ('查看统计图表\n了解产业分布特征', 8, 10, '#64B5F6'),
        ('识别异常情况和关注点', 6, 7.5, '#42A5F5'),
        ('进行深入分析\n数据下钻', 6, 5.5, '#2196F3'),
        ('获得产业态势洞察', 6, 3.5, '#1976D2'),
    ]

    # 绘制流程框
    for i, (step, x, y, color) in enumerate(steps):
        if i < 4:
            # 前四个步骤水平排列
            box = FancyBboxPatch((x-0.8, y-0.5), 1.6, 1,
                                boxstyle="round,pad=0.1",
                                facecolor=color,
                                edgecolor='#1565C0', linewidth=2, alpha=0.8)
            ax.add_patch(box)
            ax.text(x, y, step, ha='center', va='center',
                   fontsize=9, fontweight='bold')
        else:
            # 后面的步骤垂直排列，居中
            box = FancyBboxPatch((x-1.5, y-0.5), 3, 1,
                                boxstyle="round,pad=0.1",
                                facecolor=color,
                                edgecolor='#1565C0', linewidth=2, alpha=0.8)
            ax.add_patch(box)
            ax.text(x, y, step, ha='center', va='center',
                   fontsize=10, fontweight='bold')

    # 绘制流程箭头
    arrows = [
        (2.8, 10, 3.2, 10),      # 登录 -> 进入页面
        (4.8, 10, 5.2, 10),      # 进入 -> 查看指标
        (6.8, 10, 7.2, 10),      # 指标 -> 图表
        (8, 9.5, 6, 8.5),        # 图表 -> 识别异常
        (6, 7, 6, 6.5),          # 识别 -> 深入分析
        (6, 5, 6, 4.5),          # 分析 -> 洞察
    ]

    for x1, y1, x2, y2 in arrows:
        arrow = FancyArrowPatch((x1, y1), (x2, y2),
                              arrowstyle='->', mutation_scale=20,
                              linewidth=2, color='#1565C0')
        ax.add_patch(arrow)

    # 添加说明
    ax.text(6, 1.5, '业务流程：登录 → 浏览 → 查看指标 → 分析图表 → 识别异常 → 深入分析 → 获得洞察',
           ha='center', fontsize=10, style='italic', color='#666')
    ax.text(6, 0.8, '核心功能：数据可视化 | 多维度分析 | 下钻探索',
           ha='center', fontsize=9, style='italic', color='#999')

    save_figure(fig, '图2-1 产业态势感知业务流程图.png')


def create_data_processing_flow_diagram():
    """图2-2 数据处理业务流程图"""
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # 流程步骤
    steps = [
        ('数据获取\n从各数据源获取\n原始数据', 1, 6, '#E8F5E9'),
        ('数据清洗\n去除重复数据\n纠正错误数据', 3, 6, '#C8E6C9'),
        ('数据标准化\n统一数据格式\n编码规则', 5, 6, '#A5D6A7'),
        ('数据分类\n按标准进行\n企业分类', 7, 6, '#81C784'),
        ('数据审核\n审核数据质量', 9, 6, '#66BB6A'),
        ('数据入库\n导入系统数据', 11, 6, '#4CAF50'),
        ('数据发布\n更新系统数据', 13, 6, '#43A047'),
    ]

    # 绘制流程框
    for i, (step, x, y, color) in enumerate(steps):
        box = FancyBboxPatch((x-0.7, y-0.8), 1.4, 1.6,
                            boxstyle="round,pad=0.1",
                            facecolor=color,
                            edgecolor='#2E7D32', linewidth=2, alpha=0.8)
        ax.add_patch(box)
        ax.text(x, y, step, ha='center', va='center',
               fontsize=9, fontweight='bold')

    # 绘制流程箭头
    arrows = [
        (1.7, 6, 2.3, 6),      # 数据获取 → 数据清洗
        (3.7, 6, 4.3, 6),      # 数据清洗 → 数据标准化
        (5.7, 6, 6.3, 6),      # 数据标准化 → 数据分类
        (7.7, 6, 8.3, 6),      # 数据分类 → 数据审核
        (9.7, 6, 10.3, 6),     # 数据审核 → 数据入库
        (11.7, 6, 12.3, 6),    # 数据入库 → 数据发布
    ]

    for x1, y1, x2, y2 in arrows:
        arrow = FancyArrowPatch((x1, y1), (x2, y2),
                              arrowstyle='->', mutation_scale=20,
                              linewidth=2.5, color='#2E7D32')
        ax.add_patch(arrow)

    # 添加数据源标注
    ax.text(1, 4.2, '数据源:\n政府公开数据\n企业自主申报\n第三方数据服务',
           ha='center', fontsize=8, style='italic', color='#666',
           bbox=dict(boxstyle='round,pad=0.5', facecolor='#F1F8E9',
                    edgecolor='#8BC34A', alpha=0.7))

    # 添加系统标注
    ax.text(13, 4.2, '系统:\n企业展示系统',
           ha='center', fontsize=8, style='italic', color='#666',
           bbox=dict(boxstyle='round,pad=0.5', facecolor='#F1F8E9',
                    edgecolor='#8BC34A', alpha=0.7))

    # 添加说明
    ax.text(7, 2.5, '数据处理流程：获取 → 清洗 → 标准化 → 分类 → 审核 → 入库 → 发布',
           ha='center', fontsize=11, style='italic', color='#2E7D32', fontweight='bold')
    ax.text(7, 1.8, '核心目标：确保数据质量、时效性和一致性',
           ha='center', fontsize=9, style='italic', color='#666')

    save_figure(fig, '图2-2 数据处理业务流程图.png')


def create_dashboard_structure_diagram():
    """图2-4 产业数据看板模块功能结构图"""
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # 主模块框
    main_box = FancyBboxPatch((0.5, 8), 13, 1.5,
                              boxstyle="round,pad=0.1",
                              facecolor='#E3F2FD',
                              edgecolor='#1976D2', linewidth=3)
    ax.add_patch(main_box)
    ax.text(7, 8.75, '产业数据看板模块',
           ha='center', va='center', fontsize=14, fontweight='bold')

    # 连接线
    for i in range(6):
        x = 2.3 + i * 2
        ax.plot([7, x], [8, 6.5], color='#1976D2', linewidth=1.5, zorder=1)

    # 子功能框
    subfunctions = [
        ('企业列表\n展示', 1.3, 5.8, '#BBDEFB',
         ['表格展示\n分页支持\n排序功能\n列自定义']),
        ('企业搜索\n功能', 3.3, 5.8, '#BBDEFB',
         ['名称搜索\n代码搜索\n高级搜索\n历史记录']),
        ('多维度\n筛选', 5.3, 5.8, '#BBDEFB',
         ['区域筛选\n行业筛选\n领域筛选\n条件保存']),
        ('统计\n分析', 7.3, 5.8, '#BBDEFB',
         ['区域统计\n行业统计\n领域统计\n图表联动']),
        ('数据\n导出', 9.3, 5.8, '#BBDEFB',
         ['格式选择\n字段选择\n进度提示\n文件命名']),
        ('快速\n操作', 11.3, 5.8, '#BBDEFB',
         ['批量选择\n批量导出\n收藏企业\n对比企业']),
    ]

    for title, x, y, color, items in subfunctions:
        # 子功能标题框
        box = FancyBboxPatch((x-0.7, y-0.5), 1.4, 1,
                            boxstyle="round,pad=0.05",
                            facecolor=color,
                            edgecolor='#1976D2', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, title, ha='center', va='center',
               fontsize=10, fontweight='bold')

        # 子功能列表
        for i, item in enumerate(items):
            item_y = y - 0.8 - i * 0.5
            ax.text(x, item_y, f'● {item}',
                   ha='center', va='center', fontsize=8, color='#333')

    # 添加说明
    ax.text(7, 0.8, '核心功能：6大功能模块 | 24个子功能 | 全方位数据查询与分析',
           ha='center', fontsize=10, style='italic', color='#666',
           bbox=dict(boxstyle='round,pad=0.5', facecolor='#F5F5F5',
                    edgecolor='#999', alpha=0.8))

    save_figure(fig, '图2-4 产业数据看板模块功能结构图.png')


def create_industry_chain_structure_diagram():
    """图2-5 产业链图谱数据结构图"""
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')

    # 主标题框
    main_box = FancyBboxPatch((5, 7.5), 4, 0.8,
                              boxstyle="round,pad=0.1",
                              facecolor='#E8F5E9',
                              edgecolor='#2E7D32', linewidth=2.5)
    ax.add_patch(main_box)
    ax.text(7, 7.9, '产业链图谱数据结构',
           ha='center', va='center', fontsize=13, fontweight='bold', color='#2E7D32')

    # 三大核心结构
    structures = [
        ('数据层', 2.5, 6, '#C8E6C9',
         ['产业链定义', '企业关联', '统计数据']),
        ('节点层', 7, 6, '#A5D6A7',
         ['环节节点', '子环节节点', '企业节点']),
        ('关系层', 11.5, 6, '#81C784',
         ['上游关系', '下游关系', '关联关系']),
    ]

    for title, x, y, color, items in structures:
        # 主框
        box = FancyBboxPatch((x-1.5, y-0.5), 3, 1,
                            boxstyle="round,pad=0.1",
                            facecolor=color,
                            edgecolor='#2E7D32', linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, title, ha='center', va='center',
               fontsize=12, fontweight='bold', color='#1B5E20')

        # 子项
        for i, item in enumerate(items):
            item_y = y - 0.7 - i * 0.5
            sub_box = FancyBboxPatch((x-1.2, item_y-0.25), 2.4, 0.5,
                                    boxstyle="round,pad=0.05",
                                    facecolor='white',
                                    edgecolor='#2E7D32', linewidth=1, alpha=0.7)
            ax.add_patch(sub_box)
            ax.text(x, item_y, item, ha='center', va='center',
                   fontsize=9, color='#333')

    # 可视化映射
    ax.text(7, 3, '可视化属性映射',
           ha='center', fontsize=11, fontweight='bold',
           bbox=dict(boxstyle='round,pad=0.5', facecolor='#E3F2FD',
                    edgecolor='#1976D2', linewidth=1.5))

    mappings = [
        ('节点大小', 2.5, 2.2, '#64B5F6', '企业数量'),
        ('节点颜色', 5.5, 2.2, '#42A5F5', '完整度'),
        ('边的粗细', 8.5, 2.2, '#2196F3', '关联强度'),
        ('箭头方向', 11.5, 2.2, '#1E88E5', '上下游关系'),
    ]

    for title, x, y, color, desc in mappings:
        box = FancyBboxPatch((x-1.2, y-0.3), 2.4, 0.6,
                            boxstyle="round,pad=0.05",
                            facecolor=color,
                            edgecolor='#1976D2', linewidth=1.5, alpha=0.8)
        ax.add_patch(box)
        ax.text(x, y, title, ha='center', va='center',
               fontsize=9, fontweight='bold', color='white')
        ax.text(x, y-0.6, desc, ha='center', va='center',
               fontsize=8, color='#666')

    # 添加说明
    ax.text(7, 0.5, '核心要素：三层结构（数据+节点+关系） | 可视化映射（大小+颜色+粗细+方向）',
           ha='center', fontsize=9, style='italic', color='#2E7D32', fontweight='bold')

    save_figure(fig, '图2-5 产业链图谱数据结构图.png')


def create_enterprise_portrait_structure_diagram():
    """图2-6 企业画像信息架构图"""
    fig, ax = plt.subplots(figsize=(12, 10))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # 主模块框
    main_box = FancyBboxPatch((4, 8.5), 4, 1,
                              boxstyle="round,pad=0.1",
                              facecolor='#E3F2FD',
                              edgecolor='#1976D2', linewidth=2.5)
    ax.add_patch(main_box)
    ax.text(6, 9, '企业画像模块',
           ha='center', va='center', fontsize=13, fontweight='bold', color='#1976D2')

    # 连接线
    for i in range(7):
        x = 1.5 + i * 1.6
        ax.plot([6, x], [8.5, 7.5], color='#1976D2', linewidth=1.5, zorder=1)

    # 七大功能模块
    modules = [
        ('基本信息', 1.5, 7, '#BBDEFB',
         ['名称', '法人', '资本', '状态']),
        ('经营信息', 3.1, 7, '#BBDEFB',
         ['范围', '行业', '领域', '业务']),
        ('创新信息', 4.7, 7, '#BBDEFB',
         ['专利', '研发', '平台', '成果']),
        ('发展历程', 6.3, 7, '#BBDEFB',
         ['时间轴', '事件', '节点', '阶段']),
        ('关联推荐', 7.9, 7, '#BBDEFB',
         ['上下游', '同区域', '同行业', '投资']),
        ('企业对比', 9.5, 7, '#BBDEFB',
         ['多选对比', '多维分析', '可视化']),
        ('标注功能', 11.1, 7, '#BBDEFB',
         ['备注', '标签', '收藏']),
    ]

    for title, x, y, color, items in modules:
        # 标题框
        box = FancyBboxPatch((x-0.6, y-0.4), 1.2, 0.8,
                            boxstyle="round,pad=0.05",
                            facecolor=color,
                            edgecolor='#1976D2', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, title, ha='center', va='center',
               fontsize=9, fontweight='bold')

        # 子项
        for i, item in enumerate(items):
            item_y = y - 0.6 - i * 0.4
            ax.text(x, item_y, f'- {item}',
                   ha='center', va='center', fontsize=7, color='#333')

    # 添加说明
    ax.text(6, 0.5, '核心功能：7大模块 | 企业全景信息展示 | 深度分析工具',
           ha='center', fontsize=9, style='italic', color='#1976D2', fontweight='bold')

    save_figure(fig, '图2-6 企业画像信息架构图.png')


def create_innovation_ecosystem_diagram():
    """图2-7 创新生态模块功能分解图"""
    fig, ax = plt.subplots(figsize=(12, 9))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # 主模块框
    main_box = FancyBboxPatch((4, 8.5), 4, 1,
                              boxstyle="round,pad=0.1",
                              facecolor='#F3E5F5',
                              edgecolor='#7B1FA2', linewidth=2.5)
    ax.add_patch(main_box)
    ax.text(6, 9, '创新生态模块',
           ha='center', va='center', fontsize=13, fontweight='bold', color='#7B1FA2')

    # 连接线
    for i in range(4):
        x = 2 + i * 2.6
        ax.plot([6, x], [8.5, 7.5], color='#7B1FA2', linewidth=1.5, zorder=1)

    # 四大功能
    functions = [
        ('创新平台', 2, 7, '#E1BEE7',
         ['重点实验室', '工程中心', '企业中心', '服务平台']),
        ('创新成果', 4.6, 7, '#E1BEE7',
         ['获奖情况', '标准制定', '专利成果', '软著论文']),
        ('典型案例', 7.2, 7, '#E1BEE7',
         ['应用案例', '场景方案', '技术效果', '案例详情']),
        ('创新活动', 9.8, 7, '#E1BEE7',
         ['学术会议', '创新大赛', '展览活动']),
    ]

    for title, x, y, color, items in functions:
        # 标题框
        box = FancyBboxPatch((x-1.1, y-0.5), 2.2, 1,
                            boxstyle="round,pad=0.1",
                            facecolor=color,
                            edgecolor='#7B1FA2', linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, title, ha='center', va='center',
               fontsize=11, fontweight='bold', color='#4A148C')

        # 子项
        for i, item in enumerate(items):
            item_y = y - 0.8 - i * 0.5
            ax.text(x, item_y, f'- {item}',
                   ha='center', va='center', fontsize=8, color='#333')

    # 添加说明
    ax.text(6, 0.5, '核心功能：4大维度 | 展现创新活力 | 产业生态全景',
           ha='center', fontsize=9, style='italic', color='#7B1FA2', fontweight='bold')

    save_figure(fig, '图2-7 创新生态模块功能分解图.png')


def create_performance_metrics_diagram():
    """图2-10 系统性能指标分解图"""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 9)
    ax.axis('off')

    # 主标题框
    main_box = FancyBboxPatch((4.5, 7.5), 3, 0.8,
                              boxstyle="round,pad=0.1",
                              facecolor='#FFF3E0',
                              edgecolor='#F57C00', linewidth=2.5)
    ax.add_patch(main_box)
    ax.text(6, 7.9, '系统性能指标',
           ha='center', va='center', fontsize=13, fontweight='bold', color='#F57C00')

    # 三大性能类型
    perf_types = [
        ('响应时间', 2.5, 6, '#FFB74D',
         ['页面加载 < 2秒', '图表渲染 < 1秒', '搜索响应 < 500ms', '筛选响应 < 1秒']),
        ('并发性能', 6, 6, '#FFA726',
         ['支持100+并发', '响应稳定', '无延迟', '吞吐量充足']),
        ('数据容量', 9.5, 6, '#FF9800',
         ['2000+企业', '多维统计', '实时更新', '海量数据']),
    ]

    for title, x, y, color, items in perf_types:
        # 主框
        box = FancyBboxPatch((x-1.5, y-0.5), 3, 1,
                            boxstyle="round,pad=0.1",
                            facecolor=color,
                            edgecolor='#F57C00', linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, title, ha='center', va='center',
               fontsize=11, fontweight='bold', color='#E65100')

        # 子项
        for i, item in enumerate(items):
            item_y = y - 0.7 - i * 0.5
            ax.text(x, item_y, f'- {item}',
                   ha='center', va='center', fontsize=8, color='#333')

    # 添加说明
    ax.text(6, 0.5, '性能保障：快速响应 | 高并发支持 | 大数据容量',
           ha='center', fontsize=9, style='italic', color='#F57C00', fontweight='bold')

    save_figure(fig, '图2-10 系统性能指标分解图.png')


def create_dashboard_data_flow_diagram():
    """图3-9 产业数据看板数据流图（解决编号冲突）"""
    fig, ax = plt.subplots(figsize=(12, 7))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis('off')

    # 数据流节点
    nodes = [
        ('CSV数据', 1.5, 5.5, '#E3F2FD'),
        ('后端API', 3.8, 5.5, '#BBDEFB'),
        ('数据处理', 6.1, 5.5, '#90CAF9'),
        ('前端组件', 8.4, 5.5, '#64B5F6'),
        ('用户界面', 10.7, 5.5, '#42A5F5'),
    ]

    for title, x, y, color in nodes:
        box = FancyBboxPatch((x-0.7, y-0.4), 1.4, 0.8,
                            boxstyle="round,pad=0.08",
                            facecolor=color,
                            edgecolor='#1976D2', linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, title, ha='center', va='center',
               fontsize=10, fontweight='bold')

    # 箭头连接
    for i in range(len(nodes)-1):
        x1, y1 = nodes[i][1], nodes[i][2]
        x2, y2 = nodes[i+1][1], nodes[i+1][2]
        arrow = FancyArrowPatch((x1+0.7, y1), (x2-0.7, y2),
                              arrowstyle='->', mutation_scale=20,
                              linewidth=2.5, color='#1976D2')
        ax.add_patch(arrow)

    # 数据说明
    data_labels = [
        ('读取', 2.65, 6.2),
        ('调用', 4.95, 6.2),
        ('处理', 7.25, 6.2),
        ('渲染', 9.55, 6.2),
    ]

    for label, x, y in data_labels:
        ax.text(x, y, label, ha='center', fontsize=8, color='#666')

    # 底部说明
    ax.text(6, 1.5, '数据流向：CSV → API → 处理 → 组件 → 界面',
           ha='center', fontsize=10, style='italic', color='#1976D2', fontweight='bold')

    save_figure(fig, '图3-9 产业数据看板数据流图.png')


def create_industry_chain_relation_diagram():
    """图3-10 产业链图谱关系图（解决编号冲突）"""
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 9)
    ax.axis('off')

    # 产业链层级
    layers = [
        ('上游环节', 5, 7.5, '#C8E6C9'),
        ('中游环节', 5, 5.5, '#A5D6A7'),
        ('下游环节', 5, 3.5, '#81C784'),
    ]

    for title, x, y, color in layers:
        box = FancyBboxPatch((x-2, y-0.5), 4, 1,
                            boxstyle="round,pad=0.1",
                            facecolor=color,
                            edgecolor='#2E7D32', linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, title, ha='center', va='center',
               fontsize=11, fontweight='bold', color='#1B5E20')

    # 垂直箭头
    arrows = [(5, 7, 5, 6.2), (5, 5, 5, 4.2)]
    for x1, y1, x2, y2 in arrows:
        arrow = FancyArrowPatch((x1, y1), (x2, y2),
                              arrowstyle='->', mutation_scale=25,
                              linewidth=3, color='#2E7D32')
        ax.add_patch(arrow)

    # 节点说明
    nodes = [
        ('节点：产业链环节', 3, 7.5),
        ('节点：制造加工', 3, 5.5),
        ('节点：应用服务', 3, 3.5),
    ]

    for label, x, y in nodes:
        ax.text(x, y, label, ha='center', fontsize=8, color='#333')

    # 关系说明
    ax.text(7, 6.5, '关系：\n上下游\n连接', ha='center', fontsize=9,
           bbox=dict(boxstyle='round,pad=0.5', facecolor='#E8F5E9',
                    edgecolor='#2E7D32', linewidth=1))

    # 底部说明
    ax.text(5, 1.5, '核心结构：三层产业链 | 节点+关系 | 可视化展示',
           ha='center', fontsize=9, style='italic', color='#2E7D32', fontweight='bold')

    save_figure(fig, '图3-10 产业链图谱关系图.png')


def create_dev_environment_diagram():
    """图4-7 开发环境架构图（解决编号冲突）"""
    fig, ax = plt.subplots(figsize=(12, 7))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis('off')

    # 环境层级
    env_layers = [
        ('前端开发环境', 2.5, 5.5, '#E3F2FD',
         ['Node.js 18+', 'npm/pnpm', 'Vite', 'React 18']),
        ('后端开发环境', 6, 5.5, '#C8E6C9',
         ['Python 3.9+', 'FastAPI', 'Uvicorn', 'Pandas']),
        ('运行环境', 9.5, 5.5, '#FFF3E0',
         ['Chrome浏览器', '现代浏览器', '响应式设计']),
    ]

    for title, x, y, color, items in env_layers:
        # 主框
        box = FancyBboxPatch((x-1.5, y-0.5), 3, 1,
                            boxstyle="round,pad=0.1",
                            facecolor=color,
                            edgecolor='#1976D2', linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, title, ha='center', va='center',
               fontsize=10, fontweight='bold')

        # 子项
        for i, item in enumerate(items):
            item_y = y - 0.7 - i * 0.45
            ax.text(x, item_y, f'- {item}',
                   ha='center', va='center', fontsize=8, color='#333')

    # 开发工具
    tools = ['VS Code', 'Git', 'Chrome DevTools']
    for i, tool in enumerate(tools):
        x = 3 + i * 3
        box = FancyBboxPatch((x-1, 2), 2, 0.6,
                            boxstyle="round,pad=0.08",
                            facecolor='#F5F5F5',
                            edgecolor='#666', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, 2.3, tool, ha='center', va='center',
               fontsize=9, fontweight='bold', color='#333')

    # 底部说明
    ax.text(6, 0.5, '开发环境：前端+后端+工具 | 高效开发 | 调试支持',
           ha='center', fontsize=9, style='italic', color='#1976D2', fontweight='bold')

    save_figure(fig, '图4-7 开发环境架构图.png')


def create_frontend_component_hierarchy_diagram():
    """图4-8 前端组件层次结构图（解决编号冲突）"""
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 9)
    ax.axis('off')

    # 组件层级（树状结构）
    levels = [
        ('App\n(根组件)', 5, 7.5, '#E3F2FD', 15),
        ('路由\nRouter', 5, 6.2, '#BBDEFB', 12),
        ('布局\nLayout', 2.5, 4.8, '#90CAF9', 10),
        ('页面\nPages', 5, 4.8, '#90CAF9', 10),
        ('组件\nComponents', 7.5, 4.8, '#90CAF9', 10),
    ]

    for title, x, y, color, size in levels:
        circle = Circle((x, y), size/10,
                       facecolor=color, edgecolor='#1976D2',
                       linewidth=2, zorder=2)
        ax.add_patch(circle)
        ax.text(x, y, title, ha='center', va='center',
               fontsize=7, fontweight='bold')

    # 连接线
    connections = [
        (5, 7.5, 5, 6.2),      # App -> Router
        (5, 6.2, 2.5, 4.8),    # Router -> Layout
        (5, 6.2, 5, 4.8),      # Router -> Pages
        (5, 6.2, 7.5, 4.8),    # Router -> Components
    ]

    for x1, y1, x2, y2 in connections:
        line = FancyArrowPatch((x1, y1), (x2, y2),
                              arrowstyle='->', mutation_scale=15,
                              linewidth=1.5, color='#1976D2', zorder=1)
        ax.add_patch(line)

    # 底部说明
    ax.text(5, 0.5, '组件结构：树状层次 | 路由管理 | 模块化设计',
           ha='center', fontsize=9, style='italic', color='#1976D2', fontweight='bold')

    save_figure(fig, '图4-8 前端组件层次结构图.png')


def create_test_flow_diagram():
    """图5-4 测试流程图（解决编号冲突）"""
    fig, ax = plt.subplots(figsize=(11, 6))
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 7)
    ax.axis('off')

    # 测试流程步骤
    steps = [
        ('需求分析', 1.5, 4.5, '#E8F5E9'),
        ('测试计划', 3, 4.5, '#C8E6C9'),
        ('测试设计', 4.5, 4.5, '#A5D6A7'),
        ('测试执行', 6, 4.5, '#81C784'),
        ('结果分析', 7.5, 4.5, '#66BB6A'),
        ('缺陷修复', 9, 4.5, '#4CAF50'),
        ('测试报告', 9, 3, '#43A047'),
    ]

    for title, x, y, color in steps:
        box = FancyBboxPatch((x-0.6, y-0.35), 1.2, 0.7,
                            boxstyle="round,pad=0.08",
                            facecolor=color,
                            edgecolor='#2E7D32', linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, title, ha='center', va='center',
               fontsize=9, fontweight='bold', color='#1B5E20')

    # 箭头连接
    arrows = [
        (2.1, 4.5, 2.4, 4.5),
        (3.6, 4.5, 3.9, 4.5),
        (5.1, 4.5, 5.4, 4.5),
        (6.6, 4.5, 6.9, 4.5),
        (8.1, 4.5, 8.4, 4.5),
        (9, 4.15, 9, 3.35),  # 垂直箭头
    ]

    for x1, y1, x2, y2 in arrows:
        arrow = FancyArrowPatch((x1, y1), (x2, y2),
                              arrowstyle='->', mutation_scale=18,
                              linewidth=2, color='#2E7D32')
        ax.add_patch(arrow)

    # 底部说明
    ax.text(5.5, 0.5, '测试流程：需求→计划→设计→执行→分析→修复→报告',
           ha='center', fontsize=9, style='italic', color='#2E7D32', fontweight='bold')

    save_figure(fig, '图5-4 测试流程图.png')


def create_dual_mode_comparison():
    """图3-7 双模界面样式对比图"""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

    # V1模式
    ax1.set_xlim(0, 6)
    ax1.set_ylim(0, 6)
    ax1.axis('off')
    ax1.set_title('V1经典管理模式', fontsize=14, fontweight='bold', pad=10)

    # V1界面元素
    elements_v1 = [
        (0.5, 5, 5, 0.4, '#1976D2', 'Header'),
        (0.5, 3.5, 1.2, 2.3, '#E3F2FD', 'Sidebar'),
        (2, 3.5, 3.8, 2.3, '#F5F5F5', 'Content'),
        (2.2, 4.5, 1.6, 0.8, 'white', 'Card 1'),
        (4, 4.5, 1.6, 0.8, 'white', 'Card 2'),
        (2.2, 5.5, 1.6, 0.8, 'white', 'Card 3'),
        (4, 5.5, 1.6, 0.8, 'white', 'Card 4'),
    ]

    for x, y, w, h, color, label in elements_v1:
        rect = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0",
                             facecolor=color, edgecolor='#1976D2',
                             linewidth=1.5, alpha=0.8)
        ax1.add_patch(rect)
        ax1.text(x+w/2, y+h/2, label, ha='center', va='center',
                fontsize=8)

    # V1特点标注
    ax1.text(3, 0.5, '特点：容器化布局 | 紧凑间距 | 小圆角',
           ha='center', fontsize=9, style='italic', color='#666')

    # V2模式
    ax2.set_xlim(0, 6)
    ax2.set_ylim(0, 6)
    ax2.axis('off')
    ax2.set_title('V2现代体验模式', fontsize=14, fontweight='bold', pad=10)

    # V2界面元素
    elements_v2 = [
        (0.5, 5, 5, 0.5, '#7B1FA2', 'Header'),
        (0.8, 3.8, 4.4, 2.5, '#F3E5F5', 'Content'),
        (1, 4.3, 1.7, 0.9, 'white', 'Card 1'),
        (3.3, 4.3, 1.7, 0.9, 'white', 'Card 2'),
        (1, 5.3, 1.7, 0.9, 'white', 'Card 3'),
        (3.3, 5.3, 1.7, 0.9, 'white', 'Card 4'),
    ]

    for x, y, w, h, color, label in elements_v2:
        rect = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1",
                            facecolor=color, edgecolor='#7B1FA2',
                            linewidth=1.5, alpha=0.6)
        ax2.add_patch(rect)
        ax2.text(x+w/2, y+h/2, label, ha='center', va='center',
                fontsize=8)

    # V2特点标注
    ax2.text(3, 0.5, '特点：去容器化 | 宽松间距 | 大圆角',
           ha='center', fontsize=9, style='italic', color='#666')

    plt.tight_layout()

    # 保存图片
    filepath = os.path.join(IMAGE_DIR, '图3-7 双模界面样式对比图.png')
    fig.savefig(filepath, dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close(fig)
    print(f"[OK] 已生成: 图3-7 双模界面样式对比图.png")


def create_switch_flow_diagram():
    """图4-5 双模界面切换流程图"""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # 切换步骤
    steps = [
        ('用户点击\n切换按钮', 1, 8, '#E1BEE7'),
        ('更新mode状态\n(toggleMode)', 3, 8, '#CE93D8'),
        ('保存到\nlocalStorage', 5, 8, '#BA68C8'),
        ('更新DOM属性\n(data-mode)', 7, 8, '#AB47BC'),
        ('CSS变量\n重新计算', 9, 8, '#9C27B0'),
        ('组件重新渲染', 5, 6, '#8E24AA'),
        ('界面样式更新', 5, 4.5, '#7B1FA2'),
    ]

    # 绘制步骤框
    for step, x, y, color in steps:
        box = FancyBboxPatch((x, y-0.5), 1.8, 1,
                            boxstyle="round,pad=0.1",
                            facecolor=color,
                            edgecolor='#6A1B9A', linewidth=2, alpha=0.7)
        ax.add_patch(box)
        ax.text(x + 0.9, y, step, ha='center', va='center',
               fontsize=9, fontweight='bold')

    # 绘制流程箭头
    arrows = [(1+1.8, 8, 3, 8), (3+1.8, 8, 5, 8), (5+1.8, 8, 7, 8),
              (7+1.8, 8, 9, 8), (9, 7.5, 5.9, 7), (5, 5.5, 5, 5.5)]

    for x1, y1, x2, y2 in arrows:
        arrow = FancyArrowPatch((x1, y1), (x2, y2),
                              arrowstyle='->', mutation_scale=20,
                              linewidth=2, color='#6A1B9A')
        ax.add_patch(arrow)

    # 添加说明
    ax.text(6, 2, '切换流程：点击 → 状态更新 → 持久化 → DOM更新 → CSS重算 → 渲染',
           ha='center', fontsize=10, style='italic', color='#666')
    ax.text(6, 1.5, '技术实现：React Context + CSS Variables + useEffect',
           ha='center', fontsize=9, style='italic', color='#999')

    save_figure(fig, '图4-5 双模界面切换流程图.png')


def create_chart_linkage_diagram():
    """图4-6 图表联动筛选时序图"""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # 参与者
    actors = [
        ('用户', 1),
        ('图表A', 4),
        ('图表B', 8),
        ('数据源', 11),
    ]

    for actor, x in actors:
        ax.axvline(x=x, ymin=0.1, ymax=0.95, color='#999',
                 linewidth=2, linestyle='--')
        ax.text(x, 9.5, actor, ha='center', fontsize=11,
               fontweight='bold', bbox=dict(boxstyle='round,pad=0.5',
                                             facecolor='#FFECB3'))

    # 时序步骤
    sequences = [
        ('点击图表元素', 1, 4, 8),
        ('触发onClick事件', 4, 4, 7),
        ('更新筛选状态', 4, 8, 6),
        ('重新请求数据', 8, 11, 5),
        ('返回筛选后数据', 11, 8, 4),
        ('更新图表显示', 8, 8, 3),
        ('高亮关联数据', 8, 4, 2),
    ]

    for label, x1, x2, y in sequences:
        arrow = FancyArrowPatch((x1, y), (x2, y),
                              arrowstyle='->', mutation_scale=15,
                              linewidth=2, color='#FF9800',
                              connectionstyle="arc3,rad=0")
        ax.add_patch(arrow)
        ax.text((x1+x2)/2, y+0.3, label, ha='center', fontsize=9)

    # 添加说明
    ax.text(6, 1, '联动机制：点击 → 事件 → 状态 → 数据请求 → 更新显示',
           ha='center', fontsize=10, style='italic', color='#666')

    save_figure(fig, '图4-6 图表联动筛选时序图.png')


def create_test_results_chart():
    """图5-1 功能测试用例执行结果图"""
    fig, ax = plt.subplots(figsize=(10, 6))

    modules = ['战略\n情报', '数据\n看板', '产业链\n图谱', '企业\n画像',
              '创新\n生态', '算力\n基建', '区域\n矩阵', '双模\n切换', '交互\n功能']
    passed = [5, 7, 5, 5, 4, 3, 4, 5, 6]

    x = np.arange(len(modules))
    width = 0.6

    bars = ax.bar(x, passed, width, color='#4CAF50', alpha=0.8,
                 edgecolor='#2E7D32', linewidth=2)

    # 添加数值标签
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 0.1,
               f'{int(height)}', ha='center', va='bottom',
               fontsize=10, fontweight='bold')

    ax.set_xlabel('功能模块', fontsize=12, fontweight='bold')
    ax.set_ylabel('测试用例数', fontsize=12, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(modules, fontsize=10)
    ax.set_ylim(0, 9)
    ax.grid(axis='y', alpha=0.3, linestyle='--')

    # 添加统计信息
    total = sum(passed)
    ax.text(0.98, 0.95, f'总计: {total}个用例\n通过率: 100%',
           transform=ax.transAxes, ha='right', va='top',
           fontsize=11, bbox=dict(boxstyle='round,pad=0.5',
                                   facecolor='#E8F5E9', edgecolor='#4CAF50'))

    plt.tight_layout()

    filepath = os.path.join(IMAGE_DIR, '图5-1 功能测试用例执行结果图.png')
    fig.savefig(filepath, dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close(fig)
    print(f"[OK] 已生成: 图5-1 功能测试用例执行结果图.png")


def create_response_time_chart():
    """图5-2 响应时间测试结果折线图"""
    fig, ax = plt.subplots(figsize=(10, 6))

    metrics = ['首页\n加载', '看板\n加载', '图谱\n加载', '画像\n加载',
              '企业\n查询', '统计\n接口', '搜索\n接口']
    values = [1800, 1500, 2000, 1200, 120, 200, 150]
    threshold = [2000, 2000, 2000, 2000, 500, 500, 500]  # 阈值

    x = np.arange(len(metrics))

    # 绘制实际值
    line1, = ax.plot(x, values, 'o-', linewidth=2.5, markersize=8,
                    color='#2196F3', label='实际响应时间')

    # 绘制阈值线
    line2, = ax.plot(x, threshold, '--', linewidth=2, markersize=6,
                    color='#FF5722', label='性能阈值')

    # 填充区域
    ax.fill_between(x, 0, threshold, alpha=0.1, color='#4CAF50')

    # 添加数值标签
    for i, (actual, thresh) in enumerate(zip(values, threshold)):
        color = '#2E7D32' if actual <= thresh else '#C62828'
        ax.text(i, actual + 100, f'{actual}ms', ha='center',
               fontsize=9, fontweight='bold', color=color)

    ax.set_xlabel('测试项目', fontsize=12, fontweight='bold')
    ax.set_ylabel('响应时间 (ms)', fontsize=12, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(metrics, fontsize=10)
    ax.legend(loc='upper right', fontsize=10)
    ax.grid(axis='both', alpha=0.3, linestyle='--')
    ax.set_ylim(0, 2500)

    # 添加说明
    ax.text(0.98, 0.05, '[OK] 所有测试项均达到性能要求',
           transform=ax.transAxes, ha='right', va='bottom',
           fontsize=10, bbox=dict(boxstyle='round,pad=0.5',
                                   facecolor='#E8F5E9', edgecolor='#4CAF50'))

    plt.tight_layout()

    filepath = os.path.join(IMAGE_DIR, '图5-2 响应时间测试结果折线图.png')
    fig.savefig(filepath, dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close(fig)
    print(f"[OK] 已生成: 图5-2 响应时间测试结果折线图.png")


def create_concurrent_performance_chart():
    """图5-3 并发性能测试结果图"""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

    concurrent = [10, 30, 50, 100]
    response_time = [95, 150, 220, 450]
    throughput = [9.8, 28.5, 45.2, 78.6]

    # 左图：响应时间
    bars1 = ax1.bar(concurrent, response_time, width=8,
                    color='#FF9800', alpha=0.8, edgecolor='#F57C00', linewidth=2)

    for bar, time in zip(bars1, response_time):
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height + 10,
                f'{time}ms', ha='center', va='bottom',
                fontsize=10, fontweight='bold')

    ax1.set_xlabel('并发用户数', fontsize=12, fontweight='bold')
    ax1.set_ylabel('平均响应时间 (ms)', fontsize=12, fontweight='bold')
    ax1.set_title('响应时间 vs 并发数', fontsize=12, fontweight='bold')
    ax1.grid(axis='y', alpha=0.3, linestyle='--')
    ax1.set_xlim(0, 120)

    # 右图：吞吐量
    bars2 = ax2.bar(concurrent, throughput, width=8,
                    color='#4CAF50', alpha=0.8, edgecolor='#2E7D32', linewidth=2)

    for bar, value in zip(bars2, throughput):
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., height + 1,
                f'{value}', ha='center', va='bottom',
                fontsize=10, fontweight='bold')

    ax2.set_xlabel('并发用户数', fontsize=12, fontweight='bold')
    ax2.set_ylabel('吞吐量 (请求/秒)', fontsize=12, fontweight='bold')
    ax2.set_title('吞吐量 vs 并发数', fontsize=12, fontweight='bold')
    ax2.grid(axis='y', alpha=0.3, linestyle='--')
    ax2.set_xlim(0, 120)

    plt.suptitle('图5-3 并发性能测试结果', fontsize=14, fontweight='bold', y=1.02)
    plt.tight_layout()

    filepath = os.path.join(IMAGE_DIR, '图5-3 并发性能测试结果图.png')
    fig.savefig(filepath, dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close(fig)
    print(f"[OK] 已生成: 图5-3 并发性能测试结果图.png")


def create_industry_chain_heatmap():
    """区域-产业矩阵热力图"""
    fig, ax = plt.subplots(figsize=(10, 8))

    # 模拟数据
    regions = ['武汉市', '宜昌市', '襄阳市', '黄石市', '荆州市']
    industries = ['智能芯片', '算法服务', '智能应用', '算力设施', '数据要素']

    data = np.array([
        [120, 85, 95, 65, 75],
        [35, 28, 42, 25, 30],
        [38, 45, 52, 30, 28],
        [25, 20, 35, 22, 18],
        [30, 25, 40, 28, 25],
    ])

    # 绘制热力图
    im = ax.imshow(data, cmap='YlOrRd', aspect='auto')

    # 设置刻度
    ax.set_xticks(np.arange(len(industries)))
    ax.set_yticks(np.arange(len(regions)))
    ax.set_xticklabels(industries, fontsize=10)
    ax.set_yticklabels(regions, fontsize=10)

    # 旋转x轴标签
    plt.setp(ax.get_xticklabels(), rotation=45, ha="right", rotation_mode="anchor")

    # 添加数值标注
    for i in range(len(regions)):
        for j in range(len(industries)):
            text = ax.text(j, i, data[i, j],
                         ha="center", va="center", color="black", fontsize=9)

    # 添加颜色条
    cbar = plt.colorbar(im, ax=ax)
    cbar.set_label('企业数量', rotation=270, labelpad=15, fontsize=11)

    ax.set_xlabel('产业类别', fontsize=12, fontweight='bold')
    ax.set_ylabel('区域', fontsize=12, fontweight='bold')

    plt.tight_layout()

    filepath = os.path.join(IMAGE_DIR, '图3-7 区域-产业矩阵热力图示例.png')
    fig.savefig(filepath, dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close(fig)
    print(f"[OK] 已生成: 图3-7 区域-产业矩阵热力图示例.png")


def main():
    """生成所有图片"""
    print("=" * 60)
    print("开始生成论文图片...")
    print("=" * 60)
    print()

    # 第2章图片
    print("【第2章 系统需求分析】")
    create_industry_situation_flow_diagram()
    create_data_processing_flow_diagram()
    create_dashboard_structure_diagram()
    create_industry_chain_structure_diagram()
    create_enterprise_portrait_structure_diagram()
    create_innovation_ecosystem_diagram()
    create_performance_metrics_diagram()
    print()

    # 第3章图片
    print("【第3章 系统设计】")
    create_architecture_diagram()
    create_frontend_architecture()
    create_backend_architecture()
    create_module_structure()
    create_data_flow_diagram()
    create_api_sequence_diagram()
    create_dual_mode_comparison()
    create_industry_chain_heatmap()
    create_dashboard_data_flow_diagram()
    create_industry_chain_relation_diagram()
    print()

    # 第4章图片
    print("【第4章 系统实现】")
    create_dev_environment_diagram()
    create_frontend_component_hierarchy_diagram()
    create_switch_flow_diagram()
    create_chart_linkage_diagram()
    print()

    # 第5章图片
    print("【第5章 系统测试】")
    create_test_flow_diagram()
    create_test_results_chart()
    create_response_time_chart()
    create_concurrent_performance_chart()
    print()

    print("=" * 60)
    print(f"[OK] 所有图片已生成完成！")
    print(f"[OK] 图片保存位置: {os.path.abspath(IMAGE_DIR)}")
    print("=" * 60)


if __name__ == '__main__':
    main()
