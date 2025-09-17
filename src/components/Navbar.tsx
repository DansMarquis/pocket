import React, { useEffect } from 'react';
import { Sun, Moon, Wallet, Bell } from 'lucide-react';
import { ActiveTab } from '../App';
import { api } from '../lib/supabase';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard' },
    { id: 'transactions' as ActiveTab, label: 'Transactions' },
    { id: 'categories' as ActiveTab, label: 'Categories' },
    { id: 'subscriptions' as ActiveTab, label: 'Subscriptions' },
    { id: 'savings' as ActiveTab, label: 'Savings' },
    { id: 'wishlist' as ActiveTab, label: 'Wishlist' },
    { id: 'investments' as ActiveTab, label: 'Investments' },
    { id: 'analytics' as ActiveTab, label: 'Analytics' },
    { id: 'performance' as ActiveTab, label: 'Performance' },
    { id: 'payments' as ActiveTab, label: 'Payments' },
    { id: 'history' as ActiveTab, label: 'History' },
  ];

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Pocket
            </span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'gradient-bubble text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          {/* Bell icon for reminders */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Reminders"
            onClick={() => {
              // Add your reminders modal or logic here
            }}
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          {/* Dark mode toggle */}
          <button
            onClick={async () => {
              const newMode = !isDarkMode;
              setIsDarkMode(newMode);
              if (newMode) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
              await api.updateDarkMode(newMode);
            }}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden mt-4">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'gradient-bubble text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
