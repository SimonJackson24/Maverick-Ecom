import React, { useEffect } from 'react';
import { Card, Typography, Button, Alert, Switch, Select, Descriptions, Spin, notification } from 'antd';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { SyncOutlined, CloudUploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const GET_VERSION_INFO = gql`
  query GetVersionInfo {
    versionInfo {
      currentVersion
      latestVersion
      updateAvailable
      releaseNotes
    }
    systemSettings {
      autoUpdate
      updateChannel
      lastUpdated
    }
  }
`;

const CHECK_FOR_UPDATES = gql`
  mutation CheckForUpdates {
    checkForUpdates {
      currentVersion
      latestVersion
      updateAvailable
      releaseNotes
    }
  }
`;

const PERFORM_UPDATE = gql`
  mutation PerformUpdate {
    performUpdate
  }
`;

const UPDATE_SYSTEM_SETTINGS = gql`
  mutation UpdateSystemSettings($input: UpdateSystemSettingsInput!) {
    updateSystemSettings(input: $input) {
      autoUpdate
      updateChannel
    }
  }
`;

const UpdateSettings: React.FC = () => {
  const { data, loading, refetch } = useQuery(GET_VERSION_INFO);
  const [checkForUpdates] = useMutation(CHECK_FOR_UPDATES);
  const [performUpdate, { loading: updating }] = useMutation(PERFORM_UPDATE);
  const [updateSettings] = useMutation(UPDATE_SYSTEM_SETTINGS);

  useEffect(() => {
    const interval = setInterval(() => {
      if (data?.systemSettings?.autoUpdate) {
        checkForUpdates();
      }
    }, 24 * 60 * 60 * 1000); // Check once per day

    return () => clearInterval(interval);
  }, [data?.systemSettings?.autoUpdate]);

  const handleCheckUpdates = async () => {
    try {
      await checkForUpdates();
      await refetch();
      notification.success({
        message: 'Update Check Complete',
        description: 'Successfully checked for updates.',
      });
    } catch (error) {
      notification.error({
        message: 'Update Check Failed',
        description: error.message,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      await performUpdate();
      notification.success({
        message: 'Update Complete',
        description: 'The system has been successfully updated.',
      });
      window.location.reload();
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: error.message,
      });
    }
  };

  const handleAutoUpdateChange = async (checked: boolean) => {
    try {
      await updateSettings({
        variables: {
          input: {
            autoUpdate: checked,
          },
        },
      });
      notification.success({
        message: 'Settings Updated',
        description: `Auto-updates have been ${checked ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      notification.error({
        message: 'Settings Update Failed',
        description: error.message,
      });
    }
  };

  const handleChannelChange = async (channel: string) => {
    try {
      await updateSettings({
        variables: {
          input: {
            updateChannel: channel,
          },
        },
      });
      notification.success({
        message: 'Settings Updated',
        description: `Update channel changed to ${channel}.`,
      });
    } catch (error) {
      notification.error({
        message: 'Settings Update Failed',
        description: error.message,
      });
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  const { versionInfo, systemSettings } = data || {};

  return (
    <div className="space-y-6">
      <Card>
        <Title level={3}>System Updates</Title>
        
        <Descriptions column={1} className="mb-6">
          <Descriptions.Item label="Current Version">
            {versionInfo?.currentVersion}
          </Descriptions.Item>
          <Descriptions.Item label="Latest Version">
            {versionInfo?.latestVersion}
          </Descriptions.Item>
          <Descriptions.Item label="Last Checked">
            {new Date(systemSettings?.lastUpdated).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>

        {versionInfo?.updateAvailable && (
          <Alert
            type="info"
            message="Update Available"
            description={versionInfo.releaseNotes}
            className="mb-6"
          />
        )}

        <div className="space-x-4">
          <Button
            icon={<SyncOutlined />}
            onClick={handleCheckUpdates}
            loading={loading}
          >
            Check for Updates
          </Button>

          {versionInfo?.updateAvailable && (
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={handleUpdate}
              loading={updating}
            >
              Update Now
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <Title level={3}>Update Settings</Title>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Text strong>Automatic Updates</Text>
              <Text className="block text-gray-500">
                Automatically check and install updates
              </Text>
            </div>
            <Switch
              checked={systemSettings?.autoUpdate}
              onChange={handleAutoUpdateChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Text strong>Update Channel</Text>
              <Text className="block text-gray-500">
                Choose which updates to receive
              </Text>
            </div>
            <Select
              value={systemSettings?.updateChannel}
              onChange={handleChannelChange}
              style={{ width: 200 }}
            >
              <Select.Option value="stable">Stable</Select.Option>
              <Select.Option value="beta">Beta</Select.Option>
              <Select.Option value="alpha">Alpha</Select.Option>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UpdateSettings;
