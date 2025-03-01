import React from 'react';
import { Card, Button, Steps, Typography, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSetupState } from '../hooks/useSetupState';

const { Paragraph } = Typography;

const Complete: React.FC = () => {
  const navigate = useNavigate();
  const { completeSetup } = useSetupState();

  const handleComplete = async () => {
    await completeSetup();
    navigate('/admin');
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
            { title: 'Complete' },
          ]}
          className="mb-8"
        />

        <Result
          status="success"
          title="Setup Complete!"
          subTitle="Your Wick & Wax Co store is ready to go"
          extra={[
            <Button type="primary" key="console" size="large" onClick={handleComplete}>
              Go to Admin Dashboard
            </Button>,
          ]}
        >
          <div className="text-left">
            <Paragraph>
              You have successfully:
              <ul className="list-disc pl-8 mt-4">
                <li>Configured your store settings</li>
                <li>Created your admin account</li>
                <li>Set up your database</li>
                <li>Initialized your store</li>
              </ul>
            </Paragraph>
            <Paragraph>
              Next steps:
              <ul className="list-disc pl-8 mt-4">
                <li>Customize your store theme</li>
                <li>Add your products</li>
                <li>Configure shipping methods</li>
                <li>Set up payment methods</li>
                <li>Review store settings</li>
              </ul>
            </Paragraph>
          </div>
        </Result>
      </Card>
    </div>
  );
};

export default Complete;
