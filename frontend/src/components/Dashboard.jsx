import React, { useEffect, useState, useRef } from 'react';
import { Card, Row, Col, Table, Statistic, Button, Tag, Space, Carousel, Alert, Modal, Switch, Tooltip, Input, Select } from 'antd';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { fetchEnterprises, exportEnterprises, fetchRegionStats, fetchCategoryStats, fetchKeywordsStats, fetchInfraStats, fetchInnovationStats, fetchAtlasSummary, fetchAtlasEnterprises } from '../api';
import MapComponent from './MapComponent';
import { SoundOutlined, FullscreenOutlined, ExpandAltOutlined, SearchOutlined, TrophyOutlined, RiseOutlined, ShopOutlined, ThunderboltOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { TOKENS, getResolvedTokens } from '../theme';
import { useUiMode } from '../context/UiModeContext';

// --- Custom Components ---
const StatCard = ({ title, value, suffix, color }) => (
    <div className="ui-card ui-card-stat" style={{
        background: TOKENS.colors.cardBg,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: TOKENS.shadows.card,
        border: `1px solid ${TOKENS.colors.border}`,
        height: '100%',
        transition: 'all 0.3s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden'
    }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = TOKENS.shadows.cardHover;
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = TOKENS.shadows.card;
        }}
    >
        <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: `linear-gradient(135deg, transparent 50%, ${color}15 50%)`,
            borderBottomLeftRadius: '32px'
        }} />
        <p style={{ color: TOKENS.colors.textSecondary, fontSize: '13px', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</p>
        <div style={{ fontSize: '32px', fontWeight: 700, color: TOKENS.colors.textPrimary, letterSpacing: '-0.02em', fontFamily: TOKENS.fonts.mono }}>
            {value}
            <span style={{ fontSize: '14px', color: TOKENS.colors.textTertiary, marginLeft: '6px', fontWeight: 500 }}>{suffix}</span>
        </div>
    </div>
);

const SectionTitle = ({ title, subtitle }) => (
    <div className="ui-section-title">
        <h3>{title}</h3>
        {subtitle && <span style={{ fontSize: '12px', color: TOKENS.colors.textSecondary }}>{subtitle}</span>}
    </div>
);

const ChartCard = ({ title, children, height = '400px', onFullscreen, extra }) => (
    <div className="ui-card ui-card-chart" style={{
        background: TOKENS.colors.cardBg,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: TOKENS.shadows.card,
        border: `1px solid ${TOKENS.colors.border}`,
        height: '100%',
        position: 'relative'
    }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {title && <h3 style={{ fontSize: '14px', fontWeight: 600, color: TOKENS.colors.textSecondary, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>}
            <Space>
                {extra}
                {onFullscreen && (
                    <Tooltip title="全屏查看">
                        <Button
                            type="text"
                            icon={<ExpandAltOutlined />}
                            onClick={onFullscreen}
                            style={{ color: TOKENS.colors.textSecondary }}
                        />
                    </Tooltip>
                )}
            </Space>
        </div>
        <div style={{ height, width: '100%' }}>{children}</div>
    </div>
);

const Dashboard = ({ onSelectEnterprise }) => {
    const { mode } = useUiMode();
    const [loading, setLoading] = useState(true);
    const [enterprises, setEnterprises] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        region: '',
        category: '',
        subcategory: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10
    });

    const [regionStats, setRegionStats] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [keywordsStats, setKeywordsStats] = useState([]);
    const [infraStats, setInfraStats] = useState(null);
    const [innovationStats, setInnovationStats] = useState(null);
    const [atlasSummary, setAtlasSummary] = useState({ total: 0, level1: [], level2: [], level3: [], regions: [] });
    const [atlasEnterprises, setAtlasEnterprises] = useState([]);
    const [atlasLoading, setAtlasLoading] = useState(true);

    const [fullscreenChart, setFullscreenChart] = useState(null);
    const [showLabels, setShowLabels] = useState(true);
    const fullscreenChartRef = useRef(null);
    const chartOptionsRef = useRef({});

    const regionChartRef = useRef(null);
    const categoryChartRef = useRef(null);
    const keywordsChartRef = useRef(null);
    const atlasSubcategoryChartRef = useRef(null);

    // Load Stats
    useEffect(() => {
        const loadStats = async () => {
            try {
                const [regData, catData, keyData, infraData, innoData] = await Promise.all([
                    fetchRegionStats(),
                    fetchCategoryStats(),
                    fetchKeywordsStats(),
                    fetchInfraStats(),
                    fetchInnovationStats()
                ]);
                setRegionStats(regData);
                setCategoryStats(catData);
                setKeywordsStats(keyData);
                setInfraStats(infraData);
                setInnovationStats(innoData);
            } catch (error) {
                console.error("Failed to load stats", error);
            }
        };
        loadStats();
    }, []);

    useEffect(() => {
        const loadAtlasData = async () => {
            setAtlasLoading(true);
            try {
                const [summary, entries] = await Promise.all([
                    fetchAtlasSummary(),
                    fetchAtlasEnterprises()
                ]);
                setAtlasSummary(summary);
                setAtlasEnterprises(entries);
            } catch (error) {
                console.error("Failed to load atlas data", error);
            } finally {
                setAtlasLoading(false);
            }
        };
        loadAtlasData();
    }, []);

    // Load Enterprises
    useEffect(() => {
        const loadEnterprisesData = async () => {
            setLoading(true);
            try {
                const data = await fetchEnterprises(
                    pagination.current,
                    pagination.pageSize,
                    filters.search,
                    filters.region,
                    filters.category,
                    filters.subcategory
                );

                if (data.items) {
                    setEnterprises(data.items);
                    setTotal(data.total);
                } else {
                    setEnterprises(data);
                    setTotal(data.length);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to load enterprises", error);
                setLoading(false);
            }
        };
        loadEnterprisesData();
    }, [filters, pagination]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const resetFilters = () => {
        setFilters({ region: '', category: '', subcategory: '', search: '' });
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleSearch = (value) => {
        handleFilterChange('search', value);
    };

    const handleExport = async () => {
        try {
            const response = await exportEnterprises(
                filters.search, 
                filters.region, 
                filters.category, 
                filters.subcategory
            );
            
            // Create Blob URL and download
            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Try to extract filename from header
            const contentDisposition = response.headers['content-disposition'];
            let filename = `wuhan_ai_enterprises_${new Date().toISOString().slice(0,10)}.csv`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename\*=utf-8''(.+)/i);
                if (filenameMatch && filenameMatch[1]) {
                    filename = decodeURIComponent(filenameMatch[1]);
                }
            }
            
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error("Export failed:", error);
            Modal.error({ title: '导出错误', content: '无法获取数据，请检查网络或稍后重试' });
        }
    };

    const getChartTheme = () => {
        const { colors } = getResolvedTokens();
        return {
            colors,
            commonChartConfig: {
                color: TOKENS.chartPalette,
                textStyle: { fontFamily: 'Inter, system-ui, sans-serif' },
                toolbox: {
                    feature: {
                        dataZoom: { yAxisIndex: 'none' },
                        restore: {},
                        saveAsImage: {}
                    },
                    right: 20
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: colors.border,
                    textStyle: { color: colors.textPrimary },
                    padding: [12, 16],
                    extraCssText: `box-shadow: ${TOKENS.shadows.floating}; border-radius: 8px;`
                }
            }
        };
    };

    // Region Chart
    useEffect(() => {
        if (loading || !regionChartRef.current) return;
        const chart = echarts.init(regionChartRef.current);
        const { colors, commonChartConfig } = getChartTheme();
        const option = {
            ...commonChartConfig,
            grid: { left: '2%', right: '2%', bottom: '15%', top: '10%', containLabel: true },
            tooltip: { ...commonChartConfig.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    start: 0,
                    end: 100,
                    bottom: 0,
                    height: 20
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                }
            ],
            legend: {
                show: true,
                bottom: 25,
                textStyle: { color: colors.textSecondary },
                itemWidth: 12,
                itemHeight: 12
            },
            xAxis: {
                type: 'category',
                data: regionStats.map(item => item.name),
                axisLabel: {
                    interval: 0,
                    rotate: 45,
                    color: colors.textSecondary,
                    fontSize: 11
                },
                axisLine: { lineStyle: { color: colors.border } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } },
                axisLabel: { color: colors.textSecondary }
            },
            series: [{
                name: '企业数量',
                type: 'bar',
                data: regionStats.map(item => item.value),
                barMaxWidth: 32,
                label: {
                    show: showLabels,
                    position: 'top',
                    color: colors.textSecondary,
                    fontSize: 11
                },
                itemStyle: {
                    borderRadius: [6, 6, 0, 0],
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#3B82F6' },
                        { offset: 1, color: '#60A5FA' }
                    ])
                },
                emphasis: { itemStyle: { color: '#2563EB' } }
            }]
        };
        chart.setOption(option);
        chartOptionsRef.current.region = option;

        chart.on('click', (params) => handleFilterChange('region', params.name));
        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);
        return () => { chart.dispose(); window.removeEventListener('resize', handleResize); };
    }, [loading, regionStats, showLabels, mode]);

    // Category Chart
    useEffect(() => {
        if (loading || !categoryChartRef.current) return;
        const chart = echarts.init(categoryChartRef.current);
        const { colors, commonChartConfig } = getChartTheme();
        const option = {
            ...commonChartConfig,
            tooltip: { ...commonChartConfig.tooltip, trigger: 'item' },
            legend: {
                bottom: '0%',
                left: 'center',
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                textStyle: { color: colors.textSecondary }
            },
            series: [{
                name: '一级分类',
                type: 'pie',
                radius: ['45%', '70%'],
                center: ['50%', '45%'],
                itemStyle: {
                    borderRadius: 8,
                    borderColor: '#fff',
                    borderWidth: 3
                },
                label: {
                    show: showLabels,
                    formatter: '{b}\n{c} ({d}%)',
                    color: colors.textSecondary
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: colors.textPrimary
                    },
                    scale: true,
                    scaleSize: 10
                },
                data: categoryStats
            }]
        };
        chart.setOption(option);
        chartOptionsRef.current.category = option;

        chart.on('click', (params) => handleFilterChange('category', params.name));
        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);
        return () => { chart.dispose(); window.removeEventListener('resize', handleResize); };
    }, [loading, categoryStats, showLabels, mode]);

    // Keywords Chart (WordCloud)
    useEffect(() => {
        if (loading || !keywordsChartRef.current) return;
        const { colors, commonChartConfig } = getChartTheme();

        // Debug data
        console.log('Keywords Data:', keywordsStats);

        if (!keywordsStats || keywordsStats.length === 0) {
            // Render a placeholder if no data
            const chart = echarts.init(keywordsChartRef.current);
            const emptyOption = {
                title: {
                    text: '暂无数据',
                    left: 'center',
                    top: 'center',
                    textStyle: { color: colors.textSecondary }
                }
            };
            chart.setOption(emptyOption);
            chartOptionsRef.current.keywords = emptyOption;
            return;
        }

        const chart = echarts.init(keywordsChartRef.current);

        // Take more keywords for wordcloud to look dense
        const topKeywords = keywordsStats.slice(0, 60);

        const option = {
            ...commonChartConfig,
            tooltip: {
                ...commonChartConfig.tooltip,
                trigger: 'item',
                formatter: '{b}: {c} (热度)'
            },
            series: [{
                type: 'wordCloud',
                shape: 'circle',
                left: 'center',
                top: 'center',
                width: '95%',
                height: '95%',
                right: null,
                bottom: null,
                sizeRange: [12, 40],
                rotationRange: [-45, 90],
                rotationStep: 45,
                gridSize: 8,
                drawOutOfBound: false,
                layoutAnimation: true,
                textStyle: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 'bold',
                    color: function () {
                        // Random color from palette
                        return TOKENS.chartPalette[Math.floor(Math.random() * TOKENS.chartPalette.length)];
                    }
                },
                emphasis: {
                    focus: 'self',
                    textStyle: {
                        textShadowBlur: 10,
                        textShadowColor: '#333'
                    }
                },
                data: topKeywords.map(item => ({
                    name: item.name,
                    value: item.value
                }))
            }]
        };
        chart.setOption(option);
        chartOptionsRef.current.keywords = option;

        chart.on('click', (params) => handleFilterChange('search', params.name));
        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);
        return () => { chart.dispose(); window.removeEventListener('resize', handleResize); };
    }, [loading, keywordsStats, mode]);

    // Atlas Subcategory Chart
    useEffect(() => {
        if (atlasLoading || !atlasSubcategoryChartRef.current) return;
        const chart = echarts.init(atlasSubcategoryChartRef.current);
        const { colors, commonChartConfig } = getChartTheme();
        const rawData = Array.isArray(atlasSummary.level3) ? atlasSummary.level3 : [];
        const topData = rawData
            .filter((item) => item['三级分类'] && item['三级分类'] !== '未细分')
            .slice(0, 10);

        if (topData.length === 0) {
            chart.setOption({
                title: {
                    text: '暂无数据',
                    left: 'center',
                    top: 'center',
                    textStyle: { color: colors.textSecondary }
                }
            });
            return () => chart.dispose();
        }

        const option = {
            ...commonChartConfig,
            tooltip: {
                ...commonChartConfig.tooltip,
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params) => {
                    const item = topData[params[0].dataIndex];
                    return `${item['一级分类']} / ${item['二级分类']} / ${item['三级分类']}<br/>企业数量: ${item.count}`;
                }
            },
            grid: { left: '6%', right: '6%', top: '8%', bottom: '6%', containLabel: true },
            xAxis: {
                type: 'value',
                axisLabel: { color: colors.textSecondary },
                splitLine: { lineStyle: { type: 'dashed', color: colors.border } }
            },
            yAxis: {
                type: 'category',
                data: topData.map(item => item['三级分类']),
                axisLabel: {
                    color: colors.textSecondary,
                    formatter: (value) => (value.length > 8 ? `${value.slice(0, 8)}...` : value)
                },
                axisLine: { lineStyle: { color: colors.border } },
                axisTick: { show: false }
            },
            series: [{
                type: 'bar',
                data: topData.map(item => item.count),
                barMaxWidth: 18,
                label: {
                    show: true,
                    position: 'right',
                    color: colors.textSecondary,
                    fontSize: 11
                },
                itemStyle: {
                    borderRadius: 6,
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                        { offset: 0, color: '#60A5FA' },
                        { offset: 1, color: '#3B82F6' }
                    ])
                }
            }]
        };
        chart.setOption(option);

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);
        return () => {
            chart.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, [atlasLoading, atlasSummary, mode]);

    // Fullscreen Chart Effect
    useEffect(() => {
        if (fullscreenChart && fullscreenChartRef.current) {
            console.log('Attempting to render fullscreen chart:', fullscreenChart);

            let chartInstance = null;
            // Use polling to wait for Modal animation and DOM readiness
            const checkInterval = setInterval(() => {
                const container = fullscreenChartRef.current;
                // Ensure container has dimensions
                if (container && container.offsetWidth > 0 && container.offsetHeight > 0) {
                    clearInterval(checkInterval);
                    console.log('Container ready:', container.offsetWidth, container.offsetHeight);

                    try {
                        const existing = echarts.getInstanceByDom(container);
                        if (existing) existing.dispose();

                        chartInstance = echarts.init(container);
                        const option = chartOptionsRef.current[fullscreenChart];

                        if (option) {
                            chartInstance.setOption(option);
                            // Force resize to fit container with a slight delay to ensure Modal animation completes
                            setTimeout(() => {
                                chartInstance.resize();
                            }, 100);
                            console.log('Fullscreen chart initialized successfully');
                        } else {
                            console.warn('No option found for chart:', fullscreenChart);
                            // Fallback if option is missing (should not happen if loaded)
                            chartInstance.setOption({
                                title: { text: '数据加载中...', left: 'center', top: 'center' }
                            });
                        }
                    } catch (err) {
                        console.error('Error initializing fullscreen chart:', err);
                    }
                }
            }, 100);

            const handleResize = () => chartInstance && chartInstance.resize();
            window.addEventListener('resize', handleResize);

            return () => {
                clearInterval(checkInterval);
                window.removeEventListener('resize', handleResize);
                if (chartInstance) {
                    chartInstance.dispose();
                } else if (fullscreenChartRef.current) {
                    const existing = echarts.getInstanceByDom(fullscreenChartRef.current);
                    if (existing) existing.dispose();
                }
            };
        }
    }, [fullscreenChart]);

    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            width: 80,
            render: text => <span style={{ color: TOKENS.colors.textSecondary, fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>#{text}</span>
        },
        {
            title: '企业名称',
            dataIndex: 'name',
            width: 220,
            render: text => (
                <a onClick={(e) => { e.preventDefault(); onSelectEnterprise && onSelectEnterprise(text); }}>
                    <span style={{ fontWeight: 600, color: TOKENS.colors.accent, cursor: 'pointer' }}>{text}</span>
                </a>
            )
        },
        {
            title: '区域',
            dataIndex: 'region',
            width: 100,
            render: text => <Tag color="blue" style={{ borderRadius: '12px', border: 'none', background: '#EFF6FF', color: '#3B82F6' }}>{text}</Tag>
        },
        {
            title: '一级分类',
            dataIndex: 'category_level_1',
            width: 140,
            render: text => <Tag color="green" style={{ borderRadius: '12px', border: 'none', background: '#ECFDF5', color: '#10B981' }}>{text}</Tag>
        },
        {
            title: '二级分类',
            dataIndex: 'category_level_2',
            width: 140,
            render: text => <Tag color="cyan" style={{ borderRadius: '12px', border: 'none', background: '#ECFEFF', color: '#06B6D4' }}>{text}</Tag>
        },
        {
            title: '核心业务',
            dataIndex: 'products',
            ellipsis: true,
            render: text => <span style={{ color: TOKENS.colors.textSecondary }}>{text}</span>
        },
    ];

    const atlasLevel1Columns = [
        {
            title: '一级分类',
            dataIndex: '一级分类',
            render: (text) => <Tag color="blue" style={{ borderRadius: '12px', border: 'none', background: '#EFF6FF', color: '#2563EB' }}>{text}</Tag>
        },
        {
            title: '企业数量',
            dataIndex: 'count',
            width: 100,
            render: (value) => <Tag color="geekblue" style={{ borderRadius: '12px', border: 'none', background: '#EEF2FF', color: '#4338CA' }}>{value}</Tag>
        },
        {
            title: '占比',
            dataIndex: 'ratio',
            width: 90,
            render: (value) => <span style={{ color: TOKENS.colors.textSecondary }}>{value}%</span>
        }
    ];

    const atlasLevel2Columns = [
        {
            title: '一级分类',
            dataIndex: '一级分类',
            width: 120,
            render: (text) => <Tag color="blue" style={{ borderRadius: '12px', border: 'none', background: '#EFF6FF', color: '#2563EB' }}>{text}</Tag>
        },
        {
            title: '二级分类',
            dataIndex: '二级分类',
            width: 140,
            render: (text) => <Tag color="green" style={{ borderRadius: '12px', border: 'none', background: '#ECFDF5', color: '#16A34A' }}>{text}</Tag>
        },
        {
            title: '企业数量',
            dataIndex: 'count',
            width: 100,
            render: (value) => <Tag color="geekblue" style={{ borderRadius: '12px', border: 'none', background: '#EEF2FF', color: '#4338CA' }}>{value}</Tag>
        }
    ];

    const atlasLevel3Columns = [
        {
            title: '一级分类',
            dataIndex: '一级分类',
            width: 120,
            render: (text) => <Tag color="blue" style={{ borderRadius: '12px', border: 'none', background: '#EFF6FF', color: '#2563EB' }}>{text}</Tag>
        },
        {
            title: '二级分类',
            dataIndex: '二级分类',
            width: 140,
            render: (text) => <Tag color="green" style={{ borderRadius: '12px', border: 'none', background: '#ECFDF5', color: '#16A34A' }}>{text}</Tag>
        },
        {
            title: '三级分类',
            dataIndex: '三级分类',
            width: 140,
            render: (text) => <span style={{ color: TOKENS.colors.textSecondary }}>{text || '未细分'}</span>
        },
        {
            title: '企业数量',
            dataIndex: 'count',
            width: 100,
            render: (value) => <Tag color="geekblue" style={{ borderRadius: '12px', border: 'none', background: '#EEF2FF', color: '#4338CA' }}>{value}</Tag>
        }
    ];

    const atlasRegionColumns = [
        {
            title: '注册地',
            dataIndex: '注册地',
            render: (text) => <Tag color="cyan" style={{ borderRadius: '12px', border: 'none', background: '#ECFEFF', color: '#0891B2' }}>{text}</Tag>
        },
        {
            title: '企业数量',
            dataIndex: 'count',
            width: 100,
            render: (value) => <Tag color="geekblue" style={{ borderRadius: '12px', border: 'none', background: '#EEF2FF', color: '#4338CA' }}>{value}</Tag>
        }
    ];

    const atlasEnterpriseColumns = [
        {
            title: '证书编号',
            dataIndex: '证书编号',
            width: 140,
            render: (text) => <span style={{ color: TOKENS.colors.textSecondary, fontFamily: TOKENS.fonts.mono }}>{text}</span>
        },
        {
            title: '企业名称',
            dataIndex: '企业名称',
            width: 220,
            render: (text) => <span style={{ fontWeight: 600, color: TOKENS.colors.textPrimary }}>{text}</span>
        },
        {
            title: '一级分类',
            dataIndex: '一级分类',
            width: 120,
            render: (text) => <Tag color="blue" style={{ borderRadius: '12px', border: 'none', background: '#EFF6FF', color: '#2563EB' }}>{text}</Tag>
        },
        {
            title: '二级分类',
            dataIndex: '二级分类',
            width: 140,
            render: (text) => <Tag color="green" style={{ borderRadius: '12px', border: 'none', background: '#ECFDF5', color: '#16A34A' }}>{text}</Tag>
        },
        {
            title: '三级分类',
            dataIndex: '三级分类',
            width: 140,
            render: (text) => <span style={{ color: TOKENS.colors.textSecondary }}>{text || '—'}</span>
        },
        {
            title: '注册地',
            dataIndex: '注册地',
            width: 120,
            render: (text) => <Tag color="cyan" style={{ borderRadius: '12px', border: 'none', background: '#ECFEFF', color: '#0891B2' }}>{text}</Tag>
        },
        {
            title: '主要代表性技术/产品/服务',
            dataIndex: '主要代表性技术/产品/服务',
            ellipsis: true,
            render: (text) => <span style={{ color: TOKENS.colors.textSecondary }}>{text}</span>
        }
    ];

    const keywordTop = keywordsStats.slice(0, 8);
    const keywordTotal = keywordsStats.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    const topKeyword = keywordTop[0];

    return (
        <div className="dashboard-root" style={{ background: 'transparent', minHeight: '100vh', padding: 'var(--ui-page-padding)', animation: 'fadeIn 0.5s ease-out' }}>
            <div className="dashboard-inner" style={{ width: '100%', maxWidth: '100%', margin: 0 }}>

                    {/* Header */}
                    <div className="dashboard-header" style={{ marginBottom: '24px', borderBottom: `1px solid ${TOKENS.colors.border}`, paddingBottom: '24px' }}>
                        <Row justify="space-between" align="middle">
                            <Col>
                                <h1 className="dashboard-title">
                                    产业生态可视化
                                </h1>
                                <p className="dashboard-subtitle" style={{ color: TOKENS.colors.textSecondary }}>
                                    湖北省人工智能企业全景分析看板
                                </p>
                            </Col>
                            <Col>
                                <Space>
                                    <Switch
                                        checked={showLabels}
                                        onChange={setShowLabels}
                                        checkedChildren="标签开启"
                                        unCheckedChildren="标签关闭"
                                        style={{ marginRight: '16px' }}
                                    />
                                    <Button type="default" size="large" onClick={resetFilters} style={{ borderRadius: '8px' }}>
                                        重置视图
                                    </Button>
                                    <Button type="primary" size="large" onClick={handleExport} style={{ borderRadius: '8px', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)' }}>
                                        导出报告
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </div>

                    {/* Industry Briefing Marquee */}
                    <div style={{ marginBottom: '32px' }}>
                        <Alert
                            banner
                            message={
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <SoundOutlined style={{ marginRight: '12px', color: TOKENS.colors.accentSecondary, fontSize: '16px' }} />
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <Carousel autoplay dots={false} effect="fade" autoplaySpeed={4000} style={{ width: '100%' }}>
                                            <div><span style={{ color: TOKENS.colors.textSecondary, fontWeight: 500 }}>🚀 2025年武汉人工智能产业规模突破1000亿元，年均增速超30%</span></div>
                                            <div><span style={{ color: TOKENS.colors.textSecondary, fontWeight: 500 }}>📜 “人工智能十条”重磅发布，确立“智能体”为产业核心抓手</span></div>
                                            <div><span style={{ color: TOKENS.colors.textSecondary, fontWeight: 500 }}>🏭 全市算力规模突破5 EFLOPS，智算中心利用率超74%</span></div>
                                            <div><span style={{ color: TOKENS.colors.textSecondary, fontWeight: 500 }}>🏥 医疗数据资产入表实现“零的突破”，首批获贷1.26亿元</span></div>
                                        </Carousel>
                                    </div>
                                    <Tag color="blue" style={{ marginLeft: '16px', border: 'none' }}>2025快讯</Tag>
                                </div>
                            }
                            type="info"
                            style={{
                                borderRadius: '12px',
                                border: `1px solid ${TOKENS.colors.border}`,
                                background: TOKENS.colors.cardBg,
                                padding: '12px 24px'
                            }}
                        />
                    </div>

                    {/* Active Filters Bar */}
                    {(filters.region || filters.category || filters.subcategory || filters.search) && (
                        <div style={{ marginBottom: '32px', animation: 'fadeIn 0.3s ease-out' }}>
                            <div className="ui-card" style={{
                                background: TOKENS.colors.cardBg,
                                padding: '16px 24px',
                                borderRadius: '12px',
                                border: `1px solid ${TOKENS.colors.border}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                boxShadow: TOKENS.shadows.card
                            }}>
                                <span style={{ fontWeight: 600, color: TOKENS.colors.textSecondary, fontSize: '14px' }}>筛选条件:</span>
                                <Space wrap>
                                    {filters.region && <Tag closable onClose={() => handleFilterChange('region', '')} style={{ padding: '4px 12px', borderRadius: '20px', background: '#EFF6FF', border: 'none', color: '#2563EB', fontSize: '14px' }}>区域: {filters.region}</Tag>}
                                    {filters.category && <Tag closable onClose={() => handleFilterChange('category', '')} style={{ padding: '4px 12px', borderRadius: '20px', background: '#F0FDF4', border: 'none', color: '#16A34A', fontSize: '14px' }}>一级: {filters.category}</Tag>}
                                    {filters.subcategory && <Tag closable onClose={() => handleFilterChange('subcategory', '')} style={{ padding: '4px 12px', borderRadius: '20px', background: '#ECFEFF', border: 'none', color: '#0891B2', fontSize: '14px' }}>二级: {filters.subcategory}</Tag>}
                                    {filters.search && <Tag closable onClose={() => handleFilterChange('search', '')} style={{ padding: '4px 12px', borderRadius: '20px', background: '#F5F3FF', border: 'none', color: '#7C3AED', fontSize: '14px' }}>关键词: {filters.search}</Tag>}
                                </Space>
                                <Button type="link" onClick={resetFilters} style={{ color: TOKENS.colors.textSecondary, marginLeft: 'auto' }}>清除所有</Button>
                            </div>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard title="入库企业总数" value={total} suffix="家" color="#3B82F6" />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard title="产业规模 (2025)" value="1000" suffix="亿+" color="#10B981" />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard 
                                title="算力规模" 
                                value={infraStats ? infraStats.computing_power.total : 5100} 
                                suffix="PFlops" 
                                color="#F59E0B" 
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard 
                                title="创新/人才排名" 
                                value={`#${innovationStats ? innovationStats.rankings.forbes_china : 4}`} 
                                suffix="/ #6" 
                                color="#8B5CF6" 
                                icon={<TrophyOutlined />}
                                badge={
                                    <Space direction="vertical" size={0}>
                                        <Tag color="purple" style={{ margin: '2px 0', fontSize: '12px' }}>Forbes China AI Top 50</Tag>
                                        <Tag color="geekblue" style={{ margin: '2px 0', fontSize: '12px' }}>Global Talent Rank</Tag>
                                    </Space>
                                }
                            />
                        </Col>
                    </Row>

                    {/* Charts Area */}
                    <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                        {/* Left Column: Pie + Map(Bar) */}
                        <Col xs={24} lg={14}>
                            <Space direction="vertical" size={24} style={{ width: '100%' }}>
                                <ChartCard
                                    title="产业链构成分析"
                                    height="400px"
                                    onFullscreen={() => setFullscreenChart('category')}
                                >
                                    <div ref={categoryChartRef} style={{ height: '100%', width: '100%' }} />
                                </ChartCard>
                                <div style={{ height: '450px' }}>
                                    <MapComponent onRegionSelect={(region) => handleFilterChange('region', region)} />
                                </div>
                            </Space>
                        </Col>

                        {/* Right Column: Keywords */}
                        <Col xs={24} lg={10}>
                            <Space direction="vertical" size={24} style={{ width: '100%' }}>
                                <ChartCard
                                    title="热门技术趋势"
                                    height="360px"
                                    onFullscreen={() => setFullscreenChart('keywords')}
                                >
                                    <div style={{ display: 'flex', gap: '16px', height: '100%' }}>
                                        <div style={{ flex: '1 1 60%', minWidth: 0 }}>
                                            <div ref={keywordsChartRef} style={{ height: '100%', width: '100%' }} />
                                        </div>
                                        <div style={{ flex: '0 0 220px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.08)' }}>
                                                <div style={{ fontSize: '12px', color: TOKENS.colors.textTertiary }}>关键词数量</div>
                                                <div style={{ fontSize: '20px', fontWeight: 700, color: TOKENS.colors.textPrimary }}>
                                                    {keywordsStats.length}
                                                </div>
                                            </div>
                                            <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)' }}>
                                                <div style={{ fontSize: '12px', color: TOKENS.colors.textTertiary }}>Top关键词</div>
                                                <div style={{ fontSize: '16px', fontWeight: 700, color: TOKENS.colors.textPrimary }}>
                                                    {topKeyword ? topKeyword.name : '暂无数据'}
                                                </div>
                                                <div style={{ fontSize: '12px', color: TOKENS.colors.textSecondary }}>
                                                    {topKeyword ? `${topKeyword.value} 次` : '0 次'}
                                                </div>
                                            </div>
                                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                                                {keywordTop.length === 0 ? (
                                                    <span style={{ color: TOKENS.colors.textTertiary, fontSize: '12px' }}>暂无关键词数据</span>
                                                ) : (
                                                    keywordTop.map((item) => (
                                                        <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <span style={{ fontSize: '12px', color: TOKENS.colors.textSecondary }}>{item.name}</span>
                                                            <Tag color="geekblue" style={{ borderRadius: '12px', border: 'none', background: '#EEF2FF', color: '#4338CA' }}>
                                                                {item.value}
                                                            </Tag>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <div style={{ fontSize: '12px', color: TOKENS.colors.textTertiary }}>
                                                关键词累计热度 {keywordTotal}
                                            </div>
                                        </div>
                                    </div>
                                </ChartCard>
                                <ChartCard
                                    title="三级分类热度 Top10"
                                    height="420px"
                                >
                                    <div ref={atlasSubcategoryChartRef} style={{ height: '100%', width: '100%' }} />
                                </ChartCard>
                            </Space>
                        </Col>
                    </Row>

                    {/* Atlas Data Tables */}
                    <div style={{ marginBottom: '32px' }}>
                        <SectionTitle
                            title="生态图谱数据表"
                            subtitle={`数据源：data/data.csv / data/data.xlsx · 共 ${atlasSummary.total || 0} 家企业`}
                        />
                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24} lg={12}>
                                <div className="ui-card" style={{
                                    background: TOKENS.colors.cardBg,
                                    borderRadius: '12px',
                                    padding: '24px',
                                    boxShadow: TOKENS.shadows.card,
                                    border: `1px solid ${TOKENS.colors.border}`
                                }}>
                                    <SectionTitle title="一级分类统计" subtitle="企业数量与占比" />
                                    <Table
                                        dataSource={atlasSummary.level1}
                                        columns={atlasLevel1Columns}
                                        rowKey={(record) => record['一级分类']}
                                        loading={atlasLoading}
                                        pagination={{ pageSize: 6, size: 'small' }}
                                        size="small"
                                    />
                                </div>
                            </Col>
                            <Col xs={24} lg={12}>
                                <div className="ui-card" style={{
                                    background: TOKENS.colors.cardBg,
                                    borderRadius: '12px',
                                    padding: '24px',
                                    boxShadow: TOKENS.shadows.card,
                                    border: `1px solid ${TOKENS.colors.border}`
                                }}>
                                    <SectionTitle title="注册地分布" subtitle="企业注册地统计" />
                                    <Table
                                        dataSource={atlasSummary.regions}
                                        columns={atlasRegionColumns}
                                        rowKey={(record) => record['注册地']}
                                        loading={atlasLoading}
                                        pagination={{ pageSize: 6, size: 'small' }}
                                        size="small"
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24}>
                                <div className="ui-card" style={{
                                    background: TOKENS.colors.cardBg,
                                    borderRadius: '12px',
                                    padding: '24px',
                                    boxShadow: TOKENS.shadows.card,
                                    border: `1px solid ${TOKENS.colors.border}`
                                }}>
                                    <SectionTitle title="二级分类统计" subtitle="按一级/二级分类汇总" />
                                    <Table
                                        dataSource={atlasSummary.level2}
                                        columns={atlasLevel2Columns}
                                        rowKey={(record) => `${record['一级分类']}-${record['二级分类']}`}
                                        loading={atlasLoading}
                                        pagination={{ pageSize: 8, size: 'small' }}
                                        size="small"
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24}>
                                <div className="ui-card" style={{
                                    background: TOKENS.colors.cardBg,
                                    borderRadius: '12px',
                                    padding: '24px',
                                    boxShadow: TOKENS.shadows.card,
                                    border: `1px solid ${TOKENS.colors.border}`
                                }}>
                                    <SectionTitle title="三级分类统计" subtitle="三级分类细分明细" />
                                    <Table
                                        dataSource={atlasSummary.level3}
                                        columns={atlasLevel3Columns}
                                        rowKey={(record) => `${record['一级分类']}-${record['二级分类']}-${record['三级分类']}`}
                                        loading={atlasLoading}
                                        pagination={{ pageSize: 8, size: 'small' }}
                                        size="small"
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={[24, 24]}>
                            <Col xs={24}>
                                <div className="ui-card" style={{
                                    background: TOKENS.colors.cardBg,
                                    borderRadius: '12px',
                                    padding: '24px',
                                    boxShadow: TOKENS.shadows.card,
                                    border: `1px solid ${TOKENS.colors.border}`
                                }}>
                                    <SectionTitle title="生态图谱企业名录" subtitle="完整企业清单" />
                                    <Table
                                        dataSource={atlasEnterprises}
                                        columns={atlasEnterpriseColumns}
                                        rowKey={(record) => record['证书编号']}
                                        loading={atlasLoading}
                                        pagination={{ pageSize: 8 }}
                                        scroll={{ x: 1200 }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Data Table */}
                    <div className="ui-card" style={{
                        background: TOKENS.colors.cardBg,
                        borderRadius: '12px',
                        padding: '32px',
                        boxShadow: TOKENS.shadows.card,
                        border: `1px solid ${TOKENS.colors.border}`
                    }}>
                        <SectionTitle title="企业名录详情" subtitle="支持点击上方图表进行联动筛选" />
                        <Table
                            dataSource={enterprises}
                            columns={columns}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: total,
                                onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                                showTotal: (total) => <span style={{ color: TOKENS.colors.textSecondary }}>共 {total} 条记录</span>,
                                position: ['bottomRight']
                            }}
                            scroll={{ x: 1000 }}
                        />
                    </div>
            </div>

            {/* Fullscreen Chart Modal */}
            <Modal
                title={
                    fullscreenChart === 'region' ? '区域集群分布' :
                        fullscreenChart === 'category' ? '产业链构成分析' :
                            fullscreenChart === 'keywords' ? '热门技术趋势' : '图表详情'
                }
                open={!!fullscreenChart}
                onCancel={() => setFullscreenChart(null)}
                width="90%"
                footer={null}
                centered
                destroyOnClose
                bodyStyle={{ height: '80vh', padding: '24px' }}
            >
                <div ref={fullscreenChartRef} style={{ width: '100%', height: '100%' }} />
            </Modal>
        </div>
    );
};

export default Dashboard;
