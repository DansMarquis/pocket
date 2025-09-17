import React, { useEffect, useState } from 'react';
import { api, Account } from '../lib/supabase';
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CreditCard,
  Plus,
  Minus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  Repeat,
  PiggyBank,
  ArrowLeftRight,
  CalendarDays,
  Bell,
  Trophy,
  X,
} from 'lucide-react';
import { ActiveTab } from '../App'; // Import your ActiveTab type
import { CashFlowChart } from './charts/CashFlowChart';
import { TransactionOverviewChart } from './charts/TransactionOverviewChart';
import visaLogo from './assets/visa.png'; // Add your logo PNGs to /assets
import mastercardLogo from './assets/maestro.png';
import chipImg from './assets/chip.png';
import { AnimatePresence, motion } from 'framer-motion';

export const Dashboard: React.FC<{
  setActiveTab: (tab: ActiveTab) => void;
}> = ({ setActiveTab }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showEditCard, setShowEditCard] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [selectedCashFlowCategory, setSelectedCashFlowCategory] = useState<
    'income' | 'expense' | 'transfer' | 'subscription' | 'saving' | 'all'
  >('income');
  const [categories, setCategories] = useState<Record<string, any>>({});
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  // Dynamic accounts from Supabase
  const [creditCards, setCreditCards] = useState<Account[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [newCard, setNewCard] = useState({
    name: '',
    account_number: '',
    balance: 0,
    type: 'VISA', // default type
    fromColor: '#9d174d', // default gradient from color
    toColor: '#2e1065', // default gradient to color
    gradientDirection: '135deg', // <-- add this
    bank_name: '',
    currency: 'EUR',
  });
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [subscriptionsList, setSubscriptionsList] = useState<any[]>([]);
  const [savingsList, setSavingsList] = useState<any[]>([]);
  // Fetch lists on mount
  useEffect(() => {
    async function fetchLists() {
      setCategoriesList(await api.getCategories());
      setSubscriptionsList(await api.getSubscriptions());
      setSavingsList(await api.getSavings());
    }
    fetchLists();
  }, []);
  // Simple emoji picker
  function EmojiPicker({
    value,
    onChange,
  }: {
    value: string;
    onChange: (emoji: string) => void;
  }) {
    const emojis = ['💰', '🍔', '🏠', '🎵', '🚗', '🎁', '🛒', '📈', '💡', '🏦'];
    return (
      <div className="flex gap-2 flex-wrap mb-2">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className={`text-2xl px-2 py-1 rounded-lg ${value === emoji ? 'bg-purple-100' : ''}`}
            onClick={() => onChange(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  }
  function getCardIcon(type: string) {
    if (type.toLowerCase().includes('visa')) return visaLogo;
    if (type.toLowerCase().includes('mastercard')) return mastercardLogo;
    return undefined;
  }
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const [transactionForm, setTransactionForm] = useState({
    amount: '',
    description: '',
    category: '',
    type: 'normal', // for expense: normal, subscription, savings
    subscriptionId: '',
    fromAccount: '',
    toAccount: '',
  });
  const accounts = creditCards.map((card) => ({
    id: card.id,
    name: card.name,
  }));
  // Transaction modal component
  function TransactionModal({
    type,
    onClose,
  }: {
    type: 'income' | 'expense' | 'transfer';
    onClose: () => void;
  }) {
    // Expense subtypes
    const isExpense = type === 'expense';
    const isIncome = type === 'income';
    const isTransfer = type === 'transfer';

    // Dynamic background
    const bg = isIncome
      ? 'bg-gradient-to-br from-green-500 to-green-700'
      : isExpense
        ? 'bg-gradient-to-br from-red-500 to-red-700'
        : 'bg-gradient-to-br from-purple-600 to-indigo-700';

    // Dynamic button
    const mainBtn = isIncome
      ? {
          label: 'Add',
          color: 'bg-green-600 hover:bg-green-700',
          icon: <Plus className="w-5 h-5" />,
        }
      : isExpense
        ? {
            label: 'Pay',
            color: 'bg-red-600 hover:bg-red-700',
            icon: <Minus className="w-5 h-5" />,
          }
        : {
            label: 'Transfer',
            color: 'bg-black hover:bg-gray-900',
            icon: <ArrowLeftRight className="w-5 h-5" />,
          };

    // Expense type selection
    const expenseTypes = [
      { value: 'normal', label: 'Normal Expense' },
      { value: 'subscription', label: 'Subscription Payment' },
      { value: 'savings', label: 'To Savings' },
    ];

    // Form state (add emoji, date, category, account, etc.)
    const [form, setForm] = useState({
      amount: '',
      description: '',
      category: '',
      emoji: '',
      date: new Date().toISOString().slice(0, 16),
      account: '',
      expenseType: 'normal',
      subscriptionId: '',
      savingId: '',
      fromAccount: '',
      toAccount: '',
    });

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      let txData: any = {
        amount: parseFloat(form.amount),
        description: form.description,
        category_id: form.category,
        emoji: form.emoji,
        transaction_date: form.date,
      };
      if (isIncome) {
        txData.type = 'income';
        txData.account_id = form.account;
      } else if (isExpense) {
        txData.type =
          form.expenseType === 'subscription'
            ? 'subscription'
            : form.expenseType === 'savings'
              ? 'saving'
              : 'expense';
        txData.account_id = form.account;
        if (form.expenseType === 'subscription')
          txData.subscription_id = form.subscriptionId;
        if (form.expenseType === 'savings') txData.saving_id = form.savingId;
      } else if (isTransfer) {
        txData.type = 'transfer';
        txData.from_account = form.fromAccount;
        txData.to_account = form.toAccount;
      }
      await api.createTransaction(txData);
      onClose();
      setForm({
        amount: '',
        description: '',
        category: '',
        emoji: '',
        date: new Date().toISOString().slice(0, 16),
        account: '',
        expenseType: 'normal',
        subscriptionId: '',
        savingId: '',
        fromAccount: '',
        toAccount: '',
      });
    };

    // Accounts for dropdowns
    const accountOptions = creditCards.map((acc) => ({
      id: acc.id,
      name: acc.name,
      number: acc.account_number,
      type: acc.type,
    }));

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <form
          className={`${bg} rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl space-y-6`}
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            {isIncome
              ? 'Add Income'
              : isExpense
                ? 'Add Expense'
                : 'Add Transfer'}
          </h2>
          {/* INCOME FIELDS */}
          {isIncome && (
            <>
              {/* Category */}
              {/* Category Chips for Income */}
              <div className="flex gap-2 flex-wrap mb-2">
                {categoriesList
                  .filter((cat) => cat.type === 'income')
                  .map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-medium text-sm ${
                        form.category === cat.id
                          ? 'bg-green-100 border-green-400'
                          : 'bg-white border-gray-200'
                      }`}
                      onClick={() =>
                        setForm((f) => ({ ...f, category: cat.id }))
                      }
                    >
                      {/* Icon: emoji or image */}
                      {cat.icon &&
                        (cat.icon.startsWith('http') ? (
                          <img src={cat.icon} alt="" className="w-5 h-5" />
                        ) : (
                          <span className="text-xl">{cat.icon}</span>
                        ))}
                      <span>{cat.name}</span>
                    </button>
                  ))}
              </div>
              {/* Account (read-only, current card) */}
              <div
                className="w-full px-4 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
                style={{
                  background: `linear-gradient(${currentCard?.gradientDirection || '135deg'}, ${currentCard?.fromColor || '#9d174d'}, ${currentCard?.toColor || '#2e1065'})`,
                }}
              >
                {getCardIcon(currentCard?.type || '') && (
                  <img
                    src={getCardIcon(currentCard?.type || '')}
                    alt={currentCard?.type}
                    className="w-6 h-6 object-contain"
                  />
                )}
                <span>{currentCard?.name}</span>
                <span className="ml-auto text-xs opacity-70">
                  {currentCard?.account_number
                    ? `••${currentCard.account_number.slice(-4)}`
                    : ''}
                </span>
              </div>
              {/* Amount */}
              <input
                type="number"
                required
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 font-semibold mb-2"
              />
              {/* Description */}
              <input
                type="text"
                required
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 font-semibold mb-2"
              />
              {/* Date */}
              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 font-semibold mb-2"
              />
            </>
          )}
          {/* EXPENSE FIELDS */}
          {isExpense && (
            <>
              {/* Expense Type */}
              <select
                value={form.expenseType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expenseType: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 font-semibold mb-2"
              >
                {expenseTypes.map((et) => (
                  <option key={et.value} value={et.value}>
                    {et.label}
                  </option>
                ))}
              </select>
              {/* Category */}
              <select
                required
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 font-semibold mb-2"
              >
                <option value="">Select Category</option>
                {categoriesList
                  .filter((cat) => cat.type === 'expense')
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              {/* Account */}
              <div
                className="w-full px-4 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
                style={{
                  background: `linear-gradient(${currentCard?.gradientDirection || '135deg'}, ${currentCard?.fromColor || '#9d174d'}, ${currentCard?.toColor || '#2e1065'})`,
                }}
              >
                {getCardIcon(currentCard?.type || '') && (
                  <img
                    src={getCardIcon(currentCard?.type || '')}
                    alt={currentCard?.type}
                    className="w-6 h-6 object-contain"
                  />
                )}
                <span>{currentCard?.name}</span>
                <span className="ml-auto text-xs opacity-70">
                  {currentCard?.account_number
                    ? `••${currentCard.account_number.slice(-4)}`
                    : ''}
                </span>
              </div>
              {/* Amount */}
              <input
                type="number"
                required
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 font-semibold mb-2"
              />
              {/* Description */}
              <input
                type="text"
                required
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 font-semibold mb-2"
              />
              {/* Emoji Picker */}
              <EmojiPicker
                value={form.emoji}
                onChange={(emoji) => setForm((f) => ({ ...f, emoji }))}
              />
              {/* Date */}
              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 font-semibold mb-2"
              />
              {/* Subscription Picker */}
              {form.expenseType === 'subscription' && (
                <select
                  value={form.subscriptionId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subscriptionId: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 font-semibold mb-2"
                >
                  <option value="">Select Subscription</option>
                  {subscriptionsList.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              )}
              {/* Saving Picker */}
              {form.expenseType === 'savings' && (
                <select
                  value={form.savingId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, savingId: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 font-semibold mb-2"
                >
                  <option value="">Select Saving</option>
                  {savingsList.map((sav) => (
                    <option key={sav.id} value={sav.id}>
                      {sav.name}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
          {/* TRANSFER FIELDS */}
          {isTransfer && (
            <>
              {/* From Account */}
              <label className="block text-sm font-medium text-white mb-1">
                From
              </label>
              <div
                className="w-full px-4 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
                style={{
                  background: `linear-gradient(${currentCard?.gradientDirection || '135deg'}, ${currentCard?.fromColor || '#9d174d'}, ${currentCard?.toColor || '#2e1065'})`,
                }}
              >
                {getCardIcon(currentCard?.type || '') && (
                  <img
                    src={getCardIcon(currentCard?.type || '')}
                    alt={currentCard?.type}
                    className="w-6 h-6 object-contain"
                  />
                )}
                <span>{currentCard?.name}</span>
                <span className="ml-auto text-xs opacity-70">
                  {currentCard?.account_number
                    ? `••${currentCard.account_number.slice(-4)}`
                    : ''}
                </span>
              </div>
              {/* To Account */}
              {/* To Account */}
              <label className="block text-sm font-medium text-white mb-1">
                To
              </label>
              <div className="flex flex-col gap-2 mb-4">
                {creditCards
                  .filter((acc) => acc.id !== currentCard?.id)
                  .map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, toAccount: acc.id }))
                      }
                      className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition border ${
                        form.toAccount === acc.id
                          ? 'border-blue-500 ring-2 ring-blue-300'
                          : 'border-transparent'
                      }`}
                      style={{
                        background: `linear-gradient(${acc.gradientDirection || '135deg'}, ${acc.fromColor || '#9d174d'}, ${acc.toColor || '#2e1065'})`,
                        color: 'white',
                      }}
                    >
                      {getCardIcon(acc.type || '') && (
                        <img
                          src={getCardIcon(acc.type || '')}
                          alt={acc.type}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      <span>{acc.name}</span>
                      <span className="ml-auto text-xs opacity-70">
                        {acc.account_number
                          ? `••${acc.account_number.slice(-4)}`
                          : ''}
                      </span>
                    </button>
                  ))}
              </div>
              {/* Amount */}
              <label className="block text-sm font-medium text-white mb-1">
                Amount
              </label>
              <input
                type="number"
                required
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-white font-semibold text-gray-900 mb-4"
              />
              {/* Description */}
              <input
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-white font-semibold text-gray-900 mb-4"
              />
            </>
          )}
          {/* BUTTONS */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-red-600 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-red-700 transition"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 rounded-full ${mainBtn.color} text-white font-semibold text-lg flex items-center justify-center gap-2 transition`}
            >
              {mainBtn.icon}
              {mainBtn.label}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Example subscriptions list (replace with your real data)
  const subscriptions = [
    { id: 'spotify', name: 'Spotify Premium' },
    { id: 'chatgpt', name: 'ChatGPT Plus' },
    { id: 'youtube', name: 'YouTube Premium' },
  ];

  // Currency data with flag SVGs
  const currencies = [
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      flag: (
        <img
          src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/us.svg"
          alt="US"
          className="w-6 h-6 rounded-full"
        />
      ),
    },
    {
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'C$',
      flag: (
        <img
          src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/ca.svg"
          alt="Canada"
          className="w-6 h-6 rounded-full"
        />
      ),
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      flag: (
        <img
          src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/gb.svg"
          alt="UK"
          className="w-6 h-6 rounded-full"
        />
      ),
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      flag: (
        <img
          src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/eu.svg"
          alt="EU"
          className="w-6 h-6 rounded-full"
        />
      ),
    },
  ];

  function CurrencyConverter() {
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('EUR');
    const [amount, setAmount] = useState<string | number>(3215);
    const [rates, setRates] = useState<Record<string, number>>({});
    const [result, setResult] = useState<number | null>(null);

    // Fetch live rates when 'from' changes
    useEffect(() => {
      async function fetchRates() {
        const res = await fetch(
          `https://api.exchangerate.host/latest?base=${from}`
        );
        const data = await res.json();
        setRates(data.rates);
      }
      fetchRates();
    }, [from]);

    // Live conversion as you type/select
    useEffect(() => {
      if (
        !rates ||
        typeof rates[to] !== 'number' ||
        amount === '' ||
        isNaN(Number(amount)) ||
        Number(amount) <= 0
      ) {
        setResult(null);
        return;
      }
      if (from === to) {
        setResult(Number(amount));
        return;
      }
      setResult(Number(amount) * rates[to]);
    }, [amount, from, to, rates]);

    // Switch currencies
    const handleSwitch = () => {
      setFrom(to);
      setTo(from);
      setAmount(result || amount);
    };

    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20 mt-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Convert currency
        </h3>
        <div className="flex items-center gap-2 mb-4">
          {/* From currency */}
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="flex items-center px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {currencies.map((cur) => (
              <option key={cur.code} value={cur.code}>
                {cur.code}
              </option>
            ))}
          </select>
          <span className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-200 dark:border-gray-700">
            <img
              src={currencies.find((cur) => cur.code === from)?.flag.props.src}
              alt={from}
              className="w-full h-full object-cover"
            />
          </span>
          {/* Switch button */}
          <button
            onClick={handleSwitch}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
            aria-label="Switch currencies"
          >
            <ArrowLeftRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          {/* To currency */}
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex items-center px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {currencies.map((cur) => (
              <option key={cur.code} value={cur.code}>
                {cur.code}
              </option>
            ))}
          </select>
          <span className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-200 dark:border-gray-700">
            <img
              src={currencies.find((cur) => cur.code === to)?.flag.props.src}
              alt={to}
              className="w-full h-full object-cover"
            />
          </span>
        </div>
        {/* Input and live result */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <input
              type="number"
              value={amount}
              min="0"
              onChange={(e) =>
                setAmount(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white w-40 font-bold text-xl"
              placeholder={`Amount in ${from}`}
            />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              {currencies.find((cur) => cur.code === from)?.symbol}
            </span>
          </div>
          <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            {result !== null
              ? `${currencies.find((cur) => cur.code === to)?.symbol} ${result.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
              : '...'}
          </div>
        </div>
      </div>
    );
  }
  const upcomingBills = [
    {
      id: 'spotify',
      name: 'Spotify Premium',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg',
      cycle: 'Monthly',
      amount: 10.99,
      date: '15 Jul',
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT Plus',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/OpenAI_Logo.svg',
      cycle: 'Monthly',
      amount: 20.0,
      date: '18 Jul',
    },
    {
      id: 'youtube',
      name: 'YouTube Premium',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png',
      cycle: 'Monthly',
      amount: 11.99,
      date: '22 Jul',
    },
  ];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Account | null>(null);
  const [expiryMonth, setExpiryMonth] = useState(months[0]);
  const [expiryYear, setExpiryYear] = useState(String(currentYear).slice(-2));
  const fetchAccounts = async () => {
    setLoadingCards(true);
    const data = await api.getAccounts();
    setCreditCards(data);
    setLoadingCards(false);

    // Ensure currentCardIndex is valid
    if (data.length === 0) {
      setCurrentCardIndex(-1);
    } else if (currentCardIndex >= data.length) {
      setCurrentCardIndex(0);
    }
  };
  useEffect(() => {
    fetchAccounts();
    // Fetch all categories
    const fetchCategories = async () => {
      const cats = await api.getCategories();
      const map: Record<string, any> = {};
      cats.forEach((cat: any) => {
        map[cat.id] = cat;
      });
      setCategories(map);
    };

    // Fetch all transactions, then slice last 4 payments
    const fetchRecentTransactions = async () => {
      const txs = await api.getTransactions();
      // Only payments: income, expense, transfer
      const payments = txs
        .filter((tx) =>
          ['income', 'expense', 'transfer', 'saving', 'subscription'].includes(
            tx.type
          )
        )
        .slice(0, 4);
      setRecentTransactions(payments);
    };

    fetchCategories();
    fetchRecentTransactions();
  }, []);

  // Get current time in Lisbon timezone
  const getLisbonTime = () => {
    return new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Lisbon',
      hour12: false,
    });
  };

  const getTxIcon = (tx: any, category: any) => {
    switch (tx.type) {
      case 'income':
        return <ArrowUpRight className="w-5 h-5 text-green-600" />;
      case 'expense':
        return <ArrowDownRight className="w-5 h-5 text-red-600" />;
      case 'transfer':
        return <ArrowLeftRight className="w-5 h-5 text-blue-600" />;
      case 'subscription':
        return <Repeat className="w-5 h-5 text-purple-600" />;
      case 'saving': // support both if needed
        return <PiggyBank className="w-5 h-5 text-yellow-500" />;
      default:
        // Fallback
        return <ArrowUpRight className="w-5 h-5 text-gray-400" />;
    }
  };

  const getGreeting = () => {
    const lisbonTime = new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Lisbon',
      hour12: false,
    });
    const hour = parseInt(lisbonTime.split(',')[1].trim().split(':')[0]);

    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good Afternoon';
    } else if (hour >= 18 && hour < 22) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };

  // Cash flow data
  const cashFlowData = [
    { month: 'Jan', income: 4500, expense: 3200, saving: 1300 },
    { month: 'Feb', income: 4000, expense: 2800, saving: 1200 },
    { month: 'Mar', income: 4800, expense: 3100, saving: 1700 },
    { month: 'Apr', income: 4600, expense: 2900, saving: 1700 },
    { month: 'May', income: 5200, expense: 3000, saving: 2200 },
    { month: 'Jun', income: 4700, expense: 4500, saving: 200 },
    { month: 'Jul', income: 4500, expense: 2400, saving: 2100 },
    { month: 'Aug', income: 4900, expense: 3800, saving: 1100 },
    { month: 'Sep', income: 4300, expense: 2900, saving: 1400 },
    { month: 'Oct', income: 4800, expense: 3200, saving: 1600 },
    { month: 'Nov', income: 5100, expense: 3400, saving: 1700 },
    { month: 'Dec', income: 4600, expense: 4500, saving: 100 },
  ];

  // Transaction overview data
  const transactionOverviewData = [
    { date: 'Jan 01', totalPayment: 1900, previousPeriod: 1300 },
    { date: 'Jan 05', totalPayment: 2500, previousPeriod: 800 },
    { date: 'Jan 10', totalPayment: 1100, previousPeriod: 600 },
    { date: 'Jan 15', totalPayment: 1800, previousPeriod: 1400 },
    { date: 'Jan 20', totalPayment: 3100, previousPeriod: 1800 },
    { date: 'Jan 22', totalPayment: 2500, previousPeriod: 1900 },
    { date: 'Jan 25', totalPayment: 1900, previousPeriod: 2400 },
    { date: 'Jan 31', totalPayment: 2200, previousPeriod: 2800 },
  ];

  const recentActivity = [
    {
      id: 1,
      name: 'Stripe',
      type: 'Deposit',
      time: 'Today 7:18 AM',
      status: 'Paid',
      amount: 510.0,
      category: 'income',
    },
    {
      id: 2,
      name: 'Cashback',
      type: 'Business',
      time: '01 Jan, 11:44 AM',
      status: 'Income',
      amount: 510.0,
      category: 'income',
    },
    {
      id: 3,
      name: 'Refund from Amazon',
      type: 'Business',
      time: 'Today 7:18 AM',
      status: 'Food & Drinks',
      amount: -55.0,
      category: 'expense',
    },
  ];

  const nextCard = async () => {
    setCurrentCardIndex((prev) => (prev + 1) % creditCards.length);
    await fetchAccounts();
  };

  const prevCard = async () => {
    setCurrentCardIndex(
      (prev) => (prev - 1 + creditCards.length) % creditCards.length
    );
    await fetchAccounts();
  };

  const currentCard =
    creditCards.length > 0 && currentCardIndex >= 0
      ? creditCards[currentCardIndex]
      : null;

  // In JSX, check for currentCard before rendering card details:
  {
    currentCard ? (
      <div
        style={{
          background: `linear-gradient(${currentCard?.gradientDirection || '135deg'}, ${currentCard?.fromColor || '#9d174d'}, ${currentCard?.toColor || '#2e1065'})`,
        }}
        className="relative rounded-2xl p-6 text-white shadow-2xl w-80 h-48 group"
      >
        {/* ...card details... */}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">No accounts found.</div>
    );
  }
  const totalBalance = creditCards.reduce(
    (sum, card) => sum + (card.balance || 0),
    0
  );

  const lastMonthBalance = totalBalance - 4499; // Simulated last month balance
  const percentageChange =
    ((totalBalance - lastMonthBalance) / lastMonthBalance) * 100;

  const [overviewFilter, setOverviewFilter] = useState<
    'week' | 'month' | 'year'
  >('month');
  const filterOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  // Overview values for the selected card
  const [overview, setOverview] = useState({
    balance: 0,
    income: 0,
    expense: 0,
    balanceChange: 0,
    incomeChange: 0,
    expenseChange: 0,
  });

  // Fetch overview data when card or filter changes
  useEffect(() => {
    async function fetchOverview() {
      if (!currentCard) return;
      // Replace with your API logic to get transactions for the card and filter
      const txs = await api.getTransactions();
      const now = new Date();
      let start: Date;
      if (overviewFilter === 'week') {
        start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
      } else if (overviewFilter === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
      } else {
        start = new Date(now.getFullYear(), 0, 1);
      }
      const filteredTxs = txs.filter(
        (tx) =>
          (tx.from_account_id === currentCard.id ||
            tx.to_account_id === currentCard.id) &&
          new Date(tx.transaction_date) >= start
      );
      const income = filteredTxs
        .filter((tx) => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);
      const expense = filteredTxs
        .filter(
          (tx) =>
            tx.type === 'expense' ||
            tx.type === 'subscription' ||
            tx.type === 'saving'
        )
        .reduce((sum, tx) => sum + tx.amount, 0);
      const balance = currentCard.balance;
      // Simulate change (replace with your own logic)
      const prevBalance = balance - 100;
      const prevIncome = income - 50;
      const prevExpense = expense - 30;
      setOverview({
        balance,
        income,
        expense,
        balanceChange: ((balance - prevBalance) / prevBalance) * 100,
        incomeChange: ((income - prevIncome) / prevIncome) * 100,
        expenseChange: ((expense - prevExpense) / prevExpense) * 100,
      });
    }
    fetchOverview();
  }, [currentCard, overviewFilter]);

  function formatCardNumber(value: string) {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add a space every 4 digits
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }
  const handleEditCard = async (card: Account) => {
    const dbCard = await api.getAccount(card.id); // You need to implement getAccount in your API
    setEditingCard({ ...dbCard });
    setShowEditCard(true);
  };

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      // In a real app, this would update the state/database
      alert(`Card ${cardId} would be deleted`);
      await fetchAccounts();
    }
  };
  const handleAddCard = async () => {
    // You may want to validate fields here

    // Compose expiry string from dropdowns
    const expiry = `${expiryMonth}/${expiryYear}`;
    // You may want to validate fields here
    const {
      name,
      account_number,
      balance,
      type,
      fromColor,
      toColor,
      gradientDirection,
      bank_name,
      currency,
    } = newCard;
    const result = await api.createAccount({
      name,
      account_number,
      balance: parseFloat(balance.toString()),
      type: newCard.type,
      expiry, // <-- now defined
      fromColor,
      toColor,
      gradientDirection,
      bank_name,
      currency,
      is_active: true,
    });
    if ('error' in result && result.error) {
      const errorMessage =
        typeof result.error === 'object' && 'message' in result.error
          ? (result.error as { message?: string }).message
          : undefined;
      alert('Error adding card: ' + (errorMessage || 'Unknown error'));
      return;
    }
    await fetchAccounts();
    setShowAddCard(false);
    setNewCard({
      name: '',
      account_number: '',
      balance: 0,
      type: 'credit_card',
      fromColor: '#9d174d', // default gradient from color
      toColor: '#2e1065',
      gradientDirection: '135deg', // <-- add this line
      bank_name: '',
      currency: 'EUR',
    });
  };

  const closeEditModal = () => {
    setShowEditCard(false);
    setEditingCard(null);
  };

  // Save changes to database
  const saveCardChanges = async () => {
    const {
      id,
      name,
      account_number,
      balance,
      type,
      expiry,
      fromColor,
      toColor,
      gradientDirection,
      bank_name,
      currency,
    } = editingCard;
    const result = await api.updateAccount(id, {
      name,
      account_number: formatCardNumber(account_number),
      balance: parseFloat(balance),
      type,
      expiry,
      fromColor,
      toColor,
      gradientDirection,
      bank_name,
      currency,
    });
    if ('error' in result && result.error) {
      const errorMessage =
        typeof result.error === 'object' && 'message' in result.error
          ? (result.error as { message?: string }).message
          : undefined;
      alert('Error saving changes: ' + (errorMessage || 'Unknown error'));
      return;
    }
    await fetchAccounts();
    closeEditModal();
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getGreeting()}, Daniel 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to your dashboard. See a quick summary of your transaction
            below
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* Credit Card Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
              {loadingCards ? (
                <div className="text-center py-8 text-gray-500">
                  Loading accounts...
                </div>
              ) : creditCards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No accounts found.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Main Card */}
                  <div
                    style={{
                      position: 'relative',
                      width: '20rem',
                      height: '12rem',
                    }}
                    className="w-80 h-48"
                  >
                    <AnimatePresence mode="wait">
                      {currentCard && (
                        <motion.div
                          key={currentCard.id}
                          initial={{
                            scale: 0.8,
                            rotate: -10,
                            opacity: 0,
                            zIndex: 0,
                          }}
                          animate={{
                            scale: 1,
                            rotate: 0,
                            opacity: 1,
                            zIndex: 1,
                          }}
                          exit={{
                            scale: 0.8,
                            rotate: 10,
                            opacity: 0,
                            zIndex: 0,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 900,
                            damping: 100,
                            duration: 0.05,
                          }}
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <div
                            style={{
                              background: `linear-gradient(${currentCard?.gradientDirection || '135deg'}, ${currentCard?.fromColor || '#9d174d'}, ${currentCard?.toColor || '#2e1065'})`,
                            }}
                            className="relative rounded-2xl p-6 text-white shadow-2xl w-80 h-48 group"
                          >
                            <div className="absolute top-4 left-0 w-full flex justify-center space-x-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() =>
                                  currentCard && handleEditCard(currentCard)
                                }
                                className="w-7 h-7 bg-white/80 rounded-xl flex items-center justify-center transition-all duration-200 shadow hover:bg-purple-600"
                              >
                                <Edit3 className="w-4 h-4 text-black transition-colors duration-200 hover:text-white" />
                              </button>
                              <button
                                onClick={() => {
                                  setCardToDelete(currentCard);
                                  setShowDeleteModal(true);
                                }}
                                className="w-7 h-7 bg-white/80 rounded-xl flex items-center justify-center transition-all duration-200 shadow hover:bg-red-600"
                              >
                                <Trash2 className="w-4 h-4 text-black transition-colors duration-200 hover:text-white" />
                              </button>
                            </div>

                            {/* Top Row: Contactless left, Network logo right */}
                            <div className="flex justify-between items-center mt-2">
                              {/* Contactless icon */}
                              <svg
                                className="w-7 h-7 text-white opacity-80"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  d="M6 8c2.667-2.667 8-2.667 10.667 0M8 10c1.333-1.333 5.333-1.333 6.667 0M10 12c.667-.667 2.667-.667 3.333 0"
                                />
                              </svg>
                              {/* Network logo */}
                              <img
                                src={
                                  currentCard?.type === 'VISA'
                                    ? visaLogo
                                    : currentCard?.type === 'MASTERCARD'
                                      ? mastercardLogo
                                      : undefined
                                }
                                alt={currentCard?.type}
                                className={
                                  currentCard?.type === 'VISA' ? 'h-5' : 'h-7'
                                }
                              />
                            </div>

                            {/* Chip - vertically centered, right side */}
                            <img
                              src={chipImg}
                              alt="chip"
                              className="absolute right-6 top-1/2 transform -translate-y-1/2 h-8"
                            />

                            {/* Cardholder & Expiry - above number, left aligned */}
                            <div className="mt-6 ml-1">
                              <div className="text-xs font-bold">
                                {currentCard?.name}
                              </div>
                              <div className="text-xs font-mono opacity-80">
                                Exp {currentCard?.expiry || '**/**'}
                              </div>
                            </div>

                            {/* Card Number - bottom, centered, single line */}
                            <div className="absolute bottom-6 left-0 w-full flex justify-center">
                              <span className="text-xl font-mono tracking-widest whitespace-nowrap text-white font-bold drop-shadow">
                                {currentCard && currentCard.account_number
                                  ? currentCard.account_number.replace(
                                      /(\d{4})/g,
                                      '$1 '
                                    )
                                  : '•••• •••• •••• ••••'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Balance Info */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Overview
                        </h2>
                        <div className="flex items-center gap-2">
                          <select
                            value={overviewFilter}
                            onChange={(e) =>
                              setOverviewFilter(
                                e.target.value as 'week' | 'month' | 'year'
                              )
                            }
                            className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-900 font-medium text-sm focus:ring-2 focus:ring-purple-500"
                            style={{ minWidth: 110 }}
                          >
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3 mb-4">
                        {/* Balance Card */}
                        <div className="flex-1 min-w-0 max-w-[120px] bg-indigo-100 rounded-xl p-2 shadow flex flex-col items-start justify-between">
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-semibold text-xs text-gray-700 flex items-center gap-1">
                              <CreditCard className="w-4 h-4" /> Balance
                            </span>
                            <button
                              onClick={() =>
                                setIsBalanceVisible(!isBalanceVisible)
                              }
                              className="ml-1"
                              title={isBalanceVisible ? 'Hide' : 'Show'}
                            >
                              {isBalanceVisible ? (
                                <svg
                                  className="w-4 h-4 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-4 h-4 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                          <div className="text-lg font-bold text-gray-900 mb-1 truncate">
                            {isBalanceVisible
                              ? `€${overview.balance}`
                              : '€••••••'}
                          </div>
                          <div className="text-[10px] text-indigo-600 font-semibold truncate">
                            {overview.balanceChange >= 0 ? '+' : ''}
                            {overview.balanceChange.toFixed(2)}%
                          </div>
                        </div>
                        {/* Income Card */}
                        <div className="flex-1 min-w-0 max-w-[120px] bg-purple-100 rounded-xl p-2 shadow flex flex-col items-start justify-between">
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-semibold text-xs text-gray-700 flex items-center gap-1">
                              <ArrowUpRight className="w-4 h-4" /> Income
                            </span>
                          </div>
                          <div className="text-lg font-bold text-gray-900 mb-1 truncate">
                            €{overview.income}
                          </div>
                          <div className="text-[10px] text-purple-600 font-semibold truncate">
                            {overview.incomeChange >= 0 ? '+' : ''}
                            {overview.incomeChange.toFixed(2)}%
                          </div>
                        </div>
                        {/* Expense Card */}
                        <div className="flex-1 min-w-0 max-w-[120px] bg-green-100 rounded-xl p-2 shadow flex flex-col items-start justify-between">
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-semibold text-xs text-gray-700 flex items-center gap-1">
                              <ArrowDownRight className="w-4 h-4" /> Expenses
                            </span>
                          </div>
                          <div className="text-lg font-bold text-gray-900 mb-1 truncate">
                            €{overview.expense}
                          </div>
                          <div className="text-[10px] text-green-600 font-semibold truncate">
                            {overview.expenseChange >= 0 ? '+' : ''}
                            {overview.expenseChange.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="text-sm font-medium">4.51%</span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isBalanceVisible
                              ? currentCard
                                ? `+€${Math.floor(currentCard.balance * 0.1)} compared to last month`
                                : '+€0 compared to last month'
                              : '+€••• compared to last month'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        className="w-34 bg-green-600 text-white px-2 py-2 rounded-xl font-medium text-sm hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        onClick={() => setShowIncomeModal(true)}
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                          <Plus className="w-3 h-3" />
                        </span>
                        <span>Income</span>
                      </button>
                      <button
                        className="w-34 bg-red-600 text-white px-2 py-2 rounded-xl font-medium text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                        onClick={() => setShowExpenseModal(true)}
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                          <Minus className="w-3 h-3" />
                        </span>
                        <span>Expense</span>
                      </button>
                      <button
                        className="w-34 bg-blue-600 text-white px-2 py-2 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        onClick={() => setShowTransferModal(true)}
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                          <ArrowLeftRight className="w-3 h-3" />
                        </span>
                        <span>Transfer</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mini Cards */}
              <div className="flex items-center justify-center mt-8">
                <div className="flex space-x-3">
                  {creditCards.map((card, index) => (
                    <button
                      key={card.id}
                      onClick={() => setCurrentCardIndex(index)}
                      // ...
                    >
                      <div
                        style={{
                          background: `linear-gradient(${card.gradientDirection || '135deg'}, ${card.fromColor || '#9d174d'}, ${card.toColor || '#2e1065'})`,
                        }}
                        className="w-16 h-10 rounded-lg shadow-md"
                      >
                        <div className="p-2 text-white">
                          <div className="text-xs font-medium truncate">
                            {card.name}
                          </div>
                          <div className="text-xs opacity-80">
                            {card.account_number
                              ? `••${card.account_number.slice(-4)}`
                              : ''}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Add Card Button */}
                  <button
                    onClick={() => setShowAddCard(true)}
                    className="w-16 h-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 text-gray-400 hover:text-purple-500" />
                  </button>
                </div>
              </div>
            </div>
            {/* Cash Flow */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
              <CashFlowChart
                data={cashFlowData}
                selectedCategory={selectedCashFlowCategory}
                onCategoryChange={setSelectedCashFlowCategory}
              />
            </div>
            {/* Upcoming Bills Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="font-semibold text-lg text-gray-900 dark:text-white">
                    Upcoming Bills
                  </span>
                </div>
                <button className="text-sm text-purple-600 hover:underline font-medium">
                  See all
                </button>
              </div>
              <div>
                {upcomingBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={bill.logo}
                        alt={bill.name}
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 dark:border-gray-700"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {bill.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="bg-gray-100 dark:bg-gray-700 text-xs px-3 py-1 rounded-full text-gray-600 dark:text-gray-300 font-medium">
                        {bill.cycle}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${bill.amount.toFixed(2)}
                      </span>
                      {/* Pay Now button */}
                      <button
                        className="px-4 py-1 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                        onClick={() => {
                          // Add your pay logic here
                          alert(`Paying ${bill.name}`);
                        }}
                      >
                        Pay now
                      </button>
                      <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                        <CalendarDays className="w-4 h-4" />
                        {bill.date}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-lg text-gray-900 dark:text-white">
                  Investments
                </span>
                <button className="text-sm text-purple-600 hover:underline font-medium flex items-center gap-1">
                  See all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div>
                {[
                  {
                    id: 'aapl',
                    name: 'AAPL (Apple)',
                    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
                    value: 1600,
                    change: 21.9,
                    changeColor: 'text-green-600 bg-green-100',
                    current: 1950,
                  },
                  {
                    id: 'tsla',
                    name: 'TSLA (Tesla)',
                    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
                    value: 2000,
                    change: 15,
                    changeColor: 'text-green-600 bg-green-100',
                    current: 2300,
                  },
                  {
                    id: 'btc',
                    name: 'BTC (Bitcoin)',
                    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg',
                    value: 1100,
                    change: -19.1,
                    changeColor: 'text-red-600 bg-red-100',
                    current: 890,
                  },
                ].map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={inv.logo}
                        alt={inv.name}
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 dark:border-gray-700"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {inv.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        $
                        {inv.value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${inv.changeColor}`}
                      >
                        {inv.change > 0 ? '+' : ''}
                        {inv.change}%
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        $
                        {inv.current.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-lg text-gray-900 dark:text-white">
                  Goals
                </span>
                <button className="text-sm text-purple-600 hover:underline font-medium flex items-center gap-1">
                  See all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div>
                {[
                  {
                    id: 'vacation',
                    name: 'Vacation',
                    icon: 'https://cdn-icons-png.flaticon.com/512/869/869869.png',
                    saved: 2300,
                    target: 3000,
                    color: 'bg-purple-600',
                    percent: 76.7,
                    percentColor: 'text-purple-600',
                    date: 'Nov 2025',
                  },
                  {
                    id: 'house',
                    name: 'House',
                    icon: 'https://cdn-icons-png.flaticon.com/512/616/616494.png',
                    saved: 5800,
                    target: 10000,
                    color: 'bg-green-600',
                    percent: 58,
                    percentColor: 'text-green-600',
                    date: 'Jul 2026',
                  },
                  {
                    id: 'car',
                    name: 'Car',
                    icon: 'https://cdn-icons-png.flaticon.com/512/743/743007.png',
                    saved: 1450,
                    target: 5000,
                    color: 'bg-orange-500',
                    percent: 29,
                    percentColor: 'text-orange-500',
                    date: 'Mar 2026',
                  },
                ].map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={goal.icon}
                        alt={goal.name}
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 dark:border-gray-700"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {goal.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 min-w-[320px] justify-end">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${goal.saved.toLocaleString()} / $
                        {goal.target.toLocaleString()}
                      </span>
                      {/* Progress bar with trophy */}
                      <div className="flex items-center gap-2 w-32">
                        <div className="relative w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className={`absolute left-0 top-0 h-2 rounded-full ${goal.color}`}
                            style={{ width: `${goal.percent}%` }}
                          ></div>
                          <div
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{ left: `calc(${goal.percent}% - 16px)` }}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${goal.color}`}
                            >
                              <Trophy className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className={`font-semibold ${goal.percentColor}`}>
                        {goal.percent}%
                      </span>
                      <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                        <CalendarDays className="w-4 h-4" />
                        {goal.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Transaction Overview */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Transaction Overview
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Monthly
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total Payment
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      €11,203.45
                    </p>
                    <p className="text-xs text-green-600">14.51%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Previous Period
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      €8,123.78
                    </p>
                    <p className="text-xs text-red-600">8.22%</p>
                  </div>
                </div>
              </div>

              {/* Transaction Overview Chart */}
              <div className="mt-6">
                <TransactionOverviewChart data={transactionOverviewData} />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
                <button
                  className="text-purple-600 dark:text-purple-400 text-sm hover:underline"
                  onClick={() => setActiveTab('transactions')}
                >
                  See All Transactions
                </button>
              </div>

              <div className="space-y-4">
                {recentTransactions.map((tx) => {
                  const category = tx.category; // Use joined category object
                  let amountColor = 'text-green-600 dark:text-green-400';
                  let sign = '+';

                  if (
                    tx.type === 'expense' ||
                    (tx.type === 'transfer' &&
                      category?.name?.toLowerCase().includes('saving')) ||
                    (tx.type === 'expense' &&
                      category?.name?.toLowerCase().includes('subscription'))
                  ) {
                    amountColor = 'text-red-600 dark:text-red-400';
                    sign = '-';
                  } else if (tx.type === 'transfer') {
                    amountColor = 'text-blue-600 dark:text-blue-400';
                    sign = '';
                  }

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-900/30">
                          {getTxIcon(tx, category)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {tx.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {category?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${amountColor}`}>
                          {sign}€{Math.abs(tx.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(tx.transaction_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <CurrencyConverter />
          </div>
        </div>
        {showDeleteModal && cardToDelete && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Delete Card
              </h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete{' '}
                <span className="font-bold">{cardToDelete.name}</span>? This
                action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await api.deleteAccount(cardToDelete.id);
                    setShowDeleteModal(false);
                    setCardToDelete(null);
                    await fetchAccounts();
                  }}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Add Card Modal */}
        {showAddCard && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddCard(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Card
                </h2>
                <button
                  onClick={() => setShowAddCard(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center mb-6">
                <div
                  style={{
                    background: `linear-gradient(${newCard.gradientDirection || '135deg'}, ${newCard.fromColor || '#9d174d'}, ${newCard.toColor || '#2e1065'})`,
                  }}
                  className="relative rounded-2xl p-6 text-white shadow-2xl w-80 h-48"
                >
                  {/* Top Row: Contactless left, Network logo right */}
                  <div className="flex justify-between items-center mt-2">
                    <svg
                      className="w-7 h-7 text-white opacity-80"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        d="M6 8c2.667-2.667 8-2.667 10.667 0M8 10c1.333-1.333 5.333-1.333 6.667 0M10 12c.667-.667 2.667-.667 3.333 0"
                      />
                    </svg>
                    <img
                      src={
                        newCard.type === 'VISA'
                          ? visaLogo
                          : newCard.type === 'MASTERCARD'
                            ? mastercardLogo
                            : undefined
                      }
                      alt={newCard.type}
                      className={newCard.type === 'VISA' ? 'h-5' : 'h-7'}
                    />
                  </div>
                  {/* Chip */}
                  <img
                    src={chipImg}
                    alt="chip"
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 h-8"
                  />
                  {/* Cardholder & Expiry */}
                  <div className="mt-6 ml-1">
                    <div className="text-xs font-bold">
                      {newCard.name || 'Cardholder'}
                    </div>
                    <div className="text-xs font-mono opacity-80">
                      Exp {expiryMonth}/{expiryYear}
                    </div>
                  </div>
                  {/* Card Number */}
                  <div className="absolute bottom-6 left-0 w-full flex justify-center">
                    <span className="text-xl font-mono tracking-widest whitespace-nowrap text-white font-bold drop-shadow">
                      {newCard.account_number
                        ? newCard.account_number.replace(/(\d{4})/g, '$1 ')
                        : '•••• •••• •••• ••••'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Name
                  </label>
                  <input
                    type="text"
                    value={newCard.name}
                    onChange={(e) =>
                      setNewCard({ ...newCard, name: e.target.value })
                    }
                    placeholder="e.g., My Bank Card"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={newCard.account_number}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setNewCard({ ...newCard, account_number: formatted });
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19} // 16 digits + 3 spaces
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={expiryMonth}
                      onChange={(e) => setExpiryMonth(e.target.value)}
                      className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none text-gray-900 dark:text-white"
                    >
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={expiryYear}
                      onChange={(e) => setExpiryYear(e.target.value)}
                      className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none text-gray-900 dark:text-white"
                    >
                      {years.map((year) => (
                        <option key={year} value={String(year).slice(-2)}>
                          {String(year).slice(-2)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Initial Balance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCard.balance}
                    onChange={(e) =>
                      setNewCard({
                        ...newCard,
                        balance: Number(e.target.value),
                      })
                    }
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Type
                  </label>
                  <select
                    value={newCard.type}
                    onChange={(e) =>
                      setNewCard({ ...newCard, type: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  >
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MASTERCARD</option>
                    <option value="AMEX">AMEX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={newCard.bank_name}
                    onChange={(e) =>
                      setNewCard({ ...newCard, bank_name: e.target.value })
                    }
                    placeholder="Bank Name"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gradient Colors
                  </label>
                  <div className="flex space-x-4 items-center">
                    <div>
                      <span className="text-xs">From</span>
                      <input
                        type="color"
                        value={newCard.fromColor || '#9d174d'}
                        onChange={(e) =>
                          setNewCard({ ...newCard, fromColor: e.target.value })
                        }
                        className="ml-2"
                      />
                    </div>
                    <div>
                      <span className="text-xs">To</span>
                      <input
                        type="color"
                        value={newCard.toColor || '#2e1065'}
                        onChange={(e) =>
                          setNewCard({ ...newCard, toColor: e.target.value })
                        }
                        className="ml-2"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gradient Direction
                  </label>
                  <select
                    value={newCard.gradientDirection}
                    onChange={(e) =>
                      setNewCard({
                        ...newCard,
                        gradientDirection: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none text-gray-900 dark:text-white"
                  >
                    <option value="90deg">Left to Right</option>
                    <option value="180deg">Top to Bottom</option>
                    <option value="135deg">Diagonal (default)</option>
                    <option value="45deg">Reverse Diagonal</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddCard(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCard}
                  className="flex-1 gradient-bubble text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Edit Card Modal */}
        {showIncomeModal && (
          <TransactionModal
            type="income"
            onClose={() => setShowIncomeModal(false)}
          />
        )}
        {showExpenseModal && (
          <TransactionModal
            type="expense"
            onClose={() => setShowExpenseModal(false)}
          />
        )}
        {showTransferModal && (
          <TransactionModal
            type="transfer"
            onClose={() => setShowTransferModal(false)}
          />
        )}
        {showEditCard && editingCard && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={closeEditModal}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Card
                </h2>
                <button
                  onClick={closeEditModal}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center mb-6">
                <div
                  style={{
                    background: `linear-gradient(${editingCard.gradientDirection || '135deg'}, ${editingCard.fromColor || '#9d174d'}, ${editingCard.toColor || '#2e1065'})`,
                  }}
                  className="relative rounded-2xl p-6 text-white shadow-2xl w-80 h-48"
                >
                  {/* Top Row: Contactless left, Network logo right */}
                  <div className="flex justify-between items-center mt-2">
                    <svg
                      className="w-7 h-7 text-white opacity-80"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        d="M6 8c2.667-2.667 8-2.667 10.667 0M8 10c1.333-1.333 5.333-1.333 6.667 0M10 12c.667-.667 2.667-.667 3.333 0"
                      />
                    </svg>
                    <img
                      src={
                        editingCard.type === 'VISA'
                          ? visaLogo
                          : editingCard.type === 'MASTERCARD'
                            ? mastercardLogo
                            : undefined
                      }
                      alt={editingCard.type}
                      className={editingCard.type === 'VISA' ? 'h-5' : 'h-7'}
                    />
                  </div>
                  {/* Chip */}
                  <img
                    src={chipImg}
                    alt="chip"
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 h-8"
                  />
                  {/* Cardholder & Expiry */}
                  <div className="mt-6 ml-1">
                    <div className="text-xs font-bold">
                      {editingCard.name || 'Cardholder'}
                    </div>
                    <div className="text-xs font-mono opacity-80">
                      Exp {editingCard.expiry || '**/**'}
                    </div>
                  </div>
                  {/* Card Number */}
                  <div className="absolute bottom-6 left-0 w-full flex justify-center">
                    <span className="text-xl font-mono tracking-widest whitespace-nowrap text-white font-bold drop-shadow">
                      {editingCard.account_number
                        ? editingCard.account_number.replace(/(\d{4})/g, '$1 ')
                        : '•••• •••• •••• ••••'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Name
                  </label>
                  <input
                    type="text"
                    value={editingCard.name}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={editingCard.account_number}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        account_number: formatCardNumber(e.target.value),
                      })
                    }
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={editingCard.expiry?.split('/')[0] || ''}
                      onChange={(e) =>
                        setEditingCard({
                          ...editingCard,
                          expiry: `${e.target.value}/${editingCard.expiry?.split('/')[1] || ''}`,
                        })
                      }
                      className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none text-gray-900 dark:text-white"
                    >
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editingCard.expiry?.split('/')[1] || ''}
                      onChange={(e) =>
                        setEditingCard({
                          ...editingCard,
                          expiry: `${editingCard.expiry?.split('/')[0] || ''}/${e.target.value}`,
                        })
                      }
                      className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none text-gray-900 dark:text-white"
                    >
                      {years.map((year) => (
                        <option key={year} value={String(year).slice(-2)}>
                          {String(year).slice(-2)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Initial Balance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCard.balance}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        balance: e.target.value,
                      })
                    }
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Type
                  </label>
                  <select
                    value={editingCard.type}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, type: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  >
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MASTERCARD</option>
                    <option value="AMEX">AMEX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={editingCard.bank_name}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        bank_name: e.target.value,
                      })
                    }
                    placeholder="Bank Name"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gradient Colors
                  </label>
                  <div className="flex space-x-4 items-center">
                    <div>
                      <span className="text-xs">From</span>
                      <input
                        type="color"
                        value={editingCard.fromColor || '#9d174d'}
                        onChange={(e) =>
                          setEditingCard({
                            ...editingCard,
                            fromColor: e.target.value,
                          })
                        }
                        className="ml-2"
                      />
                    </div>
                    <div>
                      <span className="text-xs">To</span>
                      <input
                        type="color"
                        value={editingCard.toColor || '#2e1065'}
                        onChange={(e) =>
                          setEditingCard({
                            ...editingCard,
                            toColor: e.target.value,
                          })
                        }
                        className="ml-2"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gradient Direction
                  </label>
                  <select
                    value={editingCard.gradientDirection || '135deg'}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        gradientDirection: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none text-gray-900 dark:text-white"
                  >
                    <option value="90deg">Left to Right</option>
                    <option value="180deg">Top to Bottom</option>
                    <option value="135deg">Diagonal (default)</option>
                    <option value="45deg">Reverse Diagonal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={editingCard.currency}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        currency: e.target.value,
                      })
                    }
                    placeholder="EUR"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCardChanges}
                  className="flex-1 gradient-bubble text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
