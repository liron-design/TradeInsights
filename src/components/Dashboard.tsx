import React from 'react';
import { InstitutionalDashboard } from './InstitutionalDashboard';
import { AdvancedAnalyticsEngine } from './AdvancedAnalyticsEngine';
import { AdvancedDashboard } from './AdvancedDashboard';
import { EnhancedMarketOverview } from './EnhancedMarketOverview';
import { AdvancedChartView } from './AdvancedChartView';
import { OptionsFlowAnalyzer } from './OptionsFlowAnalyzer';
import { PortfolioTracker } from './PortfolioTracker';
import { AlertsManager } from './AlertsManager';
import { ScheduledReportManager } from './ScheduledReportManager';
import { ComprehensiveReportGenerator } from './ComprehensiveReportGenerator';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <InstitutionalDashboard />
      <AdvancedDashboard />
      <AdvancedAnalyticsEngine />
      <EnhancedMarketOverview />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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