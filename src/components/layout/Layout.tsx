import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppWidget from '../chat/WhatsAppWidget';
import { useLocation } from 'react-router-dom';

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-neutral-50">
        <Outlet />
      </main>
      <Footer />
      {!isAdminPage && (
        <WhatsAppWidget
          businessName="Wick & Wax Co"
          welcomeMessage="Hi there! 👋 How can we help you with your candle and wax melt needs today?"
          operatingHours={{
            start: "09:00",
            end: "17:00",
            timezone: "Europe/London"
          }}
          avatar="/assets/images/logo.png"
        />
      )}
    </div>
  );
};

export default Layout;