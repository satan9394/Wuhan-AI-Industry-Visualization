import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Tag, Typography, Carousel } from 'antd';
import { TrophyOutlined, ExperimentOutlined, TeamOutlined, GlobalOutlined, RocketOutlined } from '@ant-design/icons';
import { TOKENS } from '../theme';
import { fetchInnovationStats } from '../api';

const { Title, Text, Paragraph } = Typography;

const InnovationView = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const statsData = await fetchInnovationStats();
                setStats(statsData);
            } catch (error) {
                console.error("Failed to load innovation data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div style={{ padding: 24 }}>创新生态数据加载中...</div>;

    return (
        <div style={{ padding: 'var(--ui-page-padding)', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ maxWidth: 'var(--ui-page-width)', margin: '0 auto' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 className="page-title">创新策源与生态构建</h1>
                    <p className="page-subtitle">全球第六人才高地 · 41家重点实验室 · 全域应用场景</p>
                </div>

                {/* 1. Top Stats Cards */}
                <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} style={{ height: '100%', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', color: '#fff' }}>
                            <Statistic 
                                title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>全球人才黏性排名</span>}
                                value={stats?.rankings?.talent_global || 6}
                                prefix={<GlobalOutlined />}
                                valueStyle={{ color: '#fff', fontWeight: 'bold' }}
                                suffix="位"
                            />
                            <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>来源: 北京人才发展战略研究院</div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} style={{ height: '100%', borderRadius: '12px', background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: '#fff' }}>
                            <Statistic 
                                title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>福布斯中国AI企业榜</span>}
                                value={stats?.rankings?.forbes_china || 4}
                                prefix={<TrophyOutlined />}
                                valueStyle={{ color: '#fff', fontWeight: 'bold' }}
                                suffix="位"
                            />
                            <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>仅次于京沪深</div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} style={{ height: '100%', borderRadius: '12px', boxShadow: TOKENS.shadows.card }}>
                            <Statistic 
                                title="全国重点实验室"
                                value={stats?.resources?.key_labs || 41}
                                prefix={<ExperimentOutlined style={{ color: TOKENS.colors.success }}/>}
                                suffix="家"
                            />
                            <Text type="secondary" style={{ fontSize: 12 }}>原始创新策源地</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} style={{ height: '100%', borderRadius: '12px', boxShadow: TOKENS.shadows.card }}>
                            <Statistic 
                                title="高新技术企业"
                                value={stats?.resources?.high_tech_enterprises || 1017}
                                prefix={<TeamOutlined style={{ color: TOKENS.colors.warning }}/>}
                                suffix="家"
                            />
                            <Text type="secondary" style={{ fontSize: 12 }}>产业创新主力军</Text>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    {/* 2. Enterprise Ecosystem Structure */}
                    <Col xs={24} lg={14}>
                        <Card 
                            title={<Title level={4} style={{ margin: 0 }}>企业生态结构 ("金字塔"型)</Title>}
                            bordered={false}
                            style={{ borderRadius: '12px', height: '100%', boxShadow: TOKENS.shadows.card }}
                        >
                            <Row gutter={[24, 24]}>
                                <Col span={12}>
                                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', height: '100%' }}>
                                        <Text strong style={{ display: 'block', marginBottom: '16px' }}>规模结构分布</Text>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: '#e0f2fe', borderRadius: '8px', borderLeft: '4px solid #0284c7' }}>
                                                <Text>大型企业</Text>
                                                <Tag color="blue">5.4%</Tag>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: '#e0f2fe', borderRadius: '8px', borderLeft: '4px solid #38bdf8', opacity: 0.9 }}>
                                                <Text>中型企业</Text>
                                                <Tag color="cyan">26.5%</Tag>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: '#e0f2fe', borderRadius: '8px', borderLeft: '4px solid #7dd3fc', opacity: 0.8 }}>
                                                <Text>小型企业</Text>
                                                <Tag color="cyan">56.5%</Tag>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: '#e0f2fe', borderRadius: '8px', borderLeft: '4px solid #bae6fd', opacity: 0.7 }}>
                                                <Text>微型企业</Text>
                                                <Tag color="default">11.6%</Tag>
                                            </div>
                                            <div style={{ marginTop: '8px', textAlign: 'right' }}>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>中小微企业合计 94.6%</Text>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '12px', height: '100%' }}>
                                        <Text strong style={{ display: 'block', marginBottom: '16px' }}>区域集聚 (光谷核心)</Text>
                                        <Statistic 
                                            title="东湖高新区企业占比"
                                            value={65}
                                            suffix="%"
                                            valueStyle={{ color: '#16a34a', fontWeight: 'bold' }}
                                        />
                                        <Paragraph style={{ marginTop: '12px', fontSize: '13px', color: '#15803d' }}>
                                            核心产业规模占全市近七成，集聚了超过800家人工智能企业。
                                        </Paragraph>
                                        <div style={{ marginTop: '16px' }}>
                                            <Tag color="green">中国光谷</Tag>
                                            <Tag color="green">核心引领</Tag>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* 3. University Resources */}
                    <Col xs={24} lg={10}>
                        <Card 
                            title={<Title level={4} style={{ margin: 0 }}>高校创新智力与政策</Title>}
                            bordered={false}
                            style={{ borderRadius: '12px', height: '100%', boxShadow: TOKENS.shadows.card }}
                        >
                            <div style={{ marginBottom: '24px' }}>
                                <Text strong style={{ display: 'block', marginBottom: '12px' }}>重点高校/科研院所</Text>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {stats?.universities?.map((uni, index) => (
                                        <Tag key={index} color="geekblue" style={{ padding: '4px 10px', fontSize: '13px' }}>
                                            {uni}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                            
                            <div style={{ padding: '16px', background: '#FEF2F2', borderRadius: '12px', border: '1px solid #FECACA' }}>
                                <Text strong style={{ color: '#DC2626' }}>人才政策引力 ("人工智能十条")</Text>
                                <ul style={{ margin: '8px 0 0 20px', padding: 0, color: '#B91C1C', fontSize: '13px' }}>
                                    <li>顶尖人才 "一事一议"</li>
                                    <li>最高2000万技术攻关支持</li>
                                    <li>1000万算力券补贴</li>
                                    <li>安家补贴全方位覆盖</li>
                                </ul>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default InnovationView;
