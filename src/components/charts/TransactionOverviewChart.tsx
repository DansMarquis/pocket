import React, { useState, useRef } from 'react';

interface TransactionData {
  date: string;
  totalPayment: number;
  previousPeriod: number;
}

interface TransactionOverviewChartProps {
  data: TransactionData[];
}

export const TransactionOverviewChart: React.FC<TransactionOverviewChartProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ 
    index: number; 
    totalPayment: number; 
    previousPeriod: number; 
    date: string 
  } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 400;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Get all values to determine scale
  const allValues = data.flatMap(d => [d.totalPayment, d.previousPeriod]);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const valueRange = maxValue - minValue;

  // Create scales
  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;
  const yScale = (value: number) => chartHeight - ((value - minValue) / valueRange) * chartHeight;

  // Generate paths
  const totalPaymentPath = data.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d.totalPayment);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  const previousPeriodPath = data.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d.previousPeriod);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  // Generate area paths
  const totalPaymentArea = `${totalPaymentPath} L ${xScale(data.length - 1)} ${chartHeight} L ${xScale(0)} ${chartHeight} Z`;
  const previousPeriodArea = `${previousPeriodPath} L ${xScale(data.length - 1)} ${chartHeight} L ${xScale(0)} ${chartHeight} Z`;

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - padding.left;

    // Find closest data point
    const index = Math.round((x / chartWidth) * (data.length - 1));
    if (index >= 0 && index < data.length) {
      setHoveredPoint({
        index,
        totalPayment: data[index].totalPayment,
        previousPeriod: data[index].previousPeriod,
        date: data[index].date
      });
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="relative">
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
        {[0, 1000, 2000, 3000, 4000, 5000].map((tick) => {
          if (tick < minValue || tick > maxValue) return null;
          return (
            <line
              key={tick}
              x1={padding.left}
              y1={padding.top + yScale(tick)}
              x2={padding.left + chartWidth}
              y2={padding.top + yScale(tick)}
              stroke="#F3F4F6"
              strokeWidth="1"
              className="dark:stroke-gray-600"
            />
          );
        })}

        {/* Previous Period Area */}
        <path
          d={previousPeriodArea}
          fill="#3B82F6"
          fillOpacity="0.1"
          transform={`translate(${padding.left}, ${padding.top})`}
        />

        {/* Total Payment Area */}
        <path
          d={totalPaymentArea}
          fill="#F97316"
          fillOpacity="0.1"
          transform={`translate(${padding.left}, ${padding.top})`}
        />

        {/* Previous Period Line */}
        <path
          d={previousPeriodPath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`translate(${padding.left}, ${padding.top})`}
        />

        {/* Total Payment Line */}
        <path
          d={totalPaymentPath}
          fill="none"
          stroke="#F97316"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`translate(${padding.left}, ${padding.top})`}
        />

        {/* Data points */}
        {data.map((d, i) => (
          <g key={i}>
            <circle
              cx={padding.left + xScale(i)}
              cy={padding.top + yScale(d.totalPayment)}
              r={hoveredPoint?.index === i ? "5" : "3"}
              fill="#F97316"
              className="transition-all duration-200"
            />
            <circle
              cx={padding.left + xScale(i)}
              cy={padding.top + yScale(d.previousPeriod)}
              r={hoveredPoint?.index === i ? "5" : "3"}
              fill="#3B82F6"
              className="transition-all duration-200"
            />
          </g>
        ))}

        {/* Vertical line for hovered point */}
        {hoveredPoint && (
          <line
            x1={padding.left + xScale(hoveredPoint.index)}
            y1={padding.top}
            x2={padding.left + xScale(hoveredPoint.index)}
            y2={padding.top + chartHeight}
            stroke="#6B7280"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        )}

        {/* Y-axis labels */}
        {[0, 1000, 2000, 3000, 4000, 5000].map((tick) => {
          if (tick < minValue || tick > maxValue) return null;
          return (
            <text
              key={tick}
              x={padding.left - 10}
              y={padding.top + yScale(tick) + 4}
              className="text-xs fill-current text-gray-600 dark:text-gray-400"
              textAnchor="end"
            >
              ${tick >= 1000 ? `${tick/1000},000` : tick}
            </text>
          );
        })}

        {/* X-axis labels */}
        <text
          x={padding.left}
          y={height - 10}
          className="text-xs fill-current text-gray-600 dark:text-gray-400"
          textAnchor="start"
        >
          01 January
        </text>
        <text
          x={padding.left + chartWidth}
          y={height - 10}
          className="text-xs fill-current text-gray-600 dark:text-gray-400"
          textAnchor="end"
        >
          31 January
        </text>
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 80,
          }}
        >
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {hoveredPoint.date}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Payment</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                ${hoveredPoint.totalPayment.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Previous Period</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                ${hoveredPoint.previousPeriod.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};