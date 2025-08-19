import React from 'react';
import { MarketOverview } from './MarketOverview';
import { ReportStatus } from './ReportStatus';
import { QuickInsights } from './QuickInsights';
import { WatchList } from './WatchList';
import { SentimentMeter } from './SentimentMeter';
import { ReportPreview } from './ReportPreview';
import { InteractiveChart } from './InteractiveChart';
import { AIAnalysisEngine } from './AIAnalysisEngine';
import { useMarketData } from '../hooks/useMarketData';

export const Dashboard: React.FC = () => {
  const { marketData } = useMarketData();
  
  // Generate sample chart data for demonstration
  const generateChartData = () => {
    const data = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        timestamp: timestamp.toISOString(),
        price: 545 + Math.random() * 20 - 10,
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }
    return data;
  };

  const chartData = generateChartData();
  const spyData = marketData.find(item => item.symbol === 'SPY');
  const nvdaData = marketData.find(item => item.symbol === 'NVDA');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Trading Dashboard</h2>
        <p className="text-slate-600">
          Real-time market analysis and AI-powered insights for informed trading decisions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <MarketOverview />
        </div>
        <div>
          <ReportStatus />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-6">
          <QuickInsights />
          {spyData && (
            <AIAnalysisEngine
              symbol={spyData.symbol}
              price={spyData.price}
              change={spyData.change}
              volume={spyData.volume}
            />
          )}
        </div>
        <SentimentMeter />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <InteractiveChart
          data={chartData}
          title="S&P 500 ETF (SPY)"
          symbol="SPY"
          type="area"
          height={300}
        />
        {nvdaData && (
          <AIAnalysisEngine
            symbol={nvdaData.symbol}
            price={nvdaData.price}
            change={nvdaData.change}
            volume={nvdaData.volume}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReportPreview />
        </div>
        <div>
          <WatchList />
        </div>
      </div>
    </div>
  );
};