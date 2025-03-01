import React from 'react';
import { Card, Typography, Button, Steps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSetupState } from '../hooks/useSetupState';

const { Title, Paragraph } = Typography;

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentStep } = useSetupState();

  const handleStart = async () => {
    await setCurrentStep('store');
    navigate('/setup/store');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Title level={2}>Welcome to Wick & Wax Co</Title>
          <Paragraph>
            Let's get your store set up and running. This wizard will guide you through the process.
          </Paragraph>
        </div>

        <Steps
          current={0}
          items={[
            { title: 'Welcome' },
            { title: 'Store Setup' },
            { title: 'Admin Account' },
            { title: 'Database' },
            { title: 'Complete' },
          ]}
          className="mb-8"
        />

        <Paragraph className="mb-8">
          During this setup process, we'll help you:
          <ul className="list-disc pl-8 mt-4">
            <li>Configure your store settings</li>
            <li>Create your admin account</li>
            <li>Set up your database</li>
            <li>Configure essential features</li>
          </ul>
        </Paragraph>

        <div className="text-center">
          <Button type="primary" size="large" onClick={handleStart}>
            Start Setup
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Welcome;
