import React from 'react';
import { InstitutionalDashboard } from './InstitutionalDashboard';
import { AdvancedDashboard } from './AdvancedDashboard';
import { EnhancedMarketOverview } from './EnhancedMarketOverview';
import { AdvancedChartView } from './AdvancedChartView';
import { OptionsFlowAnalyzer } from './OptionsFlowAnalyzer';
import { PortfolioTracker } from './PortfolioTracker';
import { AlertsManager } from './AlertsManager';
import { ScheduledReportManager } from './ScheduledReportManager';
import { ComprehensiveReportGenerator } from './ComprehensiveReportGenerator';
import { AdvancedAnalyticsEngine } from './AdvancedAnalyticsEngine';
import { MarketOverview } from './MarketOverview';
import { SentimentMeter } from './SentimentMeter';
import { QuickInsights } from './QuickInsights';
import { ReportPreview } from './ReportPreview';
import { WatchList } from './WatchList';
import { ReportStatus } from './ReportStatus';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <InstitutionalDashboard />
      <AdvancedDashboard />
      <AdvancedAnalyticsEngine />
      <EnhancedMarketOverview />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <MarketOverview />
          </div>
          <div className="space-y-6">
            <SentimentMeter />
            <ReportStatus />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ReportPreview />
          </div>
          <div className="space-y-6">
            <WatchList />
            <QuickInsights />
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <AdvancedChartView symbol="SPY" height={350} />
          <AdvancedChartView symbol="NVDA" height={350} />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <OptionsFlowAnalyzer symbol="SPY" />
          <OptionsFlowAnalyzer symbol="NVDA" />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <PortfolioTracker />
          <AlertsManager />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ScheduledReportManager />
          <ComprehensiveReportGenerator />
        </div>
      </div>
    </div>
  );
};