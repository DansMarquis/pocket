import React, { useState } from 'react';

interface PieChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;
  
  let cumulativePercentage = 0;
  
  const createArcPath = (startAngle: number, endAngle: number, outerRadius: number) => {
    const start = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const end = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((segment, index) => {
          const startAngle = cumulativePercentage * 3.6; // Convert percentage to degrees
          const endAngle = (cumulativePercentage + segment.percentage) * 3.6;
          const currentRadius = hoveredSegment === index ? radius + 5 : radius;
          
          cumulativePercentage += segment.percentage;
          
          return (
            <path
              key={index}
              d={createArcPath(startAngle, endAngle, currentRadius)}
              fill={segment.color}
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
              opacity={hoveredSegment === null || hoveredSegment === index ? 1 : 0.7}
            />
          );
        })}
        
        {/* Center circle for donut effect */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.6}
          fill="white"
          className="dark:fill-gray-800"
        />
        
        {/* Center text */}
        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          className="text-sm font-semibold fill-current text-gray-900 dark:text-white transform rotate-90"
          style={{ transformOrigin: `${centerX}px ${centerY}px` }}
        >
          Total
        </text>
        <text
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          className="text-xs fill-current text-gray-600 dark:text-gray-400 transform rotate-90"
          style={{ transformOrigin: `${centerX}px ${centerY}px` }}
        >
          ${data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
        </text>
      </svg>
    </div>
  );
};