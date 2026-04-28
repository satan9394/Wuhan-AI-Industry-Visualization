import React, { useEffect, useState, useRef } from 'react';
import { Spin, Empty, Tag, Card, Row, Col, Input, List } from 'antd';
import * as echarts from 'echarts';
import { fetchChainGraph } from '../api';
import { TOKENS, getResolvedTokens } from '../theme';
import { DeploymentUnitOutlined, SearchOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useUiMode } from '../context/UiModeContext';

const SupplyChainMap = () => {
    const { mode } = useUiMode();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [searchText, setSearchText] = useState('');
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await fetchChainGraph();
                setData(res);
            } catch (error) {
                console.error("Failed to load chain graph", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!data || !chartRef.current) return;

        const chart = echarts.init(chartRef.current);
        chartInstance.current = chart;
        const { colors } = getResolvedTokens();

        const option = {
            tooltip: {},
            legend: [{
                data: data.categories.map(a => a.name),
                bottom: 20,
                textStyle: { color: colors.textSecondary }
            }],
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [{
                type: 'graph',
                layout: 'force',
                data: data.nodes.map(n => ({
                    ...n,
                    itemStyle: { 
                        color: n.category === 0 ? '#3B82F6' : (n.category === 1 ? '#8B5CF6' : '#10B981'),
                        borderColor: '#fff',
                        borderWidth: 2,
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,0,0,0.1)'
                    },
                    label: {
                        show: n.symbolSize > 30, // Only show label for big nodes by default
                        position: 'right',
                        color: colors.textPrimary
                    }
                })),
                links: data.links,
                categories: data.categories,
                roam: true,
                zoom: 0.8,
                label: { position: 'right', formatter: '{b}' },
                lineStyle: { color: 'source', curveness: 0.3, width: 1.5, opacity: 0.6 },
                force: { repulsion: 300, edgeLength: 100, gravity: 0.1 },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: { width: 4 }
                }
            }]
        };
        
        chart.setOption(option);

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.dispose();
        };
    }, [data, mode]);

    // Search Handler
    const handleSearch = (value) => {
        setSearchText(value);
        if (!chartInstance.current || !data) return;
        
        // Highlight logic
        if (!value) {
            chartInstance.current.dispatchAction({ type: 'downplay' });
            return;
        }

        const dataIndex = data.nodes.findIndex(n => n.name.includes(value));
        if (dataIndex !== -1) {
            chartInstance.current.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: dataIndex
            });
            chartInstance.current.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: dataIndex
            });
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out', padding: 'var(--ui-page-padding)', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ maxWidth: 'var(--ui-page-width)', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <div>
                        <h1 className="page-title">人工智能产业链图谱</h1>
                        <p className="page-subtitle">交互式探索基础层、技术层与应用层企业的协作关系</p>
                    </div>
                    <div style={{ width: '300px' }}>
                        <Input.Search 
                            placeholder="搜索产业链节点或企业..." 
                            allowClear 
                            enterButton={<SearchOutlined />} 
                            size="large"
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Spin size="large" /></div>
                ) : data ? (
                    <div style={{ 
                        flex: 1, 
                        background: TOKENS.colors.cardBg, 
                        borderRadius: '12px', 
                        boxShadow: TOKENS.shadows.card, 
                        border: `1px solid ${TOKENS.colors.border}`,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Floating Legend / Stats */}
                        <div style={{ 
                            position: 'absolute', 
                            top: '24px', 
                            left: '24px', 
                            zIndex: 10, 
                            background: 'rgba(255,255,255,0.9)', 
                            padding: '16px', 
                            borderRadius: '12px',
                            backdropFilter: 'blur(8px)',
                            border: `1px solid ${TOKENS.colors.border}`,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: TOKENS.colors.textSecondary }}>图谱图例</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Tag color="blue" style={{ margin: 0 }}><SafetyCertificateOutlined /> 基础层 (芯片/算力)</Tag>
                                <Tag color="purple" style={{ margin: 0 }}><DeploymentUnitOutlined /> 技术层 (模型/算法)</Tag>
                                <Tag color="green" style={{ margin: 0 }}><DeploymentUnitOutlined /> 应用层 (场景落地)</Tag>
                            </div>
                        </div>

                        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
                    </div>
                ) : <Empty />}
            </div>
        </div>
    );
};

export default SupplyChainMap;
