import React, { useState } from 'react';
import { CreditCard, Plus, Send, ArrowUpRight, Clock, Check, X } from 'lucide-react';

export const Payments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'send' | 'request' | 'scheduled'>('send');

  const recentPayments = [
    {
      id: 1,
      recipient: 'John Smith',
      amount: 125.50,
      status: 'completed',
      date: '2025-01-15',
      type: 'sent',
      method: 'Bank Transfer'
    },
    {
      id: 2,
      recipient: 'Sarah Johnson',
      amount: 75.00,
      status: 'pending',
      date: '2025-01-15',
      type: 'received',
      method: 'PayPal'
    },
    {
      id: 3,
      recipient: 'Mike Wilson',
      amount: 200.00,
      status: 'completed',
      date: '2025-01-14',
      type: 'sent',
      method: 'Credit Card'
    },
    {
      id: 4,
      recipient: 'Emma Davis',
      amount: 45.25,
      status: 'failed',
      date: '2025-01-14',
      type: 'sent',
      method: 'Bank Transfer'
    }
  ];

  const scheduledPayments = [
    {
      id: 1,
      name: 'Rent Payment',
      recipient: 'Property Management Co.',
      amount: 1500.00,
      frequency: 'Monthly',
      nextDate: '2025-02-01',
      active: true
    },
    {
      id: 2,
      name: 'Utility Bills',
      recipient: 'City Utilities',
      amount: 120.00,
      frequency: 'Monthly',
      nextDate: '2025-01-25',
      active: true
    },
    {
      id: 3,
      name: 'Car Insurance',
      recipient: 'InsuranceCorp',
      amount: 85.50,
      frequency: 'Monthly',
      nextDate: '2025-01-30',
      active: false
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payments</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Send money, request payments, and manage scheduled transactions
          </p>
        </div>
        <button className="gradient-bubble text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Payment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Payment Actions */}
        <div className="xl:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
            <div className="flex space-x-1 mb-6">
              {[
                { id: 'send', label: 'Send Money', icon: Send },
                { id: 'request', label: 'Request Payment', icon: ArrowUpRight },
                { id: 'scheduled', label: 'Scheduled', icon: Clock }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'gradient-bubble text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {activeTab === 'send' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recipient
                    </label>
                    <input
                      type="text"
                      placeholder="Enter name or email"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="$0.00"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="What's this for?"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                </div>
                <button className="w-full gradient-bubble text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200">
                  Send Money
                </button>
              </div>
            )}

            {activeTab === 'request' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      From
                    </label>
                    <input
                      type="text"
                      placeholder="Enter name or email"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="$0.00"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason
                  </label>
                  <input
                    type="text"
                    placeholder="What's this for?"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                </div>
                <button className="w-full gradient-bubble text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200">
                  Request Payment
                </button>
              </div>
            )}

            {activeTab === 'scheduled' && (
              <div className="space-y-4">
                {scheduledPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{payment.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{payment.recipient}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {payment.frequency} • Next: {payment.nextDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${payment.amount.toFixed(2)}
                      </p>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        payment.active
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                      }`}>
                        {payment.active ? 'Active' : 'Paused'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Payments */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Payments</h2>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      payment.type === 'sent' 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600' 
                        : 'bg-green-100 dark:bg-green-900/30 text-green-600'
                    }`}>
                      {getStatusIcon(payment.status)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{payment.recipient}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{payment.method}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{payment.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      payment.type === 'sent' 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {payment.type === 'sent' ? '-' : '+'}${payment.amount.toFixed(2)}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Methods</h2>
              <button className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
                Add New
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">•••• 3890</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Visa</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">•••• 3210</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mastercard</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Bank Account</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">•••• 1234</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">This Month</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Money Sent</span>
                </div>
                <span className="font-semibold text-red-600 dark:text-red-400">$1,247.85</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Money Received</span>
                </div>
                <span className="font-semibold text-green-600 dark:text-green-400">$3,642.00</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Pending</span>
                </div>
                <span className="font-semibold text-blue-600 dark:text-blue-400">$125.50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};