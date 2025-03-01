import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Input,
  Button,
  List,
  Avatar,
  Typography,
  Space,
  Badge,
  Drawer,
  Tag,
  Spin,
  message,
} from 'antd';
import {
  SendOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { whatsAppService } from '../../../services/support/WhatsAppService';
import type { WhatsAppMessage } from '../../../types/admin';
import moment from 'moment';

const { Text } = Typography;
const { Search } = Input;

interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastContact: Date;
  orderCount: number;
  status: 'online' | 'offline' | 'busy';
}

const WhatsAppChat: React.FC = () => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfo | null>(null);
  const [customerDrawerVisible, setCustomerDrawerVisible] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await whatsAppService.getMessages();
      setMessages(response);
      
      // Load customer info for the first conversation
      if (response.length > 0) {
        const customerInfo = await whatsAppService.getCustomerInfo(response[0].from);
        setSelectedCustomer(customerInfo);
      }
    } catch (error) {
      message.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedCustomer) return;

    try {
      const newMessage: Partial<WhatsAppMessage> = {
        content: messageInput,
        to: selectedCustomer.phone,
        type: 'text',
        timestamp: new Date(),
      };

      const sentMessage = await whatsAppService.sendMessage(newMessage);
      setMessages([...messages, sentMessage]);
      setMessageInput('');
      message.success('Message sent successfully');
    } catch (error) {
      message.error('Failed to send message');
    }
  };

  const renderMessage = (msg: WhatsAppMessage) => {
    const isAgent = msg.from === 'agent';
    return (
      <List.Item
        style={{
          justifyContent: isAgent ? 'flex-end' : 'flex-start',
          padding: '8px 16px',
        }}
      >
        <Space align="start">
          {!isAgent && (
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          )}
          <div
            style={{
              background: isAgent ? '#1890ff' : '#f0f2f5',
              color: isAgent ? 'white' : 'rgba(0, 0, 0, 0.85)',
              padding: '8px 12px',
              borderRadius: '8px',
              maxWidth: '70%',
            }}
          >
            <Text style={{ color: isAgent ? 'white' : 'inherit' }}>
              {msg.content}
            </Text>
            <div>
              <Text
                type="secondary"
                style={{
                  fontSize: '12px',
                  color: isAgent ? 'rgba(255, 255, 255, 0.75)' : undefined,
                }}
              >
                {moment(msg.timestamp).format('HH:mm')}
              </Text>
            </div>
          </div>
          {isAgent && (
            <Avatar icon={<CustomerServiceOutlined />} style={{ backgroundColor: '#52c41a' }} />
          )}
        </Space>
      </List.Item>
    );
  };

  return (
    <Card style={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 0
    }}>
      <div style={{ 
        padding: '16px 24px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Space>
          <Badge status={selectedCustomer?.status || 'default'} />
          <Text strong>{selectedCustomer?.name || 'Select a customer'}</Text>
        </Space>
        {selectedCustomer && (
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => setCustomerDrawerVisible(true)}
          >
            Customer Info
          </Button>
        )}
      </div>

      <div style={{ 
        flex: 1,
        overflow: 'auto',
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {loading ? (
          <div style={{ 
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            dataSource={messages}
            renderItem={renderMessage}
            split={false}
            style={{ flex: 1 }}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ 
        padding: '16px 24px',
        borderTop: '1px solid #f0f0f0'
      }}>
        <Search
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          enterButton={<SendOutlined />}
          onSearch={handleSendMessage}
          disabled={!selectedCustomer}
        />
      </div>

      <Drawer
        title="Customer Information"
        placement="right"
        onClose={() => setCustomerDrawerVisible(false)}
        open={customerDrawerVisible}
        width={400}
      >
        {selectedCustomer && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text type="secondary">Contact Information</Text>
              <List>
                <List.Item>
                  <Space>
                    <PhoneOutlined />
                    <Text>{selectedCustomer.phone}</Text>
                  </Space>
                </List.Item>
                <List.Item>
                  <Space>
                    <MailOutlined />
                    <Text>{selectedCustomer.email}</Text>
                  </Space>
                </List.Item>
              </List>
            </div>
            <div>
              <Text type="secondary">Order Information</Text>
              <List>
                <List.Item>
                  <Space>
                    <Text>Total Orders:</Text>
                    <Tag color="blue">{selectedCustomer.orderCount}</Tag>
                  </Space>
                </List.Item>
                <List.Item>
                  <Space>
                    <Text>Last Contact:</Text>
                    <Text>{moment(selectedCustomer.lastContact).format('MMMM D, YYYY')}</Text>
                  </Space>
                </List.Item>
              </List>
            </div>
          </Space>
        )}
      </Drawer>
    </Card>
  );
};

export default WhatsAppChat;
