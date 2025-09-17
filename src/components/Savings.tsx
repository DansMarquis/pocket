import React, { useState } from 'react';
import { Target, Plus, TrendingUp, Calendar, PiggyBank as Piggy_Bank } from 'lucide-react';

export const Savings: React.FC = () => {
  const [showAddGoal, setShowAddGoal] = useState(false);

  const savingsGoals = [
    {
      id: 1,
      name: 'Emergency Fund',
      description: '6 months of living expenses',
      targetAmount: 18000,
      currentAmount: 12500,
      monthlyContribution: 500,
      targetDate: '2025-12-31',
      color: 'from-red-500 to-pink-600',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Dream Home Down Payment',
      description: '20% down payment for house purchase',
      targetAmount: 80000,
      currentAmount: 24500,
      monthlyContribution: 1200,
      targetDate: '2027-06-30',
      color: 'from-blue-500 to-indigo-600',
      priority: 'high'
    },
    {
      id: 3,
      name: 'New Car',
      description: 'Tesla Model 3 down payment',
      targetAmount: 15000,
      currentAmount: 8900,
      monthlyContribution: 400,
      targetDate: '2025-08-15',
      color: 'from-green-500 to-emerald-600',
      priority: 'medium'
    },
    {
      id: 4,
      name: 'Retirement Savings',
      description: 'Long-term retirement planning',
      targetAmount: 500000,
      currentAmount: 125000,
      monthlyContribution: 800,
      targetDate: '2050-12-31',
      color: 'from-purple-500 to-violet-600',
      priority: 'high'
    },
    {
      id: 5,
      name: 'Education Fund',
      description: "Children's college education",
      targetAmount: 100000,
      currentAmount: 15600,
      monthlyContribution: 600,
      targetDate: '2030-08-31',
      color: 'from-orange-500 to-red-600',
      priority: 'medium'
    },
    {
      id: 6,
      name: 'Travel Fund',
      description: 'Annual vacation and travel experiences',
      targetAmount: 10000,
      currentAmount: 3200,
      monthlyContribution: 300,
      targetDate: '2025-06-01',
      color: 'from-teal-500 to-cyan-600',
      priority: 'low'
    }
  ];

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateMonthsToTarget = (current: number, target: number, monthly: number) => {
    if (monthly <= 0) return 0;
    return Math.ceil((target - current) / monthly);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTargets = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const monthlyContributions = savingsGoals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Savings Goals</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress toward financial milestones
          </p>
        </div>
        <button 
          onClick={() => setShowAddGoal(true)}
          className="gradient-bubble text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Savings Goal</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Piggy_Bank className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Total Saved</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${totalSavings.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {((totalSavings / totalTargets) * 100).toFixed(1)}% of total goals
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Target Amount</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            ${totalTargets.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            ${(totalTargets - totalSavings).toLocaleString()} remaining
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Monthly Contributions</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            ${monthlyContributions.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            ${monthlyContributions * 12}/year
          </p>
        </div>
      </div>

      {/* Savings Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {savingsGoals.map((goal) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const monthsToTarget = calculateMonthsToTarget(goal.currentAmount, goal.targetAmount, goal.monthlyContribution);
          
          return (
            <div key={goal.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-12 h-12 bg-gradient-to-r ${goal.color} rounded-xl flex items-center justify-center`}>
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{goal.description}</p>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                  {goal.priority} priority
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${goal.currentAmount.toLocaleString()}
                  </span>
                  <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                    ${goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 bg-gradient-to-r ${goal.color} rounded-full transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{progress.toFixed(1)}% complete</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    ${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly Contribution</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${goal.monthlyContribution.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Months to Goal</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {monthsToTarget > 0 ? `${monthsToTarget}` : 'Complete!'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Target: {goal.targetDate}</span>
                </div>
                <button className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium">
                  Edit Goal
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal (simplified placeholder) */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Savings Goal</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Goal name"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Target amount"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
              <input
                type="date"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddGoal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddGoal(false)}
                className="flex-1 gradient-bubble text-white px-4 py-3 rounded-xl"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};