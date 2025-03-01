import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, DatePicker, Input, message } from 'antd';
import type { TableProps } from 'antd';
import { WhatsAppService } from '../../../services/support/WhatsAppService';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Search } = Input;

interface ChatMessage {
  id: string;
  timestamp: number;
  from: string;
  content: string;
  type: 'customer' | 'agent';
}

export const ChatHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null]>([null, null]);
  const whatsAppService = WhatsAppService.getInstance();

  useEffect(() => {
    loadChatHistory();
  }, [dateRange]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const [startDate, endDate] = dateRange;
      const history = await whatsAppService.getChatHistory(
        startDate?.toDate() || null,
        endDate?.toDate() || null
      );
      setMessages(history);
    } catch (error) {
      message.error('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (customerNumber: string) => {
    try {
      const response = await whatsAppService.sendMessageToCustomer(
        customerNumber,
        'Thank you for contacting us. How can we help you today?'
      );
      message.success('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
      message.error('Failed to send message');
    }
  };

  const columns: TableProps<ChatMessage>['columns'] = [
    {
      title: 'Date & Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
      sorter: (a, b) => a.timestamp - b.timestamp,
      width: 200,
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      width: 150,
    },
    {
      title: 'Message',
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => (
        <div className="whitespace-pre-wrap max-w-lg">{content}</div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'customer' ? 'blue' : 'green'}>
          {type.toUpperCase()}
        </Tag>
      ),
      width: 100,
      filters: [
        { text: 'Customer', value: 'customer' },
        { text: 'Agent', value: 'agent' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleReply(record.from)}>
            Reply
          </Button>
        </Space>
      ),
      width: 100,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <RangePicker
          onChange={(dates) => {
            setDateRange([
              dates?.[0] || null,
              dates?.[1] || null
            ]);
          }}
          className="w-[300px]"
        />
      </div>
      <Table
        columns={columns}
        dataSource={messages}
        loading={loading}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} messages`,
        }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ChatHistory;
