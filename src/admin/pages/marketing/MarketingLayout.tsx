import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { TabsProps } from 'antd';
import TabbedPageLayout from '../../components/layout/TabbedPageLayout';

const MarketingLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || '';

  const handleTabChange = (key: string) => {
    navigate(`/admin/marketing/${key}`);
  };

  const items: TabsProps['items'] = [
    {
      key: '',
      label: 'Overview'
    },
    {
      key: 'coupons',
      label: 'Coupons'
    },
    {
      key: 'loyalty',
      label: 'Loyalty Program'
    },
    {
      key: 'email-campaigns',
      label: 'Email Campaigns'
    },
    {
      key: 'seo',
      label: 'SEO'
    }
  ];

  return (
    <TabbedPageLayout
      title="Marketing"
      items={items}
      activeKey={currentTab}
      onTabChange={handleTabChange}
    />
  );
};

export default MarketingLayout;
