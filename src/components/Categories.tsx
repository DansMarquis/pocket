import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { api, Category } from '../lib/supabase'; // Adjust path as needed

// Category types for filtering and selection
const CATEGORY_TYPES = [
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expense' },
  { key: 'saving', label: 'Saving' },
  { key: 'subscription', label: 'Subscription' },
  { key: 'transfer', label: 'Transfer' },
  { key: 'wishlist', label: 'Wishlist' },
];
const TYPE_ICONS: Record<string, string> = {
  income: '💰',
  expense: '💸',
  saving: '🐷',
  subscription: '📅',
  transfer: '🔄',
  wishlist: '🎁',
};

const PRESET_COLORS = [
  '#10B981',
  '#3B82F6',
  '#F59E42',
  '#F472B6',
  '#6EE7B7',
  '#FCA5A5',
  '#F87171',
  '#000000',
  '#FFFFFF',
  '#4B5563',
];

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedType, setSelectedType] = useState('income');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: selectedType,
    color: PRESET_COLORS[0],
    icon: '💰',
    budget: '',
  });

  // Fetch categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const categoriesData = await api.getCategories(); // Should return array
      setCategories(categoriesData);
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  // Filter categories by type
  const filteredCategories = categories.filter(
    (cat) => cat.type === selectedType
  );

  // Add category
  const handleAddCategory = async () => {
    const payload = {
      name: newCategory.name,
      type: newCategory.type,
      color: newCategory.color,
      icon: newCategory.icon,
      budget: newCategory.budget ? Number(newCategory.budget) : null,
      is_active: true,
      parent_id: null,
      user_id: '2f1b033b-57fd-4ce3-9277-021fb25ef14e', // Replace with your user id logic
    };
    const { data, error } = await api.addCategory(payload);
    if (!error && data) {
      setCategories([...categories, data]);
      setShowAddModal(false);
      setNewCategory({
        name: '',
        type: selectedType,
        color: PRESET_COLORS[0],
        icon: '💰',
        budget: '',
      });
    }
  };

  // Edit category
  const handleEditCategory = async () => {
    if (!editCategory) return;
    const payload = {
      ...editCategory,
      name: editCategory.name,
      type: editCategory.type,
      color: editCategory.color,
      icon: editCategory.icon,
      budget: editCategory.budget ? Number(editCategory.budget) : null,
    };
    const updatedCategory = await api.updateCategory(editCategory.id, payload);
    if (updatedCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );
      setShowEditModal(false);
      setEditCategory(null);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    await api.deleteCategory(categoryToDelete.id);
    const categoriesData = await api.getCategories();
    setCategories(categoriesData);
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Define and manage categories for all your transactions.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="gradient-bubble text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Type Filter */}
      <div className="flex space-x-2 mb-6">
        {CATEGORY_TYPES.map((type) => (
          <button
            key={type.key}
            onClick={() => setSelectedType(type.key)}
            className={`px-4 py-2 rounded-full font-medium flex items-center space-x-2 ${
              selectedType === type.key
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            <span className="text-xl">{TYPE_ICONS[type.key]}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-gray-200/20 dark:border-gray-700/20 hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Budget: €{cat.budget}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30"
                      onClick={() => {
                        setEditCategory(cat);
                        setShowEditModal(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 text-purple-600" />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => {
                        setCategoryToDelete(cat);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Delete Category
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete{' '}
              <span className="font-bold">{categoryToDelete.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add Category
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  placeholder="Category name"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={newCategory.type}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, type: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none text-gray-900 dark:text-white"
                >
                  {CATEGORY_TYPES.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Emoji
                </label>
                <Picker
                  data={data}
                  onEmojiSelect={(emoji: any) =>
                    setNewCategory({ ...newCategory, icon: emoji.native })
                  }
                  previewPosition="none"
                  theme="auto"
                />
                <div className="mt-2 text-3xl">{newCategory.icon}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-7 h-7 rounded-full border-2 ${newCategory.color === color ? 'border-purple-500' : 'border-gray-200'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewCategory({ ...newCategory, color })}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Budget (€)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newCategory.budget}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, budget: e.target.value })
                  }
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="flex-1 gradient-bubble text-white px-4 py-3 rounded-xl"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && editCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Edit Category
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editCategory.name}
                  onChange={(e) =>
                    setEditCategory({ ...editCategory, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={editCategory.type}
                  onChange={(e) =>
                    setEditCategory({
                      ...editCategory,
                      type: e.target.value as Category['type'],
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none text-gray-900 dark:text-white"
                >
                  {CATEGORY_TYPES.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Emoji
                </label>
                <Picker
                  data={data}
                  onEmojiSelect={(emoji: any) =>
                    setEditCategory({ ...editCategory, icon: emoji.native })
                  }
                  previewPosition="none"
                  theme="auto"
                />
                <div className="mt-2 text-3xl">{editCategory.icon}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-7 h-7 rounded-full border-2 ${editCategory.color === color ? 'border-purple-500' : 'border-gray-200'}`}
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        setEditCategory({ ...editCategory, color })
                      }
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Budget (€)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editCategory.budget ?? ''}
                  onChange={(e) =>
                    setEditCategory({
                      ...editCategory,
                      budget: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCategory}
                className="flex-1 gradient-bubble text-white px-4 py-3 rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
