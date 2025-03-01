import React from 'react';
import { Card, Form, Input, Button, Steps, Select, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSetupState } from '../hooks/useSetupState';
import { gql, useMutation } from '@apollo/client';

const { Title } = Typography;

const CREATE_STORE_SETTINGS = gql`
  mutation CreateStoreSettings($input: CreateStoreSettingsInput!) {
    createStoreSettings(input: $input) {
      id
      storeName
      contactEmail
    }
  }
`;

const StoreSetup: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentStep } = useSetupState();
  const [createStoreSettings] = useMutation(CREATE_STORE_SETTINGS);

  const onFinish = async (values: any) => {
    try {
      await createStoreSettings({
        variables: {
          input: values,
        },
      });
      await setCurrentStep('admin');
      navigate('/setup/admin');
    } catch (error) {
      console.error('Failed to save store settings:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <Steps
          current={1}
          items={[
            { title: 'Welcome' },
            { title: 'Store Setup' },
            { title: 'Admin Account' },
            { title: 'Database' },
            { title: 'Complete' },
          ]}
          className="mb-8"
        />

        <Title level={3} className="mb-6 text-center">
          Store Configuration
        </Title>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            currency: 'USD',
            timezone: 'UTC',
          }}
        >
          <Form.Item
            name="storeName"
            label="Store Name"
            rules={[{ required: true, message: 'Please enter your store name' }]}
          >
            <Input placeholder="Wick & Wax Co" />
          </Form.Item>

          <Form.Item
            name="storeDescription"
            label="Store Description"
          >
            <Input.TextArea placeholder="Tell us about your store..." />
          </Form.Item>

          <Form.Item
            name="contactEmail"
            label="Contact Email"
            rules={[
              { required: true, message: 'Please enter your contact email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="contact@example.com" />
          </Form.Item>

          <Form.Item
            name="contactPhone"
            label="Contact Phone"
          >
            <Input placeholder="+1 (555) 123-4567" />
          </Form.Item>

          <Form.Item
            name="currency"
            label="Default Currency"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="USD">USD - US Dollar</Select.Option>
              <Select.Option value="EUR">EUR - Euro</Select.Option>
              <Select.Option value="GBP">GBP - British Pound</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="timezone"
            label="Timezone"
            rules={[{ required: true }]}
          >
            <Select showSearch>
              <Select.Option value="UTC">UTC</Select.Option>
              <Select.Option value="America/New_York">Eastern Time</Select.Option>
              <Select.Option value="America/Chicago">Central Time</Select.Option>
              <Select.Option value="America/Denver">Mountain Time</Select.Option>
              <Select.Option value="America/Los_Angeles">Pacific Time</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" size="large">
              Continue to Admin Setup
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default StoreSetup;
