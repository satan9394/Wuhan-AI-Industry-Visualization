import React from 'react';
import { Row, Col, Card, Steps, Tag, Typography, Timeline, Statistic, List, Space } from 'antd';
import { RobotOutlined, CarOutlined, DesktopOutlined, MobileOutlined, EyeOutlined, BuildOutlined, RocketOutlined, ExperimentOutlined, EnvironmentOutlined, MedicineBoxOutlined, HddOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { TOKENS } from '../theme';

const { Title, Paragraph, Text } = Typography;

const StrategyCard = ({ title, icon, children, extra }) => (
    <Card 
        bordered={false} 
        style={{ 
            height: '100%', 
            borderRadius: '12px', 
            boxShadow: TOKENS.shadows.card,
            background: TOKENS.colors.cardBg 
        }}
        bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', background: 'var(--ui-accent-soft)', borderRadius: '8px', color: TOKENS.colors.accent }}>
                    {icon}
                </div>
                <Title level={4} style={{ margin: 0, color: TOKENS.colors.textPrimary }}>{title}</Title>
            </div>
            {extra}
        </div>
        <div style={{ flex: 1 }}>{children}</div>
    </Card>
);

const TerminalItem = ({ icon, title, desc, company, color, tag, tagColor }) => (
    <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '16px', 
        marginBottom: '12px', 
        background: '#f8fafc', 
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease'
    }}>
        <div style={{ 
            fontSize: '24px', 
            marginRight: '16px', 
            color: color,
            background: '#fff',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <Text strong style={{ fontSize: '16px' }}>{title}</Text>
                <Tag color={tagColor || color}>{tag}</Tag>
            </div>
            <Text type="secondary" style={{ fontSize: '13px' }}>{desc}</Text>
        </div>
    </div>
);

const StrategyView = () => {
    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out', padding: 'var(--ui-page-padding)' }}>
            <div style={{ maxWidth: 'var(--ui-page-width)', margin: '0 auto' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 className="page-title">战略聚焦与政策指引</h1>
                    <p className="page-subtitle">核心抓手 “智能体” 与五大终端万亿赛道布局</p>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Column 1: Core Strategy (Smart Agent) */}
                    <Col xs={24} lg={8}>
                        <StrategyCard title="核心抓手：智能体 (Agent)" icon={<BuildOutlined />}>
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ 
                                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', 
                                    borderRadius: '20px', 
                                    padding: '30px', 
                                    color: '#fff',
                                    marginBottom: '24px',
                                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                                }}>
                                    <RocketOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                                    <Title level={3} style={{ color: '#fff', margin: 0 }}>Intelligent Agent</Title>
                                    <Paragraph style={{ color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
                                        大模型能力的具身化与垂直化
                                    </Paragraph>
                                </div>
                                <Steps direction="vertical" current={1} items={[
                                    {
                                        title: '趋势·大模型',
                                        description: '千亿参数级跃迁 / 低成本高效应用',
                                    },
                                    {
                                        title: '行业智能体',
                                        description: '多场景 / 多任务 / 20+重点示范应用',
                                        status: 'process',
                                    },
                                    {
                                        title: '用户智能体',
                                        description: '端侧个性化助手 / 人机共创',
                                    },
                                ]} />
                            </div>
                        </StrategyCard>
                    </Col>

                    {/* Column 2: 5 Terminals */}
                    <Col xs={24} lg={10}>
                        <StrategyCard title="五大核心链接通道" icon={<RobotOutlined />}>
                            <TerminalItem 
                                icon={<RobotOutlined />} 
                                title="AI + 机器人" 
                                desc="人形机器人研发制造基地，康养/服务场景落地。" 
                                tag="产业链"
                                color="#ef4444"
                                tagColor="magenta"
                            />
                            <TerminalItem 
                                icon={<CarOutlined />} 
                                title="AI + 汽车" 
                                desc="L3/L4自动驾驶，车路云一体化示范区。" 
                                tag="场景/应用"
                                color="#f97316"
                                tagColor="orange"
                            />
                            <TerminalItem 
                                icon={<DesktopOutlined />} 
                                title="AI + PC/智能岛" 
                                desc="本地智算专用机，AI PC生态构建。" 
                                tag="生态"
                                color="#3b82f6"
                                tagColor="blue"
                            />
                            <TerminalItem 
                                icon={<MobileOutlined />} 
                                title="AI + 手机" 
                                desc="端侧大模型部署，计算摄影升级。" 
                                tag="终端/Moto"
                                color="#10b981"
                                tagColor="green"
                            />
                            <TerminalItem 
                                icon={<EyeOutlined />} 
                                title="实体智能体 (XR)" 
                                desc="轻量化模型AR眼镜，沉浸式体验叠加。" 
                                tag="体验/沉浸"
                                color="#8b5cf6"
                                tagColor="purple"
                            />
                        </StrategyCard>
                    </Col>

                    {/* Column 3: Policy Timeline & Resources */}
                    <Col xs={24} lg={6}>
                        <StrategyCard title="政策演进与资源保障" icon={<RocketOutlined />}>
                            <Timeline
                                mode="left"
                                style={{ marginTop: '10px' }}
                                items={[
                                    {
                                        label: '2025-02',
                                        children: (
                                            <>
                                                <Text strong>人工智能"十条"</Text>
                                                <br/>
                                                <Text type="secondary" style={{fontSize: '12px'}}>最高2000万技术攻关</Text>
                                            </>
                                        ), 
                                        color: 'blue'
                                    },
                                    {
                                        label: '2024',
                                        children: '算力基础设施行动方案',
                                        color: 'gray'
                                    },
                                    {
                                        label: '2023',
                                        children: '数据要素登记与授权试点', 
                                        color: 'gray'
                                    }
                                ]}
                            />
                            <div style={{ marginTop: '16px', padding: '16px', background: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                                <Text strong style={{ color: '#c2410c' }}>产业资源保障 (政策驱动)</Text>
                                <ul style={{ margin: '8px 0 0 16px', padding: 0, color: '#9a3412', fontSize: '13px' }}>
                                    <li>R&D 研发强度提升 <Text strong>70%+</Text></li>
                                    <li>AI+数智化改造投资大幅提升</li>
                                    <li>近3年企业数量增长 <Text strong>30%</Text></li>
                                    <li>算力集群规模持续扩容</li>
                                </ul>
                            </div>
                        </StrategyCard>
                    </Col>
                </Row>

                {/* New Section: Future Frontier & AGI Exploration */}
                <div style={{ marginTop: '24px' }}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={16}>
                            <StrategyCard title="前沿探索：AGI与AI4S新范式" icon={<ExperimentOutlined />}>
                                <Row gutter={[24, 24]}>
                                    <Col span={12}>
                                        <div style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)', padding: '24px', borderRadius: '12px', height: '100%' }}>
                                            <Title level={5} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', color: '#475569' }}>
                                                <RobotOutlined style={{ marginRight: '8px', color: '#6366F1' }} /> 
                                                通向AGI的“社会模拟器”
                                            </Title>
                                            <Paragraph style={{ color: '#475569', fontSize: '13px', lineHeight: '1.6' }}>
                                                <Text strong>中科院自动化所 + 华为 + 北大</Text> 联合体在汉部署“社会模拟器” (Social Simulator)，将AI服务注入工商业与日常生活。
                                            </Paragraph>
                                            <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.6)', borderRadius: '8px' }}>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    <RocketOutlined style={{ marginRight: '6px' }} />
                                                    目标：基于真实世界数据的通用人工智能 (AGI) 演进路径
                                                </Text>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={{ background: 'linear-gradient(135deg, #F0F9FF 0%, #BAE6FD 100%)', padding: '24px', borderRadius: '12px', height: '100%' }}>
                                            <Title level={5} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', color: '#0369A1' }}>
                                                <HddOutlined style={{ marginRight: '8px', color: '#0EA5E9' }} /> 
                                                AI for Science (AI4S)
                                            </Title>
                                            <Paragraph style={{ color: '#334155', fontSize: '13px', lineHeight: '1.6' }}>
                                                依托<Text strong>武汉人工智能研究院 + 超算中心</Text>，构建全国首个“智算+超算”融合的多元云服务集群。
                                            </Paragraph>
                                            <Space size={[0, 8]} wrap>
                                                <Tag color="blue">新药研发</Tag>
                                                <Tag color="cyan">材料科学</Tag>
                                                <Tag color="geekblue">基因育种</Tag>
                                            </Space>
                                        </div>
                                    </Col>
                                </Row>
                            </StrategyCard>
                        </Col>
                        
                        <Col xs={24} lg={8}>
                            <StrategyCard title="跨区域协同创新" icon={<EnvironmentOutlined />}>
                                <div style={{ padding: '12px' }}>
                                    <Timeline
                                        items={[
                                            {
                                                color: 'purple',
                                                children: (
                                                    <>
                                                        <Text strong>京汉联动</Text>
                                                        <div style={{ fontSize: '12px', color: '#64748B' }}>北京顶级AI机构（中科院/北大）在汉设立分支，共建研发中心</div>
                                                    </>
                                                ),
                                            },
                                            {
                                                color: 'orange',
                                                children: (
                                                    <>
                                                        <Text strong>深汉合作</Text>
                                                        <div style={{ fontSize: '12px', color: '#64748B' }}>华为昇腾生态 + 深圳数据交易所互联互通</div>
                                                    </>
                                                ),
                                            },
                                            {
                                                color: 'green',
                                                children: (
                                                    <>
                                                        <Text strong>中部辐射</Text>
                                                        <div style={{ fontSize: '12px', color: '#64748B' }}>算力网络覆盖湘鄂赣，赋能中部制造业转型</div>
                                                    </>
                                                ),
                                            },
                                        ]}
                                    />
                                </div>
                            </StrategyCard>
                        </Col>
                    </Row>
                </div>

            </div>
        </div>
    );
};

export default StrategyView;
