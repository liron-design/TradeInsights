import React, { useEffect, useState } from 'react';
import { Clock, Play, Pause, Calendar } from 'lucide-react';
import { ReportScheduler } from '../utils/scheduler';
import { useReports } from '../contexts/ReportContext';
import { useNotifications } from '../contexts/NotificationContext';
import { format } from 'date-fns';

export const ScheduledReportManager: React.FC = () => {
  const { generateReport } = useReports();
  const { addNotification } = useNotifications();
  const [isScheduled, setIsScheduled] = useState(false);
  const [nextPreMarket, setNextPreMarket] = useState<Date | null>(null);
  const [nextPreClose, setNextPreClose] = useState<Date | null>(null);

  useEffect(() => {
    // Calculate next scheduled times
    setNextPreMarket(ReportScheduler.getNextScheduledTime('pre-market'));
    setNextPreClose(ReportScheduler.getNextScheduledTime('pre-close'));
  }, []);

  const startScheduling = () => {
    // Schedule pre-market report (4:00 AM ET)
    ReportScheduler.scheduleReport('pre-market', async () => {
      try {
        await generateReport({
          title: 'Pre-Market Analysis Report',
          type: 'pre-market',
          market: 'US Equities',
          focusTickers: ['SPY', 'NVDA', 'TSLA', 'AAPL']
        });
        
        addNotification({
          type: 'success',
          title: 'Pre-Market Report Generated',
          message: 'Your daily pre-market analysis is ready for review.'
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Report Generation Failed',
          message: 'Failed to generate pre-market report. Please try again.'
        });
      }
    });

    // Schedule pre-close report (3:30 PM ET)
    ReportScheduler.scheduleReport('pre-close', async () => {
      try {
        await generateReport({
          title: 'Pre-Close Analysis Report',
          type: 'pre-close',
          market: 'US Equities',
          focusTickers: ['SPY', 'NVDA', 'TSLA', 'AAPL']
        });
        
        addNotification({
          type: 'success',
          title: 'Pre-Close Report Generated',
          message: 'Your daily pre-close analysis is ready for review.'
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Report Generation Failed',
          message: 'Failed to generate pre-close report. Please try again.'
        });
      }
    });

    setIsScheduled(true);
    addNotification({
      type: 'info',
      title: 'Report Scheduling Enabled',
      message: 'Daily reports will be generated automatically at 4:00 AM and 3:30 PM ET.'
    });
  };

  const stopScheduling = () => {
    ReportScheduler.cancelAllSchedules();
    setIsScheduled(false);
    addNotification({
      type: 'info',
      title: 'Report Scheduling Disabled',
      message: 'Automatic report generation has been stopped.'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-slate-900">Scheduled Reports</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isScheduled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
        }`}>
          {isScheduled ? 'Active' : 'Inactive'}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">Pre-Market Report</h4>
              <p className="text-sm text-blue-700">Daily at 4:00 AM ET</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-blue-900">
              {nextPreMarket ? format(nextPreMarket, 'MMM dd') : 'Not scheduled'}
            </div>
            <div className="text-xs text-blue-700">
              {nextPreMarket ? format(nextPreMarket, 'h:mm a') : ''}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-900">Pre-Close Report</h4>
              <p className="text-sm text-green-700">Daily at 3:30 PM ET</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-900">
              {nextPreClose ? format(nextPreClose, 'MMM dd') : 'Not scheduled'}
            </div>
            <div className="text-xs text-green-700">
              {nextPreClose ? format(nextPreClose, 'h:mm a') : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        {!isScheduled ? (
          <button
            onClick={startScheduling}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Enable Scheduling</span>
          </button>
        ) : (
          <button
            onClick={stopScheduling}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Pause className="w-4 h-4" />
            <span>Disable Scheduling</span>
          </button>
        )}
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <p className="text-xs text-slate-600">
          <strong>Note:</strong> Reports are automatically generated on trading days only (Monday-Friday). 
          Weekend and holiday reports will be shifted to the next trading day.
        </p>
      </div>
    </div>
  );
};