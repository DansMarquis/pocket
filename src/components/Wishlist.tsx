import React, { useState } from 'react';
import { Heart, Plus, Calendar, MapPin, Plane, Car, Home, ShoppingBag } from 'lucide-react';

export const Wishlist: React.FC = () => {
  const [showAddWish, setShowAddWish] = useState(false);

  const wishlistItems = [
    {
      id: 1,
      name: 'European Vacation',
      description: '2 weeks exploring Paris, Rome, and Barcelona',
      estimatedCost: 8500,
      savedAmount: 3200,
      targetDate: '2025-08-15',
      category: 'travel',
      priority: 'high',
      image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Tesla Model 3',
      description: 'Electric vehicle for daily commuting',
      estimatedCost: 45000,
      savedAmount: 12000,
      targetDate: '2026-03-01',
      category: 'vehicle',
      priority: 'high',
      image: 'https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Home Theater System',
      description: 'Premium audio/video entertainment setup',
      estimatedCost: 3500,
      savedAmount: 1800,
      targetDate: '2025-06-01',
      category: 'electronics',
      priority: 'medium',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      name: 'Kitchen Renovation',
      description: 'Complete kitchen makeover with modern appliances',
      estimatedCost: 25000,
      savedAmount: 8500,
      targetDate: '2025-12-01',
      category: 'home',
      priority: 'medium',
      image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 5,
      name: 'Japan Cherry Blossom Trip',
      description: 'Spring vacation to see cherry blossoms in Kyoto',
      estimatedCost: 6000,
      savedAmount: 2100,
      targetDate: '2026-04-10',
      category: 'travel',
      priority: 'medium',
      image: 'https://images.pexels.com/photos/3601094/pexels-photo-3601094.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 6,
      name: 'Professional Camera Kit',
      description: 'Canon EOS R5 with lenses for photography',
      estimatedCost: 4200,
      savedAmount: 950,
      targetDate: '2025-09-15',
      category: 'electronics',
      priority: 'low',
      image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel':
        return <Plane className="w-5 h-5" />;
      case 'vehicle':
        return <Car className="w-5 h-5" />;
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'electronics':
        return <ShoppingBag className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'travel':
        return 'from-blue-500 to-cyan-600';
      case 'vehicle':
        return 'from-red-500 to-pink-600';
      case 'home':
        return 'from-green-500 to-emerald-600';
      case 'electronics':
        return 'from-purple-500 to-violet-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const calculateProgress = (saved: number, target: number) => {
    return Math.min((saved / target) * 100, 100);
  };

  const totalWishlistValue = wishlistItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalSaved = wishlistItems.reduce((sum, item) => sum + item.savedAmount, 0);
  const averageProgress = wishlistItems.length > 0 ? (totalSaved / totalWishlistValue) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Save for the things that matter most to you
          </p>
        </div>
        <button 
          onClick={() => setShowAddWish(true)}
          className="gradient-bubble text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Wishlist Item</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Total Wishlist Value</h3>
          </div>
          <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
            ${totalWishlistValue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {wishlistItems.length} items
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Amount Saved</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${totalSaved.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {averageProgress.toFixed(1)}% of total goals
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Next Goal</h3>
          </div>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {wishlistItems[0]?.name || 'No items'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {wishlistItems[0]?.targetDate || 'Add your first item'}
          </p>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => {
          const progress = calculateProgress(item.savedAmount, item.estimatedCost);
          
          return (
            <div key={item.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-gray-200/20 dark:border-gray-700/20 hover:scale-105 transition-transform duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${getCategoryColor(item.category)} rounded-xl flex items-center justify-center shadow-lg`}>
                    {getCategoryIcon(item.category)}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                    {item.priority} priority
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${item.savedAmount.toLocaleString()}
                    </span>
                    <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                      ${item.estimatedCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                    <div 
                      className={`h-3 bg-gradient-to-r ${getCategoryColor(item.category)} rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{progress.toFixed(1)}% saved</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      ${(item.estimatedCost - item.savedAmount).toLocaleString()} to go
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Target: {item.targetDate}</span>
                  </div>
                  <button className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium">
                    Add Funds
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Wishlist Item Modal (simplified placeholder) */}
      {showAddWish && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Wishlist Item</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Item name"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
              <textarea
                placeholder="Description"
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Estimated cost"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
              <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white">
                <option value="travel">Travel</option>
                <option value="vehicle">Vehicle</option>
                <option value="home">Home</option>
                <option value="electronics">Electronics</option>
              </select>
              <input
                type="date"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddWish(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddWish(false)}
                className="flex-1 gradient-bubble text-white px-4 py-3 rounded-xl"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};