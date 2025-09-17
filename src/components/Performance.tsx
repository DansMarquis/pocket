import React from 'react';
import { TrendingUp, Target, Award, Calendar } from 'lucide-react';
import { BarChart } from './charts/BarChart';

export const Performance: React.FC = () => {
  const goals = [
    {
      id: 1,
      title: 'Emergency Fund',
      target: 10000,
      current: 7500,
      deadline: '2025-12-31',
      status: 'on-track'
    },
    {
      id: 2,
      title: 'Vacation Savings',
      target: 5000,
      current: 3200,
      deadline: '2025-08-15',
      status: 'on-track'
    },
    {
      id: 3,
      title: 'Car Down Payment',
      target: 15000,
      current: 8900,
      deadline: '2025-06-30',
      status: 'behind'
    },
    {
      id: 4,
      title: 'Home Renovation',
      target: 25000,
      current: 25000,
      deadline: '2025-03-15',
      status: 'completed'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Budget Master',
      description: 'Stayed under budget for 6 consecutive months',
      earned: true,
      icon: '🏆'
    },
    {
      id: 2,
      title: 'Savings Streak',
      description: 'Saved money every month for a year',
      earned: true,
      icon: '💰'
    },
    {
      id: 3,
      title: 'Goal Crusher',
      description: 'Completed 5 financial goals',
      earned: false,
      icon: '🎯'
    },
    {
      id: 4,
      title: 'Emergency Ready',
      description: 'Built a 6-month emergency fund',
      earned: false,
      icon: '🛡️'
    }
  ];

  const monthlyMetrics = [
    { month: 'Jan', savingsRate: 25, budgetCompliance: 85, score: 82 },
    { month: 'Feb', savingsRate: 30, budgetCompliance: 78, score: 79 },
    { month: 'Mar', savingsRate: 22, budgetCompliance: 92, score: 88 },
    { month: 'Apr', savingsRate: 28, budgetCompliance: 88, score: 85 },
    { month: 'May', savingsRate: 35, budgetCompliance: 95, score: 91 },
    { month: 'Jun', savingsRate: 32, budgetCompliance: 89, score: 87 }
  ];

  // Prepare data for performance chart
  const performanceChartData = monthlyMetrics.map(metric => ({
    label: metric.month,
    value: metric.score,
    color: '#8B5CF6'
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'on-track':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'behind':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Performance</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your financial goals and monitor your progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Goals Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
            <div className="flex items-center space-x-2 mb-6">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Financial Goals</h2>
            </div>

            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = calculateProgress(goal.current, goal.target);
                return (
                  <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                        {goal.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            goal.status === 'completed' ? 'bg-green-500' :
                            goal.status === 'on-track' ? 'bg-blue-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Target: {goal.deadline}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Monthly Performance</h2>
            </div>

            <div className="space-y-4">
              {monthlyMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{metric.month}</span>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="text-blue-600 dark:text-blue-400 font-semibold">{metric.savingsRate}%</div>
                      <div className="text-gray-500 dark:text-gray-400">Savings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-600 dark:text-green-400 font-semibold">{metric.budgetCompliance}%</div>
                      <div className="text-gray-500 dark:text-gray-400">Budget</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-600 dark:text-purple-400 font-semibold">{metric.score}</div>
                      <div className="text-gray-500 dark:text-gray-400">Score</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <BarChart data={performanceChartData} height={160} />
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
            <div className="flex items-center space-x-2 mb-6">
              <Award className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Achievements</h2>
            </div>

            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-xl border transition-all ${
                    achievement.earned 
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        achievement.earned 
                          ? 'text-yellow-800 dark:text-yellow-300' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${
                        achievement.earned 
                          ? 'text-yellow-700 dark:text-yellow-400' 
                          : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Score */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Overall Score</h2>
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <div className="text-2xl font-bold text-white">87</div>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Excellent</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                You're doing great with your financial management!
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">This Month</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">+5 points</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Best Score</span>
                  <span className="font-semibold text-gray-900 dark:text-white">91</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};