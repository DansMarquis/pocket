/*
  # Populate sample data for user

  1. New Data
    - Sample user profile
    - Sample accounts (5 accounts with different types)
    - Sample categories (19 categories for income, expense, transfer)
    - Sample transactions (10 sample transactions)

  2. Security
    - All data linked to authenticated user
    - Proper foreign key relationships
*/

-- First, ensure the user exists in the users table
INSERT INTO users (id, email, full_name, currency, timezone, created_at, updated_at)
VALUES (
  '2f1b033b-57fd-4ce3-9277-021fb25ef14e',
  'danielfmarques@ua.pt',
  'Daniel Marques',
  'EUR',
  'Europe/Lisbon',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  currency = EXCLUDED.currency,
  timezone = EXCLUDED.timezone,
  updated_at = now();

-- Insert sample accounts
INSERT INTO accounts (id, user_id, name, type, balance, currency, account_number, bank_name, color, is_active, created_at, updated_at) VALUES
('a1111111-1111-1111-1111-111111111111', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Main Checking', 'checking', 5420.50, 'EUR', '1234567890', 'Caixa Geral de Depósitos', 'from-blue-500 to-blue-600', true, now(), now()),
('a2222222-2222-2222-2222-222222222222', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Savings Account', 'savings', 12500.00, 'EUR', '0987654321', 'Caixa Geral de Depósitos', 'from-green-500 to-green-600', true, now(), now()),
('a3333333-3333-3333-3333-333333333333', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Credit Card', 'credit_card', -850.25, 'EUR', '4532123456789012', 'Revolut', 'from-red-500 to-pink-600', true, now(), now()),
('a4444444-4444-4444-4444-444444444444', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Investment Account', 'investment', 8750.00, 'EUR', '5678901234', 'Degiro', 'from-purple-500 to-indigo-600', true, now(), now()),
('a5555555-5555-5555-5555-555555555555', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Cash Wallet', 'cash', 125.00, 'EUR', NULL, NULL, 'from-gray-500 to-gray-600', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample categories
-- Income categories
INSERT INTO categories (id, user_id, name, type, color, icon, is_active, created_at, updated_at) VALUES
('c1111111-1111-1111-1111-111111111111', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Salary', 'income', '#10B981', 'Briefcase', true, now(), now()),
('c1111111-1111-1111-1111-111111111112', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Freelance', 'income', '#3B82F6', 'Award', true, now(), now()),
('c1111111-1111-1111-1111-111111111113', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Investment Returns', 'income', '#8B5CF6', 'TrendingUp', true, now(), now()),
('c1111111-1111-1111-1111-111111111114', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Cashback', 'income', '#F59E0B', 'Gift', true, now(), now()),
('c1111111-1111-1111-1111-111111111115', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Side Business', 'income', '#06B6D4', 'Building', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Expense categories
INSERT INTO categories (id, user_id, name, type, color, icon, is_active, created_at, updated_at) VALUES
('c2222222-2222-2222-2222-222222222221', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Groceries', 'expense', '#EF4444', 'ShoppingCart', true, now(), now()),
('c2222222-2222-2222-2222-222222222222', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Restaurants', 'expense', '#F97316', 'Utensils', true, now(), now()),
('c2222222-2222-2222-2222-222222222223', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Transportation', 'expense', '#84CC16', 'Car', true, now(), now()),
('c2222222-2222-2222-2222-222222222224', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Entertainment', 'expense', '#EC4899', 'Music', true, now(), now()),
('c2222222-2222-2222-2222-222222222225', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Utilities', 'expense', '#6366F1', 'Zap', true, now(), now()),
('c2222222-2222-2222-2222-222222222226', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Healthcare', 'expense', '#14B8A6', 'Heart', true, now(), now()),
('c2222222-2222-2222-2222-222222222227', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Shopping', 'expense', '#A855F7', 'ShoppingBag', true, now(), now()),
('c2222222-2222-2222-2222-222222222228', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Education', 'expense', '#0EA5E9', 'BookOpen', true, now(), now()),
('c2222222-2222-2222-2222-222222222229', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Insurance', 'expense', '#64748B', 'PiggyBank', true, now(), now()),
('c2222222-2222-2222-2222-222222222230', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Coffee & Drinks', 'expense', '#92400E', 'Coffee', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Transfer categories
INSERT INTO categories (id, user_id, name, type, color, icon, is_active, created_at, updated_at) VALUES
('c3333333-3333-3333-3333-333333333331', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Savings Transfer', 'transfer', '#059669', 'PiggyBank', true, now(), now()),
('c3333333-3333-3333-3333-333333333332', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Investment Transfer', 'transfer', '#7C3AED', 'TrendingUp', true, now(), now()),
('c3333333-3333-3333-3333-333333333333', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Account Transfer', 'transfer', '#2563EB', 'ArrowRightLeft', true, now(), now()),
('c3333333-3333-3333-3333-333333333334', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'Emergency Fund', 'transfer', '#DC2626', 'PiggyBank', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (id, user_id, from_account_id, to_account_id, category_id, amount, description, transaction_date, type, status, created_at, updated_at) VALUES
('t1111111-1111-1111-1111-111111111111', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', NULL, 'a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 3500.00, 'Monthly Salary', '2025-01-15', 'income', 'completed', now(), now()),
('t2222222-2222-2222-2222-222222222222', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'a1111111-1111-1111-1111-111111111111', NULL, 'c2222222-2222-2222-2222-222222222221', 89.45, 'Weekly Groceries', '2025-01-14', 'expense', 'completed', now(), now()),
('t3333333-3333-3333-3333-333333333333', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'a1111111-1111-1111-1111-111111111111', NULL, 'c2222222-2222-2222-2222-222222222222', 45.20, 'Dinner at Restaurant', '2025-01-13', 'expense', 'completed', now(), now()),
('t4444444-4444-4444-4444-444444444444', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'a1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 500.00, 'Monthly Savings', '2025-01-12', 'transfer', 'completed', now(), now()),
('t5555555-5555-5555-5555-555555555555', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', NULL, 'a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111112', 750.00, 'Freelance Project Payment', '2025-01-11', 'income', 'completed', now(), now()),
('t6666666-6666-6666-6666-666666666666', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'a1111111-1111-1111-1111-111111111111', NULL, 'c2222222-2222-2222-2222-222222222223', 35.80, 'Gas Station', '2025-01-10', 'expense', 'completed', now(), now()),
('t7777777-7777-7777-7777-777777777777', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'a1111111-1111-1111-1111-111111111111', NULL, 'c2222222-2222-2222-2222-222222222230', 4.50, 'Morning Coffee', '2025-01-09', 'expense', 'completed', now(), now()),
('t8888888-8888-8888-8888-888888888888', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'a1111111-1111-1111-1111-111111111111', NULL, 'c2222222-2222-2222-2222-222222222224', 25.00, 'Movie Tickets', '2025-01-08', 'expense', 'completed', now(), now()),
('t9999999-9999-9999-9999-999999999999', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', 'a1111111-1111-1111-1111-111111111111', NULL, 'c2222222-2222-2222-2222-222222222225', 120.00, 'Electricity Bill', '2025-01-07', 'expense', 'completed', now(), now()),
('t0000000-0000-0000-0000-000000000000', '2f1b033b-57fd-4ce3-9277-021fb25ef14e', NULL, 'a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111114', 15.75, 'Credit Card Cashback', '2025-01-06', 'income', 'completed', now(), now())
ON CONFLICT (id) DO NOTHING;