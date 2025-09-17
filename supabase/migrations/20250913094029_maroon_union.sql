```sql
-- Set a variable for the user_id
DO $$
DECLARE
    user_uuid UUID := '2f1b033b-57fd-4ce3-9277-021fb25ef14e';
    -- Declare variables for account UUIDs
    account_checking_uuid UUID;
    account_savings_uuid UUID;
    account_credit_uuid UUID;
    account_investment_uuid UUID;
    account_cash_uuid UUID;
    -- Declare variables for category UUIDs
    cat_salary_uuid UUID;
    cat_freelance_uuid UUID;
    cat_investment_returns_uuid UUID;
    cat_cashback_uuid UUID;
    cat_side_business_uuid UUID;
    cat_groceries_uuid UUID;
    cat_restaurants_uuid UUID;
    cat_transportation_uuid UUID;
    cat_entertainment_uuid UUID;
    cat_utilities_uuid UUID;
    cat_healthcare_uuid UUID;
    cat_shopping_uuid UUID;
    cat_education_uuid UUID;
    cat_insurance_uuid UUID;
    cat_coffee_drinks_uuid UUID;
    cat_savings_transfer_uuid UUID;
    cat_investment_transfer_uuid UUID;
    cat_account_transfer_uuid UUID;
    cat_emergency_fund_uuid UUID;
BEGIN
    -- Update user profile (if it exists, otherwise insert)
    INSERT INTO public.users (id, email, full_name, currency, timezone)
    VALUES (user_uuid, 'danielfmarques@ua.pt', 'Daniel Marques', 'EUR', 'Europe/Lisbon')
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        currency = EXCLUDED.currency,
        timezone = EXCLUDED.timezone;

    -- Insert sample accounts and capture their generated UUIDs
    INSERT INTO public.accounts (id, user_id, name, type, balance, currency, bank_name, color)
    VALUES
        (gen_random_uuid(), user_uuid, 'Main Checking', 'checking', 5420.50, 'EUR', 'Caixa Geral de Depósitos', 'from-blue-600 to-blue-700') RETURNING id INTO account_checking_uuid;
    INSERT INTO public.accounts (id, user_id, name, type, balance, currency, bank_name, color)
    VALUES
        (gen_random_uuid(), user_uuid, 'Savings Account', 'savings', 12500.00, 'EUR', 'Caixa Geral de Depósitos', 'from-green-500 to-emerald-600') RETURNING id INTO account_savings_uuid;
    INSERT INTO public.accounts (id, user_id, name, type, balance, currency, bank_name, color)
    VALUES
        (gen_random_uuid(), user_uuid, 'Credit Card', 'credit_card', -850.25, 'EUR', 'Revolut', 'from-pink-500 via-blue-500 to-cyan-400') RETURNING id INTO account_credit_uuid;
    INSERT INTO public.accounts (id, user_id, name, type, balance, currency, bank_name, color)
    VALUES
        (gen_random_uuid(), user_uuid, 'Investment Account', 'investment', 8750.00, 'EUR', 'Degiro', 'from-purple-500 to-violet-600') RETURNING id INTO account_investment_uuid;
    INSERT INTO public.accounts (id, user_id, name, type, balance, currency, bank_name, color)
    VALUES
        (gen_random_uuid(), user_uuid, 'Cash Wallet', 'cash', 125.00, 'EUR', NULL, 'from-gray-500 to-slate-600') RETURNING id INTO account_cash_uuid;

    -- Insert sample categories and capture their generated UUIDs
    -- Income
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Salary', 'income', '#10B981', 'Euro') RETURNING id INTO cat_salary_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Freelance', 'income', '#3B82F6', 'Briefcase') RETURNING id INTO cat_freelance_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Investment Returns', 'income', '#8B5CF6', 'TrendingUp') RETURNING id INTO cat_investment_returns_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Cashback', 'income', '#EC4899', 'Award') RETURNING id INTO cat_cashback_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Side Business', 'income', '#F97316', 'Building') RETURNING id INTO cat_side_business_uuid;

    -- Expense
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Groceries', 'expense', '#EF4444', 'ShoppingCart') RETURNING id INTO cat_groceries_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Restaurants', 'expense', '#F59E0B', 'Utensils') RETURNING id INTO cat_restaurants_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Transportation', 'expense', '#6B7280', 'Car') RETURNING id INTO cat_transportation_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Entertainment', 'expense', '#8B5CF6', 'Gamepad2') RETURNING id INTO cat_entertainment_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Utilities', 'expense', '#3B82F6', 'Zap') RETURNING id INTO cat_utilities_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Healthcare', 'expense', '#EC4899', 'Heart') RETURNING id INTO cat_healthcare_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Shopping', 'expense', '#F97316', 'ShoppingBag') RETURNING id INTO cat_shopping_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Education', 'expense', '#10B981', 'BookOpen') RETURNING id INTO cat_education_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Insurance', 'expense', '#6366F1', 'CreditCard') RETURNING id INTO cat_insurance_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Coffee & Drinks', 'expense', '#78350F', 'Coffee') RETURNING id INTO cat_coffee_drinks_uuid;

    -- Transfer
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Savings Transfer', 'transfer', '#06B6D4', 'PiggyBank') RETURNING id INTO cat_savings_transfer_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Investment Transfer', 'transfer', '#6366F1', 'TrendingUp') RETURNING id INTO cat_investment_transfer_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Account Transfer', 'transfer', '#3B82F6', 'ArrowRightLeft') RETURNING id INTO cat_account_transfer_uuid;
    INSERT INTO public.categories (id, user_id, name, type, color, icon)
    VALUES
        (gen_random_uuid(), user_uuid, 'Emergency Fund', 'transfer', '#F97316', 'TreePine') RETURNING id INTO cat_emergency_fund_uuid;

    -- Insert sample transactions
    INSERT INTO public.transactions (id, user_id, from_account_id, to_account_id, category_id, amount, description, transaction_date, type, status, created_at, updated_at)
    VALUES
        (gen_random_uuid(), user_uuid, NULL, account_checking_uuid, cat_salary_uuid, 3500.00, 'Monthly Salary', '2025-01-15', 'income', 'completed', now(), now()),
        (gen_random_uuid(), user_uuid, account_checking_uuid, NULL, cat_groceries_uuid, 85.50, 'Lidl Groceries', '2025-01-16', 'expense', 'completed', now(), now()),
        (gen_random_uuid(), user_uuid, account_checking_uuid, account_savings_uuid, cat_savings_transfer_uuid, 500.00, 'Monthly Savings Transfer', '2025-01-17', 'transfer', 'completed', now(), now()),
        (gen_random_uuid(), user_uuid, account_credit_uuid, NULL, cat_restaurants_uuid, 45.20, 'Dinner at Local Restaurant', '2025-01-18', 'expense', 'completed', now(), now()),
        (gen_random_uuid(), user_uuid, NULL, account_checking_uuid, cat_freelance_uuid, 750.00, 'Freelance Project Payment', '2025-01-19', 'income', 'completed', now(), now()),
        (gen_random_uuid(), user_uuid, account_checking_uuid, NULL, cat_transportation_uuid, 30.00, 'Fuel for Car', '2025-01-20', 'expense', 'completed', now(), now()),
        (gen_random_uuid(), user_uuid, account_checking_uuid, NULL, cat_entertainment_uuid, 12.99, 'Netflix Subscription', '2025-01-21', 'expense', 'completed', now(), now()),
        (gen_random_uuid(), user_uuid, account_checking_uuid, NULL, cat_utilities_uuid, 60.00, 'Electricity Bill', '2025-01-22', 'expense', 'completed', now(), now()),
        (gen_random_uuid(), user_uuid, account_cash_uuid, NULL, cat_coffee_drinks_uuid, 3.50, 'Morning Coffee', '2025-01-23', 'expense', 'completed', now(), now()),
        (gen_random_uuid(), user_uuid, NULL, account_investment_uuid, cat_investment_returns_uuid, 150.00, 'Stock Dividend', '2025-01-24', 'income', 'completed', now(), now());

END $$;
```;
