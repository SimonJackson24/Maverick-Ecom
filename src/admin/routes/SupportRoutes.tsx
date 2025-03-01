import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SupportPage from '../pages/support/SupportPage';
import SupportSettings from '../pages/support/SupportSettings';
import WhatsAppChat from '../pages/support/WhatsAppChat';
import ChatHistory from '../pages/support/ChatHistory';
import CustomerInquiries from '../pages/support/CustomerInquiries';

const SupportRoutes = () => {
  return (
    <Routes>
      <Route element={<SupportPage />}>
        <Route index element={<SupportSettings />} />
        <Route path="settings" element={<SupportSettings />} />
        <Route path="chat" element={<WhatsAppChat />} />
        <Route path="chat-history" element={<ChatHistory />} />
        <Route path="inquiries" element={<CustomerInquiries />} />
      </Route>
    </Routes>
  );
};

export default SupportRoutes;
