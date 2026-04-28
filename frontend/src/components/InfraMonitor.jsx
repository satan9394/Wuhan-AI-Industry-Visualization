import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Card, Statistic, Progress, Spin, Empty, Tag } from 'antd';
import * as echarts from 'echarts';
import { fetchInfraStats } from '../api';
import { TOKENS } from '../theme';
import { CloudServerOutlined, DatabaseOutlined, ClusterOutlined, ApiOutlined, ThunderboltOutlined } from '@ant-design/icons';

const ChartCard = ({ title, icon, children, height = '300px' }) => (
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

const MetricCard = ({ title, value, unit, icon, color, subtext }) => (
    <Card bordered={false} style={{ height: '100%', borderRadius: '12px', boxShadow: TOKENS.shadows.card }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ 
                background: `${color}15`, 
                padding: '12px', 
                borderRadius: '12px', 
                color: color,
                marginRight: '16px' 
            }}>
                {icon}
            </div>
            <span style={{ fontSize: '16px', color: TOKENS.colors.textSecondary, fontWeight: 500 }}>{title}</span>
        </div>
        <div style={{ fontSize: '36px', fontWeight: 800, color: TOKENS.colors.textPrimary, marginBottom: '8px', fontFamily: TOKENS.fonts.mono }}>
            {value} <span style={{ fontSize: '16px', color: TOKENS.colors.textSecondary, fontWeight: 400 }}>{unit}</span>
        </div>
        {subtext && <div style={{ color: TOKENS.colors.textSecondary, fontSize: '13px' }}>{subtext}</div>}
    </Card>
);

