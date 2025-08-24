import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, Target } from 'lucide-react';

interface PortfolioPosition {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
  allocation: number;
}

export const PortfolioTracker: React.FC = () => {
  const [positions, setPositions] = useState<PortfolioPosition[]>([
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp',
      shares: 50,
      avgCost: 120.00,
      currentPrice: 128.45,
      value: 6422.50,
      gainLoss: 422.50,
      gainLossPercent: 7.04,
      allocation: 35.2
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc',
      shares: 25,
      avgCost: 235.00,
      currentPrice: 242.87,
      value: 6071.75,
      gainLoss: 196.75,
      gainLossPercent: 3.35,
      allocation: 33.3
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc',
      shares: 30,
      avgCost: 185.00,
      currentPrice: 191.23,
      value: 5736.90,
      gainLoss: 186.90,
      gainLossPercent: 3.37,
      allocation: 31.5
    }
  ]);

  const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0);
  const totalGainLoss = positions.reduce((sum, pos) => sum + pos.gainLoss, 0);
  const totalGainLossPercent = (totalGainLoss / (totalValue - totalGainLoss)) * 100;

  const pieData = positions.map(pos => ({
    name: pos.symbol,
    value: pos.allocation,
    color: pos.symbol === 'NVDA' ? '#10b981' : pos.symbol === 'TSLA' ? '#3b82f6' : '#8b5cf6'
  }));

  const performanceData = positions.map(pos => ({
    symbol: pos.symbol,
    performance: pos.gainLossPercent
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Portfolio Tracker</h3>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">
              ${totalValue.toLocaleString()}
            </div>
            <div className={`text-sm font-medium flex items-center ${
              totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalGainLoss >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)} ({totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Asset Allocation</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Performance</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performanceData}>
              <XAxis dataKey="symbol" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="performance" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        {positions.map((position) => (
          <div key={position.symbol} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div>
                <div className="font-semibold text-slate-900">{position.symbol}</div>
                <div className="text-sm text-slate-500">{position.shares} shares @ ${position.avgCost}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="font-semibold text-slate-900">${position.value.toLocaleString()}</div>
                <div className="text-sm text-slate-500">${position.currentPrice}</div>
              </div>
              
              <div className={`text-right font-medium ${
                position.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <div className="flex items-center">
                  {position.gainLoss >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {position.gainLoss >= 0 ? '+' : ''}${position.gainLoss.toFixed(2)}
                </div>
                <div className="text-sm">
                  {position.gainLossPercent >= 0 ? '+' : ''}{position.gainLossPercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-sm text-slate-600">Total Value</div>
          <div className="font-bold text-slate-900">${totalValue.toLocaleString()}</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Percent className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-sm text-slate-600">Total Return</div>
          <div className={`font-bold ${totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-sm text-slate-600">Positions</div>
          <div className="font-bold text-slate-900">{positions.length}</div>
        </div>
      </div>
    </div>
  );
};