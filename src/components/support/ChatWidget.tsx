import React, { useState, useEffect, useRef } from 'react';
import { ChatService } from '../../services/support/ChatService';
import { WhatsAppService } from '../../services/support/WhatsAppService';
import { PhoneInput } from '../common/PhoneInput';
import { WhatsAppSettings } from '../../types/admin';

interface Message {
  id: string;
  content: string;
  type: 'customer' | 'agent';
  timestamp: number;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'phone' | 'chat'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const whatsAppService = useRef(WhatsAppService.getInstance());

  useEffect(() => {
    const checkOperatingHours = async () => {
      if (!whatsAppService.current.isWithinOperatingHours()) {
        setError('Our support team is currently offline. Please try again during operating hours.');
        return;
      }
      setError(null);
    };

    if (isOpen) {
      checkOperatingHours();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (sessionId) {
        whatsAppService.current.endSession(sessionId);
      }
    };
  }, [sessionId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!whatsAppService.current.isEnabled()) {
        throw new Error('WhatsApp support is currently disabled.');
      }

      const settings = await whatsAppService.current.getSettings();
      setMessages([
        {
          id: 'welcome',
          content: settings.welcomeMessage,
          type: 'agent',
          timestamp: Date.now()
        }
      ]);

      const newSessionId = await whatsAppService.current.startSession(phoneNumber);
      setSessionId(newSessionId);
      setStep('chat');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start chat session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    const tempMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      type: 'customer',
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      await whatsAppService.current.sendMessageToGroup(messageContent, phoneNumber);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      setMessages((prev) => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        aria-label="Open chat"
      >
        <ChatIcon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
      <div className="p-4 bg-primary-600 text-white rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">Support Chat</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200"
          aria-label="Close chat"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handlePhoneSubmit} className="p-4 flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your WhatsApp number to start chatting
          </label>
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !phoneNumber}
            className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Starting chat...' : 'Start Chat'}
          </button>
        </form>
      ) : (
        <>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.type === 'customer' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.type === 'customer'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 disabled:opacity-50"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

// Icons
const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);
