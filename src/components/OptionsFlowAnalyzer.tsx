import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { realTimeDataService, OptionsFlow } from '../services/realTimeDataService';
import { TrendingUp, TrendingDown, Target, Activity } from 'lucide-react';

interface OptionsFlowAnalyzerProps {
  symbol: string;
}

interface FlowSummary {
  totalCallVolume: number;
  totalPutVolume: number;
  putCallRatio: number;
  avgImpliedVol: number;
  netGamma: number;
  netDelta: number;
}

export const OptionsFlowAnalyzer: React.FC<OptionsFlowAnalyzerProps> = ({ symbol }) => {
  const [optionsFlow, setOptionsFlow] = useState<OptionsFlow[]>([]);
  const [flowSummary, setFlowSummary] = useState<FlowSummary>({
    totalCallVolume: 0,
    totalPutVolume: 0,
    putCallRatio: 0,
    avgImpliedVol: 0,
    netGamma: 0,
    netDelta: 0
  });

  useEffect(() => {
    const unsubscribe = realTimeDataService.subscribe(
      `options:${symbol}`,
      (newFlow: OptionsFlow) => {
        setOptionsFlow(prev => {
          const updated = [...prev, newFlow];
          // Keep last 50 flows for performance
          const recent = updated.slice(-50);
          
          // Calculate summary statistics
          const callVolume = recent.filter(f => f.type === 'call').reduce((sum, f) => sum + f.volume, 0);
          const putVolume = recent.filter(f => f.type === 'put').reduce((sum, f) => sum + f.volume, 0);
          const avgIV = recent.reduce((sum, f) => sum + f.impliedVolatility, 0) / recent.length;
          const netGamma = recent.reduce((sum, f) => sum + f.gamma, 0);
          const netDelta = recent.reduce((sum, f) => sum + f.delta, 0);

          setFlowSummary({
            totalCallVolume: callVolume,
            totalPutVolume: putVolume,
            putCallRatio: putVolume / (callVolume || 1),
            avgImpliedVol: avgIV,
            netGamma,
            netDelta
          });

          return recent;
        });
      }
    );

    return unsubscribe;
  }, [symbol]);

  const strikeData = optionsFlow.reduce((acc, flow) => {
    const existing = acc.find(item => item.strike === flow.strike);
    if (existing) {
      if (flow.type === 'call') {
        existing.callVolume += flow.volume;
      } else {
        existing.putVolume += flow.volume;
      }
    } else {
      acc.push({
        strike: flow.strike,
        callVolume: flow.type === 'call' ? flow.volume : 0,
        putVolume: flow.type === 'put' ? flow.volume : 0
      });
    }
    return acc;
  }, [] as Array<{ strike: number; callVolume: number; putVolume: number }>);

  const volumeDistribution = [
    { name: 'Calls', value: flowSummary.totalCallVolume, color: '#10b981' },
    { name: 'Puts', value: flowSummary.totalPutVolume, color: '#ef4444' }
  ];

  const getSentimentColor = (ratio: number) => {
    if (ratio < 0.7) return 'text-green-600'; // Bullish
    if (ratio > 1.3) return 'text-red-600'; // Bearish
    return 'text-blue-600'; // Neutral
  };

  const getSentimentLabel = (ratio: number) => {
    if (ratio < 0.7) return 'Bullish';
    if (ratio > 1.3) return 'Bearish';
    return 'Neutral';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-slate-900">Options Flow: {symbol}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-500">Live Flow</span>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-slate-900">
            {flowSummary.putCallRatio.toFixed(2)}
          </div>
          <div className={`text-sm font-medium ${getSentimentColor(flowSummary.putCallRatio)}`}>
            P/C Ratio - {getSentimentLabel(flowSummary.putCallRatio)}
          </div>
        </div>

        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-slate-900">
            {(flowSummary.avgImpliedVol * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-slate-600">Avg IV</div>
        </div>

        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className={`text-2xl font-bold ${flowSummary.netDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {flowSummary.netDelta >= 0 ? '+' : ''}{flowSummary.netDelta.toFixed(2)}
          </div>
          <div className="text-sm text-slate-600">Net Delta</div>
        </div>

        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className={`text-2xl font-bold ${flowSummary.netGamma >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {flowSummary.netGamma >= 0 ? '+' : ''}{flowSummary.netGamma.toFixed(3)}
          </div>
          <div className="text-sm text-slate-600">Net Gamma</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume by Strike */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Volume by Strike</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={strikeData.slice(-10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="strike" 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `${(value as number).toLocaleString()}`,
                  name === 'callVolume' ? 'Call Volume' : 'Put Volume'
                ]}
                labelFormatter={(label) => `Strike: $${label}`}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }}
              />
              <Bar dataKey="callVolume" fill="#10b981" name="callVolume" />
              <Bar dataKey="putVolume" fill="#ef4444" name="putVolume" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Call/Put Distribution */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Call/Put Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={volumeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {volumeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [(value as number).toLocaleString(), 'Volume']}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Calls ({flowSummary.totalCallVolume.toLocaleString()})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Puts ({flowSummary.totalPutVolume.toLocaleString()})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Flow Table */}
      <div className="mt-6">
        <h4 className="font-semibold text-slate-900 mb-4">Recent Options Flow</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-2 px-3 font-medium text-slate-600">Strike</th>
                <th className="text-left py-2 px-3 font-medium text-slate-600">Type</th>
                <th className="text-right py-2 px-3 font-medium text-slate-600">Volume</th>
                <th className="text-right py-2 px-3 font-medium text-slate-600">IV</th>
                <th className="text-right py-2 px-3 font-medium text-slate-600">Delta</th>
                <th className="text-right py-2 px-3 font-medium text-slate-600">Gamma</th>
              </tr>
            </thead>
            <tbody>
              {optionsFlow.slice(-10).map((flow, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="py-2 px-3 font-medium">${flow.strike}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      flow.type === 'call' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {flow.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-right py-2 px-3">{flow.volume.toLocaleString()}</td>
                  <td className="text-right py-2 px-3">{(flow.impliedVolatility * 100).toFixed(1)}%</td>
                  <td className={`text-right py-2 px-3 ${flow.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {flow.delta.toFixed(3)}
                  </td>
                  <td className="text-right py-2 px-3">{flow.gamma.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {optionsFlow.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-pulse" />
            <p className="text-slate-500">Waiting for options flow data...</p>
          </div>
        </div>
      )}
    </div>
  );
};