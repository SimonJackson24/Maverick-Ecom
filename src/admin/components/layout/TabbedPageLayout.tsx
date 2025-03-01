import React from 'react';
import { Outlet } from 'react-router-dom';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import PageLayout from './PageLayout';

interface TabbedPageLayoutProps {
  title: string;
  items: TabsProps['items'];
  activeKey: string;
  onTabChange: (key: string) => void;
  children?: React.ReactNode;
}

const TabbedPageLayout: React.FC<TabbedPageLayoutProps> = ({
  title,
  items,
  activeKey,
  onTabChange,
  children,
}) => {
  return (
    <PageLayout title={title}>
      <Tabs
        activeKey={activeKey}
        onChange={onTabChange}
        items={items}
        className="mb-4"
      />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </PageLayout>
  );
};

export default TabbedPageLayout;
