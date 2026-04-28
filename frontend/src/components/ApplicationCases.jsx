import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Typography, Spin } from 'antd';
import { RocketOutlined, TagOutlined, BankOutlined } from '@ant-design/icons';
import { TOKENS } from '../theme';
import { fetchApplicationCases } from '../api';

const { Title, Text, Paragraph } = Typography;

const ApplicationCases = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCases = async () => {
            try {
                const data = await fetchApplicationCases();
                setCases(data);
            } catch (error) {
                console.error("Failed to load application cases", error);
            } finally {
                setLoading(false);
            }
        };
        loadCases();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: 'var(--ui-page-padding)', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ maxWidth: 'var(--ui-page-width)', margin: '0 auto' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 className="page-title">典型应用案例</h1>
                    <p className="page-subtitle">基于《2025年度武汉市人工智能产业发展综合评估报告》筛选的重点领域标杆项目</p>
                </div>

                <List
                    grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 3 }}
                    dataSource={cases}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                hoverable
                                bordered={false}
                                className="ui-card"
                                style={{ height: '100%' }}
                                bodyStyle={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div style={{ 
                                        width: '48px', 
                                        height: '48px', 
                                        borderRadius: '12px', 
                                        background: 'var(--ui-accent-soft)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: TOKENS.colors.accent
                                    }}>
                                        <RocketOutlined style={{ fontSize: '24px' }} />
                                    </div>
                                    <Tag color="blue" style={{ borderRadius: '12px', margin: 0 }}>{item.tags[0]}</Tag>
                                </div>

                                <Title level={4} style={{ marginBottom: '8px', fontSize: '18px' }}>{item.title}</Title>
                                
                                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                                    <BankOutlined style={{ marginRight: '8px', color: TOKENS.colors.textSecondary }} />
                                    <Text strong style={{ color: TOKENS.colors.textPrimary }}>{item.org}</Text>
                                </div>

                                <Paragraph style={{ color: TOKENS.colors.textSecondary, flex: 1, marginBottom: '24px' }}>
                                    {item.desc}
                                </Paragraph>

                                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${TOKENS.colors.border}` }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {item.tags.map((tag, idx) => (
                                            <Tag key={idx} icon={<TagOutlined />} style={{ background: 'var(--ui-border)', border: 'none', color: TOKENS.colors.textSecondary }}>
                                                {tag}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default ApplicationCases;
