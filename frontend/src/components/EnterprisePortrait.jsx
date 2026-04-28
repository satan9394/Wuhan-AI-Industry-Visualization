import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Row, Col, Tag, Spin, Empty, Descriptions, Select, Button, Space, Progress } from 'antd';
import * as echarts from 'echarts';
import { fetchEnterpriseDetail, fetchEnterprises, fetchAtlasEnterprises } from '../api';
import { TOKENS, getResolvedTokens } from '../theme';
import { ApartmentOutlined, RadarChartOutlined, LineChartOutlined, TrophyOutlined, CheckCircleOutlined, ReloadOutlined, SearchOutlined, TeamOutlined, EnvironmentOutlined, AimOutlined, BulbOutlined } from '@ant-design/icons';
import { useUiMode } from '../context/UiModeContext';

const ChartCard = ({ title, icon, children, height = '380px' }) => (
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

const MetricCard = ({ title, value, suffix, icon, color, hint }) => (
    <div className="ui-card" style={{
        background: TOKENS.colors.cardBg,
        borderRadius: '12px',
        padding: '20px',
        boxShadow: TOKENS.shadows.card,
        border: `1px solid ${TOKENS.colors.border}`,
        height: '100%'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: TOKENS.colors.textSecondary, fontWeight: 600 }}>{title}</span>
            <span style={{ color }}>{icon}</span>
        </div>
        <div style={{ marginTop: '12px', fontSize: '24px', fontWeight: 700, color: TOKENS.colors.textPrimary }}>
            {value}
            {suffix && <span style={{ fontSize: '12px', color: TOKENS.colors.textTertiary, marginLeft: '6px' }}>{suffix}</span>}
        </div>
        {hint && <div style={{ marginTop: '8px', fontSize: '12px', color: TOKENS.colors.textTertiary }}>{hint}</div>}
    </div>
);

const buildCountMap = (list, key) => list.reduce((acc, item) => {
    const value = item[key] || '未知';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
}, {});

const clampNumber = (value, min, max) => Math.max(min, Math.min(max, value));

const getRankMeta = (countMap, value) => {
    const entries = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
    const index = entries.findIndex(([name]) => name === value);
    return {
        rank: index >= 0 ? index + 1 : null,
        total: entries.length,
        count: countMap[value] || 0,
        entries
    };
};

const extractKeywords = (text, limit = 20) => {
    if (!text) return [];
    const parts = text
        .replace(/[()（）]/g, ' ')
        .split(/[，、,;；。/\s]+/)
        .map((item) => item.trim())
        .filter((item) => item.length >= 2);
    const unique = Array.from(new Set(parts));
    return unique.slice(0, limit);
};

const toKeywordTags = (text) => extractKeywords(text, 10);

const getChartTheme = () => {
    const { colors } = getResolvedTokens();
    return {
        colors,
        commonChartConfig: {
            color: TOKENS.chartPalette,
            textStyle: { fontFamily: 'Inter, system-ui, sans-serif' },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: colors.border,
                textStyle: { color: colors.textPrimary },
                padding: [10, 14],
                extraCssText: `box-shadow: ${TOKENS.shadows.floating}; border-radius: 8px;`
            }
        }
    };
};

const TAG_COLORS = ['#E0F2FE', '#DBEAFE', '#EDE9FE', '#DCFCE7', '#FEF3C7'];

