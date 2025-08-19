import React from 'react';
import { Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

export const ReportStatus: React.FC = () => {
  const nextReportTime = '3:30 PM ET';
  const lastReportTime = '4:00 AM ET';
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Report Status</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Pre-Market Report</p>
              <p className="text-sm text-green-700">Generated at {lastReportTime}</p>
            </div>
          </div>
          <button className="text-sm text-green-600 hover:text-green-800 font-medium">
            View
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Pre-Close Report</p>
              <p className="text-sm text-blue-700">Scheduled for {nextReportTime}</p>
            </div>
          </div>
          <div className="text-sm font-medium text-blue-600">
            2h 15m
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">Custom Analysis</p>
              <p className="text-sm text-amber-700">NVDA earnings preview</p>
            </div>
          </div>
          <button className="text-sm text-amber-600 hover:text-amber-800 font-medium">
            Generate
          </button>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Schedule Custom Report</span>
        </button>
      </div>
    </div>
  );
};