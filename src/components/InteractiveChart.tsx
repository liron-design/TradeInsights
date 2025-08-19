import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';

interface ChartDataPoint {
  timestamp: string;
  price: number;
  volume?: number;
}

interface InteractiveChartProps {
  data: ChartDataPoint[];
  title: string;
  symbol: string;
  type?: 'line' | 'area';
  height?: number;
  showVolume?: boolean;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  title,
  symbol,
  type = 'area',
  height = 300,
  showVolume = false
}) => {
  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'price') {
      return [`$${value.toLocaleString()}`, 'Price'];
    }
    if (name === 'volume') {
      return [value.toLocaleString(), 'Volume'];
    }
    return [value, name];
  };

  const formatXAxisLabel = (tickItem: string) => {
    return format(new Date(tickItem), 'HH:mm');
  };

  const ChartComponent = type === 'area' ? AreaChart : LineChart;
  const DataComponent = type === 'area' ? Area : Line;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">{symbol} • Last 24 hours</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-slate-500">Live</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxisLabel}
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            formatter={formatTooltipValue}
            labelFormatter={(label) => format(new Date(label), 'MMM dd, HH:mm')}
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#f8fafc'
            }}
          />
          {type === 'area' ? (
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6' }}
            />
          )}
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};