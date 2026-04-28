import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Spin, Empty, Tag, Statistic, Card } from 'antd';
import * as echarts from 'echarts';
import { fetchIndustryAnalysis } from '../api';
import { TOKENS, getResolvedTokens } from '../theme';
import { RiseOutlined, FunnelPlotOutlined, DashboardOutlined, RadarChartOutlined, RocketOutlined, ShopOutlined, PieChartOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useUiMode } from '../context/UiModeContext';

const ChartCard = ({ title, icon, children, height = '400px' }) => (
    <div className="ui-card" style={{
        background: TOKENS.colors.cardBg,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: TOKENS.shadows.card,
        border: `1px solid ${TOKENS.colors.border}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon}
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: TOKENS.colors.textPrimary, margin: 0 }}>{title}</h3>
        </div>
        <div style={{ flex: 1, minHeight: height, width: '100%' }}>{children}</div>
    </div>
);

const OverviewCard = ({ title, value, suffix, prefix, color }) => (
    <Card bordered={false} style={{ borderRadius: '12px', boxShadow: TOKENS.shadows.card, height: '100%', background: '#fff' }}>
        <Statistic
            title={<span style={{ color: TOKENS.colors.textSecondary, fontWeight: 500 }}>{title}</span>}
            value={value}
            precision={title.includes('占比') ? 1 : 0}
            valueStyle={{ color: color, fontWeight: 700, fontSize: '28px' }}
            prefix={prefix}
            suffix={<span style={{ fontSize: '14px', color: TOKENS.colors.textSecondary, marginLeft: '4px' }}>{suffix}</span>}
        />
    </Card>
);

const IndustryAnalysis = () => {
    const { mode } = useUiMode();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const scatterRef = useRef(null);
    const funnelRef = useRef(null);
    const gaugeRef = useRef(null);
    const terminalsRef = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await fetchIndustryAnalysis();
                setData(res);
            } catch (error) {
                console.error("Failed to load industry analysis", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!data) return;
        const { colors } = getResolvedTokens();

        // 1. Scatter Chart
        const scatterChart = echarts.init(scatterRef.current);
        scatterChart.setOption({
            tooltip: {
                formatter: (params) => {
                    return `营收: ${params.value[0]}万<br/>创新指数: ${params.value[1]}<br/>领域: ${params.value[3]}`;
                }
            },
            grid: { top: '10%', left: '10%', right: '10%', bottom: '10%' },
            xAxis: { name: '营收规模', splitLine: { lineStyle: { type: 'dashed' } } },
            yAxis: { name: '创新指数', splitLine: { lineStyle: { type: 'dashed' } } },
            series: [{
                type: 'scatter',
                symbolSize: (data) => data[2],
                data: data.scatter,
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(25, 100, 150, 0.5)',
                    shadowOffsetY: 5,
                    color: (params) => {
                        const colors = TOKENS.chartPalette;
                        return colors[params.dataIndex % colors.length];
                    }
                },
                markArea: {
                    silent: true,
                    itemStyle: {
                        color: 'transparent',
                        borderWidth: 1,
                        borderType: 'dashed'
                    },
                    data: [[
                        {
                            name: '中小微企业集群 (94.6%)',
                            xAxis: 0,
                            yAxis: 0
                        },
                        {
                            xAxis: 2000,
                            yAxis: 100
                        }
                    ]]
                }
            }]
        });

        // 2. Terminals Radar Chart
        const terminalsChart = echarts.init(terminalsRef.current);
        if (data.terminals) {
            terminalsChart.setOption({
                tooltip: {},
                radar: {
                    indicator: data.terminals.map(item => ({ name: item.name, max: item.max })),
                    radius: '65%',
                    splitArea: {
                        areaStyle: {
                            color: ['rgba(248,250,252,0.8)', 'rgba(241,245,249,0.8)'],
                        }
                    },
                    axisName: {
                        color: colors.textSecondary,
                        fontSize: 12,
                        fontWeight: 500
                    },
                    splitLine: {
                        lineStyle: {
                            color: colors.border
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: colors.border
                        }
                    }
                },
                series: [{
                    name: '发展指数',
                    type: 'radar',
                    data: [
                        {
                            value: data.terminals.map(item => item.value),
                            name: '五大重点终端',
                            itemStyle: { color: '#3B82F6' },
                            areaStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
                                    { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
                                ])
                            },
                            lineStyle: {
                                width: 2,
                                color: '#3B82F6'
                            }
                        }
                    ]
                }]
            });
        }

        // 3. Funnel Chart
        const funnelChart = echarts.init(funnelRef.current);
        funnelChart.setOption({
            tooltip: { trigger: 'item', formatter: "{a} <br/>{b} : {c}%" },
            series: [
                {
                    name: '项目转化',
                    type: 'funnel',
                    left: '10%',
                    top: 60,
                    bottom: 60,
                    width: '80%',
                    min: 0,
                    max: 100,
                    minSize: '0%',
                    maxSize: '100%',
                    sort: 'descending',
                    gap: 2,
                    label: { show: true, position: 'inside' },
                    labelLine: { length: 10, lineStyle: { width: 1, type: 'solid' } },
                    itemStyle: { borderColor: '#fff', borderWidth: 1 },
                    emphasis: { label: { fontSize: 20 } },
                    data: data.funnel.map((item, index) => ({
                        ...item,
                        itemStyle: { color: TOKENS.chartPalette[index % TOKENS.chartPalette.length] }
                    }))
                }
            ]
        });

        // 4. Gauge Chart
        const gaugeChart = echarts.init(gaugeRef.current);
        gaugeChart.setOption({
            series: [{
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 100,
                splitNumber: 10,
                itemStyle: {
                    color: colors.accent,
                    shadowColor: 'rgba(0,138,255,0.45)',
                    shadowBlur: 10,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                },
                progress: { show: true, roundCap: true, width: 18 },
                pointer: { icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z', length: '75%', width: 16, offsetCenter: [0, '5%'] },
                axisLine: { roundCap: true, lineStyle: { width: 18 } },
                axisTick: { splitNumber: 2, lineStyle: { width: 2, color: '#999' } },
                splitLine: { length: 24, lineStyle: { width: 3, color: '#999' } },
                axisLabel: { distance: 30, color: '#999', fontSize: 20 },
                title: { show: false },
                detail: {
                    backgroundColor: '#fff',
                    borderColor: '#999',
                    borderWidth: 2,
                    width: '60%',
                    lineHeight: 40,
                    height: 40,
                    borderRadius: 8,
                    offsetCenter: [0, '35%'],
                    valueAnimation: true,
                    formatter: function (value) {
                        return '{value|' + value.toFixed(0) + '}{unit|分}';
                    },
                    rich: {
                        value: { fontSize: 40, fontWeight: 'bolder', color: '#777' },
                        unit: { fontSize: 20, color: '#999', padding: [0, 0, -20, 10] }
                    }
                },
                data: [{ value: data.gauge }]
            }]
        });

        const handleResize = () => {
            scatterChart.resize();
            terminalsChart.resize();
            funnelChart.resize();
            gaugeChart.resize();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            scatterChart.dispose();
            terminalsChart.dispose();
            funnelChart.dispose();
            gaugeChart.dispose();
        };
    }, [data, mode]);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out', padding: 'var(--ui-page-padding)' }}>
            <div style={{ maxWidth: 'var(--ui-page-width)', margin: '0 auto' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 className="page-title">行业绩效与运营分析</h1>
                    <p className="page-subtitle">基于多维数据的行业健康度与效能分析</p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Spin size="large" /></div>
                ) : data ? (
                    <>
                        {/* Overview Cards */}
                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24} sm={12} lg={6}>
                                <OverviewCard 
                                    title="2025年产业规模(预估)" 
                                    value={1000} 
                                    suffix="亿元" 
                                    prefix={<RocketOutlined />} 
                                    color="#3B82F6" 
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <OverviewCard 
                                    title="人工智能企业总量" 
                                    value={1326} 
                                    suffix="家" 
                                    prefix={<ShopOutlined />} 
                                    color="#10B981" 
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <OverviewCard 
                                    title="中小微企业占比" 
                                    value={94.6} 
                                    suffix="%" 
                                    prefix={<PieChartOutlined />} 
                                    color="#F59E0B" 
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <OverviewCard 
                                    title="核心集聚区(东湖)占比" 
                                    value={71.6} 
                                    suffix="%" 
                                    prefix={<ThunderboltOutlined />} 
                                    color="#8B5CF6" 
                                />
                            </Col>
                        </Row>

                        {/* Row 1: Scatter & Radar */}
                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24} lg={16}>
                                <ChartCard title="企业规模与创新效率 (金字塔结构)" icon={<RiseOutlined style={{ color: TOKENS.colors.accent }}/>} height="500px">
                                    <div style={{ position: 'absolute', right: '48px', top: '80px', zIndex: 10 }}>
                                        <Tag color="blue">中小微占比 94.6%</Tag>
                                    </div>
                                    <div ref={scatterRef} style={{ width: '100%', height: '100%' }} />
                                </ChartCard>
                            </Col>
                            <Col xs={24} lg={8}>
                                <ChartCard title="五大重点终端赛道 (2025)" icon={<RadarChartOutlined style={{ color: '#8B5CF6' }}/>} height="500px">
                                    <div ref={terminalsRef} style={{ width: '100%', height: '100%' }} />
                                </ChartCard>
                            </Col>
                        </Row>

                        {/* Row 2: Funnel & Gauge */}
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12}>
                                <ChartCard title="创新成果转化漏斗" icon={<FunnelPlotOutlined style={{ color: '#F59E0B' }}/>}>
                                    <div ref={funnelRef} style={{ width: '100%', height: '100%' }} />
                                </ChartCard>
                            </Col>
                            <Col xs={24} lg={12}>
                                <ChartCard title="2025年行业景气度预测" icon={<DashboardOutlined style={{ color: '#10B981' }}/>}>
                                    <div ref={gaugeRef} style={{ width: '100%', height: '100%' }} />
                                </ChartCard>
                            </Col>
                        </Row>
                    </>
                ) : <Empty />}
            </div>
        </div>
    );
};

export default IndustryAnalysis;
