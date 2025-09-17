import React, { useState, useRef, useEffect } from 'react';
import { Maximize2 } from 'lucide-react';
import { CustomDateRangeModal } from '../CustomDateRangeModal';

interface CashFlowData {
  month: string;
  income: number;
  expense: number;
  saving: number;
}
type CategoryType =
  | 'income'
  | 'expense'
  | 'saving'
  | 'transfer'
  | 'saving'
  | 'subscription'
  | 'all';

interface CashFlowChartProps {
  data: CashFlowData[];
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  data,
  selectedCategory,
  onCategoryChange,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    value: number;
    month: string;
    category?: CategoryType;
  } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const [isCustomDateModalOpen, setCustomDateModalOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const handleApplyCustomDate = (start: string, end: string) => {
    setCustomDateRange({ start, end });
    setCustomDateModalOpen(false);
    // TODO: Filter your data based on start and end dates
  };
  const width = 800;
  const height = 300;
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const filteredData = customDateRange
    ? data.filter((d) => {
        const monthDate = new Date(`${d.month} 1, 2025`);
        const startDate = new Date(customDateRange.start);
        const endDate = new Date(customDateRange.end);
        return monthDate >= startDate && monthDate <= endDate;
      })
    : data;

  // Get values for selected category
  let values: number[] = [];
  if (selectedCategory === 'all') {
    values = filteredData.flatMap((d) => [d.income, d.expense, d.saving]);
  } else if (
    selectedCategory === 'income' ||
    selectedCategory === 'expense' ||
    selectedCategory === 'saving'
  ) {
    values = filteredData.map((d) => d[selectedCategory]);
  } else {
    values = [];
  }
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const valueRange = maxValue - minValue;
  const average =
    selectedCategory === 'all'
      ? 0 // Don't show average line for "all"
      : values.reduce((sum, val) => sum + val, 0) / values.length;

  // Create scales
  const xScale = (index: number) =>
    (index / (filteredData.length - 1)) * chartWidth;
  const yScale = (value: number) =>
    chartHeight - ((value - minValue) / valueRange) * chartHeight;

  // Generate path for the line
  const linePath = filteredData
    .map((d, i) => {
      const x = xScale(i);
      const y = yScale(
        selectedCategory === 'all'
          ? d.income + d.expense + d.saving
          : selectedCategory === 'income'
          ? d.income
          : selectedCategory === 'expense'
          ? d.expense
          : selectedCategory === 'saving'
          ? d.saving
          : 0
      );
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Generate area path
  const areaPath = `${linePath} L ${xScale(filteredData.length - 1)} ${chartHeight} L ${xScale(0)} ${chartHeight} Z`;

  // Y-axis ticks
  const yTicks = [0, 1000, 2000, 3000, 4000, 5000];
  const visibleYTicks = yTicks.filter(
    (tick) => tick >= minValue && tick <= maxValue
  );

  const categoryList: CategoryType[] = [
    'income',
    'expense',
    'transfer',
    'saving',
    'subscription',
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'income':
        return { line: '#3B82F6', area: '#3B82F6', bg: 'bg-blue-500' };
      case 'expense':
        return { line: '#F97316', area: '#F97316', bg: 'bg-orange-500' };
      case 'saving':
        return { line: '#10B981', area: '#10B981', bg: 'bg-green-500' };
      default:
        return { line: '#6B7280', area: '#6B7280', bg: 'bg-gray-500' };
    }
  };

  const colors = getCategoryColor(selectedCategory);

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || selectedCategory === 'all') return; // <-- Prevent tooltip for "all"

    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - padding.left;
    const index = Math.round((x / chartWidth) * (filteredData.length - 1));
    if (index >= 0 && index < filteredData.length) {
      setHoveredPoint({
        index,
        value:
          selectedCategory === 'income'
            ? filteredData[index].income
            : selectedCategory === 'expense'
            ? filteredData[index].expense
            : selectedCategory === 'saving'
            ? filteredData[index].saving
            : 0,
        month: filteredData[index].month,
        category: selectedCategory,
      });
      setMousePosition({
        x: rect.left + padding.left + xScale(index),
        y:
          rect.top +
          padding.top +
          yScale(
            selectedCategory === 'income'
              ? filteredData[index].income
              : selectedCategory === 'expense'
              ? filteredData[index].expense
              : selectedCategory === 'saving'
              ? filteredData[index].saving
              : 0
          ),
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Cash Flow
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            $
            {filteredData
              .reduce((sum, d) => {
                switch (selectedCategory) {
                  case 'income':
                    return sum + d.income;
                  case 'expense':
                    return sum + d.expense;
                  case 'saving':
                    return sum + d.saving;
                  case 'all':
                    return sum + d.income + d.expense + d.saving;
                  default:
                    return sum;
                }
              }, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium flex items-center space-x-1"
            onClick={() => setCustomDateModalOpen(true)}
          >
            <span>+ Custom Date</span>
          </button>
          <button
            className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm"
            onClick={() => {
              const now = new Date();
              const year = now.getFullYear();
              const start = `${year}-01-01`;
              const end = `${year}-12-31`;
              setCustomDateRange({ start, end });
            }}
          >
            1Y
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="flex space-x-1 mb-6">
        {(
          [
            'all',
            'income',
            'expense',
            'transfer',
            'saving',
            'subscription',
          ] as const
        ).map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {category === 'all'
              ? 'All'
              : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl p-4">
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines */}
          {visibleYTicks.map((tick) => (
            <line
              key={tick}
              x1={padding.left}
              y1={padding.top + yScale(tick)}
              x2={padding.left + chartWidth}
              y2={padding.top + yScale(tick)}
              stroke="#E5E7EB"
              strokeWidth="1"
              className="dark:stroke-gray-600"
            />
          ))}

          {selectedCategory !== 'all' && (
            <>
              {/* Average line */}
              <line
                x1={padding.left}
                y1={padding.top + yScale(average)}
                x2={padding.left + chartWidth}
                y2={padding.top + yScale(average)}
                stroke={colors.line}
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.6"
              />
              <text
                x={padding.left - 10}
                y={padding.top + yScale(average) - 5}
                className="text-xs fill-current text-gray-600 dark:text-gray-400"
                textAnchor="end"
              >
                Avg
              </text>

              {/* Area */}
              <path
                d={areaPath}
                fill={colors.area}
                fillOpacity="0.1"
                transform={`translate(${padding.left}, ${padding.top})`}
              />
            </>
          )}

          {['income', 'expense', 'transfer', 'saving', 'subscription'].map(
            (category) => {
              if (selectedCategory === 'all' || selectedCategory === category) {
                // Generate line path for this category
                const linePath = filteredData
                  .map((d, i) => {
                    const x = xScale(i);
                    const y = yScale(
                      category === 'income'
                        ? d.income
                        : category === 'expense'
                        ? d.expense
                        : category === 'saving'
                        ? d.saving
                        : 0
                    );
                    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                  })
                  .join(' ');

                return (
                  <React.Fragment key={category}>
                    {/* Line for category */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke={getCategoryColor(category).line}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      transform={`translate(${padding.left}, ${padding.top})`}
                      opacity={selectedCategory === 'all' ? 0.8 : 1}
                    />
                    {/* Data points for category */}
                    {filteredData.map((d, i) => (
                      <circle
                        key={category + i}
                        cx={padding.left + xScale(i)}
                        cy={
                          padding.top +
                          yScale(
                            category === 'income'
                              ? d.income
                              : category === 'expense'
                              ? d.expense
                              : category === 'saving'
                              ? d.saving
                              : 0
                          )
                        }
                        r={
                          hoveredPoint?.index === i &&
                          hoveredPoint?.category === category
                            ? 6
                            : 4
                        }
                        fill={getCategoryColor(category).line}
                        className="transition-all duration-200 cursor-pointer"
                        onMouseEnter={(e) => {
                          setHoveredPoint({
                            index: i,
                            value:
                              category === 'income'
                                ? d.income
                                : category === 'expense'
                                ? d.expense
                                : category === 'saving'
                                ? d.saving
                                : 0,
                            month: d.month,
                            category: category as CategoryType,
                          });
                          const rect = svgRef.current?.getBoundingClientRect();
                          if (rect) {
                            setMousePosition({
                              x: rect.left + padding.left + xScale(i),
                              y: rect.top + padding.top + yScale(
                                category === 'income'
                                  ? d.income
                                  : category === 'expense'
                                  ? d.expense
                                  : category === 'saving'
                                  ? d.saving
                                  : 0
                              ),
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    ))}
                  </React.Fragment>
                );
              }
              return null;
            }
          )}

          {/* Highlighted bar for hovered point */}
          {hoveredPoint && (
            <rect
              x={padding.left + xScale(hoveredPoint.index) - 15}
              y={padding.top}
              width="30"
              height={chartHeight}
              fill={colors.area}
              fillOpacity="0.2"
            />
          )}

          {/* Y-axis labels */}
          {visibleYTicks.map((tick) => (
            <text
              key={tick}
              x={padding.left - 10}
              y={padding.top + yScale(tick) + 4}
              className="text-xs fill-current text-gray-600 dark:text-gray-400"
              textAnchor="end"
            >
              ${tick >= 1000 ? `${tick / 1000}K` : tick}
            </text>
          ))}

          {/* X-axis labels */}
          {filteredData.map((d, i) => (
            <text
              key={i}
              x={padding.left + xScale(i)}
              y={height - 20}
              className="text-xs fill-current text-gray-600 dark:text-gray-400"
              textAnchor="middle"
            >
              {d.month}
            </text>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 pointer-events-none"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 60,
            }}
          >
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {hoveredPoint.month}, 2025
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {selectedCategory}
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              ${hoveredPoint.value.toLocaleString()}
            </div>
          </div>
        )}
      </div>
      <CustomDateRangeModal
        isOpen={isCustomDateModalOpen}
        onClose={() => setCustomDateModalOpen(false)}
        onApply={handleApplyCustomDate}
        initialStartDate={
          customDateRange?.start || `${new Date().getFullYear()}-01-01`
        }
        initialEndDate={
          customDateRange?.end || `${new Date().getFullYear()}-12-31`
        }
      />
    </div>
  );
};
