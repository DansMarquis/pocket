import React, { useState } from 'react';
import { TrendingUp, PieChart, BarChart3, Activity } from 'lucide-react';
import { PieChart as PieChartComponent } from './charts/PieChart';
import { BarChart } from './charts/BarChart';

export const Analytics: React.FC = () => {
  const categories = [
    {
      name: 'Food & Drinks',
      amount: 1250.5,
      percentage: 28,
      color: 'bg-red-500',
    },
    { name: 'Shopping', amount: 890.2, percentage: 20, color: 'bg-blue-500' },
    {
      name: 'Transportation',
      amount: 540.8,
      percentage: 12,
      color: 'bg-green-500',
    },
    {
      name: 'Entertainment',
      amount: 420.3,
      percentage: 10,
      color: 'bg-purple-500',
    },
    {
      name: 'Bills & Utilities',
      amount: 680.9,
      percentage: 15,
      color: 'bg-orange-500',
    },
    { name: 'Healthcare', amount: 320.75, percentage: 7, color: 'bg-pink-500' },
    { name: 'Other', amount: 356.25, percentage: 8, color: 'bg-gray-500' },
  ];
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const [tableYear, setTableYear] = React.useState<number | ''>(
    new Date().getFullYear()
  );
  const [tableMonth, setTableMonth] = React.useState('');
  const [tableCategory, setTableCategory] = React.useState('');
  const [tableType, setTableType] = React.useState('');
  const [tableRowsToShow, setTableRowsToShow] = React.useState(12);

  const years = Array.from({ length: 2064 - 2025 + 1 }, (_, i) => 2025 + i);

  // Replace with your real prediction logic/API
  const predictionRows = Array.from({ length: 100 }, (_, i) => ({
    year: 2025 + Math.floor(i / 12),
    period: `25/${(i % 12) + 8}/2025 - 24/${(i % 12) + 9}/2025`,
    month: months[i % 12],
    salary: 1975.65 + (i % 5) * 10,
    foodAllowance: i % 3 === 0 ? 172.8 : 0,
    extras: i % 4 === 0 ? 1500 : 0,
    notes: i % 6 === 0 ? 'Prémio Salarial' : '',
    balance: 1975.65 + (i % 5) * 10 + (i % 4 === 0 ? 1500 : 0),
    remaining: i % 2 === 0 ? 745.76 : 445.76,
    expenses: 1200 + (i % 6) * 100,
    subscriptions: 136.23 + (i % 3) * 50,
    debt: i % 7 === 0 ? 500 : 0,
    credit: i % 8 === 0 ? 1000 : 0,
    type: i % 2 === 0 ? 'Income' : 'Expense',
    category: months[i % 12],
  }));
  const [tableRows, setTableRows] = useState(() =>
    Array.from({ length: (2064 - 2025 + 1) * 12 }, (_, i) => ({
      year: 2025 + Math.floor(i / 12),
      period: `25/${(i % 12) + 8}/2025 - 24/${(i % 12) + 9}/2025`,
      month: months[i % 12],
      salary: 1975.65 + (i % 5) * 10,
      foodAllowance: i % 3 === 0 ? 172.8 : 0,
      extras: i % 4 === 0 ? 1500 : 0,
      notes: i % 6 === 0 ? 'Prémio Salarial' : '',
      balance: 1975.65 + (i % 5) * 10 + (i % 4 === 0 ? 1500 : 0),
      remaining: i % 2 === 0 ? 745.76 : 445.76,
      expenses: 1200 + (i % 6) * 100,
      subscriptions: 136.23 + (i % 3) * 50,
      debt: i % 7 === 0 ? 500 : 0,
      credit: i % 8 === 0 ? 1000 : 0,
      type: i % 2 === 0 ? 'Income' : 'Expense',
      category: months[i % 12],
    }))
  );
  const [editRowIdx, setEditRowIdx] = useState<number | null>(null);
  const [editRowData, setEditRowData] = useState<any>(null);

  // --- Filtering logic ---
  const filteredRows = tableRows.filter(
    (row) =>
      (tableYear ? row.year === tableYear : true) &&
      (tableMonth ? row.month === tableMonth : true) &&
      (tableCategory ? row.category === tableCategory : true) &&
      (tableType ? row.type === tableType : true)
  );

  // --- Helpers to map filtered index to real index ---
  const getRealIdx = (filteredIdx: number) =>
    tableRows.findIndex((row) => row === filteredRows[filteredIdx]);

  // --- Edit handler ---
  const handleEditRow = (filteredIdx: number) => {
    setEditRowIdx(filteredIdx);
    setEditRowData({ ...filteredRows[filteredIdx] });
  };
  const handleSaveEditRow = () => {
    if (editRowIdx === null) return;
    const realIdx = getRealIdx(editRowIdx);
    const updatedRows = [...tableRows];
    updatedRows[realIdx] = editRowData;
    setTableRows(updatedRows);
    setEditRowIdx(null);
    setEditRowData(null);
  };
  // --- Delete handler ---
  const handleDeleteRow = (filteredIdx: number) => {
    const realIdx = getRealIdx(filteredIdx);
    setTableRows(tableRows.filter((_, i) => i !== realIdx));
    setSelectedRows(selectedRows.filter((idx) => idx !== filteredIdx));
  };

  // --- Bulk delete handler ---
  const handleBulkDelete = () => {
    const realIdxs = selectedRows.map(getRealIdx);
    setTableRows(tableRows.filter((_, i) => !realIdxs.includes(i)));
    setSelectedRows([]);
  };

  const monthlyTrends = [
    { month: 'Jan', income: 4500, expenses: 3200, savings: 1300 },
    { month: 'Feb', income: 4200, expenses: 3800, savings: 400 },
    { month: 'Mar', income: 4800, expenses: 3100, savings: 1700 },
    { month: 'Apr', income: 4600, expenses: 3500, savings: 1100 },
    { month: 'May', income: 5200, expenses: 3300, savings: 1900 },
    { month: 'Jun', income: 4900, expenses: 4100, savings: 800 },
  ];
  const [predictionRange, setPredictionRange] = React.useState<
    'week' | 'month' | '6months' | 'year'
  >('6months');
  const [selectedPredictionIdx, setSelectedPredictionIdx] = React.useState(0); // default to first bar

  // Color for selected bar (use purple as in your design)
  const selectedBarColor = 'bg-purple-500';
  const selectedTextColor = 'text-purple-700 dark:text-purple-300';
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [columns, setColumns] = useState([
    'Ano',
    'Período',
    'Mês',
    'Salário',
    'Subsídio de Alimentação',
    'Extras',
    'Notas',
    'Balanço',
    'Restante',
    'Despesas',
    'Subscrições',
    'Dívida',
    'Crédito',
  ]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Add column handler
  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      setColumns([...columns, newColumnName.trim()]);
      setShowAddColumnModal(false);
      setNewColumnName('');
    }
  };

  const getPredictionData = (range: typeof predictionRange) => {
    const now = new Date();
    if (range === 'week') {
      // Example: next 7 days
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() + i);
        return {
          label: date.toLocaleDateString('en-US', { weekday: 'short' }),
          value: 200 + Math.round(Math.random() * 100), // Replace with your logic
        };
      });
    }
    if (range === 'month') {
      // Example: next 4 weeks
      return Array.from({ length: 4 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() + i * 7);
        return {
          label: `W${i + 1}`,
          value: 800 + Math.round(Math.random() * 300), // Replace with your logic
        };
      });
    }
    if (range === '6months') {
      // Example: next 6 months
      return Array.from({ length: 6 }, (_, i) => {
        const date = new Date(now);
        date.setMonth(now.getMonth() + i);
        return {
          label: date.toLocaleString('en-US', { month: 'short' }),
          value: 1200 + Math.round(Math.random() * 600), // Replace with your logic
        };
      });
    }
    // Year: next 12 months
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now);
      date.setMonth(now.getMonth() + i);
      return {
        label: date.toLocaleString('en-US', { month: 'short' }),
        value: 1200 + Math.round(Math.random() * 600), // Replace with your logic
      };
    });
  };
  const predictionData = getPredictionData(predictionRange);
  const selectedPrediction = predictionData[selectedPredictionIdx];
  const expectedIncome = selectedPrediction?.value || 0;
  // Prepare data for pie chart
  const pieChartData = categories.map((category) => ({
    name: category.name,
    value: category.amount,
    color: category.color.replace('bg-', '#').replace('500', ''),
    percentage: category.percentage,
  }));

  // Convert CSS classes to hex colors
  const colorMap: { [key: string]: string } = {
    'bg-red-500': '#EF4444',
    'bg-blue-500': '#3B82F6',
    'bg-green-500': '#10B981',
    'bg-purple-500': '#8B5CF6',
    'bg-orange-500': '#F97316',
    'bg-pink-500': '#EC4899',
    'bg-gray-500': '#6B7280',
  };

  const pieChartDataWithColors = categories.map((category) => ({
    name: category.name,
    value: category.amount,
    color: colorMap[category.color] || '#6B7280',
    percentage: category.percentage,
  }));

  // Prepare data for bar chart
  const barChartData = monthlyTrends.map((trend) => ({
    label: trend.month,
    value: trend.savings,
    color: '#10B981',
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Detailed insights into your spending patterns and financial trends
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Categories */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Spending by Category
            </h2>
          </div>

          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${category.color}`}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${category.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {category.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <PieChartComponent data={pieChartDataWithColors} size={280} />
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics
          </h2>
          <div className="flex items-center gap-2 mb-4">
            {['week', 'month', '6months', 'year'].map((range) => (
              <button
                key={range}
                onClick={() =>
                  setPredictionRange(range as typeof predictionRange)
                }
                className={`px-4 py-1 rounded-full font-medium text-sm transition-colors ${
                  predictionRange === range
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                }`}
              >
                {range === 'week'
                  ? 'Week'
                  : range === 'month'
                    ? 'Month'
                    : range === '6months'
                      ? '6 months'
                      : 'Year'}
              </button>
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6 w-full max-w-xl">
            <div className="mb-2 text-gray-700 dark:text-gray-300 font-medium">
              Expected income
            </div>
            <div
              className={`text-3xl font-bold mb-4 transition-colors ${selectedTextColor}`}
            >
              ${expectedIncome}
            </div>
            {/* Interactive Bar Graph */}
            <div className="flex items-end gap-2 h-32 w-full">
              {predictionData.map((d, idx) => {
                const isActive = idx === selectedPredictionIdx;
                const maxVal = Math.max(...predictionData.map((p) => p.value));
                return (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setSelectedPredictionIdx(idx)}
                    className="flex flex-col items-center justify-end h-full focus:outline-none"
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    <div
                      className={`w-full rounded-xl transition-all duration-300 ${
                        isActive
                          ? selectedBarColor
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      style={{
                        height: `${(d.value / maxVal) * 100}%`,
                        boxShadow: isActive ? '0 0 0 2px #a78bfa' : undefined,
                      }}
                    ></div>
                    <span
                      className={`mt-2 text-xs truncate ${
                        isActive
                          ? `font-bold ${selectedTextColor}`
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {d.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* Monthly Trends */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Monthly Trends
            </h2>
          </div>

          <div className="space-y-4">
            {monthlyTrends.map((trend, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {trend.month}
                </span>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-green-600 dark:text-green-400">
                    Income: ${trend.income.toLocaleString()}
                  </div>
                  <div className="text-red-600 dark:text-red-400">
                    Expenses: ${trend.expenses.toLocaleString()}
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">
                    Savings: ${trend.savings.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <BarChart data={barChartData} height={160} />
          </div>
        </div>

        {/* Financial Health Score */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Financial Health
            </h2>
          </div>

          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <div className="text-3xl font-bold text-white">85</div>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Excellent Score
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Keep up the great work!
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Savings Rate
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                28%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Debt-to-Income
              </span>
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                15%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Emergency Fund
              </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                6 months
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Credit Score
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                750
              </span>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Key Insights
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800 dark:text-green-300">
                  Positive Trend
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">
                Your savings rate increased by 15% compared to last month
              </p>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="font-medium text-orange-800 dark:text-orange-300">
                  Watch Out
                </span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-400">
                Food & drinks spending is 28% above your monthly budget
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-blue-800 dark:text-blue-300">
                  Recommendation
                </span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Consider setting up automatic transfers to boost your emergency
                fund
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 w-full overflow-x-auto">
        {/* Table Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="🔍 Search Anything..."
            className="px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium w-64"
            // Add search logic if needed
          />
          <select
            value={tableYear}
            onChange={(e) =>
              setTableYear(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={tableMonth}
            onChange={(e) => setTableMonth(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
          >
            <option value="">All Months</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={tableCategory}
            onChange={(e) => setTableCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
          >
            <option value="">All Categories</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={tableType}
            onChange={(e) => setTableType(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
          >
            <option value="">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <div className="flex items-center gap-3 mb-4">
            <button
              className="px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              onClick={() => setShowAddColumnModal(true)}
            >
              + Add Column
            </button>
            {/* Bulk Delete Button */}
            <button
              className="px-3 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              disabled={selectedRows.length === 0}
              onClick={handleBulkDelete}
            >
              Delete Selected
            </button>
          </div>
          <button className="ml-auto px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium border hover:bg-gray-200 dark:hover:bg-gray-700">
            Export
          </button>
        </div>
        {/* Add Column Modal */}
        {showAddColumnModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl w-full max-w-sm">
              <h3 className="text-lg font-bold mb-4">Add Column</h3>
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="Column name"
                className="w-full px-3 py-2 rounded-lg border mb-4"
              />
              <div className="flex gap-2 justify-end">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                  onClick={() => setShowAddColumnModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold"
                  onClick={handleAddColumn}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
        {editRowIdx !== null && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl w-full max-w-sm">
              <h3 className="text-lg font-bold mb-4">Edit Row</h3>
              {columns.map((col, i) => (
                <div key={i} className="mb-2">
                  <label className="block text-sm font-medium mb-1">
                    {col}
                  </label>
                  <input
                    type="text"
                    value={
                      editRowData[col.toLowerCase().replace(/ /g, '')] ?? ''
                    }
                    onChange={(e) =>
                      setEditRowData({
                        ...editRowData,
                        [col.toLowerCase().replace(/ /g, '')]: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border"
                  />
                </div>
              ))}
              <div className="flex gap-2 justify-end mt-4">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                  onClick={() => setEditRowIdx(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold"
                  onClick={handleSaveEditRow}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Table */}
        <table className="min-w-full text-sm dark:text-gray-100">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.length === predictionRows.length}
                  onChange={(e) =>
                    setSelectedRows(
                      e.target.checked
                        ? predictionRows.map((_, idx) => idx)
                        : []
                    )
                  }
                />
              </th>
              {columns.map((col, i) => (
                <th key={i} className="px-2 py-2 font-bold">
                  {col}
                </th>
              ))}
              <th className="px-2 py-2 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.slice(0, tableRowsToShow).map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(idx)}
                    onChange={(e) =>
                      setSelectedRows(
                        e.target.checked
                          ? [...selectedRows, idx]
                          : selectedRows.filter((i) => i !== idx)
                      )
                    }
                  />
                </td>
                {columns.map((col, i) => (
                  <td key={i} className="px-2 py-2">
                    {(row as Record<string, any>)[
                      col.toLowerCase().replace(/ /g, '')
                    ] ?? ''}
                  </td>
                ))}
                <td className="px-2 py-2 flex gap-2">
                  <button
                    className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold"
                    onClick={() => handleEditRow(idx)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 rounded bg-red-100 text-red-800 font-semibold"
                    onClick={() => handleDeleteRow(idx)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            onClick={() => setTableRowsToShow((prev) => prev + 20)}
            disabled={
              tableRowsToShow >=
              predictionRows.filter(
                (row) =>
                  (tableYear ? row.year === tableYear : true) &&
                  (tableMonth ? row.month === tableMonth : true) &&
                  (tableCategory ? row.category === tableCategory : true) &&
                  (tableType ? row.type === tableType : true)
              ).length
            }
          >
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};
