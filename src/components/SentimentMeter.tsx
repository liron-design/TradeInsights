import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

export const SentimentMeter: React.FC = () => {
  const overallSentiment = 62; // 0-100 scale
  const sentimentData = [
    { source: 'Social Media', value: 68, change: +5 },
    { source: 'News Analytics', value: 58, change: -2 },
    { source: 'Options Flow', value: 75, change: +8 },
    { source: 'Institutional', value: 45, change: -12 }
  ];

  const getSentimentColor = (value: number) => {
    if (value >= 70) return 'text-green-600 bg-green-50';
    if (value >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getSentimentIcon = (value: number) => {
    if (value >= 70) return <Smile className="w-4 h-4" />;
    if (value >= 40) return <Meh className="w-4 h-4" />;
    return <Frown className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Market Sentiment</h3>

      <div className="text-center mb-6">
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#3b82f6"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${overallSentiment * 2.83}, 283`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{overallSentiment}</div>
              <div className="text-xs text-slate-500">Overall</div>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-2">Moderately Bullish</p>
      </div>

      <div className="space-y-3">
        {sentimentData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-full ${getSentimentColor(item.value)}`}>
                {getSentimentIcon(item.value)}
              </div>
              <span className="text-sm font-medium text-slate-700">{item.source}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-slate-900">{item.value}</span>
              <span className={`text-xs font-medium ${
                item.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.change >= 0 ? '+' : ''}{item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>Last Updated:</span>
            <span>2 minutes ago</span>
          </div>
          <div className="flex justify-between">
            <span>Data Sources:</span>
            <span>Twitter, Reddit, News, Options</span>
          </div>
        </div>
      </div>
    </div>
  );
};