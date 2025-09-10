import React from 'react';
import { MarketOverview } from './MarketOverview';
import { SentimentMeter } from './SentimentMeter';
import { QuickInsights } from './QuickInsights';
import { ReportPreview } from './ReportPreview';
import { WatchList } from './WatchList';
import { ReportStatus } from './ReportStatus';
import { AdvancedChartView } from './AdvancedChartView';
import { OptionsFlowAnalyzer } from './OptionsFlowAnalyzer';
import { PortfolioTracker } from './PortfolioTracker';
import { AlertsManager } from './AlertsManager';
import { ScheduledReportManager } from './ScheduledReportManager';
import { ComprehensiveReportGenerator } from './ComprehensiveReportGenerator';
import { AIAnalysisEngine } from './AIAnalysisEngine';

export const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Row - Market Overview and Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MarketOverview />
        </div>
        <div className="space-y-6">
          <SentimentMeter />
          <ReportStatus />
        </div>
      </div>
      
      {/* Second Row - Report Preview and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ReportPreview />
        </div>
        <div className="space-y-6">
          <WatchList />
          <QuickInsights />
        </div>
      </div>
      
      {/* Third Row - Advanced Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AdvancedChartView symbol="SPY" height={350} />
        <AdvancedChartView symbol="NVDA" height={350} />
      </div>
      
      {/* Fourth Row - Options Flow */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <OptionsFlowAnalyzer symbol="SPY" />
        <OptionsFlowAnalyzer symbol="NVDA" />
      </div>
      
      {/* Fifth Row - Portfolio and Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <PortfolioTracker />
        <AlertsManager />
      </div>
      
      {/* Sixth Row - AI Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AIAnalysisEngine symbol="SPY" price={545.23} change={2.45} volume={45000000} />
        <AIAnalysisEngine symbol="NVDA" price={128.45} change={-1.23} volume={28000000} />
      </div>
      
      {/* Bottom Row - Management Tools */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ScheduledReportManager />
        <ComprehensiveReportGenerator />
      </div>
    </div>
  );
};