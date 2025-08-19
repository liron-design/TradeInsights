import React from 'react';
import { Brain, Target, AlertTriangle } from 'lucide-react';

export const QuickInsights: React.FC = () => {
  const insights = [
    {
      type: 'bullish',
      icon: Target,
      title: 'NVDA Technical Setup',
      description: 'RSI cooling from overbought levels, potential breakout above $130 resistance',
      confidence: 78,
      timeframe: 'Intraday'
    },
    {
      type: 'bearish',
      icon: AlertTriangle,
      title: 'Market Breadth Warning',
      description: 'S&P 500 showing negative divergence with advancing/declining ratio',
      confidence: 65,
      timeframe: 'Short-term'
    },
    {
      type: 'neutral',
      icon: Brain,
      title: 'AI Model Prediction',
      description: 'VIX likely to test 15-16 range based on options flow patterns',
      confidence: 82,
      timeframe: 'This Week'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">AI Insights</h3>
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <Brain className="w-4 h-4" />
          <span>Powered by xAI</span>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          const colorClass = insight.type === 'bullish' ? 'text-green-600' : 
                           insight.type === 'bearish' ? 'text-red-600' : 'text-blue-600';
          const bgColorClass = insight.type === 'bullish' ? 'bg-green-50 border-green-200' : 
                             insight.type === 'bearish' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200';

          return (
            <div key={index} className={`p-4 rounded-lg border ${bgColorClass}`}>
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 mt-0.5 ${colorClass}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 px-2 py-1 bg-white rounded-full">
                        {insight.timeframe}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorClass} bg-white`}>
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
        Generate Custom Insights
      </button>
    </div>
  );
};