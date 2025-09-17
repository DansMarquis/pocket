import React, { useState } from 'react';

interface BarChartData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 200 }) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = 40;
  const barSpacing = 20;
  const width = data.length * (barWidth + barSpacing) - barSpacing + 80; // 80 for padding
  const padding = { top: 20, right: 40, bottom: 40, left: 40 };
  const chartHeight = height - padding.top - padding.bottom;

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="min-w-full">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding.top + chartHeight * (1 - ratio);
          return (
            <line
              key={ratio}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#F3F4F6"
              strokeWidth="1"
              className="dark:stroke-gray-600"
            />
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding.left + index * (barWidth + barSpacing);
          const y = padding.top + chartHeight - barHeight;
          const isHovered = hoveredBar === index;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color}
                className="transition-all duration-300 cursor-pointer"
                opacity={isHovered ? 1 : 0.8}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              />
              
              {/* Value label on hover */}
              {isHovered && (
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-current text-gray-900 dark:text-white"
                >
                  {item.value.toLocaleString()}
                </text>
              )}
              
              {/* X-axis labels */}
              <text
                x={x + barWidth / 2}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-current text-gray-600 dark:text-gray-400"
              >
                {item.label}
              </text>
            </g>
          );
        })}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const value = Math.round(maxValue * ratio);
          const y = padding.top + chartHeight * (1 - ratio);
          return (
            <text
              key={ratio}
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              className="text-xs fill-current text-gray-600 dark:text-gray-400"
            >
              {value >= 1000 ? `${value/1000}K` : value}
            </text>
          );
        })}
      </svg>
    </div>
  );
};