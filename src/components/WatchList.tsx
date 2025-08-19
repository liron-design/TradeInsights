import React, { useState } from 'react';
import { Plus, Star, TrendingUp, TrendingDown } from 'lucide-react';

interface WatchListItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  starred: boolean;
}

export const WatchList: React.FC = () => {
  const [watchList, setWatchList] = useState<WatchListItem[]>([
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 128.45, change: -1.23, changePercent: -0.95, starred: true },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 242.87, change: 5.67, changePercent: 2.39, starred: true },
    { symbol: 'AAPL', name: 'Apple Inc', price: 191.23, change: 1.45, changePercent: 0.76, starred: false },
    { symbol: 'PLTR', name: 'Palantir Tech', price: 45.32, change: 2.1, changePercent: 4.86, starred: true },
    { symbol: 'CRSP', name: 'CRISPR Therapeutics', price: 67.89, change: -0.45, changePercent: -0.66, starred: false }
  ]);

  const toggleStar = (symbol: string) => {
    setWatchList(prev => prev.map(item => 
      item.symbol === symbol ? { ...item, starred: !item.starred } : item
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Watch List</h3>
        <button className="p-2 text-blue-600 hover:text-blue-700 rounded-md hover:bg-blue-50 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {watchList.map((item) => (
          <div key={item.symbol} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleStar(item.symbol)}
                className={`p-1 rounded ${item.starred ? 'text-yellow-500' : 'text-slate-300'} hover:text-yellow-500 transition-colors`}
              >
                <Star className="w-4 h-4" fill={item.starred ? 'currentColor' : 'none'} />
              </button>
              <div>
                <div className="font-semibold text-slate-900">{item.symbol}</div>
                <div className="text-xs text-slate-500 truncate max-w-20">{item.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-900">${item.price}</div>
              <div className={`text-xs flex items-center justify-end space-x-1 ${
                item.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
          Add Custom Ticker
        </button>
      </div>
    </div>
  );
};