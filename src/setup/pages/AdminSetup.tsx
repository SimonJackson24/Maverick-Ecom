import React from 'react';
import { Card, Form, Input, Button, Steps, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSetupState } from '../hooks/useSetupState';
import { gql, useMutation } from '@apollo/client';

const { Title } = Typography;

const CREATE_ADMIN_USER = gql`
  mutation CreateAdminUser($input: CreateAdminUserInput!) {
    createAdminUser(input: $input) {
      id
      email
    }
  }
`;

const AdminSetup: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentStep } = useSetupState();
  const [createAdminUser] = useMutation(CREATE_ADMIN_USER);

  const onFinish = async (values: any) => {
    try {
      await createAdminUser({
        variables: {
          input: values,
        },
      });
      await setCurrentStep('database');
      navigate('/setup/database');
    } catch (error) {
      console.error('Failed to create admin user:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <Steps
          current={2}
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
          Create Admin Account
        </Title>

        <Alert
          message="Security Note"
          description="This account will have full administrative access to your store. Please use a strong password and keep it secure."
          type="warning"
          showIcon
          className="mb-6"
        />

        <Form
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            label="Admin Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="admin@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 8, message: 'Password must be at least 8 characters' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Password must include uppercase, lowercase, number and special character',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please enter your first name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter your last name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" size="large">
              Continue to Database Setup
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminSetup;