const InfraMonitor = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const barRef = useRef(null);
    const gaugeRef = useRef(null);
    const lineRef = useRef(null);
    const taskRef = useRef(null);
    
    // Real-time states
    const [realtimeUsage, setRealtimeUsage] = useState(0);
    const [energyTrend, setEnergyTrend] = useState([]);

    // Initialize real-time data
    useEffect(() => {
        // Initial trend data
        const now = new Date();
        const initialTrend = Array.from({ length: 10 }, (_, i) => {
            const t = new Date(now.getTime() - (9 - i) * 3000);
            return {
                time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                value: parseFloat((1.2 + Math.random() * 0.3).toFixed(2))
            };
        });
        setEnergyTrend(initialTrend);
        setRealtimeUsage(75.5);

        const interval = setInterval(() => {
            // Update Usage
            setRealtimeUsage(prev => {
                const change = (Math.random() - 0.5) * 5;
                const next = Math.max(0, Math.min(100, prev + change));
                return parseFloat(next.toFixed(1));
            });

            // Update Energy Trend
            setEnergyTrend(prev => {
                const now = new Date();
                const newPoint = {
                    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    value: parseFloat((1.2 + Math.random() * 0.3).toFixed(2))
                };
                const newTrend = [...prev.slice(1), newPoint];
                return newTrend;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await fetchInfraStats();
                setData(res);
            } catch (error) {
                console.error("Failed to load infra stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!data) return;
        // Safety check for refs
        if (!barRef.current || !gaugeRef.current || !lineRef.current || !taskRef.current) return;

        let barChart, gaugeChart, lineChart, taskChart;

        try {
            // 1. Bar Chart (Computing Centers)
            if (data?.computing_power?.centers) {
                barChart = echarts.getInstanceByDom(barRef.current) || echarts.init(barRef.current);
                barChart.setOption({
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                    grid: { top: '10%', left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    xAxis: { 
                        type: 'value', 
                        splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } } 
                    },
                    yAxis: { 
                        type: 'category', 
                        data: data.computing_power.centers.map(c => c.name),
                        axisLabel: { width: 100, overflow: 'truncate' }
                    },
                    series: [{
                        name: '算力规模(P)',
                        type: 'bar',
                        data: data.computing_power.centers.map(c => ({
                            value: c.value,
                            itemStyle: {
                                color: c.type === '超算' ? '#F59E0B' : '#3B82F6'
                            }
                        })),
                        label: { show: true, position: 'right' },
                        barWidth: 20,
                        itemStyle: { borderRadius: [0, 4, 4, 0] }
                    }]
                });
            }

            // 2. Gauge Chart (Real-time Utilization)
            gaugeChart = echarts.getInstanceByDom(gaugeRef.current) || echarts.init(gaugeRef.current);
            gaugeChart.setOption({
                series: [{
                    type: 'gauge',
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: 100,
                    splitNumber: 5,
                    itemStyle: { color: realtimeUsage > 80 ? '#EF4444' : '#10B981' },
                    progress: { show: true, width: 30 },
                    pointer: { show: false },
                    axisLine: { lineStyle: { width: 30 } },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    detail: {
                        valueAnimation: true,
                        offsetCenter: [0, '-10%'],
                        fontSize: 40,
                        fontWeight: 'bolder',
                        formatter: '{value}%',
                        color: realtimeUsage > 80 ? '#EF4444' : '#10B981'
                    },
                    data: [{ value: realtimeUsage }]
                }]
            });

            // 3. Line Chart (Energy Efficiency / PUE Trend)
            lineChart = echarts.getInstanceByDom(lineRef.current) || echarts.init(lineRef.current);
            lineChart.setOption({
                title: { text: '实时 PUE 趋势', left: 'center', textStyle: { fontSize: 14, color: '#64748B' } },
                tooltip: { trigger: 'axis' },
                grid: { top: '15%', left: '3%', right: '4%', bottom: '15%', containLabel: true },
                dataZoom: [
                    { type: 'inside', start: 0, end: 100 },
                    { type: 'slider', start: 0, end: 100, height: 20, bottom: 0 }
                ],
                xAxis: { 
                    type: 'category', 
                    boundaryGap: false,
                    data: energyTrend.map(d => d.time)
                },
                yAxis: { 
                    type: 'value',
                    min: 1.0,
                    max: 2.0,
                    splitLine: { lineStyle: { type: 'dashed' } }
                },
                series: [{
                    name: 'PUE',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                        ])
                    },
                    itemStyle: { color: '#10B981' },
                    data: energyTrend.map(d => d.value)
                }]
            });

            // 4. Pie Chart (Task Status)
            taskChart = echarts.getInstanceByDom(taskRef.current) || echarts.init(taskRef.current);
            taskChart.setOption({
                tooltip: { trigger: 'item' },
                legend: { top: '5%', left: 'center' },
                series: [{
                    name: '任务状态',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
                    label: { show: false, position: 'center' },
                    emphasis: { label: { show: true, fontSize: '20', fontWeight: 'bold' } },
                    data: [
                        { value: 1048, name: '运行中', itemStyle: { color: '#3B82F6' } },
                        { value: 735, name: '排队中', itemStyle: { color: '#F59E0B' } },
                        { value: 580, name: '已完成', itemStyle: { color: '#10B981' } },
                        { value: 484, name: '异常', itemStyle: { color: '#EF4444' } }
                    ]
                }]
            });
        } catch (err) {
            console.error("ECharts init error:", err);
        }

        const handleResize = () => {
            barChart?.resize();
            gaugeChart?.resize();
            lineChart?.resize();
            taskChart?.resize();
        };
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            // Don't dispose here if we want to reuse instances, but if we init every time, we should dispose?
            // Actually, best practice is to init once and update option.
            // But since our dependency is [data, realtimeUsage, energyTrend], it runs frequently.
            // So we use getInstanceByDom to reuse.
            // No need to dispose on every update, only on unmount.
            // BUT, this useEffect hook cleans up every time it re-runs.
            // If we don't dispose, we get "already initialized" error next time IF we call init().
            // So: either dispose OR check getInstanceByDom.
            // I used getInstanceByDom || init.
            // So I should NOT dispose on update, only on unmount.
            // But how to distinguish update from unmount in cleanup? You can't.
            // So, usually we split the "init" effect (runs once) from "update" effect.
            // But here I'll just dispose to be safe and simple, as long as performance is OK (3s interval).
            barChart?.dispose();
            gaugeChart?.dispose();
            lineChart?.dispose();
            taskChart?.dispose();
        };
    }, [data, realtimeUsage, energyTrend]);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out', padding: 'var(--ui-page-padding)' }}>
            <div style={{ maxWidth: 'var(--ui-page-width)', margin: '0 auto' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 className="page-title">算力基建与数据要素监控</h1>
                    <p className="page-subtitle">实时监测全市算力调度、数据流通与基础设施状态</p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Spin size="large" /></div>
                ) : data ? (
                    <>
                        {/* Top Metrics */}
                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24} md={8}>
                                <MetricCard 
                                    title="全市算力总规模" 
                                    value={data?.computing_power?.total} 
                                    unit="PFlops" 
                                    icon={<ThunderboltOutlined style={{ fontSize: '24px' }}/>} 
                                    color="#3B82F6"
                                    subtext="较上年增长 20%"
                                />
                            </Col>
                            <Col xs={24} md={8}>
                                <MetricCard 
                                    title="数据要素汇聚量" 
                                    value={data?.data_elements?.records} 
                                    unit="万条" 
                                    icon={<DatabaseOutlined style={{ fontSize: '24px' }}/>} 
                                    color="#8B5CF6"
                                    subtext={`开放数据集 ${data?.data_elements?.datasets} 个`}
                                />
                            </Col>
                            <Col xs={24} md={8}>
                                <MetricCard 
                                    title="数据接口调用" 
                                    value={data?.data_elements?.api_calls} 
                                    unit="亿次" 
                                    icon={<ApiOutlined style={{ fontSize: '24px' }}/>} 
                                    color="#10B981"
                                    subtext="活跃开发者 2万+"
                                />
                            </Col>
                        </Row>

                        {/* Charts Area */}
                        <Row gutter={[24, 24]}>
                            {/* Top Row: Distribution + Gauge */}
                            <Col xs={24} lg={16}>
                                <ChartCard title="智算中心算力分布" icon={<ClusterOutlined style={{ color: '#3B82F6' }}/>} height="350px">
                                    <div ref={barRef} style={{ width: '100%', height: '100%' }} />
                                </ChartCard>
                            </Col>
                            <Col xs={24} lg={8}>
                                <ChartCard title="算力资源实时利用率" icon={<CloudServerOutlined style={{ color: '#10B981' }}/>} height="350px">
                                    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <div ref={gaugeRef} style={{ width: '100%', height: '280px' }} />
                                        <div style={{ textAlign: 'center', marginTop: '-30px', zIndex: 10 }}>
                                            <Tag color="success">高负荷运行</Tag>
                                            <p style={{ color: TOKENS.colors.textSecondary, marginTop: '4px', fontSize: '12px' }}>全市算力需求旺盛</p>
                                        </div>
                                    </div>
                                </ChartCard>
                            </Col>

                            {/* Bottom Row: Energy Trend + Task Status */}
                            <Col xs={24} lg={14}>
                                <ChartCard title="绿色算力监控 (PUE趋势)" icon={<ThunderboltOutlined style={{ color: '#10B981' }}/>} height="300px">
                                    <div ref={lineRef} style={{ width: '100%', height: '100%' }} />
                                </ChartCard>
                            </Col>
                            <Col xs={24} lg={10}>
                                <ChartCard title="任务调度状态" icon={<ApiOutlined style={{ color: '#F59E0B' }}/>} height="300px">
                                    <div ref={taskRef} style={{ width: '100%', height: '100%' }} />
                                </ChartCard>
                            </Col>
                        </Row>
                    </>
                ) : <Empty />}
            </div>
        </div>
    );
};

export default InfraMonitor;
