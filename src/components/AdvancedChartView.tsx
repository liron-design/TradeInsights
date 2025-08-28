import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from 'recharts';
import { realTimeDataService, RealTimeDataPoint } from '../services/realTimeDataService';
import { format } from 'date-fns';
import { TrendingUp, BarChart3, Activity, Volume2, Zap } from 'lucide-react';

interface AdvancedChartViewProps {
  symbol: string;
  height?: number;
}

interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume: number;
  bid: number;
  ask: number;
  spread: number;
  time: string;
}

export const AdvancedChartView: React.FC<AdvancedChartViewProps> = ({
  symbol,
  height = 400
}) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [chartType, setChartType] = useState<'line' | 'area' | 'candlestick' | 'volume'>('area');
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h'>('1m');
  const [isLive, setIsLive] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<RealTimeDataPoint | null>(null);

  useEffect(() => {
    const unsubscribe = realTimeDataService.subscribe(
      `realtime:${symbol}`,
      (newData: RealTimeDataPoint) => {
        setCurrentPrice(newData);
        
        if (isLive) {
          const chartPoint: ChartDataPoint = {
            ...newData,
            time: format(new Date(newData.timestamp), 'HH:mm:ss')
          };

          setData(prevData => {
            const newDataArray = [...prevData, chartPoint];
            // Keep last 100 points for performance
            return newDataArray.slice(-100);
          });
        }
      }
    );

    return unsubscribe;
  }, [symbol, isLive]);

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'price' || name === 'bid' || name === 'ask') {
      return [`$${value.toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)];
    }
    if (name === 'volume') {
      return [value.toLocaleString(), 'Volume'];
    }
    if (name === 'spread') {
      return [`$${value.toFixed(4)}`, 'Spread'];
    }
    return [value, name];
  };

  const priceChange = data.length > 1 ? 
    data[data.length - 1].price - data[data.length - 2].price : 0;
  const priceChangePercent = data.length > 1 ? 
    (priceChange / data[data.length - 2].price) * 100 : 0;

  const renderChart = () => {
    switch (chartType) {
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              stroke="#64748b"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        );

      case 'line':
        return (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              stroke="#64748b"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6' }}
            />
            <Line
              type="monotone"
              dataKey="bid"
              stroke="#10b981"
              strokeWidth={1}
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="ask"
              stroke="#ef4444"
              strokeWidth={1}
              dot={false}
              strokeDasharray="5 5"
            />
          </LineChart>
        );

      case 'volume':
        return (
          <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              stroke="#64748b"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis 
              yAxisId="price"
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <YAxis 
              yAxisId="volume"
              orientation="right"
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
            />
            <Area
              yAxisId="price"
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill="#8b5cf6"
              opacity={0.6}
            />
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </ComposedChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{symbol} Live Chart</h3>
          <div className="flex items-center space-x-4 mt-1">
            {currentPrice && (
              <>
                <span className="text-2xl font-bold text-slate-900">
                  ${currentPrice.price.toFixed(2)}
                </span>
                <span className={`flex items-center space-x-1 text-sm font-medium ${
                  priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${priceChange < 0 ? 'rotate-180' : ''}`} />
                  <span>
                    {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} 
                    ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                  </span>
                </span>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <span>Bid: ${currentPrice.bid}</span>
                  <span>Ask: ${currentPrice.ask}</span>
                  <span>Spread: ${currentPrice.spread.toFixed(4)}</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
            <span className="text-sm text-slate-600">{isLive ? 'Live' : 'Paused'}</span>
            <button
              onClick={() => setIsLive(!isLive)}
              className="p-1 text-slate-500 hover:text-slate-700 rounded"
            >
              {isLive ? <Activity className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="flex bg-slate-100 rounded-lg p-1">
            {(['1m', '5m', '15m', '1h'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeframe === tf
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'line' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'area' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('volume')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'volume' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>

      {data.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-pulse" />
            <p className="text-slate-500">Connecting to live data feed...</p>
          </div>
        </div>
      )}
    </div>
  );
};