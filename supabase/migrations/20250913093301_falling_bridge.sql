/*
  # Populate Sample Data for Personal Finance App

  1. Sample Data
    - Add sample accounts (checking, savings, credit card)
    - Add sample categories for income, expense, and transfer types
    - Add sample user record

  2. Data Structure
    - User: Sample user for testing
    - Accounts: 3 different account types with realistic balances
    - Categories: Comprehensive set of categories for all transaction types
*/

-- Insert sample user (using the hardcoded UUID from the API)
INSERT INTO users (id, email, full_name, currency, timezone) VALUES 
('00000000-0000-0000-0000-000000000001', 'demo@example.com', 'Demo User', 'EUR', 'Europe/Lisbon')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  currency = EXCLUDED.currency,
  timezone = EXCLUDED.timezone;

-- Insert sample accounts
INSERT INTO accounts (user_id, name, type, balance, currency, account_number, bank_name, color, is_active) VALUES 
('00000000-0000-0000-0000-000000000001', 'Main Checking', 'checking', 5420.50, 'EUR', '****1234', 'Caixa Geral', 'from-blue-500 to-blue-600', true),
('00000000-0000-0000-0000-000000000001', 'Savings Account', 'savings', 12500.00, 'EUR', '****5678', 'Caixa Geral', 'from-green-500 to-green-600', true),
('00000000-0000-0000-0000-000000000001', 'Credit Card', 'credit_card', -850.25, 'EUR', '****9012', 'Revolut', 'from-purple-500 to-purple-600', true),
('00000000-0000-0000-0000-000000000001', 'Investment Account', 'investment', 8750.00, 'EUR', '****3456', 'Degiro', 'from-orange-500 to-orange-600', true),
('00000000-0000-0000-0000-000000000001', 'Cash Wallet', 'cash', 125.00, 'EUR', NULL, NULL, 'from-gray-500 to-gray-600', true)
ON CONFLICT (user_id, name, type) DO UPDATE SET
  balance = EXCLUDED.balance,
  currency = EXCLUDED.currency,
  account_number = EXCLUDED.account_number,
  bank_name = EXCLUDED.bank_name,
  color = EXCLUDED.color,
  is_active = EXCLUDED.is_active;

-- Insert income categories
INSERT INTO categories (user_id, name, type, color, icon, is_active) VALUES 
('00000000-0000-0000-0000-000000000001', 'Salary', 'income', '#10B981', 'Briefcase', true),
('00000000-0000-0000-0000-000000000001', 'Freelance', 'income', '#3B82F6', 'Award', true),
('00000000-0000-0000-0000-000000000001', 'Investment Returns', 'income', '#8B5CF6', 'TrendingUp', true),
('00000000-0000-0000-0000-000000000001', 'Cashback', 'income', '#F59E0B', 'Gift', true),
('00000000-0000-0000-0000-000000000001', 'Side Business', 'income', '#EF4444', 'Building', true)
ON CONFLICT (user_id, name, type) DO UPDATE SET
  color = EXCLUDED.color,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active;

-- Insert expense categories
INSERT INTO categories (user_id, name, type, color, icon, is_active) VALUES 
('00000000-0000-0000-0000-000000000001', 'Groceries', 'expense', '#EF4444', 'ShoppingCart', true),
('00000000-0000-0000-0000-000000000001', 'Restaurants', 'expense', '#F97316', 'Utensils', true),
('00000000-0000-0000-0000-000000000001', 'Transportation', 'expense', '#3B82F6', 'Car', true),
('00000000-0000-0000-0000-000000000001', 'Entertainment', 'expense', '#8B5CF6', 'Music', true),
('00000000-0000-0000-0000-000000000001', 'Utilities', 'expense', '#10B981', 'Zap', true),
('00000000-0000-0000-0000-000000000001', 'Healthcare', 'expense', '#EC4899', 'Heart', true),
('00000000-0000-0000-0000-000000000001', 'Shopping', 'expense', '#F59E0B', 'ShoppingBag', true),
('00000000-0000-0000-0000-000000000001', 'Education', 'expense', '#06B6D4', 'BookOpen', true),
('00000000-0000-0000-0000-000000000001', 'Insurance', 'expense', '#6B7280', 'PiggyBank', true),
('00000000-0000-0000-0000-000000000001', 'Coffee & Drinks', 'expense', '#92400E', 'Coffee', true)
ON CONFLICT (user_id, name, type) DO UPDATE SET
  color = EXCLUDED.color,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active;

-- Insert transfer categories
INSERT INTO categories (user_id, name, type, color, icon, is_active) VALUES 
('00000000-0000-0000-0000-000000000001', 'Savings Transfer', 'transfer', '#10B981', 'ArrowRightLeft', true),
('00000000-0000-0000-0000-000000000001', 'Investment Transfer', 'transfer', '#8B5CF6', 'TrendingUp', true),
('00000000-0000-0000-0000-000000000001', 'Account Transfer', 'transfer', '#3B82F6', 'CreditCard', true),
('00000000-0000-0000-0000-000000000001', 'Emergency Fund', 'transfer', '#EF4444', 'PiggyBank', true)
ON CONFLICT (user_id, name, type) DO UPDATE SET
  color = EXCLUDED.color,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active;