import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Analytics } from './components/Analytics';
import { Performance } from './components/Performance';
import { Payments } from './components/Payments';
import { History } from './components/History';
import { Savings } from './components/Savings';
import { Wishlist } from './components/Wishlist';
import { Subscriptions } from './components/Subscriptions';
import { Categories } from './components/Categories';
import Investments from './components/Investments';
import Login from './components/Login';


import { api } from './lib/supabase';

export type ActiveTab =
  | 'dashboard'
  | 'transactions'
  | 'categories'
  | 'analytics'
  | 'performance'
  | 'payments'
  | 'history'
  | 'savings'
  | 'wishlist'
  | 'investments'
  | 'subscriptions';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await api.getSettings();
      if (settings && typeof settings.darkMode === 'boolean') {
        setIsDarkMode(settings.darkMode);
        if (settings.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    loadSettings();
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'transactions':
        return <Transactions />;
      case 'analytics':
        return <Analytics />;
      case 'categories':
        return <Categories />;
      case 'performance':
        return <Performance />;
      case 'payments':
        return <Payments />;
      case 'history':
        return <History />;
      case 'savings':
        return <Savings />;
      case 'subscriptions':
        return <Subscriptions />;
      case 'wishlist':
        return <Wishlist />;
        case 'investments':
        return <Investments />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-black dark:to-[#0d001a] transition-colors duration-300">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main className="pt-20 pb-8">{renderActiveTab()}</main>
    </div>
  );
}

export default App;
