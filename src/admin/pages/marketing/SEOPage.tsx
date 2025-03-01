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
  Alert,
  Spin,
} from 'antd';
import { useQuery, gql } from '@apollo/client';
import type { TabsProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const GET_SEO_METRICS = gql`
  query GetSEOMetrics($url: String!) {
    getSEOMetrics(url: $url) {
      readabilityScore
      keywordDensity {
        keyword
        density
      }
      wordCount
      metaTags {
        title
        description
        keywords
      }
      headings {
        level
        text
      }
    }
  }
`;

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
  const [selectedUrl, setSelectedUrl] = useState<string>('');

  const { loading, error, data, refetch } = useQuery(GET_SEO_METRICS, {
    variables: { url: selectedUrl },
    skip: !selectedUrl,
    notifyOnNetworkStatusChange: true,
  });

  const handleAnalyze = (values: { url: string }) => {
    setSelectedUrl(values.url);
  };

  const handleRefresh = () => {
    if (selectedUrl) {
      refetch();
    }
  };

  const renderSEOMetrics = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: '1rem' }}>Loading SEO metrics...</Text>
        </div>
      );
    }

    if (error) {
      return (
        <Alert
          message="Error"
          description={error.message || 'Failed to load SEO metrics. Please try again.'}
          type="error"
          showIcon
          action={
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Retry
            </Button>
          }
        />
      );
    }

    if (!data?.getSEOMetrics) {
      return (
        <Alert
          message="No Data"
          description="Enter a URL above and click Analyze to view SEO metrics."
          type="info"
          showIcon
        />
      );
    }

    const { readabilityScore, keywordDensity, wordCount, metaTags, headings } = data.getSEOMetrics;

    return (
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="Overview">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>Readability Score: {readabilityScore.toFixed(1)}</Text>
            <Text>Word Count: {wordCount}</Text>
          </Space>
        </Card>

        <Card title="Meta Tags">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Title:</Text>
            <Text>{metaTags.title || 'Not found'}</Text>
            <Text strong>Description:</Text>
            <Text>{metaTags.description || 'Not found'}</Text>
            <Text strong>Keywords:</Text>
            <Text>{metaTags.keywords || 'Not found'}</Text>
          </Space>
        </Card>

        <Card title="Keyword Density">
          <Table
            dataSource={keywordDensity}
            columns={[
              { title: 'Keyword', dataIndex: 'keyword' },
              { 
                title: 'Density (%)', 
                dataIndex: 'density',
                render: (value: number) => value.toFixed(2)
              },
            ]}
            size="small"
            pagination={{ pageSize: 10 }}
          />
        </Card>

        <Card title="Headings Structure">
          <Table
            dataSource={headings}
            columns={[
              { 
                title: 'Level', 
                dataIndex: 'level',
                render: (level: number) => `H${level}`
              },
              { title: 'Text', dataIndex: 'text' },
            ]}
            size="small"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </Space>
    );
  };

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
    {
      key: 'seo-analysis',
      label: 'SEO Analysis',
      children: (
        <div>
          <Form form={form} onFinish={handleAnalyze} style={{ marginBottom: '2rem' }}>
            <Space style={{ width: '100%' }}>
              <Form.Item
                name="url"
                style={{ flex: 1, marginBottom: 0 }}
                rules={[
                  { required: true, message: 'Please enter a URL' },
                  { type: 'url', message: 'Please enter a valid URL' }
                ]}
              >
                <Input placeholder="Enter URL to analyze" />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Analyze
                </Button>
              </Form.Item>
              {selectedUrl && (
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
                    Refresh
                  </Button>
                </Form.Item>
              )}
            </Space>
          </Form>

          {renderSEOMetrics()}
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
