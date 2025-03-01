import React from 'react';
import { Card, Form, Input, Button, Steps, Switch, Typography, Alert, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSetupState } from '../hooks/useSetupState';
import { gql, useMutation } from '@apollo/client';
import { SecuritySettings } from '../types';

const { Title, Text } = Typography;

const CONFIGURE_SECURITY = gql`
  mutation ConfigureSecurity($input: SecuritySettingsInput!) {
    configureSecuritySettings(input: $input) {
      sslEnabled
      firewallEnabled
      rateLimitEnabled
      authType
    }
  }
`;

const SecuritySetup: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentStep } = useSetupState();
  const [configureSecurity] = useMutation(CONFIGURE_SECURITY);

  const onFinish = async (values: SecuritySettings) => {
    try {
      await configureSecurity({
        variables: {
          input: values,
        },
      });
      await setCurrentStep('complete');
      navigate('/setup/complete');
    } catch (error) {
      console.error('Failed to configure security settings:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <Steps
          current={4}
          items={[
            { title: 'Welcome' },
            { title: 'Store Setup' },
            { title: 'Admin Account' },
            { title: 'Database' },
            { title: 'Security' },
            { title: 'Complete' },
          ]}
          className="mb-8"
        />

        <Title level={2} className="mb-6">Security Configuration</Title>

        <Alert
          message="Important Security Settings"
          description="These settings help secure your application. We recommend enabling all security features for production environments."
          type="info"
          showIcon
          className="mb-6"
        />

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            sslEnabled: true,
            firewallEnabled: true,
            rateLimitEnabled: true,
            authType: 'jwt',
          }}
        >
          <Space direction="vertical" className="w-full">
            <Form.Item
              label="Enable SSL/TLS"
              name="sslEnabled"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Enable Firewall"
              name="firewallEnabled"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Enable Rate Limiting"
              name="rateLimitEnabled"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Authentication Type"
              name="authType"
              rules={[{ required: true, message: 'Please select authentication type' }]}
            >
              <Select>
                <Select.Option value="jwt">JWT (Recommended)</Select.Option>
                <Select.Option value="session">Session Based</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="CORS Origins"
              name="corsOrigins"
              rules={[{ required: true, message: 'Please enter allowed origins' }]}
            >
              <Select mode="tags" placeholder="Enter allowed origins (e.g., https://your-domain.com)">
                <Select.Option value="*">Allow All (Not recommended for production)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.authType !== currentValues.authType}
            >
              {({ getFieldValue }) => 
                getFieldValue('authType') === 'jwt' ? (
                  <Form.Item
                    label="JWT Secret"
                    name="jwtSecret"
                    rules={[
                      { required: true, message: 'Please enter JWT secret' },
                      { min: 32, message: 'Secret should be at least 32 characters long' }
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label="Session Secret"
                    name="sessionSecret"
                    rules={[
                      { required: true, message: 'Please enter session secret' },
                      { min: 32, message: 'Secret should be at least 32 characters long' }
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                )
              }
            </Form.Item>

            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" size="large" block>
                Continue
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default SecuritySetup;
