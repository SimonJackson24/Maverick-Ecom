import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Fab,
  Grow,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  useTheme,
  styled,
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { whatsAppService } from '../../services/support/WhatsAppService';

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  backgroundColor: '#25D366',
  '&:hover': {
    backgroundColor: '#128C7E',
  },
}));

const ChatWindow = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(12),
  right: theme.spacing(4),
  width: 360,
  maxHeight: 600,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: 1000,
  [theme.breakpoints.down('sm')]: {
    width: '90vw',
    right: '5vw',
    maxHeight: '80vh',
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  backgroundColor: '#075E54',
  color: 'white',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const ChatBody = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  maxHeight: 400,
}));

const ChatFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: theme.spacing(1),
}));

const Message = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser?: boolean }>(({ theme, isUser }) => ({
  maxWidth: '80%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? '#DCF8C6' : theme.palette.background.paper,
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  position: 'relative',
  boxShadow: theme.shadows[1],
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '8px 8px 0 8px',
    borderColor: `${isUser ? '#DCF8C6' : theme.palette.background.paper} transparent transparent transparent`,
    transform: 'rotate(45deg)',
    bottom: -4,
    [isUser ? 'right' : 'left']: 8,
  },
}));

interface WhatsAppWidgetProps {
  businessName?: string;
  welcomeMessage?: string;
  avatar?: string;
  operatingHours?: {
    start: string;
    end: string;
    timezone: string;
  };
}

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  businessName = "Wick & Wax Co",
  welcomeMessage = "Hi there! 👋 How can we help you today?",
  avatar = "/assets/images/logo.png",
  operatingHours,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
  }>>([]);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    // Check if within operating hours
    if (operatingHours) {
      const now = new Date();
      const [startHour, startMinute] = operatingHours.start.split(':').map(Number);
      const [endHour, endMinute] = operatingHours.end.split(':').map(Number);
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const isWithinHours =
        currentHour > startHour ||
        (currentHour === startHour && currentMinute >= startMinute) &&
        (currentHour < endHour ||
        (currentHour === endHour && currentMinute <= endMinute));

      setIsOnline(isWithinHours);
    }
  }, [operatingHours]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([
        {
          id: "0",
          content: welcomeMessage,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, welcomeMessage]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    try {
      // Send message to WhatsApp service
      await whatsAppService.sendMessage({
        content: message,
        type: "text",
      });

      // Add automated response (in production, this would come from the WhatsApp service)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: "Thanks for your message! We'll get back to you shortly.",
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      }, 1000);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <StyledFab
        color="primary"
        aria-label="whatsapp"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <CloseIcon /> : <WhatsAppIcon />}
      </StyledFab>

      <Grow in={isOpen}>
        <ChatWindow elevation={3}>
          <ChatHeader>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              color={isOnline ? "success" : "error"}
            >
              <Avatar src={avatar} alt={businessName}>
                {businessName.charAt(0)}
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="subtitle1">{businessName}</Typography>
              <Typography variant="caption" color="inherit">
                {isOnline ? "Online" : "Away"}
              </Typography>
            </Box>
          </ChatHeader>

          <ChatBody>
            {messages.map((msg) => (
              <Message key={msg.id} isUser={msg.isUser}>
                <Typography variant="body2">{msg.content}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                  {new Intl.DateTimeFormat("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(msg.timestamp)}
                </Typography>
              </Message>
            ))}
            <div ref={messagesEndRef} />
          </ChatBody>

          <ChatFooter>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isOnline}
            />
            <Tooltip title={isOnline ? "Send message" : "Currently away"}>
              <span>
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!isOnline || !message.trim()}
                >
                  <SendIcon />
                </IconButton>
              </span>
            </Tooltip>
          </ChatFooter>
        </ChatWindow>
      </Grow>
    </>
  );
};

export default WhatsAppWidget;
