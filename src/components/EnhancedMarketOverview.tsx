import React, { useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useMarketData } from '../hooks/useMarketData';
import { format } from 'date-fns';

export const EnhancedMarketOverview: React.FC = () => {
  const { marketData, isLoading, error, lastUpdate, refreshData } = useMarketData();
  const [showTechnicals, setShowTechnicals] = useState(false);
  const [sortBy, setSortBy] = useState<'symbol' | 'change' | 'volume'>('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedData = [...marketData].sort((a, b) => {
    let aValue: number | string = a[sortBy];
    let bValue: number | string = b[sortBy];
    
    if (sortBy === 'symbol') {
      aValue = a.symbol;
      bValue = b.symbol;
    } else if (sortBy === 'change') {
      aValue = a.changePercent;
      bValue = b.changePercent;
    } else if (sortBy === 'volume') {
      aValue = a.volume;
      bValue = b.volume;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (column: 'symbol' | 'change' | 'volume') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Error Loading Market Data</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
        <button
          onClick={refreshData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Enhanced Market Overview</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowTechnicals(!showTechnicals)}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
            >
              {showTechnicals ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showTechnicals ? 'Hide' : 'Show'} Technicals</span>
            </button>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span>{isLoading ? 'Updating...' : 'Live Data'}</span>
            </div>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="p-2 text-slate-500 hover:text-slate-700 rounded-md hover:bg-slate-100 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th 
                className="text-left py-3 px-4 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('symbol')}
              >
                Symbol {sortBy === 'symbol' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Price</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">High/Low</th>
              <th 
                className="text-right py-3 px-4 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('change')}
              >
                Change {sortBy === 'change' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-right py-3 px-4 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('volume')}
              >
                Volume {sortBy === 'volume' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              {showTechnicals && (
                <>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">RSI</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">MACD</th>
                </>
              )}
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={item.symbol} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-semibold text-slate-900">{item.symbol}</div>
                    <div className="text-sm text-slate-500 truncate max-w-32">{item.name}</div>
                  </div>
                </td>
                <td className="text-right py-4 px-4">
                  <div className="font-semibold text-slate-900">
                    ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-slate-500">
                    Prev: ${item.previousClose.toFixed(2)}
                  </div>
                </td>
                <td className="text-right py-4 px-4">
                  <div className="text-sm">
                    <div className="text-green-600">${item.high.toFixed(2)}</div>
                    <div className="text-red-600">${item.low.toFixed(2)}</div>
                  </div>
                </td>
                <td className={`text-right py-4 px-4 font-semibold ${
                  item.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <div>
                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                  </div>
                  <div className="text-sm">
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </div>
                </td>
                <td className="text-right py-4 px-4">
                  <div className="text-sm font-medium text-slate-900">
                    {item.volume > 0 ? (item.volume / 1000000).toFixed(1) + 'M' : 'N/A'}
                  </div>
                </td>
                {showTechnicals && (
                  <>
                    <td className="text-right py-4 px-4">
                      <div className={`text-sm font-medium ${
                        item.technicals.rsi > 70 ? 'text-red-600' : 
                        item.technicals.rsi < 30 ? 'text-green-600' : 'text-slate-600'
                      }`}>
                        {item.technicals.rsi.toFixed(1)}
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className={`text-sm font-medium ${
                        item.technicals.macd > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.technicals.macd.toFixed(2)}
                      </div>
                    </td>
                  </>
                )}
                <td className="py-4 px-4">
                  {item.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex justify-between items-center text-xs text-slate-500">
          <span>Last updated: {format(lastUpdate, 'HH:mm:ss')}</span>
          <span>Data refreshes every 5 seconds • {marketData.length} symbols tracked</span>
        </div>
      </div>
    </div>
  );
};