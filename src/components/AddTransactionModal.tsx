import React, { useState, useEffect } from 'react';
import { X, Euro } from 'lucide-react';
import { api, Account, Category, Transaction } from '../lib/supabase';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (
    transactionData: Omit<
      Transaction,
      'id' | 'user_id' | 'created_at' | 'updated_at'
    >
  ) => Promise<void>;
  accounts: Account[];
  categories: Category[];
  isLoadingAccounts?: boolean;
  isLoadingCategories?: boolean;
  initialData?: Transaction;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  accounts,
  categories,
  isLoadingAccounts = false,
  isLoadingCategories = false,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    saving_goal_id: '',
    type: 'expense' as
      | 'income'
      | 'expense'
      | 'transfer'
      | 'subscription'
      | 'saving',
    transaction_date: new Date().toISOString().split('T')[0],
    category_id: '',
    from_account_id: '',
    to_account_id: '',
    notes: '',
    status: 'completed' as 'pending' | 'completed' | 'cancelled',
    // Subscription-specific
    repeats: 'weekly' as 'daily' | 'weekly' | 'yearly',
    repeats_every: 1,
    repeats_on: [] as string[],
    starts_on: new Date().toISOString().split('T')[0],
    ends: 'never' as 'never' | 'after' | 'on_date',
    ends_after_occurrences: 1,
    ends_on_date: '',
  });
  const [savingGoals, setSavingGoals] = useState<
    {
      id: string;
      name: string;
      current_amount: number;
      target_amount: number;
    }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && formData.type === 'saving') {
      api.getSavingGoals().then(setSavingGoals);
    }
  }, [isOpen, formData.type]);
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Editing mode - populate with existing data
        setFormData({
          description: initialData.description,
          amount: Math.abs(initialData.amount).toString(),
          saving_goal_id: (initialData as any).saving_goal_id || '',
          type: initialData.type,
          transaction_date: initialData.transaction_date,
          category_id: initialData.category_id || '',
          from_account_id: initialData.from_account_id || '',
          to_account_id: initialData.to_account_id || '',
          notes: initialData.notes || '',
          status: initialData.status,
          // Subscription-specific fields
          repeats: (initialData as any).repeats || 'weekly',
          repeats_every: (initialData as any).repeats_every || 1,
          repeats_on: (initialData as any).repeats_on || [],
          starts_on:
            (initialData as any).starts_on ||
            new Date().toISOString().split('T')[0],
          ends: (initialData as any).ends || 'never',
          ends_after_occurrences:
            (initialData as any).ends_after_occurrences || 1,
          ends_on_date: (initialData as any).ends_on_date || '',
        });
      } else {
        // Adding mode - reset form
        setFormData({
          description: '',
          amount: '',
          saving_goal_id: '',
          type: 'expense',
          transaction_date: new Date().toISOString().split('T')[0],
          category_id: '',
          from_account_id: '',
          to_account_id: '',
          notes: '',
          status: 'completed',
          repeats: 'weekly',
          repeats_every: 1,
          repeats_on: [],
          starts_on: new Date().toISOString().split('T')[0],
          ends: 'never',
          ends_after_occurrences: 1,
          ends_on_date: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Filter categories based on transaction type
  const filteredCategories =
    categories?.filter((category) => category.type === formData.type) || [];

  // Reset category when type changes
  useEffect(() => {
    if (!initialData) {
      setFormData((prev) => ({ ...prev, category_id: '' }));
    }
  }, [formData.type]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.type !== 'saving' && !formData.category_id) {
      newErrors.category_id = 'Category is required';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (formData.type === 'saving') {
      if (!formData.saving_goal_id) {
        newErrors.saving_goal_id = 'Saving goal is required';
      }
    }
    if (!formData.transaction_date) {
      newErrors.transaction_date = 'Transaction date is required';
    }

    // Account validation based on transaction type
    if (formData.type === 'expense' && !formData.from_account_id) {
      newErrors.from_account_id = 'From account is required for expenses';
    }

    if (formData.type === 'income' && !formData.to_account_id) {
      newErrors.to_account_id = 'To account is required for income';
    }

    if (formData.type === 'transfer') {
      if (!formData.from_account_id) {
        newErrors.from_account_id = 'From account is required for transfers';
      }
      if (!formData.to_account_id) {
        newErrors.to_account_id = 'To account is required for transfers';
      }
      if (formData.from_account_id === formData.to_account_id) {
        newErrors.to_account_id = 'From and To accounts must be different';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const savingsCategory = categories.find(
      (cat) => cat.name.toLowerCase() === 'savings'
    );
    // Build transactionData for all types
    const transactionData = {
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      transaction_date: formData.transaction_date,
      category_id:
        formData.type === 'saving'
          ? savingsCategory?.id
          : formData.category_id || undefined,
      from_account_id: formData.from_account_id || undefined,
      to_account_id: formData.to_account_id || undefined,
      notes: formData.notes.trim() || undefined,
      status: formData.status,
      recurring_transaction_id: undefined,
      saving_goal_id:
        formData.type === 'saving' ? formData.saving_goal_id : undefined,
      ...(formData.type === 'subscription' && {
        repeats: formData.repeats,
        repeats_every: formData.repeats_every,
        repeats_on: formData.repeats_on,
        starts_on: formData.starts_on,
        ends: formData.ends,
        ends_after_occurrences:
          formData.ends === 'after'
            ? formData.ends_after_occurrences
            : undefined,
        ends_on_date:
          formData.ends === 'on_date' ? formData.ends_on_date : undefined,
      }),
    };

    try {
      if (formData.type === 'saving') {
        // 1. Create transaction
        await onAddTransaction(transactionData);

        // 2. Update saving goal
        const goal = savingGoals.find((g) => g.id === formData.saving_goal_id);
        if (!goal) {
          setErrors({ submit: 'Selected saving goal not found.' });
          setIsSubmitting(false);
          return;
        }
        await api.updateSavingGoal(formData.saving_goal_id, {
          current_amount: Number(goal.current_amount) + Number(formData.amount),
        });

        onClose();
        setIsSubmitting(false);
        return;
      }

      await onAddTransaction(transactionData);
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
      setErrors({ submit: 'Failed to add transaction. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Euro className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="e.g., Grocery shopping"
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white ${
                errors.description
                  ? 'border-red-500'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Amount and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="0.00"
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white ${
                  errors.amount
                    ? 'border-red-500'
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="transfer">Transfer</option>
                <option value="subscription">Subscription</option>
                <option value="saving">Saving</option> {/* <-- Add this */}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={formData.transaction_date}
              onChange={(e) =>
                handleInputChange('transaction_date', e.target.value)
              }
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white ${
                errors.transaction_date
                  ? 'border-red-500'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            />
            {errors.transaction_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.transaction_date}
              </p>
            )}
          </div>

          {/* From Account */}
          {(formData.type === 'expense' || formData.type === 'transfer') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Account *
              </label>
              <select
                value={formData.from_account_id}
                onChange={(e) =>
                  handleInputChange('from_account_id', e.target.value)
                }
                disabled={isLoadingAccounts || accounts.length === 0}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white ${
                  errors.from_account_id
                    ? 'border-red-500'
                    : 'border-gray-200 dark:border-gray-600'
                } ${isLoadingAccounts || accounts.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {isLoadingAccounts
                    ? 'Loading accounts...'
                    : accounts.length === 0
                      ? 'No accounts available'
                      : 'Select an account'}
                </option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} (€{account.balance.toFixed(2)})
                  </option>
                ))}
              </select>
              {errors.from_account_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.from_account_id}
                </p>
              )}
            </div>
          )}
          {formData.type !== 'saving' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  handleInputChange('category_id', e.target.value)
                }
                disabled={
                  isLoadingCategories || filteredCategories.length === 0
                }
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white ${
                  errors.category_id
                    ? 'border-red-500'
                    : 'border-gray-200 dark:border-gray-600'
                } ${isLoadingCategories || filteredCategories.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {isLoadingCategories
                    ? 'Loading categories...'
                    : (filteredCategories?.length || 0) === 0
                      ? 'No categories available'
                      : 'Select a category'}
                </option>
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category_id}
                </p>
              )}
            </div>
          )}
          {formData.type === 'saving' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Saving Goal *
                </label>
                <select
                  value={formData.saving_goal_id || ''}
                  onChange={(e) =>
                    handleInputChange('saving_goal_id', e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none text-gray-900 dark:text-white"
                >
                  <option value="">Select a goal</option>
                  {savingGoals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.name} (Saved: €{goal.current_amount} / Target: €
                      {goal.target_amount})
                    </option>
                  ))}
                </select>
                {errors.saving_goal_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.saving_goal_id}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0.00"
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white ${
                    errors.amount
                      ? 'border-red-500'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>
            </>
          )}

          {/* To Account */}
          {(formData.type === 'income' || formData.type === 'transfer') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Account *
              </label>
              <select
                value={formData.to_account_id}
                onChange={(e) =>
                  handleInputChange('to_account_id', e.target.value)
                }
                disabled={isLoadingAccounts || accounts.length === 0}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white ${
                  errors.to_account_id
                    ? 'border-red-500'
                    : 'border-gray-200 dark:border-gray-600'
                } ${isLoadingAccounts || accounts.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {isLoadingAccounts
                    ? 'Loading accounts...'
                    : accounts.length === 0
                      ? 'No accounts available'
                      : 'Select an account'}
                </option>
                {accounts
                  .filter((account) => account.id !== formData.from_account_id)
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} (€{account.balance.toFixed(2)})
                    </option>
                  ))}
              </select>
              {errors.to_account_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.to_account_id}
                </p>
              )}
            </div>
          )}

          {/* Subscriptions */}

          {formData.type === 'subscription' && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Subscription Settings
              </h3>

              {/* Repeats */}
              <div className="flex space-x-2">
                <select
                  value={formData.repeats}
                  onChange={(e) => handleInputChange('repeats', e.target.value)}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <input
                  type="number"
                  min="1"
                  value={formData.repeats_every}
                  onChange={(e) =>
                    handleInputChange('repeats_every', e.target.value)
                  }
                  className="w-20 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 self-center">
                  interval
                </span>
              </div>

              {/* Repeats on */}
              {formData.repeats === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Repeat on:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                      (day) => (
                        <button
                          type="button"
                          key={day}
                          onClick={() => {
                            const updated = formData.repeats_on.includes(day)
                              ? formData.repeats_on.filter((d) => d !== day)
                              : [...formData.repeats_on, day];
                            handleInputChange('repeats_on', updated);
                          }}
                          className={`px-3 py-1 rounded-lg border ${
                            formData.repeats_on.includes(day)
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {day}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Starts on */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Starts on
                </label>
                <input
                  type="date"
                  value={formData.starts_on}
                  onChange={(e) =>
                    handleInputChange('starts_on', e.target.value)
                  }
                  className="px-3 py-2 border rounded-lg w-full dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Ends */}
              <div>
                <label className="block text-sm font-medium mb-2">Ends</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="ends"
                      value="never"
                      checked={formData.ends === 'never'}
                      onChange={(e) =>
                        handleInputChange('ends', e.target.value)
                      }
                    />
                    <span>Never</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="ends"
                      value="after"
                      checked={formData.ends === 'after'}
                      onChange={(e) =>
                        handleInputChange('ends', e.target.value)
                      }
                    />
                    <span>After</span>
                    {formData.ends === 'after' && (
                      <input
                        type="number"
                        min="1"
                        value={formData.ends_after_occurrences}
                        onChange={(e) =>
                          handleInputChange(
                            'ends_after_occurrences',
                            e.target.value
                          )
                        }
                        className="w-20 px-2 py-1 border rounded-lg"
                      />
                    )}
                    <span>occurrences</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="ends"
                      value="on_date"
                      checked={formData.ends === 'on_date'}
                      onChange={(e) =>
                        handleInputChange('ends', e.target.value)
                      }
                    />
                    <span>On date</span>
                    {formData.ends === 'on_date' && (
                      <input
                        type="date"
                        value={formData.ends_on_date}
                        onChange={(e) =>
                          handleInputChange('ends_on_date', e.target.value)
                        }
                        className="px-2 py-1 border rounded-lg"
                      />
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errors.submit}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 gradient-bubble text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? initialData
                  ? 'Updating...'
                  : 'Adding...'
                : initialData
                  ? 'Update Transaction'
                  : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
