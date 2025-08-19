import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ReportData {
  id: string;
  title: string;
  type: 'pre-market' | 'pre-close' | 'custom';
  date: string;
  time: string;
  market: string;
  focusTickers: string[];
  content: {
    deepDive: any;
    summary: string;
    insights: any[];
  };
  status: 'generating' | 'completed' | 'error';
}

interface ReportContextType {
  reports: ReportData[];
  currentReport: ReportData | null;
  generateReport: (config: Partial<ReportData>) => Promise<void>;
  getReport: (id: string) => ReportData | undefined;
  updateReport: (id: string, updates: Partial<ReportData>) => void;
  deleteReport: (id: string) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};

interface ReportProviderProps {
  children: ReactNode;
}

export const ReportProvider: React.FC<ReportProviderProps> = ({ children }) => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null);

  const generateReport = async (config: Partial<ReportData>): Promise<void> => {
    const newReport: ReportData = {
      id: Date.now().toString(),
      title: config.title || 'Generated Report',
      type: config.type || 'custom',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      market: config.market || 'US Equities',
      focusTickers: config.focusTickers || ['SPY', 'QQQ'],
      content: {
        deepDive: {},
        summary: 'Report generation in progress...',
        insights: []
      },
      status: 'generating'
    };

    setReports(prev => [newReport, ...prev]);
    setCurrentReport(newReport);

    // Simulate report generation
    setTimeout(() => {
      updateReport(newReport.id, {
        status: 'completed',
        content: {
          deepDive: {
            macroeconomics: 'Sample macro analysis',
            technical: 'Sample technical analysis',
            sentiment: 'Sample sentiment analysis'
          },
          summary: 'Sample executive summary of market conditions...',
          insights: [
            { type: 'bullish', ticker: 'NVDA', strategy: 'Bull call spread' },
            { type: 'bearish', ticker: 'SPY', strategy: 'Protective puts' }
          ]
        }
      });
    }, 3000);
  };

  const getReport = (id: string): ReportData | undefined => {
    return reports.find(report => report.id === id);
  };

  const updateReport = (id: string, updates: Partial<ReportData>) => {
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, ...updates } : report
    ));
    
    if (currentReport?.id === id) {
      setCurrentReport(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
    if (currentReport?.id === id) {
      setCurrentReport(null);
    }
  };

  return (
    <ReportContext.Provider value={{
      reports,
      currentReport,
      generateReport,
      getReport,
      updateReport,
      deleteReport
    }}>
      {children}
    </ReportContext.Provider>
  );
};