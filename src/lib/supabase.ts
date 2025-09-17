import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  currency: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  account_number?: string;
  bank_name?: string;
  fromColor?: string; // <-- add this
  toColor?: string;   // <-- add this
  gradientDirection?: string; // <-- add this line
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expiry: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense' | 'transfer' | 'subscription' | 'saving';
  color: string;
  icon: string;
    budget: number | null;
  parent_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  from_account_id?: string;
  to_account_id?: string;
  category_id?: string;
  amount: number;
  description: string;
  notes?: string;
  transaction_date: string;
  type: 'income' | 'expense' | 'transfer' | 'subscription' | 'saving';
  status: 'pending' | 'completed' | 'cancelled';
  recurring_transaction_id?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  from_account?: Account;
  to_account?: Account;
  category?: Category;
}

export interface SavingGoal {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  priority: 'low' | 'medium' | 'high';
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  estimated_cost: number;
  saved_amount: number;
  target_date?: string;
  category: 'travel' | 'vehicle' | 'home' | 'electronics' | 'other';
  priority: 'low' | 'medium' | 'high';
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface RecurringTransaction {
  id: string;
  user_id: string;
  from_account_id?: string;
  to_account_id?: string;
  category_id?: string;
  amount: number;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_date: string;
  end_date?: string;
  type: 'income' | 'expense' | 'transfer' | 'subscription' | 'saving';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  from_account?: Account;
  to_account?: Account;
  category?: Category;
}

export interface Settings {
  id: string;
  darkMode: boolean;
}

// API functions
export const api = {
  // Accounts
  async getAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*'); // Remove .eq('is_active', true) to get all cards

  if (error) throw error;
  return data || [];
},
async getAccount(id: string): Promise<Account> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
},

  async createAccount(account: Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { expiry?: string }): Promise<Account> {
  const { data, error } = await supabase
    .from('accounts')
    .insert([{ ...account, user_id: '2f1b033b-57fd-4ce3-9277-021fb25ef14e', expiry: account.expiry }])
    .select()
    .single();

  if (error) throw error;
  return data;
},

  async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    const { data, error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAccount(id: string): Promise<void> {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id); // This will permanently remove the card

  if (error) throw error;
},

  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('type', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },
  addCategory: async (payload: any): Promise<{ data: any; error: any }> => {
    // Replace with your actual supabase logic
    const { data, error } = await supabase
      .from('categories')
      .insert([payload])
      .select()
      .single();
    return { data, error };
  },

  async createCategory(category: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ ...category, user_id: '2f1b033b-57fd-4ce3-9277-021fb25ef14e' }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSavings(): Promise<SavingGoal[]> {
    const { data, error } = await supabase
      .from('saving_goals')
      .select('*')
      .eq('user_id', '2f1b033b-57fd-4ce3-9277-021fb25ef14e')
      .order('priority', { ascending: false })
      .order('target_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
},

 getSettings: async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();
  return data;
},
updateDarkMode: async (darkMode: boolean) => {
  const { error } = await supabase
    .from('settings')
    .update({ darkMode })
    .eq('id', 1);
  return error;
},

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        from_account:from_account_id(id, name, type),
        to_account:to_account_id(id, name, type),
        category:category_id(id, name, type, icon)
      `)
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: '2f1b033b-57fd-4ce3-9277-021fb25ef14e' }])
      .select(`
        *,
        from_account:from_account_id(id, name, type),
        to_account:to_account_id(id, name, type),
        category:category_id(id, name, type, icon)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        from_account:from_account_id(id, name, type, color),
        to_account:to_account_id(id, name, type, color),
        category:category_id(id, name, type, color, icon)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Saving Goals
  async getSavingGoals(): Promise<SavingGoal[]> {
    const { data, error } = await supabase
      .from('saving_goals')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .order('target_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createSavingGoal(goal: Omit<SavingGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<SavingGoal> {
    const { data, error } = await supabase
      .from('saving_goals')
      .insert([{ ...goal, user_id: '2f1b033b-57fd-4ce3-9277-021fb25ef14e' }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSavingGoal(id: string, updates: Partial<SavingGoal>): Promise<SavingGoal> {
    const { data, error } = await supabase
      .from('saving_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteSavingGoal(id: string): Promise<void> {
    const { error } = await supabase
      .from('saving_goals')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Wishlist Items
  async getWishlistItems(): Promise<WishlistItem[]> {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .order('target_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createWishlistItem(item: Omit<WishlistItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<WishlistItem> {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert([{ ...item, user_id: '2f1b033b-57fd-4ce3-9277-021fb25ef14e' }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateWishlistItem(id: string, updates: Partial<WishlistItem>): Promise<WishlistItem> {
    const { data, error } = await supabase
      .from('wishlist_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteWishlistItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('wishlist_items')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  }
};