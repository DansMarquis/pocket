import React, { useState } from 'react';
import {
  Repeat,
  Plus,
  Calendar,
  CreditCard,
  Wifi,
  Music,
  BookOpen,
} from 'lucide-react';

export const Subscriptions: React.FC = () => {
  const [showAddSubscription, setShowAddSubscription] = useState(false);

  const subscriptions = [
    {
      id: 1,
      name: 'Spotify Premium',
      description: 'Music streaming subscription',
      monthlyCost: 9.99,
      nextBillingDate: '2025-09-20',
      category: 'music',
      status: 'active',
      icon: <Music className="w-5 h-5" />,
    },
    {
      id: 2,
      name: 'Netflix',
      description: 'Video streaming subscription',
      monthlyCost: 15.99,
      nextBillingDate: '2025-09-25',
      category: 'entertainment',
      status: 'active',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 3,
      name: 'Adobe Creative Cloud',
      description: 'Design tools subscription',
      monthlyCost: 52.99,
      nextBillingDate: '2025-09-30',
      category: 'software',
      status: 'active',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: 4,
      name: 'Internet Service',
      description: 'Monthly home internet',
      monthlyCost: 39.99,
      nextBillingDate: '2025-09-18',
      category: 'utilities',
      status: 'active',
      icon: <Wifi className="w-5 h-5" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Subscriptions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your recurring payments and subscriptions
          </p>
        </div>
        <button
          onClick={() => setShowAddSubscription(true)}
          className="gradient-bubble text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-gray-200/20 dark:border-gray-700/20 hover:scale-105 transition-transform duration-300"
          >
            <div className="relative h-32 flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600">
              <div className="absolute top-4 left-4">
                <div className="w-10 h-10 bg-white/80 dark:bg-gray-900/80 rounded-xl flex items-center justify-center shadow-lg">
                  {sub.icon}
                </div>
              </div>
              <Repeat className="w-8 h-8 text-purple-600 opacity-30" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {sub.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {sub.description}
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  ${sub.monthlyCost.toFixed(2)}/mo
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Next: {sub.nextBillingDate}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800`}
              >
                {sub.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Subscription Modal (simplified placeholder) */}
      {showAddSubscription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add Subscription
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Subscription name"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
              <textarea
                placeholder="Description"
                rows={2}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Monthly cost"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
              <input
                type="date"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddSubscription(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddSubscription(false)}
                className="flex-1 gradient-bubble text-white px-4 py-3 rounded-xl"
              >
                Add Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
