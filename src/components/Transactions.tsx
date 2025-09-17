import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  List,
  Edit,
  Trash2,
  Euro,
  ShoppingCart,
  Coffee,
  Car,
  Home,
  Zap,
  Phone,
  Wifi,
  Gamepad2,
  Music,
  Dumbbell,
  Plane,
  Gift,
  TreePine,
  Utensils,
  Building,
  PiggyBank,
  ArrowRightLeft,
  CreditCard,
  Briefcase,
  Award,
  TrendingUp,
  Heart,
  Utensils as UtensilsIcon,
  ShoppingBag,
  Zap as ZapIcon,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { TransactionCalendarView } from './TransactionCalendarView';
import { AddTransactionModal } from './AddTransactionModal';
import { Savings } from './Savings';
import { Wishlist } from './Wishlist';
import { Transaction, Account, Category, api } from '../lib/supabase';
import { useQuery } from '../hooks/useQuery';

interface FilterOption {
  id: string;
  label: string;
  color: string;
}

export const Transactions: React.FC = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState({ min: 0, max: 10000 });
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: '',
  });
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [showAmountFilter, setShowAmountFilter] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Fetch data from database
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useQuery('transactions', api.getTransactions);

  const { data: accounts, isLoading: isLoadingAccounts } = useQuery(
    'accounts',
    api.getAccounts
  );

  const { data: categories, isLoading: isLoadingCategories } = useQuery(
    'categories',
    api.getCategories
  );

  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All', color: 'bg-gray-500' },
    { id: 'income', label: 'Income', color: 'bg-green-500' },
    { id: 'expense', label: 'Expense', color: 'bg-red-500' },
    { id: 'transfer', label: 'Transfer', color: 'bg-blue-500' },
    { id: 'savings', label: 'Savings', color: 'bg-purple-500' },
    { id: 'wishlist', label: 'Wishlist', color: 'bg-pink-500' },
  ];

  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);

  const toggleFilter = (filterId: string) => {
    if (filterId === 'all') {
      setSelectedFilters(['all']);
      setTypeFilter('all');
    } else {
      const newFilters = selectedFilters.includes(filterId)
        ? selectedFilters.filter((f) => f !== filterId)
        : [...selectedFilters.filter((f) => f !== 'all'), filterId];

      setSelectedFilters(newFilters.length === 0 ? ['all'] : newFilters);
      setTypeFilter(filterId);
    }
  };

  const getAvailableCategories = () => {
    if (selectedFilters.includes('all')) {
      return [...new Set((categories || []).map((cat) => cat.name))];
    } else {
      // Filter categories based on selected transaction types
      const validTypes = selectedFilters.filter((filter) =>
        ['income', 'expense', 'transfer', 'saving', 'subscription'].includes(
          filter
        )
      );

      if (validTypes.length === 0) {
        return [...new Set((categories || []).map((cat) => cat.name))];
      }

      return [
        ...new Set(
          (categories || [])
            .filter((cat) => validTypes.includes(cat.type))
            .map((cat) => cat.name)
        ),
      ];
    }
  };

  const getUniqueAccounts = () => {
    return [...new Set((accounts || []).map((acc) => acc.name))];
  };

  const toggleCategoryFilter = (category: string) => {
    setCategoryFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setDateFilter('all');
    setTypeFilter('all');
    setCategoryFilters([]);
    setAmountRange({ min: 0, max: 50000 });
    setCustomDateRange({ start: '', end: '' });
    setFromAccount('');
    setToAccount('');
    setSelectedFilters(['all']);
  };

  const getTransactionIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      Euro: <Euro className="w-4 h-4" />,
      ShoppingCart: <ShoppingCart className="w-4 h-4" />,
      Coffee: <Coffee className="w-4 h-4" />,
      Car: <Car className="w-4 h-4" />,
      Home: <Home className="w-4 h-4" />,
      Zap: <Zap className="w-4 h-4" />,
      Phone: <Phone className="w-4 h-4" />,
      Wifi: <Wifi className="w-4 h-4" />,
      Gamepad2: <Gamepad2 className="w-4 h-4" />,
      Music: <Music className="w-4 h-4" />,
      Dumbbell: <Dumbbell className="w-4 h-4" />,
      Plane: <Plane className="w-4 h-4" />,
      Gift: <Gift className="w-4 h-4" />,
      TreePine: <TreePine className="w-4 h-4" />,
      Utensils: <UtensilsIcon className="w-4 h-4" />,
      Building: <Building className="w-4 h-4" />,
      PiggyBank: <PiggyBank className="w-4 h-4" />,
      ArrowRightLeft: <ArrowRightLeft className="w-4 h-4" />,
      CreditCard: <CreditCard className="w-4 h-4" />,
      Briefcase: <Briefcase className="w-4 h-4" />,
      Award: <Award className="w-4 h-4" />,
      TrendingUp: <TrendingUp className="w-4 h-4" />,
      Heart: <Heart className="w-4 h-4" />,
      ShoppingBag: <ShoppingBag className="w-4 h-4" />,
      BookOpen: <BookOpen className="w-4 h-4" />,
    };
    return iconMap[iconName] || <Euro className="w-4 h-4" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'expense':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      case 'transfer':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'saving':
      case 'savings':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 dark:text-yellow-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };

  const filteredTransactions = (transactions || []).filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (transaction.category?.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      selectedFilters.includes('all') ||
      selectedFilters.includes(transaction.type);

    const matchesCategory =
      categoryFilters.length === 0 ||
      categoryFilters.includes(transaction.category?.name || '');

    const matchesAmount =
      transaction.amount >= amountRange.min &&
      Math.abs(transaction.amount) <= amountRange.max;

    const matchesFromAccount =
      !fromAccount || transaction.from_account?.name === fromAccount;

    const matchesToAccount =
      !toAccount || transaction.to_account?.name === toAccount;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const transactionDate = new Date(transaction.transaction_date);
      const today = new Date();

      switch (dateFilter) {
        case 'today':
          matchesDate = transactionDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            today.getDate()
          );
          matchesDate = transactionDate >= monthAgo;
          break;
        case 'year':
          const yearAgo = new Date(
            today.getFullYear() - 1,
            today.getMonth(),
            today.getDate()
          );
          matchesDate = transactionDate >= yearAgo;
          break;
        case 'custom':
          if (customDateRange.start && customDateRange.end) {
            const startDate = new Date(customDateRange.start);
            const endDate = new Date(customDateRange.end);
            matchesDate =
              transactionDate >= startDate && transactionDate <= endDate;
          }
          break;
      }
    }

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesAmount &&
      matchesFromAccount &&
      matchesToAccount &&
      matchesDate
    );
  });

  const handleAddTransaction = async (
    transactionData: Omit<
      Transaction,
      'id' | 'user_id' | 'created_at' | 'updated_at'
    >
  ) => {
    try {
      await api.createTransaction(transactionData);
      await refetchTransactions();
      setShowAddTransactionModal(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const handleEditTransaction = async (
    id: string,
    updates: Partial<Transaction>
  ) => {
    try {
      await api.updateTransaction(id, updates);
      await refetchTransactions();
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.deleteTransaction(id);
        await refetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const openTransactionModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  // Render different content based on selected filter
  if (typeFilter === 'savings') {
    return <Savings />;
  }

  if (typeFilter === 'wishlist') {
    return <Wishlist />;
  }

  if (isLoadingTransactions || isLoadingAccounts || isLoadingCategories) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage all your financial transactions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddTransactionModal(true)}
            className="gradient-bubble text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleFilter(option.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedFilters.includes(option.id)
                ? 'gradient-bubble text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>

          <button
            onClick={() => setShowAmountFilter(!showAmountFilter)}
            className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              showAmountFilter || amountRange.min > 0 || amountRange.max < 50000
                ? 'gradient-bubble text-white shadow-lg'
                : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Amount Range</span>
          </button>
        </div>

        {dateFilter === 'custom' && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <input
              type="date"
              value={customDateRange.start}
              onChange={(e) =>
                setCustomDateRange((prev) => ({
                  ...prev,
                  start: e.target.value,
                }))
              }
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
            />
            <input
              type="date"
              value={customDateRange.end}
              onChange={(e) =>
                setCustomDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
            />
          </div>
        )}

        {showAmountFilter && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Amount Range: €{amountRange.min.toLocaleString()} - €
                {amountRange.max.toLocaleString()}
              </label>

              <div className="relative">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800 rounded-lg h-2 top-1/2 transform -translate-y-1/2"></div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="100"
                      value={amountRange.min}
                      onChange={(e) =>
                        setAmountRange((prev) => ({
                          ...prev,
                          min: Math.min(
                            parseInt(e.target.value),
                            prev.max - 100
                          ),
                        }))
                      }
                      className="range-slider range-slider-min absolute inset-0 w-full h-2 bg-transparent cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="100"
                      value={amountRange.max}
                      onChange={(e) =>
                        setAmountRange((prev) => ({
                          ...prev,
                          max: Math.max(
                            parseInt(e.target.value),
                            prev.min + 100
                          ),
                        }))
                      }
                      className="range-slider range-slider-max absolute inset-0 w-full h-2 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Min Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50000"
                      step="10"
                      value={amountRange.min}
                      onChange={(e) =>
                        setAmountRange((prev) => ({
                          ...prev,
                          min: Math.min(
                            parseInt(e.target.value) || 0,
                            prev.max - 100
                          ),
                        }))
                      }
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Max Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50000"
                      step="10"
                      value={amountRange.max}
                      onChange={(e) =>
                        setAmountRange((prev) => ({
                          ...prev,
                          max: Math.max(
                            parseInt(e.target.value) || 50000,
                            prev.min + 100
                          ),
                        }))
                      }
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <select
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
          >
            <option value="">All From Accounts</option>
            {getUniqueAccounts().map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>

          <select
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
          >
            <option value="">All To Accounts</option>
            {getUniqueAccounts().map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-wrap gap-2">
            {getAvailableCategories().map((category) => (
              <button
                key={category}
                onClick={() => toggleCategoryFilter(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  categoryFilters.includes(category)
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <button
            onClick={clearAllFilters}
            className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => setView('list')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'list'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List</span>
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'calendar'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar</span>
          </button>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredTransactions.length} transaction
          {filteredTransactions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Content */}
      {view === 'calendar' ? (
        <TransactionCalendarView
          transactions={filteredTransactions.map((t) => ({
            id: typeof t.id === 'string' ? parseInt(t.id, 10) : t.id,
            date: t.transaction_date,
            name: t.description,
            amount: t.amount,
            type: t.type,
            icon: t.category?.icon || 'Euro',
            category: t.category?.name || 'Other',
            fromAccount: t.from_account?.name || '',
            toAccount: t.to_account?.name || '',
          }))}
          selectedFilters={selectedFilters}
          openTransactionModal={(transaction) => {
            const fullTransaction = filteredTransactions.find(
              (t) => String(t.id) === String(transaction.id)
            );
            if (fullTransaction) openTransactionModal(fullTransaction);
          }}
          getTypeColor={getTypeColor}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          toggleFilter={toggleFilter}
          filterOptions={filterOptions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          categoryFilters={categoryFilters}
          setCategoryFilters={setCategoryFilters}
          amountRange={amountRange}
          setAmountRange={setAmountRange}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
          fromAccount={fromAccount}
          setFromAccount={setFromAccount}
          toAccount={toAccount}
          setToAccount={setToAccount}
          getAvailableCategories={getAvailableCategories}
          getUniqueAccounts={getUniqueAccounts}
          toggleCategoryFilter={toggleCategoryFilter}
          clearAllFilters={clearAllFilters}
          getTransactionIcon={getTransactionIcon}
        />
      ) : (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/20 dark:border-gray-700/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${getTypeColor(transaction.type)}`}
                        >
                          {getTransactionIcon(
                            transaction.category?.icon || 'Euro'
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.type.charAt(0).toUpperCase() +
                              transaction.type.slice(1)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {transaction.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.type === 'transfer'
                        ? `${transaction.from_account?.name || 'Unknown'} → ${transaction.to_account?.name || 'Unknown'}`
                        : transaction.type === 'income'
                          ? transaction.to_account?.name || 'Unknown'
                          : transaction.from_account?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-semibold ${
                          transaction.type === 'income'
                            ? 'text-green-600 dark:text-green-400'
                            : transaction.type === 'expense' ||
                                transaction.type === 'subscription'
                              ? 'text-red-600 dark:text-red-400'
                              : transaction.type === 'transfer'
                                ? 'text-blue-600 dark:text-blue-400'
                                : transaction.type === 'saving' ||
                                    transaction.type === 'whishlist'
                                  ? 'text-yellow-500 dark:text-yellow-400'
                                  : ''
                        }`}
                      >
                        {transaction.type === 'income'
                          ? '+'
                          : transaction.type === 'transfer'
                            ? ''
                            : '-'}
                        €{Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(
                        transaction.transaction_date
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openTransactionModal(transaction)}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 p-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No transactions found matching your criteria.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddTransactionModal}
        onClose={() => setShowAddTransactionModal(false)}
        onAddTransaction={handleAddTransaction}
        accounts={accounts || []}
        categories={categories || []}
        isLoadingAccounts={isLoadingAccounts}
        isLoadingCategories={isLoadingCategories}
      />

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <AddTransactionModal
          isOpen={true}
          onClose={() => setEditingTransaction(null)}
          onAddTransaction={async (data) => {
            await handleEditTransaction(editingTransaction.id, data);
          }}
          accounts={accounts || []}
          categories={categories || []}
          isLoadingAccounts={isLoadingAccounts}
          isLoadingCategories={isLoadingCategories}
          initialData={editingTransaction}
        />
      )}
    </div>
  );
};
