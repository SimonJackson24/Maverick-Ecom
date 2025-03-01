import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppWidget from '../chat/WhatsAppWidget';
import { whatsAppService } from '../../services/support/WhatsAppService';

const StoreLayout: React.FC = () => {
  const settings = whatsAppService.getSettings();
  const operatingHours = settings?.operatingHours;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-neutral-50">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppWidget
        businessName="Wick & Wax Co"
        welcomeMessage="Hi there! 👋 How can we help you with your candle and wax melt needs today?"
        operatingHours={{
          start: operatingHours?.schedule[1].start || "09:00", // Monday's schedule
          end: operatingHours?.schedule[1].end || "17:00",
          timezone: operatingHours?.timezone || "Europe/London"
        }}
        avatar="/assets/images/logo.png"
      />
    </div>
  );
};

export default StoreLayout;
