import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Card, Spin, Empty, Tag, Button, Space, message } from 'antd';
import { ReloadOutlined, CompassOutlined } from '@ant-design/icons';
import { fetchRegionStats } from '../api';
import { TOKENS, getResolvedTokens } from '../theme';

// Placeholder GeoJSON for Wuhan (simplified for demo if real geojson missing)
// Ideally this should be loaded from assets/wuhan.json
const WUHAN_GEOJSON_URL = 'https://geo.datav.aliyun.com/areas_v3/bound/420100_full.json';

const MapComponent = ({ onRegionSelect }) => {
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [geoJsonLoaded, setGeoJsonLoaded] = useState(false);
    const [regionData, setRegionData] = useState([]);

    useEffect(() => {
        const initMap = async () => {
            setLoading(true);
            try {
                // 1. Load Region Data
                const stats = await fetchRegionStats();
                setRegionData(stats);

                // 2. Load GeoJSON
                if (!window.echartsMapRegistered) {
                    const response = await fetch(WUHAN_GEOJSON_URL);
                    if (!response.ok) throw new Error('Failed to load map data');
                    const geoJson = await response.json();
                    echarts.registerMap('wuhan', geoJson);
                    window.echartsMapRegistered = true;
                }
                setGeoJsonLoaded(true);
            } catch (error) {
                console.error("Map initialization failed:", error);
                // Allow graceful degradation (show list instead of map if geojson fails)
            } finally {
                setLoading(false);
            }
        };

        initMap();
    }, []);

    useEffect(() => {
        if (!geoJsonLoaded || !chartRef.current) return;

        const chart = echarts.init(chartRef.current);
        
        // Transform data for map
        const mapData = regionData.map(item => ({
            name: item.name,
            value: item.value
        }));

        const chartTokens = getResolvedTokens();
        const colors = chartTokens.colors;

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}<br/>企业数量: {c} 家',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: colors.border,
                textStyle: { color: colors.textPrimary },
                extraCssText: `box-shadow: ${TOKENS.shadows.floating};`
            },
            visualMap: {
                min: 0,
                max: Math.max(...mapData.map(d => d.value), 100),
                text: ['高', '低'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['#E0F2FE', '#3B82F6', '#1E40AF']
                },
                left: 'right',
                bottom: 'bottom'
            },
            series: [
                {
                    name: '武汉人工智能企业分布',
                    type: 'map',
                    map: 'wuhan',
                    label: {
                        show: true,
                        color: colors.textPrimary,
                        fontSize: 10
                    },
                    itemStyle: {
                        areaColor: '#F1F5F9',
                        borderColor: colors.border
                    },
                    emphasis: {
                        label: {
                            show: true,
                            color: '#fff'
                        },
                        itemStyle: {
                            areaColor: '#F59E0B'
                        }
                    },
                    data: mapData,
                    select: {
                        itemStyle: {
                            areaColor: '#F59E0B'
                        }
                    }
                }
            ]
        };

        chart.setOption(option);

        // Click Event
        chart.on('click', (params) => {
            if (onRegionSelect) {
                onRegionSelect(params.name);
                message.info(`已筛选区域: ${params.name}`);
            }
        });

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);

        return () => {
            chart.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, [geoJsonLoaded, regionData, onRegionSelect]);

    return (
        <Card 
            title={
                <Space>
                    <CompassOutlined style={{ color: TOKENS.colors.accent }} />
                    <span>区域分布热力图</span>
                </Space>
            }
            extra={
                <Button 
                    type="text" 
                    icon={<ReloadOutlined />} 
                    onClick={() => onRegionSelect && onRegionSelect('')}
                >
                    重置筛选
                </Button>
            }
            bordered={false}
            style={{ 
                borderRadius: '12px', 
                boxShadow: TOKENS.shadows.card,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
            bodyStyle={{ flex: 1, padding: 0, position: 'relative', minHeight: '400px' }}
        >
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Spin tip="地图加载中..." />
                </div>
            ) : geoJsonLoaded ? (
                <div ref={chartRef} style={{ width: '100%', height: '100%', minHeight: '400px' }} />
            ) : (
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description="地图数据加载失败，请检查网络或使用列表视图" 
                    style={{ paddingTop: '80px' }}
                />
            )}
            
            {/* Fallback Overlay if needed */}
            {!loading && geoJsonLoaded && (
                <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
                    <Space direction="vertical">
                        <Tag color="blue">东湖高新区: {regionData.find(r => r.name === '东湖高新区')?.value || 0}</Tag>
                        <Tag color="cyan">洪山区: {regionData.find(r => r.name === '洪山区')?.value || 0}</Tag>
                    </Space>
                </div>
            )}
        </Card>
    );
};

export default MapComponent;
