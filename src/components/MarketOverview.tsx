import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useMarketData } from '../hooks/useMarketData';
import { format } from 'date-fns';

export const MarketOverview: React.FC = () => {
  const { marketData, isLoading, lastUpdate, refreshData } = useMarketData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Market Overview</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span>{isLoading ? 'Updating...' : 'Live Data'}</span>
          </div>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">Symbol</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-slate-600">Price</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-slate-600">Change</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-slate-600">%</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((item) => (
              <tr key={item.symbol} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-2">
                  <div>
                    <div className="font-semibold text-slate-900">{item.symbol}</div>
                    <div className="text-sm text-slate-500 truncate">{item.name}</div>
                  </div>
                </td>
                <td className="text-right py-4 px-2 font-semibold text-slate-900">
                  ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className={`text-right py-4 px-2 font-semibold ${
                  item.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                </td>
                <td className={`text-right py-4 px-2 font-semibold ${
                  item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </td>
                <td className="py-4 px-2">
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
      
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center text-xs text-slate-500">
          <span>Last updated: {format(lastUpdate, 'HH:mm:ss')}</span>
          <span>Data refreshes every 5 seconds</span>
        </div>
      </div>
    </div>
  );
};