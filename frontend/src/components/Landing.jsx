import React, { useState, useEffect } from 'react';
import { Button, Typography, Space } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Landing = ({ onEnter }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Grid Effect */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
                opacity: 0.3,
                pointerEvents: 'none'
            }} />

            <div style={{
                textAlign: 'center',
                zIndex: 1,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 1s ease-out, transform 1s ease-out',
                padding: '0 20px'
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <Text style={{ 
                        color: '#3B82F6', 
                        letterSpacing: '4px', 
                        textTransform: 'uppercase', 
                        fontSize: '14px',
                        fontWeight: 600,
                        background: 'rgba(59, 130, 246, 0.1)',
                        padding: '8px 16px',
                        borderRadius: '20px'
                    }}>
                        Hubei AI Ecosystem
                    </Text>
                </div>

                <Title level={1} style={{ 
                    color: '#fff', 
                    fontSize: 'clamp(40px, 5vw, 72px)', 
                    margin: '0 0 24px 0',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1
                }}>
                    湖北省人工智能<br />
                    <span style={{ 
                        background: 'linear-gradient(to right, #60A5FA, #A78BFA)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent' 
                    }}>
                        产业生态大脑
                    </span>
                </Title>

                <Text style={{ 
                    display: 'block', 
                    color: '#94A3B8', 
                    fontSize: 'clamp(16px, 2vw, 20px)', 
                    maxWidth: '600px', 
                    margin: '0 auto 48px auto',
                    lineHeight: 1.6
                }}>
                    汇聚全省企业数据，洞察产业发展脉络。
                    <br />
                    从政策引领到技术落地，全景式可视化呈现。
                </Text>

                <Button 
                    type="primary" 
                    size="large" 
                    onClick={onEnter}
                    icon={<ArrowRightOutlined />}
                    style={{ 
                        height: '56px', 
                        padding: '0 40px', 
                        fontSize: '18px', 
                        borderRadius: '28px',
                        background: '#3B82F6',
                        border: 'none',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
                    }}
                >
                    进入系统
                </Button>

                <div style={{ marginTop: '32px', display: 'flex', gap: '24px', justifyContent: 'center', color: '#64748B', fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></span>
                        数据已同步: 2025-12
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></span>
                        节点在线: 1326
                    </span>
                </div>
            </div>
            
            <div style={{
                position: 'absolute',
                bottom: '40px',
                color: '#475569',
                fontSize: '12px'
            }}>
                © 2025 Enterprise Display System. Designed for Future.
            </div>
        </div>
    );
};

export default Landing;
