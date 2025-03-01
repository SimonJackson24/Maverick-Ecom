import React from 'react';
import { Card, Button, Result, Typography, Alert, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const CompletePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="Setup Complete!"
          subTitle="Your Wick & Wax Co store is ready to use"
        />

        <div className="text-center mb-8">
          <Title level={4}>Next Steps</Title>
          <Space direction="vertical" className="w-full">
            <Alert
              message="Security Reminder"
              description="Make sure to save your admin credentials in a secure location and enable two-factor authentication for additional security."
              type="warning"
              showIcon
            />

            <Alert
              message="Backup Configuration"
              description="Configure regular backups for your database and files to prevent data loss."
              type="info"
              showIcon
            />

            <Alert
              message="SSL Certificate"
              description="Ensure your SSL certificate is properly installed and configured for secure transactions."
              type="info"
              showIcon
            />
          </Space>
        </div>

        <Paragraph className="text-center mb-8">
          <Text>
            Visit our <a href="https://docs.wickandwax.co" target="_blank" rel="noopener noreferrer">documentation</a> for detailed guides and best practices.
          </Text>
        </Paragraph>

        <div className="text-center">
          <Button type="primary" size="large" onClick={handleGoToDashboard}>
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CompletePage;
