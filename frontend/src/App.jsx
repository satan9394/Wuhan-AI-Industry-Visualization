import React, { useState } from 'react';
import { Layout, Menu, ConfigProvider, theme, Segmented } from 'antd';
import { DashboardOutlined, ReadOutlined, RocketOutlined, BarChartOutlined, TeamOutlined, CloudServerOutlined, DatabaseOutlined, PartitionOutlined, ExperimentOutlined, BulbOutlined, AppstoreOutlined } from '@ant-design/icons';
import StrategyView from './components/StrategyView';
import InnovationView from './components/InnovationView';
import ApplicationCases from './components/ApplicationCases';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import StrategicIntelligenceView from './components/StrategicIntelligenceView';
import DataElementView from './components/DataElementView';
import PolicyModule from './components/PolicyModule';
import EnterprisePortrait from './components/EnterprisePortrait';
import IndustryAnalysis from './components/IndustryAnalysis';
import InfraMonitor from './components/InfraMonitor';
import SupplyChainMap from './components/SupplyChainMap';
import RegionCategoryMatrix from './components/RegionCategoryMatrix';
import { UiModeProvider, useUiMode } from './context/UiModeContext';
import './App.css';

const { Sider, Content } = Layout;

const MODE_OPTIONS = [
  { label: '经典模式', value: 'v1_classic' },
  { label: '体验模式', value: 'v2_editorial' },
];

const AppShell = () => {
  const [view, setView] = useState('landing');
  const [currentModule, setCurrentModule] = useState('strategy_intel');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState(null);
  const { mode, setMode } = useUiMode();
  const isEditorial = mode === 'v2_editorial';
  const siderWidth = collapsed ? 80 : 240;

  const handleEnter = () => {
    setView('app');
  };

  const handleSelectEnterprise = (name) => {
    setSelectedEnterprise(name);
    setCurrentModule('portrait');
  };

  const renderContent = () => {
    switch (currentModule) {
      case 'strategy_intel':
        return <StrategicIntelligenceView />;
      case 'strategy':
        return <StrategyView />;
      case 'innovation':
        return <InnovationView />;
      case 'cases':
        return <ApplicationCases />;
      case 'policy':
        return <PolicyModule />;
      case 'dashboard':
        return <Dashboard onSelectEnterprise={handleSelectEnterprise} />;
      case 'portrait':
        return <EnterprisePortrait enterpriseName={selectedEnterprise} />;
      case 'analysis':
        return <IndustryAnalysis />;
      case 'infra':
        return <InfraMonitor />;
      case 'data_element':
        return <DataElementView />;
      case 'region_matrix':
        return <RegionCategoryMatrix />;
      case 'chain':
        return <SupplyChainMap />;
      default:
        return <StrategicIntelligenceView />;
    }
  };

  if (view === 'landing') {
    return (
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <Landing onEnter={handleEnter} />
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: isEditorial ? '#111827' : '#3B82F6',
          borderRadius: isEditorial ? 12 : 8,
          fontFamily: 'var(--ui-font-body)',
        },
      }}
    >
      <div className={`ui-root ${isEditorial ? 'ui-mode-v2' : 'ui-mode-v1'}`}>
        <Layout className="app-layout">
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            collapsedWidth={80}
            style={{
              background: 'var(--ui-sider-bg)',
              borderRight: '1px solid var(--ui-sider-border)',
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              height: '100vh',
              overflow: 'auto',
              zIndex: 100
            }}
            width={240}
          >
            <div style={{
              height: '64px',
              margin: '16px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: collapsed ? '12px' : '16px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              transition: 'all 0.2s'
            }}>
              {collapsed ? 'AI' : '产业大脑'}
            </div>

            <div className="mode-toggle">
              <div className="mode-toggle-title">界面模式</div>
              <Segmented
                block
                size="small"
                value={mode}
                onChange={(value) => setMode(value)}
                options={MODE_OPTIONS}
              />
            </div>

            <Menu
              theme="dark"
              defaultSelectedKeys={['policy']}
              mode="inline"
              selectedKeys={[currentModule]}
              onClick={({ key }) => setCurrentModule(key)}
              style={{ background: 'transparent' }}
              items={[
                {
                  key: 'strategy_intel',
                  icon: <RocketOutlined />,
                  label: '战略情报',
                },
                {
                  key: 'strategy',
                  icon: <RocketOutlined />,
                  label: '战略全景',
                },
                {
                  key: 'innovation',
                  icon: <ExperimentOutlined />,
                  label: '创新生态',
                },
                {
                  key: 'cases',
                  icon: <BulbOutlined />,
                  label: '典型应用案例',
                },
                {
                  key: 'dashboard',
                  icon: <DashboardOutlined />,
                  label: '产业数据看板',
                },
                {
                  key: 'analysis',
                  icon: <BarChartOutlined />,
                  label: '行业运营分析',
                },
                {
                  key: 'infra',
                  icon: <CloudServerOutlined />,
                  label: '算力基建监控',
                },
                {
                  key: 'data_element',
                  icon: <DatabaseOutlined />,
                  label: '数据要素看板',
                },
                {
                  key: 'region_matrix',
                  icon: <AppstoreOutlined />,
                  label: '区域-产业矩阵',
                },
                {
                  key: 'chain',
                  icon: <PartitionOutlined />,
                  label: '产业链图谱',
                },
                {
                  key: 'policy',
                  icon: <ReadOutlined />,
                  label: '政策归档',
                },
                {
                  key: 'portrait',
                  icon: <TeamOutlined />,
                  label: '企业详细画像',
                },
              ]}
            />
          </Sider>

          <Layout style={{ background: 'transparent', marginLeft: siderWidth, transition: 'margin-left 0.2s ease' }}>
            <Content className="app-content" style={{ overflowY: 'auto' }}>
              {renderContent()}
            </Content>
          </Layout>
        </Layout>
      </div>
    </ConfigProvider>
  );
};

const App = () => (
  <UiModeProvider>
    <AppShell />
  </UiModeProvider>
);

export default App;
