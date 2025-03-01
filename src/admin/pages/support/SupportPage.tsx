import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import type { TabsProps } from 'antd';
import TabbedPageLayout from '../../components/layout/TabbedPageLayout';

const SupportPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'settings';

  const handleTabChange = (key: string) => {
    navigate(`/admin/support/${key}`);
  };

  const items: TabsProps['items'] = [
    {
      key: 'settings',
      label: 'Settings'
    },
    {
      key: 'chat',
      label: 'WhatsApp Chat'
    },
    {
      key: 'chat-history',
      label: 'Chat History'
    },
    {
      key: 'inquiries',
      label: 'Customer Inquiries'
    }
  ];

  return (
    <TabbedPageLayout
      title="Support Management"
      items={items}
      activeKey={currentTab}
      onTabChange={handleTabChange}
    >
      <Outlet />
    </TabbedPageLayout>
  );
};

export default SupportPage;
