import React from 'react';
import { EnhancedMarketOverview } from './EnhancedMarketOverview';
import { ComprehensiveReportGenerator } from './ComprehensiveReportGenerator';
import { ReportStatus } from './ReportStatus';
import { QuickInsights } from './QuickInsights';
import { WatchList } from './WatchList';
import { SentimentMeter } from './SentimentMeter';
import { ReportPreview } from './ReportPreview';
import { InteractiveChart } from './InteractiveChart';
import { AIAnalysisEngine } from './AIAnalysisEngine';
import { ScheduledReportManager } from './ScheduledReportManager';

export const Dashboard: React.FC = () => {
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
          <EnhancedMarketOverview />
        </div>
        <div>
          <ReportStatus />
        </div>
      </div>

      <div className="mb-8">
        <ComprehensiveReportGenerator />
      </div>

      <div className="mb-8">
        <ScheduledReportManager />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <QuickInsights />
        <SentimentMeter />
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