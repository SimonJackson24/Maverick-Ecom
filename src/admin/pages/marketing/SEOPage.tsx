import React, { useState } from 'react';
import {
  Card,
  Typography,
  Tabs,
  Form,
  Input,
  Button,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import type { TabsProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface MetaTag {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  lastUpdated: string;
}

interface Redirect {
  id: string;
  fromPath: string;
  toPath: string;
  type: '301' | '302';
  active: boolean;
  lastUpdated: string;
}

const SEOPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('meta-tags');
  const [form] = Form.useForm();

  // Mock data - replace with actual API calls
  const metaTags: MetaTag[] = [
    {
      id: '1',
      path: '/',
      title: 'Wick & Wax Co | Handcrafted Luxury Candles',
      description: 'Discover our collection of handcrafted luxury candles. Made with natural ingredients and unique scent combinations.',
      keywords: 'candles, luxury candles, handcrafted candles, natural candles',
      lastUpdated: '2025-02-16',
    },
  ];

  const redirects: Redirect[] = [
    {
      id: '1',
      fromPath: '/candles',
      toPath: '/products',
      type: '301',
      active: true,
      lastUpdated: '2025-02-16',
    },
  ];

  const metaTagColumns = [
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: MetaTag) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  const redirectColumns = [
    {
      title: 'From Path',
      dataIndex: 'fromPath',
      key: 'fromPath',
    },
    {
      title: 'To Path',
      dataIndex: 'toPath',
      key: 'toPath',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === '301' ? 'green' : 'blue'}>{type}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Redirect) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: 'meta-tags',
      label: 'Meta Tags',
      children: (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Manage meta tags for your pages</Text>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Meta Tag
            </Button>
          </div>
          <Table
            columns={metaTagColumns}
            dataSource={metaTags}
            rowKey="id"
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: 'redirects',
      label: 'Redirects',
      children: (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Manage URL redirects</Text>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Redirect
            </Button>
          </div>
          <Table
            columns={redirectColumns}
            dataSource={redirects}
            rowKey="id"
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: 'sitemap',
      label: 'Sitemap',
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Text>Configure your sitemap settings</Text>
          </div>
          <Form layout="vertical">
            <Form.Item
              label="Sitemap URL"
              name="sitemapUrl"
              initialValue="https://wickandwaxco.com/sitemap.xml"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item label="Excluded Paths" name="excludedPaths">
              <TextArea
                placeholder="Enter paths to exclude from sitemap (one per line)"
                rows={4}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary">Save Changes</Button>
                <Button>Generate Sitemap</Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <Title level={2}>SEO Management</Title>
      <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
        Manage your website's search engine optimization settings
      </Text>
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        style={{ marginTop: 24 }}
      />
    </Card>
  );
};

export default SEOPage;
