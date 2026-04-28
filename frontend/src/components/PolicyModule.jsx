import React from 'react';
import { Typography, Timeline, Card, Row, Col, Tag, Divider } from 'antd';
import { TOKENS } from '../theme';

const { Title, Paragraph, Text } = Typography;

const PolicyModule = () => {
    return (
        <div style={{ padding: 'var(--ui-page-padding)', maxWidth: 'var(--ui-page-width)', margin: '0 auto', animation: 'fadeIn 0.8s ease-out' }}>
            <div style={{ marginBottom: '48px', textAlign: 'center' }}>
                <h1 className="page-title">武汉人工智能产业发展战略（2025）</h1>
                <p className="page-subtitle" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    2025年，武汉人工智能产业规模有望突破<Text strong style={{ color: TOKENS.colors.accentSecondary }}>1000亿元</Text>，
                    企业总量达<Text strong style={{ color: TOKENS.colors.accentSecondary }}>1326家</Text>。
                    依托东湖高新区核心集聚优势，构建从芯片到大模型的全产业链生态，
                    力争进入全国人工智能城市发展第一梯队。
                </p>
            </div>

            <Row gutter={[48, 48]}>
                {/* Left Column: Policy Narrative */}
                <Col xs={24} lg={14}>
                    <Card bordered={false} style={{ background: 'transparent', boxShadow: 'none' }} bodyStyle={{ padding: 0 }}>
                        <Title level={3} style={{ marginTop: 0 }}>核心指导思想</Title>
                        <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: TOKENS.colors.textSecondary }}>
                            武汉正处于经济结构转型升级的关键时期，人工智能作为“头雁”效应显著的战略性技术，
                            是提升城市竞争力的重要抓手。2025年，武汉市人工智能产业近三年年均增速超过<Text strong>30%</Text>，
                            已形成以<Text strong style={{ color: TOKENS.colors.accentSecondary }}>东湖高新区</Text>为核心（占全市55.7%），
                            洪山区、武汉经开区、江岸区协同发展的产业格局。
                        </Paragraph>
                        <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: TOKENS.colors.textSecondary }}>
                            重点聚焦于<Text strong style={{ color: TOKENS.colors.accentSecondary }}>智能网联汽车</Text>（智能道路总里程全国第一）、
                            <Text strong style={{ color: TOKENS.colors.accentSecondary }}>智慧医疗</Text>（AI产品覆盖72款）、
                            <Text strong style={{ color: TOKENS.colors.accentSecondary }}>智能制造</Text>（拥有10家国家级智能工厂）等垂直领域，
                            打造具有全球影响力的产业集群。
                        </Paragraph>

                        <Divider />

                        <Title level={3}>2025 重点行动目标</Title>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <Card hoverable bordered={false} className="ui-card" style={{ borderLeft: `4px solid ${TOKENS.colors.accentSecondary}` }}>
                                <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>01. 算力基础设施升级</Text>
                                <Text type="secondary">全市算力规模达到 <Text strong style={{ color: TOKENS.colors.accentSecondary }}>4500 PFlops</Text>，建成智算中心8家、超算中心2家，智能算力利用率大幅提升。</Text>
                            </Card>
                            <Card hoverable bordered={false} className="ui-card" style={{ borderLeft: `4px solid ${TOKENS.colors.success}` }}>
                                <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>02. 标杆应用场景落地</Text>
                                <Text type="secondary">建成20家国家卓越级以上智能工厂，培育100个工业智能体标杆，推动人形机器人产业化。</Text>
                            </Card>
                            <Card hoverable bordered={false} className="ui-card" style={{ borderLeft: `4px solid ${TOKENS.colors.warning}` }}>
                                <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>03. 产业生态与人才</Text>
                                <Text type="secondary">入选福布斯中国AI企业50强9家（全国第四），全球高产出科学家排名第6，打造百亿基金投资生态。</Text>
                            </Card>
                        </div>
                    </Card>
                </Col>

                {/* Right Column: Timeline & Highlights */}
                <Col xs={24} lg={10}>
                    <Card title="关键政策与发展里程碑" bordered={false} className="ui-card" style={{ height: '100%' }}>
                        <Timeline
                            mode="left"
                            items={[
                                {
                                    color: 'gray',
                                    label: '2022-03',
                                    children: (
                                        <>
                                            <Text strong>湖北省人工智能产业“十四五”发展规划</Text>
                                            <br />
                                            <Text type="secondary" style={{ fontSize: '12px' }}>目标：2025年产业规模达1000亿元</Text>
                                        </>
                                    ),
                                },
                                {
                                    color: 'blue',
                                    label: '2025-02',
                                    children: (
                                        <>
                                            <Text strong style={{ color: TOKENS.colors.accentSecondary }}>武汉市促进人工智能产业发展若干政策措施</Text>
                                            <br />
                                            <Text type="secondary" style={{ fontSize: '12px' }}>“人工智能十条”发布，最高2000万支持</Text>
                                        </>
                                    ),
                                },
                                {
                                    color: 'blue',
                                    label: '2025-03',
                                    children: (
                                        <>
                                            <Text strong>武汉市2025年人工智能产业发展行动方案</Text>
                                            <br />
                                            <Tag color="blue">算力4500P</Tag>
                                            <Tag color="blue">智能体矩阵</Tag>
                                        </>
                                    ),
                                },
                                {
                                    color: 'green',
                                    label: '2025-06',
                                    children: (
                                        <>
                                            <Text strong>福布斯中国AI企业50强评选</Text>
                                            <br />
                                            <Text type="secondary" style={{ fontSize: '12px' }}>光谷8家企业上榜，全国排名第四</Text>
                                        </>
                                    ),
                                },
                                {
                                    color: 'orange',
                                    label: '2025-11',
                                    children: (
                                        <>
                                            <Text strong>推动“人工智能＋制造”行动方案</Text>
                                            <br />
                                            <Tag color="orange">20家卓越工厂</Tag>
                                            <Tag color="orange">100个智能体</Tag>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PolicyModule;
