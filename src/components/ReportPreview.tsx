import React from 'react';
import { FileText, Calendar, Download, Share2 } from 'lucide-react';

export const ReportPreview: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Latest Report Preview</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-500 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-500 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-slate-900">Pre-Market Analysis Report</span>
          <span className="text-sm text-slate-500">• Today, 4:00 AM ET</span>
        </div>
        <div className="text-sm text-slate-600 leading-relaxed">
          <strong>Executive Summary:</strong> U.S. equities positioned for cautious open with S&P futures at 6,463. 
          Macro resilience continues but consumer confidence remains subdued at 58.6. Tech sector shows concentration 
          risk with NVDA displaying mixed sentiment patterns ahead of earnings...
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
          <div>
            <h4 className="font-medium text-slate-900">Deep-Dive Analysis</h4>
            <p className="text-sm text-slate-600">Macro, Technical, Sentiment & Options Flow</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-blue-600">12 sections</span>
            <p className="text-xs text-slate-500">~8 min read</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
          <div>
            <h4 className="font-medium text-slate-900">Professional Summary</h4>
            <p className="text-sm text-slate-600">Key insights and market shifts</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-green-600">Ready</span>
            <p className="text-xs text-slate-500">2 min read</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
          <div>
            <h4 className="font-medium text-slate-900">Actionable Insights</h4>
            <p className="text-sm text-slate-600">Trade setups and risk management</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-blue-600">8 strategies</span>
            <p className="text-xs text-slate-500">Quick scan</p>
          </div>
        </div>
      </div>

      <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
        <FileText className="w-4 h-4" />
        <span>View Full Report</span>
      </button>
    </div>
  );
};