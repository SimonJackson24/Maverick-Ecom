import React, { useEffect, useState } from 'react';
import { Card, Button, Steps, Typography, Alert, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSetupState } from '../hooks/useSetupState';
import { gql, useMutation, useQuery } from '@apollo/client';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TEST_DATABASE = gql`
  query TestDatabase {
    testDatabaseConnection
  }
`;

const RUN_MIGRATIONS = gql`
  mutation RunMigrations {
    runDatabaseMigrations
  }
`;

const DatabaseSetup: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentStep } = useSetupState();
  const [step, setStep] = useState<'testing' | 'migrations' | 'complete'>('testing');
  
  const { data: testData, loading: testLoading, error: testError } = useQuery(TEST_DATABASE);
  const [runMigrations, { loading: migrationsLoading, error: migrationsError }] = useMutation(RUN_MIGRATIONS);

  useEffect(() => {
    if (testData?.testDatabaseConnection && step === 'testing') {
      setStep('migrations');
      handleRunMigrations();
    }
  }, [testData]);

  const handleRunMigrations = async () => {
    try {
      await runMigrations();
      setStep('complete');
    } catch (error) {
      console.error('Failed to run migrations:', error);
    }
  };

  const handleContinue = async () => {
    await setCurrentStep('complete');
    navigate('/setup/complete');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <Steps
          current={3}
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
          Database Setup
        </Title>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-8">
              {step === 'testing' ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              ) : (
                <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              )}
            </div>
            <div className="flex-1">
              <Text strong>Testing Database Connection</Text>
              {testError && (
                <Alert
                  type="error"
                  message="Database Connection Error"
                  description={testError.message}
                  className="mt-2"
                />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-8">
              {step === 'migrations' ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              ) : step === 'complete' ? (
                <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
              )}
            </div>
            <div className="flex-1">
              <Text strong>Running Database Migrations</Text>
              {migrationsError && (
                <Alert
                  type="error"
                  message="Migration Error"
                  description={migrationsError.message}
                  className="mt-2"
                />
              )}
            </div>
          </div>
        </div>

        {step === 'complete' && (
          <div className="text-center mt-8">
            <Button type="primary" size="large" onClick={handleContinue}>
              Continue to Final Step
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DatabaseSetup;