const EnterprisePortrait = ({ enterpriseName }) => {
    const { mode } = useUiMode();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [data, setData] = useState(null);
    const [enterpriseList, setEnterpriseList] = useState([]);
    const [atlasList, setAtlasList] = useState([]);
    const [selectedName, setSelectedName] = useState(enterpriseName || '');

    const radarRef = useRef(null);
    const lineRef = useRef(null);
    const trackRadarRef = useRef(null);
    const graphRef = useRef(null);
    const categoryDistRef = useRef(null);
    const regionDistRef = useRef(null);

    useEffect(() => {
        if (!enterpriseName) return;
        setSelectedName(enterpriseName);
    }, [enterpriseName]);

    useEffect(() => {
        const loadEnterpriseList = async () => {
            setListLoading(true);
            try {
                const res = await fetchEnterprises(1, 2000, '', '', '', '');
                const items = res.items || res || [];
                setEnterpriseList(items);
                if (!selectedName && items.length > 0) {
                    setSelectedName(items[0].name);
                }
            } catch (error) {
                console.error('Failed to load enterprise list', error);
            } finally {
                setListLoading(false);
            }
        };
        loadEnterpriseList();
    }, []);

    useEffect(() => {
        const loadAtlasList = async () => {
            try {
                const list = await fetchAtlasEnterprises();
                setAtlasList(list || []);
            } catch (error) {
                console.error('Failed to load atlas list', error);
            }
        };
        loadAtlasList();
    }, []);

    useEffect(() => {
        if (!selectedName) {
            setData(null);
            return;
        }

        const loadData = async () => {
            setLoading(true);
            try {
                const res = await fetchEnterpriseDetail(selectedName);
                setData(res);
            } catch (error) {
                console.error('Failed to load enterprise detail', error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [selectedName]);

    const atlasMatch = useMemo(() => {
        if (!data || !atlasList.length) return null;
        const direct = atlasList.find((item) => item['企业名称'] === data.info.name);
        if (direct) return direct;
        return atlasList.find((item) => data.info.name && item['企业名称'] && item['企业名称'].includes(data.info.name));
    }, [data, atlasList]);

    const metrics = useMemo(() => {
        if (!data || !enterpriseList.length) return null;
        const regionCounts = buildCountMap(enterpriseList, 'region');
        const category1Counts = buildCountMap(enterpriseList, 'category_level_1');
        const category2Counts = buildCountMap(enterpriseList, 'category_level_2');

        const regionMeta = getRankMeta(regionCounts, data.info.region);
        const category1Meta = getRankMeta(category1Counts, data.info.category_level_1);
        const category2Count = category2Counts[data.info.category_level_2] || 0;

        const total = enterpriseList.length;
        const regionShare = total > 0 ? (regionMeta.count / total * 100).toFixed(1) : '0.0';
        const categoryShare = total > 0 ? (category1Meta.count / total * 100).toFixed(1) : '0.0';
        const keywords = toKeywordTags(data.info.products);

        const category2Dist = enterpriseList
            .filter((item) => item.category_level_1 === data.info.category_level_1)
            .reduce((acc, item) => {
                const key = item.category_level_2 || '未知';
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {});

        const category2Entries = Object.entries(category2Dist)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, value]) => ({ name, value }));

        const regionEntries = regionMeta.entries
            .slice(0, 8)
            .map(([name, value]) => ({ name, value }));

        const category2Values = Object.values(category2Dist);
        const category2Max = category2Values.length ? Math.max(...category2Values) : 0;

        return {
            total,
            regionMeta,
            category1Meta,
            category2Count,
            regionShare,
            categoryShare,
            keywords,
            category2Entries,
            regionEntries,
            category2Dist,
            category2Max,
            regionCounts,
            category1Counts
        };
    }, [data, enterpriseList]);

    const derived = useMemo(() => {
        if (!data || !metrics) return null;
        const target = data.info || {};
        const targetKeywords = extractKeywords(target.products, 12);
        const targetKeywordSet = new Set(targetKeywords);

        const atlasNameMap = new Map();
        atlasList.forEach((item) => {
            const name = (item['企业名称'] || '').trim();
            if (name && !atlasNameMap.has(name)) {
                atlasNameMap.set(name, item);
            }
        });

        const targetAtlas = atlasMatch || atlasNameMap.get(target.name);
        const thirdCategory = targetAtlas?.['三级分类'] || '';

        const relatedCompanies = enterpriseList
            .filter((item) => item.name && item.name !== target.name)
            .map((item) => {
                const reasons = [];
                let score = 0;
                const candidateKeywords = extractKeywords(item.products, 10);

                if (item.category_level_2 && item.category_level_2 === target.category_level_2) {
                    score += 4;
                    reasons.push('同二级分类');
                }
                if (item.category_level_1 && item.category_level_1 === target.category_level_1) {
                    score += 2;
                    reasons.push('同一级分类');
                }
                if (item.region && item.region === target.region) {
                    score += 2;
                    reasons.push('同区域');
                }

                const overlapCount = candidateKeywords.filter((word) => targetKeywordSet.has(word)).length;
                if (overlapCount) {
                    score += Math.min(3, overlapCount);
                    reasons.push(`关键词重合${overlapCount}`);
                }

                const atlasCandidate = atlasNameMap.get(item.name);
                if (thirdCategory && atlasCandidate?.['三级分类'] === thirdCategory) {
                    score += 2;
                    reasons.push('同三级分类');
                }

                const matchScore = clampNumber(Math.round(score * 8 + overlapCount * 4), 0, 100);
                return {
                    ...item,
                    reasons: reasons.slice(0, 3),
                    score,
                    matchScore,
                    candidateKeywords
                };
            })
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 6);

        const atlasPeers = thirdCategory
            ? Array.from(
                new Set(
                    atlasList
                        .filter((item) => item['三级分类'] === thirdCategory)
                        .map((item) => (item['企业名称'] || '').trim())
                        .filter(Boolean)
                )
            )
                .filter((name) => name !== target.name)
                .slice(0, 6)
            : [];

        const tagWeightMap = new Map();
        const addTag = (tag, weight) => {
            if (!tag) return;
            tagWeightMap.set(tag, (tagWeightMap.get(tag) || 0) + weight);
        };
        const addTags = (tags, weight) => {
            tags.forEach((tag) => addTag(tag, weight));
        };

        addTags(targetKeywords, 3);
        addTags(extractKeywords(targetAtlas?.['主要代表性技术/产品/服务'], 12), 2);
        addTags(relatedCompanies.flatMap((item) => extractKeywords(item.products, 6)), 1);
        [target.category_level_1, target.category_level_2, thirdCategory].forEach((item) => addTag(item, 4));

        const tagWall = Array.from(tagWeightMap.entries())
            .map(([name, weight]) => ({ name, weight }))
            .sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name))
            .slice(0, 18);

        const sameCategoryList = enterpriseList.filter((item) => item.category_level_1 === target.category_level_1);
        const overallCounts = buildCountMap(sameCategoryList, 'category_level_2');
        const regionCounts = buildCountMap(sameCategoryList.filter((item) => item.region === target.region), 'category_level_2');
        const maxOverall = Math.max(...Object.values(overallCounts), 0);
        const opportunities = Object.entries(overallCounts)
            .filter(([name]) => name && name !== target.category_level_2 && name !== '未知')
            .map(([name, count]) => {
                const regionCount = regionCounts[name] || 0;
                const gapRatio = count > 0 ? 1 - regionCount / count : 0;
                const score = maxOverall ? Math.round(clampNumber((count / maxOverall) * gapRatio * 100, 0, 100)) : 0;
                return {
                    name,
                    score,
                    regionCount,
                    total: count,
                    gapRatio
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 6);

        const radarValues = data.radar?.values || [];
        const radarLabels = data.radar?.indicator?.map((item) => item.name) || [];
        const radarMap = radarLabels.reduce((acc, name, index) => {
            acc[name] = radarValues[index] || 0;
            return acc;
        }, {});
        const revenueValues = data.revenue?.values || [];
        const growthRate = revenueValues.length >= 2
            ? ((revenueValues[revenueValues.length - 1] - revenueValues[0]) / Math.max(1, revenueValues[0]) * 100)
            : 0;
        const growthScore = clampNumber(Math.round(growthRate), 0, 100);
        const densityScore = metrics.category2Max ? Math.round(metrics.category2Count / metrics.category2Max * 100) : 0;
        const regionScore = metrics.regionMeta.total
            ? Math.round((1 - (metrics.regionMeta.rank - 1) / metrics.regionMeta.total) * 100)
            : 0;
        const categoryScore = metrics.category1Meta.total
            ? Math.round((1 - (metrics.category1Meta.rank - 1) / metrics.category1Meta.total) * 100)
            : 0;
        const innovationScore = radarValues.length
            ? Math.round(radarValues.reduce((sum, value) => sum + value, 0) / radarValues.length)
            : 0;
        const synergyScore = clampNumber(Math.round((relatedCompanies.length / 6) * 50 + (tagWall.length / 18) * 50), 0, 100);

        const benchmarkItems = [
            { label: '研发强度', value: radarMap['研发'] || innovationScore, color: '#3B82F6', hint: '研发投入与技术储备' },
            { label: '市场动能', value: radarMap['市场'] || categoryScore, color: '#10B981', hint: '市场触达与商业化' },
            { label: '成长速度', value: growthScore, color: '#F59E0B', hint: `近五年增幅 ${growthRate.toFixed(1)}%` },
            { label: '赛道密度', value: densityScore, color: '#6366F1', hint: `同类企业 ${metrics.category2Count || 0} 家` },
            { label: '区域影响', value: regionScore, color: '#8B5CF6', hint: `区域排名 ${metrics.regionMeta.rank || '-'} / ${metrics.regionMeta.total || '-'}` }
        ];

        const trackRadar = {
            indicator: [
                { name: '区域影响', max: 100 },
                { name: '赛道集中', max: 100 },
                { name: '成长动能', max: 100 },
                { name: '协同潜力', max: 100 },
                { name: '创新指数', max: 100 }
            ],
            values: [regionScore, categoryScore, growthScore, synergyScore, innovationScore]
        };

        const graphCategories = [
            { name: '核心企业' },
            { name: '同类型企业' },
            { name: '生态伙伴' },
            { name: '区域节点' },
            { name: '赛道节点' },
            { name: '标签' }
        ];

        const nodes = [];
        const links = [];
        const nodeSet = new Set();
        const linkSet = new Set();

        const addNode = (id, name, category, size) => {
            if (!id || nodeSet.has(id)) return;
            nodes.push({ id, name, category, symbolSize: size, draggable: true });
            nodeSet.add(id);
        };

        const addLink = (source, target) => {
            if (!source || !target) return;
            const key = `${source}__${target}`;
            if (linkSet.has(key)) return;
            links.push({ source, target });
            linkSet.add(key);
        };

        const coreId = `core:${target.name}`;
        addNode(coreId, target.name, 0, 46);

        const regionId = target.region ? `region:${target.region}` : '';
        if (regionId) {
            addNode(regionId, `区域 ${target.region}`, 3, 28);
            addLink(coreId, regionId);
        }

        const category1Id = target.category_level_1 ? `cat1:${target.category_level_1}` : '';
        if (category1Id) {
            addNode(category1Id, `一级类 ${target.category_level_1}`, 4, 30);
            addLink(coreId, category1Id);
        }

        const category2Id = target.category_level_2 ? `cat2:${target.category_level_2}` : '';
        if (category2Id) {
            addNode(category2Id, `二级类 ${target.category_level_2}`, 4, 26);
            addLink(coreId, category2Id);
        }

        const category3Id = thirdCategory ? `cat3:${thirdCategory}` : '';
        if (category3Id) {
            addNode(category3Id, `三级类 ${thirdCategory}`, 4, 24);
            addLink(coreId, category3Id);
        }

        tagWall.slice(0, 6).forEach((tag) => {
            const tagId = `tag:${tag.name}`;
            addNode(tagId, tag.name, 5, 18);
            addLink(coreId, tagId);
        });

        relatedCompanies.forEach((item) => {
            const peerId = `peer:${item.name}`;
            addNode(peerId, item.name, 1, 26);
            addLink(coreId, peerId);
            addLink(category2Id, peerId);
            if (item.region && regionId && item.region === target.region) {
                addLink(regionId, peerId);
            }
        });

        atlasPeers.forEach((name) => {
            const atlasId = `atlas:${name}`;
            addNode(atlasId, name, 2, 22);
            addLink(coreId, atlasId);
            addLink(category3Id || category2Id, atlasId);
        });

        return {
            relatedCompanies,
            atlasPeers,
            tagWall,
            opportunities,
            benchmarkItems,
            trackRadar,
            graphData: { nodes, links, categories: graphCategories }
        };
    }, [data, metrics, enterpriseList, atlasList, atlasMatch]);

    useEffect(() => {
        if (!data || !radarRef.current || !lineRef.current || !graphRef.current) return;
        const { colors } = getResolvedTokens();

        const radarChart = echarts.init(radarRef.current);
        radarChart.setOption({
            tooltip: {},
            radar: {
                indicator: data.radar.indicator,
                shape: 'circle',
                splitArea: {
                    areaStyle: {
                        color: [colors.bg, colors.cardBg],
                        shadowColor: 'rgba(0, 0, 0, 0.08)',
                        shadowBlur: 10
                    }
                },
                axisLine: { lineStyle: { color: colors.border } },
                splitLine: { lineStyle: { color: colors.border } }
            },
            series: [{
                name: '企业能力',
                type: 'radar',
                data: [{
                    value: data.radar.values,
                    name: '各项指标',
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(59, 130, 246, 0.5)' },
                            { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
                        ])
                    },
                    lineStyle: { color: colors.accentSecondary, width: 2 },
                    itemStyle: { color: colors.accentSecondary }
                }]
            }]
        });

        const lineChart = echarts.init(lineRef.current);
        lineChart.setOption({
            tooltip: { trigger: 'axis' },
            grid: { top: '10%', left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.revenue.years,
                axisLine: { lineStyle: { color: colors.textSecondary } }
            },
            yAxis: {
                type: 'value',
                axisLine: { show: false },
                splitLine: { lineStyle: { color: colors.border, type: 'dashed' } }
            },
            series: [{
                name: '营收(万元)',
                type: 'line',
                smooth: true,
                data: data.revenue.values,
                itemStyle: { color: TOKENS.chartPalette[1] },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(16, 185, 129, 0.35)' },
                        { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                    ])
                }
            }]
        });

        const graphChart = echarts.init(graphRef.current);
        const graphSource = derived?.graphData || data.network;
        graphChart.setOption({
            tooltip: {},
            legend: [{
                data: graphSource.categories.map((item) => item.name),
                textStyle: { color: colors.textSecondary }
            }],
            series: [{
                type: 'graph',
                layout: 'force',
                data: graphSource.nodes.map((n) => ({
                    ...n,
                    itemStyle: { color: TOKENS.chartPalette[n.category % TOKENS.chartPalette.length] }
                })),
                links: graphSource.links,
                categories: graphSource.categories,
                roam: true,
                label: { show: true, position: 'right', color: colors.textPrimary },
                force: { repulsion: 240, edgeLength: 90 },
                lineStyle: { color: 'source', curveness: 0.3 }
            }]
        });

        const handleResize = () => {
            radarChart.resize();
            lineChart.resize();
            graphChart.resize();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            radarChart.dispose();
            lineChart.dispose();
            graphChart.dispose();
        };
    }, [data, derived, mode]);

    useEffect(() => {
        if (!derived?.trackRadar || !trackRadarRef.current) return;
        const { colors } = getResolvedTokens();
        const trackChart = echarts.init(trackRadarRef.current);
        trackChart.setOption({
            tooltip: {},
            radar: {
                indicator: derived.trackRadar.indicator,
                shape: 'circle',
                splitArea: {
                    areaStyle: {
                        color: [colors.bg, colors.cardBg],
                        shadowColor: 'rgba(0, 0, 0, 0.08)',
                        shadowBlur: 10
                    }
                },
                axisLine: { lineStyle: { color: colors.border } },
                splitLine: { lineStyle: { color: colors.border } }
            },
            series: [{
                name: '生态势能',
                type: 'radar',
                data: [{
                    value: derived.trackRadar.values,
                    name: '综合得分',
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(139, 92, 246, 0.5)' },
                            { offset: 1, color: 'rgba(139, 92, 246, 0.1)' }
                        ])
                    },
                    lineStyle: { color: '#8B5CF6', width: 2 },
                    itemStyle: { color: '#8B5CF6' }
                }]
            }]
        });

        const handleResize = () => trackChart.resize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            trackChart.dispose();
        };
    }, [derived, mode]);

    useEffect(() => {
        if (!metrics) return;
        const { colors, commonChartConfig } = getChartTheme();
        const categoryChart = echarts.init(categoryDistRef.current);

        if (!metrics.category2Entries.length) {
            categoryChart.setOption({
                title: {
                    text: '暂无数据',
                    left: 'center',
                    top: 'center',
                    textStyle: { color: colors.textSecondary }
                }
            });
        } else {
            categoryChart.setOption({
                ...commonChartConfig,
                tooltip: { ...commonChartConfig.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: '6%', right: '6%', top: '10%', bottom: '8%', containLabel: true },
                xAxis: {
                    type: 'value',
                    axisLabel: { color: colors.textSecondary },
                    splitLine: { lineStyle: { color: colors.border, type: 'dashed' } }
                },
                yAxis: {
                    type: 'category',
                    data: metrics.category2Entries.map((item) => item.name),
                    axisLabel: { color: colors.textSecondary },
                    axisLine: { lineStyle: { color: colors.border } },
                    axisTick: { show: false }
                },
                series: [{
                    type: 'bar',
                    data: metrics.category2Entries.map((item) => item.value),
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
                            { offset: 1, color: '#2563EB' }
                        ])
                    }
                }]
            });
        }

        const handleResize = () => categoryChart.resize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            categoryChart.dispose();
        };
    }, [metrics, mode]);

    useEffect(() => {
        if (!metrics) return;
        const { colors, commonChartConfig } = getChartTheme();
        const regionChart = echarts.init(regionDistRef.current);

        if (!metrics.regionEntries.length) {
            regionChart.setOption({
                title: {
                    text: '暂无数据',
                    left: 'center',
                    top: 'center',
                    textStyle: { color: colors.textSecondary }
                }
            });
        } else {
            regionChart.setOption({
                ...commonChartConfig,
                tooltip: { ...commonChartConfig.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: '6%', right: '6%', top: '10%', bottom: '8%', containLabel: true },
                xAxis: {
                    type: 'value',
                    axisLabel: { color: colors.textSecondary },
                    splitLine: { lineStyle: { color: colors.border, type: 'dashed' } }
                },
                yAxis: {
                    type: 'category',
                    data: metrics.regionEntries.map((item) => item.name),
                    axisLabel: { color: colors.textSecondary },
                    axisLine: { lineStyle: { color: colors.border } },
                    axisTick: { show: false }
                },
                series: [{
                    type: 'bar',
                    data: metrics.regionEntries.map((item) => item.value),
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
                            { offset: 0, color: '#34D399' },
                            { offset: 1, color: '#10B981' }
                        ])
                    }
                }]
            });
        }

        const handleResize = () => regionChart.resize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            regionChart.dispose();
        };
    }, [metrics, mode]);

    const relatedCompanies = derived?.relatedCompanies || [];
    const atlasPeers = derived?.atlasPeers || [];
    const benchmarkItems = derived?.benchmarkItems || [];
    const tagWall = derived?.tagWall || [];
    const opportunities = derived?.opportunities || [];

    const selectionOptions = enterpriseList.map((item) => ({
        label: item.name,
        value: item.name
    }));

    const handleRandomPick = () => {
        if (!enterpriseList.length) return;
        const index = Math.floor(Math.random() * enterpriseList.length);
        setSelectedName(enterpriseList[index].name);
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out', padding: 'var(--ui-page-padding)' }}>
            <div style={{ maxWidth: 'var(--ui-page-width)', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <div>
                        <h1 className="page-title">企业详细画像</h1>
                        <p className="page-subtitle">多维度洞察企业实力、成长性与生态关联</p>
                    </div>
                    <Space wrap>
                        <Select
                            showSearch
                            allowClear
                            style={{ minWidth: 240 }}
                            placeholder="搜索企业名称"
                            loading={listLoading}
                            value={selectedName || undefined}
                            onChange={(value) => setSelectedName(value || '')}
                            options={selectionOptions}
                            filterOption={(input, option) => (option?.label || '').toLowerCase().includes(input.toLowerCase())}
                            suffixIcon={<SearchOutlined />}
                        />
                        <Button icon={<ReloadOutlined />} onClick={handleRandomPick}>随机推荐</Button>
                    </Space>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '120px' }}><Spin size="large" /></div>
                ) : !data ? (
                    <Empty description="请选择企业查看画像" style={{ marginTop: 80 }} />
                ) : (
                    <>
                        <div className="ui-card" style={{
                            background: TOKENS.colors.cardBg,
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow: TOKENS.shadows.card,
                            border: `1px solid ${TOKENS.colors.border}`,
                            marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: TOKENS.colors.textPrimary }}>{data.info.name}</h2>
                                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <Tag color="blue">{data.info.category_level_1}</Tag>
                                        <Tag color="cyan">{data.info.category_level_2}</Tag>
                                        <Tag color="default" icon={<EnvironmentOutlined />}>{data.info.region}</Tag>
                                        {atlasMatch?.['三级分类'] && <Tag color="purple">{atlasMatch['三级分类']}</Tag>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    <Tag color="geekblue" icon={<TeamOutlined />}>企业编号 {data.info.id}</Tag>
                                    <Tag color="green" icon={<TrophyOutlined />}>生态图谱认证</Tag>
                                </div>
                            </div>
                            <div style={{ marginTop: '16px', color: TOKENS.colors.textSecondary, lineHeight: 1.6 }}>
                                {data.info.products}
                            </div>
                            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {metrics?.keywords?.length ? metrics.keywords.map((word) => (
                                    <Tag key={word} color="blue" style={{ borderRadius: '12px', border: 'none', background: '#EFF6FF', color: '#2563EB' }}>{word}</Tag>
                                )) : (
                                    <span style={{ fontSize: '12px', color: TOKENS.colors.textTertiary }}>暂无关键词</span>
                                )}
                            </div>
                        </div>

                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24} sm={12} lg={6}>
                                <MetricCard
                                    title="同区域企业"
                                    value={metrics?.regionMeta.count || 0}
                                    suffix="家"
                                    icon={<EnvironmentOutlined />}
                                    color="#3B82F6"
                                    hint={`区域占比 ${metrics?.regionShare || '0.0'}%`}
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <MetricCard
                                    title="一级分类企业"
                                    value={metrics?.category1Meta.count || 0}
                                    suffix="家"
                                    icon={<AimOutlined />}
                                    color="#10B981"
                                    hint={`分类占比 ${metrics?.categoryShare || '0.0'}%`}
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <MetricCard
                                    title="二级分类企业"
                                    value={metrics?.category2Count || 0}
                                    suffix="家"
                                    icon={<TeamOutlined />}
                                    color="#6366F1"
                                    hint="同赛道企业数量"
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <MetricCard
                                    title="关键词数量"
                                    value={metrics?.keywords?.length || 0}
                                    suffix="项"
                                    icon={<SearchOutlined />}
                                    color="#F59E0B"
                                    hint="产品与技术标签"
                                />
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24} lg={16}>
                                <Card bordered={false} style={{ borderRadius: '12px', boxShadow: TOKENS.shadows.card, height: '100%' }}>
                                    <Descriptions title="基本信息" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                                        <Descriptions.Item label="证书编号">{data.info.id}</Descriptions.Item>
                                        <Descriptions.Item label="注册地">{data.info.region}</Descriptions.Item>
                                        <Descriptions.Item label="一级分类">{data.info.category_level_1}</Descriptions.Item>
                                        <Descriptions.Item label="二级分类">{data.info.category_level_2}</Descriptions.Item>
                                        <Descriptions.Item label="三级分类">{atlasMatch?.['三级分类'] || '未细分'}</Descriptions.Item>
                                        <Descriptions.Item label="主要产品">{data.info.products}</Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            <Col xs={24} lg={8}>
                                <div className="ui-card" style={{
                                    background: TOKENS.colors.cardBg,
                                    borderRadius: '12px',
                                    padding: '24px',
                                    boxShadow: TOKENS.shadows.card,
                                    border: `1px solid ${TOKENS.colors.border}`,
                                    height: '100%'
                                }}>
                                    <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: 700, color: TOKENS.colors.textPrimary }}>画像洞察</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <CheckCircleOutlined style={{ color: '#10B981' }} />
                                            <span style={{ color: TOKENS.colors.textSecondary }}>
                                                区域排名 {metrics?.regionMeta.rank || '-'} / {metrics?.regionMeta.total || '-'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <CheckCircleOutlined style={{ color: '#3B82F6' }} />
                                            <span style={{ color: TOKENS.colors.textSecondary }}>
                                                一级分类排名 {metrics?.category1Meta.rank || '-'} / {metrics?.category1Meta.total || '-'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <CheckCircleOutlined style={{ color: '#F59E0B' }} />
                                            <span style={{ color: TOKENS.colors.textSecondary }}>
                                                同类企业 {metrics?.category2Count || 0} 家
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <CheckCircleOutlined style={{ color: '#8B5CF6' }} />
                                            <span style={{ color: TOKENS.colors.textSecondary }}>
                                                生态图谱认证编号 {atlasMatch?.['证书编号'] || data.info.id}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.08)', color: TOKENS.colors.textSecondary }}>
                                        企业画像基于产业数据看板与生态图谱数据生成，支持实时筛选对比。
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24} lg={15}>
                                <Card
                                    bordered={false}
                                    style={{ borderRadius: '12px', boxShadow: TOKENS.shadows.card, height: '100%' }}
                                    title={(
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <TeamOutlined style={{ color: '#3B82F6' }} />
                                            同类型企业推荐
                                        </span>
                                    )}
                                >
                                    {relatedCompanies.length ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {relatedCompanies.map((item) => (
                                                <div key={item.name} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    gap: '16px',
                                                    padding: '12px 14px',
                                                    borderRadius: '12px',
                                                    border: `1px solid ${TOKENS.colors.border}`,
                                                    background: TOKENS.colors.cardBg
                                                }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: '15px', fontWeight: 600, color: TOKENS.colors.textPrimary }}>
                                                            {item.name}
                                                        </div>
                                                        <div style={{ marginTop: '4px', fontSize: '12px', color: TOKENS.colors.textSecondary }}>
                                                            {item.category_level_1} · {item.category_level_2} · {item.region}
                                                        </div>
                                                        <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                            {item.reasons.map((reason) => (
                                                                <Tag key={`${item.name}-${reason}`} color="blue">{reason}</Tag>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div style={{ minWidth: '150px', textAlign: 'right' }}>
                                                        <div style={{ fontSize: '12px', color: TOKENS.colors.textSecondary }}>
                                                            匹配度 {item.matchScore}%
                                                        </div>
                                                        <Progress
                                                            percent={item.matchScore}
                                                            size="small"
                                                            showInfo={false}
                                                            strokeColor="#3B82F6"
                                                        />
                                                        <Button size="small" type="link" onClick={() => setSelectedName(item.name)}>
                                                            查看画像
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <Empty description="暂无同类型推荐" />
                                    )}
                                    {atlasPeers.length > 0 && (
                                        <div style={{
                                            marginTop: '16px',
                                            padding: '12px',
                                            borderRadius: '10px',
                                            background: 'rgba(59, 130, 246, 0.06)'
                                        }}>
                                            <div style={{ fontSize: '12px', color: TOKENS.colors.textSecondary, marginBottom: '6px' }}>
                                                生态图谱同类企业
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {atlasPeers.map((name) => (
                                                    <Tag key={name} color="geekblue">{name}</Tag>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            </Col>
                            <Col xs={24} lg={9}>
                                <Card
                                    bordered={false}
                                    style={{ borderRadius: '12px', boxShadow: TOKENS.shadows.card, height: '100%' }}
                                    title={(
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <TrophyOutlined style={{ color: '#F59E0B' }} />
                                            竞争对标面板
                                        </span>
                                    )}
                                >
                                    {benchmarkItems.length ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                            {benchmarkItems.map((item) => (
                                                <div key={item.label}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '13px', color: TOKENS.colors.textSecondary }}>{item.label}</span>
                                                        <span style={{ fontSize: '13px', fontWeight: 600, color: item.color }}>{item.value}</span>
                                                    </div>
                                                    <Progress percent={item.value} size="small" showInfo={false} strokeColor={item.color} />
                                                    <div style={{ fontSize: '12px', color: TOKENS.colors.textTertiary }}>{item.hint}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <Empty description="暂无对标数据" />
                                    )}
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24} md={12}>
                                <ChartCard title="企业能力雷达" icon={<RadarChartOutlined style={{ color: TOKENS.colors.accentSecondary }} />}>
                                    <div ref={radarRef} style={{ width: '100%', height: '100%' }} />
                                </ChartCard>
                            </Col>
                            <Col xs={24} md={12}>
                                <ChartCard title="营收增长趋势" icon={<LineChartOutlined style={{ color: '#10B981' }} />}>
                                    <div ref={lineRef} style={{ width: '100%', height: '100%' }} />
                                </ChartCard>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24} md={12}>
                                <ChartCard title="生态势能雷达" icon={<BulbOutlined style={{ color: '#8B5CF6' }} />}>
                                    <div ref={trackRadarRef} style={{ width: '100%', height: '100%' }} />
                                </ChartCard>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card
                                    bordered={false}
                                    style={{ borderRadius: '12px', boxShadow: TOKENS.shadows.card, height: '100%' }}
                                    title={(
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <BulbOutlined style={{ color: '#6366F1' }} />
                                            生态标签墙
                                        </span>
                                    )}
                                >
                                    {tagWall.length ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {tagWall.map((tag) => {
                                                const colorIndex = tag.weight % TAG_COLORS.length;
                                                const fontSize = 12 + Math.min(6, tag.weight * 1.5);
                                                return (
                                                    <Tag
                                                        key={tag.name}
                                                        style={{
                                                            borderRadius: '999px',
                                                            border: 'none',
                                                            background: TAG_COLORS[colorIndex],
                                                            color: TOKENS.colors.textPrimary,
                                                            fontSize: `${fontSize}px`,
                                                            padding: '4px 12px'
                                                        }}
                                                    >
                                                        {tag.name}
                                                    </Tag>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <Empty description="暂无标签数据" />
                                    )}
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24} md={12}>
                                <ChartCard title="二级分类分布 Top8" icon={<AimOutlined style={{ color: '#2563EB' }} />}>
                                    <div ref={categoryDistRef} style={{ width: '100%', height: '100%' }} />
                                </ChartCard>
                            </Col>
                            <Col xs={24} md={12}>
                                <ChartCard title="区域企业分布 Top8" icon={<EnvironmentOutlined style={{ color: '#10B981' }} />}>
                                    <div ref={regionDistRef} style={{ width: '100%', height: '100%' }} />
                                </ChartCard>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                            <Col xs={24}>
                                <Card
                                    bordered={false}
                                    style={{ borderRadius: '12px', boxShadow: TOKENS.shadows.card, height: '100%' }}
                                    title={(
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <BulbOutlined style={{ color: '#F97316' }} />
                                            机会窗口
                                        </span>
                                    )}
                                >
                                    {opportunities.length ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                            {opportunities.map((item) => (
                                                <div key={item.name} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: '16px',
                                                    padding: '10px 12px',
                                                    borderRadius: '12px',
                                                    border: `1px solid ${TOKENS.colors.border}`
                                                }}>
                                                    <div>
                                                        <div style={{ fontSize: '15px', fontWeight: 600, color: TOKENS.colors.textPrimary }}>
                                                            {item.name}
                                                        </div>
                                                        <div style={{ marginTop: '4px', fontSize: '12px', color: TOKENS.colors.textSecondary }}>
                                                            区域覆盖 {item.regionCount} / {item.total} · 需求缺口 {(item.gapRatio * 100).toFixed(0)}%
                                                        </div>
                                                    </div>
                                                    <div style={{ minWidth: '180px' }}>
                                                        <Progress percent={item.score} size="small" showInfo={false} strokeColor="#F97316" />
                                                        <div style={{ marginTop: '4px', fontSize: '12px', color: TOKENS.colors.textTertiary, textAlign: 'right' }}>
                                                            机会指数 {item.score}%
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <Empty description="暂无机会窗口数据" />
                                    )}
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]}>
                            <Col xs={24}>
                                <ChartCard title="供应链与合作网络" icon={<ApartmentOutlined style={{ color: '#8B5CF6' }} />} height="480px">
                                    <div ref={graphRef} style={{ width: '100%', height: '100%' }} />
                                </ChartCard>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
        </div>
    );
};

export default EnterprisePortrait;
