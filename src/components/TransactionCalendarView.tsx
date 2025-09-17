import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
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
} from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  name: string;
  amount: number;
  type: string;
  icon: string;
  category: string;
  fromAccount: string;
  toAccount: string;
}

interface FilterOption {
  id: string;
  label: string;
  color: string;
}

interface TransactionCalendarViewProps {
  transactions: Transaction[];
  selectedFilters: string[];
  openTransactionModal: (transaction: Transaction) => void;
  getTypeColor: (type: string) => string;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  toggleFilter: (filterId: string) => void;
  filterOptions: FilterOption[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  categoryFilters: string[];
  setCategoryFilters: (filters: string[]) => void;
  amountRange: { min: number; max: number };
  setAmountRange: (range: { min: number; max: number }) => void;
  customDateRange: { start: string; end: string };
  setCustomDateRange: (range: { start: string; end: string }) => void;
  fromAccount: string;
  setFromAccount: (account: string) => void;
  toAccount: string;
  setToAccount: (account: string) => void;
  getAvailableCategories: () => string[];
  getUniqueAccounts: () => string[];
  toggleCategoryFilter: (category: string) => void;
  clearAllFilters: () => void;
  getTransactionIcon: (iconName: string) => React.ReactElement;
}

export const TransactionCalendarView: React.FC<
  TransactionCalendarViewProps
> = ({
  transactions,
  selectedFilters,
  openTransactionModal,
  getTypeColor,
  currentDate,
  setCurrentDate,
  getTransactionIcon,
}) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTransactionsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return transactions.filter((t) => t.date === dateStr);
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/20 dark:border-gray-700/20 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Calendar Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="p-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {emptyDays.map((day) => (
            <div
              key={`empty-${day}`}
              className="h-32 border-r border-b border-gray-200 dark:border-gray-700"
            ></div>
          ))}
          {days.map((day) => {
            const dayTransactions = getTransactionsForDate(day);
            return (
              <div
                key={day}
                className="h-32 border-r border-b border-gray-200 dark:border-gray-700 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {day}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-20">
                  {dayTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`${getTypeColor(transaction.type)} bg-opacity-20 dark:bg-opacity-30 p-1 rounded text-xs cursor-pointer hover:bg-opacity-30 dark:hover:bg-opacity-40 transition-all duration-200`}
                      onClick={() => openTransactionModal(transaction)}
                    >
                      <div
                        className={`${getTypeColor(transaction.type).replace('bg-', 'text-')} font-medium truncate flex items-center space-x-1`}
                      >
                        {getTransactionIcon(transaction.icon)}
                        <span>{transaction.name}</span>
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        ${Math.abs(transaction.amount).toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
