import React, { useEffect, useState, useRef } from 'react';
import { Card, Row, Col, Statistic, Tag, List, Space, Divider } from 'antd';
import { DatabaseOutlined, TransactionOutlined, CloudServerOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import { fetchInfraStats } from '../api';
import { TOKENS, getResolvedTokens } from '../theme';
import { useUiMode } from '../context/UiModeContext';

const DataElementView = () => {
    const { mode } = useUiMode();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            const stats = await fetchInfraStats();
            setData(stats?.data_elements || {});
            setLoading(false);
        };
        loadData();
    }, []);

    // 交易趋势示例图
    useEffect(() => {
        if (loading || !chartRef.current) return;
        const chart = echarts.init(chartRef.current);
        const { colors } = getResolvedTokens();
        
        const option = {
            title: { 
                text: '数据要素交易趋势（示例）', 
                left: 'center',
                textStyle: { color: colors.textPrimary, fontSize: 14, fontWeight: 600 }
            },
            tooltip: { trigger: 'axis' },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: { 
                type: 'category', 
                data: ['1月', '2月', '3月', '4月', '5月', '6月'],
                axisLabel: { color: colors.textSecondary },
                axisLine: { lineStyle: { color: colors.border } }
            },
            yAxis: { 
                type: 'value', 
                name: '交易额 (万元)',
                axisLabel: { color: colors.textSecondary },
                splitLine: { lineStyle: { color: colors.border, type: 'dashed' } }
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330],
                type: 'line',
                smooth: true,
                areaStyle: { color: colors.accentSecondary, opacity: 0.12 },
                itemStyle: { color: colors.accentSecondary }
            }]
        };
        
        chart.setOption(option);
        
        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);
        return () => {
            chart.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, [loading, mode]);

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>数据要素看板加载中...</div>;

    return (
        <div style={{ padding: 'var(--ui-page-padding)', maxWidth: 'var(--ui-page-width)', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 className="page-title">数据要素市场看板</h1>
                <p className="page-subtitle">聚焦公共数据开放、交易流通与资产化应用</p>
            </div>

            {/* Core Metrics */}
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable className="ui-card">
                        <Statistic 
                            title="公共数据目录" 
                            value={data.catalogs || 0} 
                            suffix="个"
                            prefix={<DatabaseOutlined style={{ color: TOKENS.colors.accentSecondary }} />} 
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable className="ui-card">
                        <Statistic 
                            title="开放数据集" 
                            value={data.datasets || 0} 
                            suffix="个"
                            prefix={<CloudServerOutlined style={{ color: TOKENS.colors.success }} />} 
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable className="ui-card">
                        <Statistic 
                            title="数据记录总量" 
                            value={data.records || 0} 
                            suffix="万条"
                            prefix={<SafetyCertificateOutlined style={{ color: TOKENS.colors.warning }} />} 
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable className="ui-card">
                        <Statistic 
                            title="API 调用次数" 
                            value={data.api_calls || 0} 
                            suffix="亿次"
                            prefix={<TransactionOutlined style={{ color: TOKENS.colors.danger }} />} 
                        />
                    </Card>
                </Col>
            </Row>

            <Divider />

            <Row gutter={[24, 24]}>
                {/* Trading Platform */}
                <Col xs={24} lg={12}>
                    <Card title="交易平台（汉数通）" bordered={false} className="ui-card" style={{ height: '100%' }}>
                        <div ref={chartRef} style={{ height: '300px' }} />
                        <Space size="large" style={{ marginTop: 20, justifyContent: 'center', width: '100%' }}>
                            <Statistic title="入驻数商" value={697} valueStyle={{ fontSize: 18 }} />
                            <Statistic title="挂牌产品" value={1239} valueStyle={{ fontSize: 18 }} />
                            <Statistic title="互联城市" value={29} valueStyle={{ fontSize: 18 }} />
                        </Space>
                    </Card>
                </Col>

                {/* Assetization & Cases */}
                <Col xs={24} lg={12}>
                    <Card title="数据资产入表与应用" bordered={false} className="ui-card" style={{ height: '100%' }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={[
                                { title: '医疗数据资产入表+融资', desc: '首批获授信企业 7 家，授信金额 1.26 亿元', tag: '金融' },
                                { title: '交通数据要素应用', desc: '车路协同数据服务，覆盖 200+ 路口', tag: '交通' },
                                { title: '政务数据共享', desc: '跨部门数据调用效率提升 50%', tag: '政务' },
                            ]}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Tag color="blue">{item.tag}</Tag>}
                                        title={item.title}
                                        description={item.desc}
                                    />
                                </List.Item>
                            )}
                        />
                        <div style={{ marginTop: 24, background: 'var(--ui-border)', padding: 16, borderRadius: 8 }}>
                            <Statistic 
                                title="总撮合交易额" 
                                value={4353} 
                                suffix="万元" 
                                valueStyle={{ color: TOKENS.colors.accentSecondary, fontWeight: 'bold' }}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DataElementView;
