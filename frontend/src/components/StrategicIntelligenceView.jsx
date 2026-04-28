import React from 'react';
import { Card, Tag, Typography, Row, Col, Statistic, Divider, ConfigProvider, Timeline } from 'antd';
import { RocketOutlined, TrophyOutlined, BankOutlined, CloudServerOutlined, RobotOutlined, CarOutlined, DesktopOutlined, MobileOutlined, MedicineBoxOutlined, TeamOutlined, ReadOutlined } from '@ant-design/icons';
import { TOKENS } from '../theme';
import { useUiMode } from '../context/UiModeContext';

const { Title, Text, Paragraph } = Typography;

const StrategicIntelligenceView = () => {
    const { mode } = useUiMode();
    const isEditorial = mode === 'v2_editorial';
    // Strategic Targets (from Data_All.md & mita_data.md)
    const targets = [
        { title: '产业总体规模', value: '> 1000', suffix: '亿元', icon: <RocketOutlined />, color: '#3B82F6', desc: '确认突破千亿大关，包含核心与相关产业' },
        { title: '企业总量', value: '1326', suffix: '家', icon: <BankOutlined />, color: '#10B981', desc: '同比增长33.3%，形成千家企业集群' },
        { title: '算力规模', value: '5', suffix: 'EFLOPS', icon: <CloudServerOutlined />, color: '#8B5CF6', desc: '高性能算力超4.5 EFLOPS，智算超4.1 EFLOPS' },
        { title: '全国排名', value: 'No.4', suffix: '', icon: <TrophyOutlined />, color: '#F59E0B', desc: '福布斯AI 50强企业数仅次于京沪深' },
    ];

    // Key Enterprises Matrix (from qwen.md & Data_All.md)
    const enterpriseMatrix = [
        { category: 'AI + 机器人', companies: ['优必选 (人形机器人基地)', '科大讯飞 (服务机器人)'], icon: <RobotOutlined /> },
        { category: 'AI + 汽车', companies: ['东风汽车 (领航辅助驾驶)', '百度Apollo (Robotaxi)', '黑芝麻智能 (自动驾驶芯片)'], icon: <CarOutlined /> },
        { category: 'AI + PC/服务器', companies: ['长江计算 (AI加速服务器)', '联想武汉基地', '小米武汉总部'], icon: <DesktopOutlined /> },
        { category: 'AI + 手机/终端', companies: ['小米 (端侧大模型)', '摩托罗拉', '华中科技大学 (AR眼镜)'], icon: <MobileOutlined /> },
        { category: '智慧医疗', companies: ['兰丁智能 (宫颈癌筛查)', '联影医疗 (AI医学影像)'], icon: <MedicineBoxOutlined /> },
        { category: '基础软硬件', companies: ['长飞光纤 (光通信)', '达梦数据库 (图数据库)', '华工科技 (光模块)'], icon: <CloudServerOutlined /> },
    ];

    // Policy & Milestones (from mita_data.md)
    const milestones = [
        { date: '2022.03', content: '《湖北省人工智能产业"十四五"发展规划》发布，确立千亿目标。' },
        { date: '2024.02', content: '中国电信中部智算中心投运，初始算力2000P。' },
        { date: '2025.02', content: '发布《武汉市促进人工智能产业发展若干政策措施》（“人工智能十条”），设立算力券。' },
        { date: '2025.03', content: '发布《武汉市2025年人工智能产业发展行动方案》，确立“智能体”为核心抓手。' },
        { date: '2025.03', content: '全国首个医疗数据“资产入表+信贷融资”试点落地，7家企业获授信1.26亿元。' },
        { date: '2025.09', content: '工信部公示卓越级智能工厂名单，武汉5家入选，数量全省第一。' },
        { date: '2025.12', content: '全市算力规模达5 EFLOPS，智能算力平均利用率达74%。' },
    ];

    return (
        <ConfigProvider theme={{ token: { colorPrimary: isEditorial ? '#111827' : '#3B82F6' } }}>
            <div style={{ padding: 'var(--ui-page-padding)', animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{ maxWidth: 'var(--ui-page-width)', margin: '0 auto' }}>
                    
                    {/* Header */}
                    <div style={{ marginBottom: '32px' }}>
                        <h1 className="page-title"><RocketOutlined /> 战略情报看板（2025）</h1>
                        <p className="page-subtitle">基于权威产业报告的战略目标、企业生态与政策里程碑追踪</p>
                    </div>

                    {/* Strategic Targets */}
                    <Title level={4} style={{ marginBottom: '16px' }}>核心战略指标</Title>
                    <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                        {targets.map((item, idx) => (
                            <Col xs={24} sm={12} md={6} key={idx}>
                                <Card bordered={false} style={{ borderRadius: '12px', boxShadow: TOKENS.shadows.card, height: '100%' }}>
                                    <Statistic 
                                        title={<span>{item.icon} {item.title}</span>}
                                        value={item.value} 
                                        suffix={item.suffix}
                                        valueStyle={{ color: item.color, fontWeight: 800, fontSize: '28px' }}
                                    />
                                    <div style={{ marginTop: '8px', color: TOKENS.colors.textSecondary, fontSize: '12px' }}>
                                        {item.desc}
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Row gutter={[24, 24]}>
                        {/* Enterprise Matrix */}
                        <Col xs={24} lg={14}>
                            <Card 
                                title={<span><TeamOutlined /> 重点赛道与标杆企业矩阵</span>}
                                bordered={false} 
                                style={{ borderRadius: '12px', boxShadow: TOKENS.shadows.card, height: '100%' }}
                            >
                                <Row gutter={[16, 16]}>
                                    {enterpriseMatrix.map((item, idx) => (
                                        <Col span={12} key={idx} style={{ marginBottom: '16px' }}>
                                            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: TOKENS.colors.primary }}>
                                                {item.icon} {item.category}
                                            </div>
                                            <div>
                                                {item.companies.map((company, cIdx) => (
                                                    <Tag key={cIdx} color="blue" style={{ marginBottom: '4px' }}>{company}</Tag>
                                                ))}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        </Col>

                        {/* Policy Timeline */}
                        <Col xs={24} lg={10}>
                            <Card 
                                title={<span><ReadOutlined /> 政策与里程碑 (2024-2025)</span>}
                                bordered={false} 
                                style={{ borderRadius: '12px', boxShadow: TOKENS.shadows.card, height: '100%' }}
                            >
                                <Timeline
                                    mode="left"
                                    items={milestones.map(m => ({
                                        color: 'blue',
                                        label: m.date,
                                        children: m.content
                                    }))}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Infrastructure Highlights */}
                    <div style={{ marginTop: '32px' }}>
                        <Card bordered={false} style={{ borderRadius: '12px', boxShadow: TOKENS.shadows.card, background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)', color: '#fff' }}>
                            <Row align="middle" gutter={24}>
                                <Col xs={24} md={16}>
                                    <Title level={3} style={{ color: '#fff', margin: 0 }}>基础设施新高地："万P"算力集群</Title>
                                    <Paragraph style={{ color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
                                        截至2025年底，武汉已建成 <strong>8家智算中心 + 2家超算中心</strong>，总算力规模达 <strong>5 EFLOPS</strong>。
                                        其中，中国移动智算中心(2.2 EFLOPS)与中国电信中部智算中心(2 EFLOPS)构成双核心引擎，智能算力利用率突破 <strong>74%</strong>。
                                    </Paragraph>
                                </Col>
                                <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                                    <Tag color="#10B981" style={{ fontSize: '14px', padding: '6px 12px' }}>智算占比 &gt; 80%</Tag>
                                    <Tag color="#3B82F6" style={{ fontSize: '14px', padding: '6px 12px' }}>中部第一</Tag>
                                </Col>
                            </Row>
                        </Card>
                    </div>

                </div>
            </div>
        </ConfigProvider>
    );
};

export default StrategicIntelligenceView;
