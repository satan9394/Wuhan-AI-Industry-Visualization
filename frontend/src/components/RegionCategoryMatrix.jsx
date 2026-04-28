import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Spin, Empty } from 'antd';
import * as echarts from 'echarts';
import { AppstoreOutlined, EnvironmentOutlined, ApartmentOutlined } from '@ant-design/icons';
import { TOKENS, getResolvedTokens } from '../theme';
import { useUiMode } from '../context/UiModeContext';
import { fetchRegionCategoryStats } from '../api';

const StatCard = ({ title, value, suffix, icon, color }) => (
    <Card
        bordered={false}
        style={{
            borderRadius: '12px',
            boxShadow: TOKENS.shadows.card,
            height: '100%',
        }}
    >
        <Statistic
            title={<span style={{ color: TOKENS.colors.textSecondary }}>{title}</span>}
            value={value}
            suffix={suffix}
            prefix={icon}
            valueStyle={{
                color,
                fontWeight: 700,
                fontSize: '28px',
                fontFamily: TOKENS.fonts.mono,
            }}
        />
    </Card>
);

const RegionCategoryMatrix = () => {
    const { mode } = useUiMode();
    const [loading, setLoading] = useState(false);
    const [matrixData, setMatrixData] = useState({
        regions: [],
        categories: [],
        matrix: [],
        top_pairs: [],
        totals: { overall: 0, regions: {}, categories: {} },
    });
    const chartRef = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await fetchRegionCategoryStats();
                setMatrixData(res || {});
            } catch (error) {
                console.error('Failed to load region-category stats', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (loading || !chartRef.current) return;

        const chart = echarts.init(chartRef.current);
        const { colors } = getResolvedTokens();
        const { regions = [], categories = [], matrix = [] } = matrixData;
        const maxValue = matrix.reduce((max, item) => Math.max(max, item[2] || 0), 0);

        if (!regions.length || !categories.length) {
            chart.clear();
            return () => chart.dispose();
        }

        chart.setOption({
            tooltip: {
                position: 'top',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: colors.border,
                textStyle: { color: colors.textPrimary },
                formatter: (params) => {
                    const [x, y, val] = params.value;
                    return `${regions[y]} / ${categories[x]}<br/>企业数: ${val}`;
                },
            },
            grid: { left: '10%', right: '6%', top: '8%', bottom: '14%' },
            xAxis: {
                type: 'category',
                data: categories,
                axisLabel: {
                    color: colors.textSecondary,
                    rotate: 30,
                    fontSize: 11,
                },
                axisLine: { lineStyle: { color: colors.border } },
                axisTick: { show: false },
            },
            yAxis: {
                type: 'category',
                data: regions,
                axisLabel: { color: colors.textSecondary },
                axisLine: { lineStyle: { color: colors.border } },
                axisTick: { show: false },
            },
            visualMap: {
                min: 0,
                max: maxValue || 1,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: 0,
                inRange: {
                    color: ['#E2E8F0', '#3B82F6'],
                },
                textStyle: { color: colors.textSecondary },
            },
            series: [{
                name: '企业分布',
                type: 'heatmap',
                data: matrix,
                label: { show: false },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 6,
                        shadowColor: 'rgba(15, 23, 42, 0.18)',
                    },
                },
            }],
        });

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.dispose();
        };
    }, [loading, matrixData, mode]);

    const topRows = (matrixData.top_pairs || []).map((item, idx) => ({
        key: `${item.region}-${item.category_level_1}-${idx}`,
        region: item.region,
        category: item.category_level_1,
        value: item.value,
    }));

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: '产业环节',
            dataIndex: 'category',
            render: (text) => <Tag color="green">{text}</Tag>,
        },
        {
            title: '企业数',
            dataIndex: 'value',
            align: 'right',
        },
    ];

    return (
        <div style={{ padding: 'var(--ui-page-padding)', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ maxWidth: 'var(--ui-page-width)', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 className="page-title">
                        <AppstoreOutlined /> 区域-产业矩阵
                    </h1>
                    <p className="page-subtitle">
                        统计 `data/processed/enterprises.csv` 的区域与产业环节交叉分布
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
                        <Spin size="large" />
                    </div>
                ) : !matrixData?.regions?.length ? (
                    <Empty description="暂无矩阵数据" />
                ) : (
                    <>
                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24} sm={8}>
                                <StatCard
                                    title="覆盖区域"
                                    value={matrixData.regions.length}
                                    suffix="个"
                                    icon={<EnvironmentOutlined style={{ color: TOKENS.colors.accentSecondary }} />}
                                    color={TOKENS.colors.accentSecondary}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <StatCard
                                    title="产业环节"
                                    value={matrixData.categories.length}
                                    suffix="类"
                                    icon={<ApartmentOutlined style={{ color: TOKENS.colors.success }} />}
                                    color={TOKENS.colors.success}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <StatCard
                                    title="有效记录"
                                    value={matrixData.totals?.overall || 0}
                                    suffix="条"
                                    icon={<AppstoreOutlined style={{ color: TOKENS.colors.warning }} />}
                                    color={TOKENS.colors.warning}
                                />
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={16}>
                                <Card
                                    title="区域-产业交叉热力图"
                                    bordered={false}
                                    style={{ borderRadius: '12px', boxShadow: TOKENS.shadows.card, height: '100%' }}
                                    bodyStyle={{ height: '480px' }}
                                >
                                    <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
                                </Card>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Card
                                    title="高密度组合 TOP 8"
                                    bordered={false}
                                    style={{ borderRadius: '12px', boxShadow: TOKENS.shadows.card, height: '100%' }}
                                >
                                    <Table
                                        columns={columns}
                                        dataSource={topRows}
                                        pagination={false}
                                        size="small"
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
        </div>
    );
};

export default RegionCategoryMatrix;
