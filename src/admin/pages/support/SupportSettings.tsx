import React, { useEffect, useState } from 'react';
import { Form, Input, Switch, TimePicker, InputNumber, Button, notification, Select, Table } from 'antd';
import { WhatsAppSettings } from '../../../types/admin';
import { WhatsAppService } from '../../../services/support/WhatsAppService';
import { SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const SupportSettings: React.FC = () => {
  const [form] = Form.useForm<WhatsAppSettings>();
  const [loading, setLoading] = useState(false);
  const whatsappService = WhatsAppService.getInstance();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await whatsappService.getSettings();
      
      // Convert schedule times to dayjs objects
      const formattedSettings = {
        ...settings,
        operatingHours: {
          ...settings.operatingHours,
          schedule: settings.operatingHours.schedule.map(day => ({
            ...day,
            start: day.isOpen ? dayjs(day.start, 'HH:mm') : null,
            end: day.isOpen ? dayjs(day.end, 'HH:mm') : null,
          })),
        },
      };
      
      form.setFieldsValue(formattedSettings);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to load WhatsApp settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: WhatsAppSettings) => {
    try {
      setLoading(true);
      
      // Convert dayjs objects back to time strings
      const settings = {
        ...values,
        operatingHours: {
          ...values.operatingHours,
          schedule: values.operatingHours.schedule.map(day => ({
            ...day,
            start: day.isOpen ? day.start.format('HH:mm') : '',
            end: day.isOpen ? day.end.format('HH:mm') : '',
          })),
        },
      };
      
      await whatsappService.updateSettings(settings);
      notification.success({
        message: 'Success',
        description: 'WhatsApp settings updated successfully',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update WhatsApp settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const scheduleColumns = [
    {
      title: 'Day',
      dataIndex: 'day',
      key: 'day',
      render: (_: any, __: any, index: number) => DAYS_OF_WEEK[index],
    },
    {
      title: 'Open',
      dataIndex: ['operatingHours', 'schedule', 'isOpen'],
      key: 'isOpen',
      render: (_: any, __: any, index: number) => (
        <Form.Item
          name={['operatingHours', 'schedule', index, 'isOpen']}
          valuePropName="checked"
          noStyle
        >
          <Switch />
        </Form.Item>
      ),
    },
    {
      title: 'Start Time',
      dataIndex: ['operatingHours', 'schedule', 'start'],
      key: 'start',
      render: (_: any, __: any, index: number) => (
        <Form.Item
          name={['operatingHours', 'schedule', index, 'start']}
          noStyle
          dependencies={[['operatingHours', 'schedule', index, 'isOpen']]}
        >
          <TimePicker
            format="HH:mm"
            className="w-full"
            disabled={!form.getFieldValue(['operatingHours', 'schedule', index, 'isOpen'])}
          />
        </Form.Item>
      ),
    },
    {
      title: 'End Time',
      dataIndex: ['operatingHours', 'schedule', 'end'],
      key: 'end',
      render: (_: any, __: any, index: number) => (
        <Form.Item
          name={['operatingHours', 'schedule', index, 'end']}
          noStyle
          dependencies={[['operatingHours', 'schedule', index, 'isOpen']]}
        >
          <TimePicker
            format="HH:mm"
            className="w-full"
            disabled={!form.getFieldValue(['operatingHours', 'schedule', index, 'isOpen'])}
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Support Settings</h1>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={() => form.submit()}
        >
          Save Changes
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="max-w-4xl"
      >
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">WhatsApp Integration</h2>
          
          <Form.Item
            name={['enabled']}
            valuePropName="checked"
            label="Enable WhatsApp Integration"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name={['businessName']}
            label="Business Name"
            rules={[{ required: true, message: 'Please enter your business name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={['businessPhoneNumber']}
            label="Business Phone Number"
            rules={[{ required: true, message: 'Please enter your WhatsApp business number' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={['welcomeMessage']}
            label="Welcome Message"
            rules={[{ required: true, message: 'Please enter a welcome message' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Operating Hours</h2>
          
          <Form.Item
            name={['operatingHours', 'enabled']}
            valuePropName="checked"
            label="Enable Operating Hours"
          >
            <Switch />
          </Form.Item>

          <Form.List name={['operatingHours', 'schedule']}>
            {(fields) => (
              <Table
                dataSource={fields}
                columns={scheduleColumns}
                pagination={false}
                rowKey={(record) => record.name}
                className="mt-4"
              />
            )}
          </Form.List>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Support Group Settings</h2>
          
          <Form.Item
            name={['groupId']}
            label="Support Group ID"
            rules={[{ required: true, message: 'Please enter the support group ID' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={['notifyNewCustomer']}
            valuePropName="checked"
            label="Notify on New Customer"
          >
            <Switch />
          </Form.Item>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Auto Reply Settings</h2>
          
          <Form.Item
            name={['autoReply', 'enabled']}
            valuePropName="checked"
            label="Enable Auto Reply"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name={['autoReply', 'message']}
            label="Auto Reply Message"
            rules={[
              {
                required: true,
                message: 'Please enter auto reply message',
                dependencies: [['autoReply', 'enabled']],
              },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Webhook Settings</h2>
          
          <Form.Item
            name={['webhook', 'enabled']}
            valuePropName="checked"
            label="Enable Webhook"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name={['webhook', 'verifyToken']}
            label="Verify Token"
            rules={[
              {
                required: true,
                message: 'Please enter webhook verify token',
                dependencies: [['webhook', 'enabled']],
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={['webhook', 'notificationUrl']}
            label="Notification URL"
            rules={[
              {
                required: true,
                message: 'Please enter notification URL',
                dependencies: [['webhook', 'enabled']],
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default SupportSettings;
