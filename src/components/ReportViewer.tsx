import React, { useState } from 'react';
import { Calendar, FileText, Download, Filter, Search } from 'lucide-react';
import { ExportModal } from './ExportModal';

interface Report {
  id: string;
  title: string;
  type: 'pre-market' | 'pre-close' | 'custom';
  date: string;
  time: string;
  summary: string;
  status: 'completed' | 'generating' | 'scheduled';
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Pre-Market Analysis Report',
    type: 'pre-market',
    date: '2025-01-19',
    time: '4:00 AM ET',
    summary: 'S&P futures at 6,463 with tech concentration risks. Consumer confidence remains subdued.',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Pre-Close Analysis Report',
    type: 'pre-close',
    date: '2025-01-18',
    time: '3:30 PM ET',
    summary: 'Market closed mixed with rotation into defensive sectors. VIX elevated above 16.',
    status: 'completed'
  },
  {
    id: '3',
    title: 'NVDA Earnings Preview',
    type: 'custom',
    date: '2025-01-18',
    time: '2:15 PM ET',
    summary: 'Deep dive into NVIDIA earnings expectations, options positioning, and technical setup.',
    status: 'completed'
  }
];

export const ReportViewer: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showExportModal, setShowExportModal] = useState(false);
  
  const filteredReports = filterType === 'all' 
    ? mockReports 
    : mockReports.filter(report => report.type === filterType);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pre-market': return 'bg-blue-100 text-blue-700';
      case 'pre-close': return 'bg-green-100 text-green-700';
      case 'custom': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const renderReportContent = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Pre-Trading Analysis Report: U.S. Equities</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowExportModal(true)}
              className="p-2 text-slate-600 hover:text-slate-800 rounded-md hover:bg-slate-100"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          January 19, 2025 • 4:00 AM ET • Pre-Trading Start
        </div>
      </div>

      <div className="prose max-w-none">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <p className="text-sm font-medium text-blue-800">
            <strong>Executive Summary:</strong> U.S. equities positioned for cautious open with S&P futures at 6,463. 
            Macro resilience continues but consumer confidence remains subdued at 58.6. Tech sector concentration 
            with NVDA showing mixed sentiment patterns ahead of earnings.
          </p>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4">A. Deep-Dive Analysis</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">1. Macroeconomic Overview</h3>
            <p className="text-slate-700 mb-4">
              Current economic indicators suggest a cautious but stable environment. Q2 GDP growth at 3.0% 
              indicates continued expansion, though consumer confidence at 58.6 reflects underlying sentiment concerns.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-slate-200 rounded-lg">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Indicator</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Latest Value</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Forecast Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-4 py-2 text-sm text-slate-700">GDP (Q2 Annualized)</td>
                    <td className="px-4 py-2 text-sm text-slate-900 font-medium">3.0%</td>
                    <td className="px-4 py-2 text-sm text-green-600">Positive short-term</td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="px-4 py-2 text-sm text-slate-700">Consumer Confidence (Aug)</td>
                    <td className="px-4 py-2 text-sm text-slate-900 font-medium">58.6</td>
                    <td className="px-4 py-2 text-sm text-red-600">Negative sentiment drag</td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="px-4 py-2 text-sm text-slate-700">Industrial Production (Jul)</td>
                    <td className="px-4 py-2 text-sm text-slate-900 font-medium">-0.1%</td>
                    <td className="px-4 py-2 text-sm text-yellow-600">Mild slowdown</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">2. Technical Analysis</h3>
            <p className="text-slate-700 mb-4">
              S&P futures trading at 6,463 show consolidation patterns. RSI at neutral levels (~50) 
              suggests balanced momentum, while MACD indicates potential bearish divergence.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-2">Key Levels</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>Support: 6,420</li>
                  <li>Resistance: 6,500</li>
                  <li>Pivot: 6,463</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-2">Indicators</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>RSI (14): 50 (Neutral)</li>
                  <li>MACD: Bearish Cross</li>
                  <li>Volume: Below average</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4 mt-8">B. Professional Summary</h2>
        <p className="text-slate-700 leading-relaxed mb-6">
          As of January 19, 2025, U.S. equities indicate a subdued opening with S&P futures at 6,463. 
          Macroeconomic resilience persists with 3.0% GDP growth, though consumer sentiment remains 
          pressured at 58.6. The technology sector demonstrates concentration risk with NVIDIA 
          displaying mixed sentiment patterns ahead of earnings. Cryptocurrency markets show 
          strength with Bitcoin trading above $67,000. Key risks include potential recession 
          probability of 20% and elevated volatility expectations.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mb-4">C. Actionable Insights & Recommendations</h2>
        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <h4 className="font-semibold text-green-800 mb-2">Short-Term (Intraday)</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Monitor S&P support at 6,420; consider protective puts if breached</li>
              <li>• NVDA bull call spread if price exceeds $130 with volume confirmation</li>
              <li>• Watch VIX for mean reversion opportunities below 15</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Medium-Term (Weekly-Monthly)</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Position for potential rate cuts in Q2 2025</li>
              <li>• Accumulate Bitcoin on dips below $65,000</li>
              <li>• Diversify into defensive sectors (healthcare, utilities)</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
            <h4 className="font-semibold text-purple-800 mb-2">Risk Assessment</h4>
            <p className="text-sm text-purple-700">
              Elevated volatility (1.5% expected daily range), 15% portfolio downside risk. 
              Maintain 25% cash allocation for opportunities.
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-slate-100 rounded-lg text-xs text-slate-600">
          <p><strong>Disclaimer:</strong> This report is for informational purposes only and does not constitute financial advice. 
          Past performance does not guarantee future results. Please consult with a qualified financial advisor before making investment decisions.</p>
        </div>
        
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          reportTitle="Pre-Trading Analysis Report: U.S. Equities"
          reportContent="Full report content would be here..."
        />
      </div>
    </div>
  );

  if (selectedReport) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setSelectedReport(null)}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Reports
        </button>
        {renderReportContent()}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Analysis Reports</h2>
        <p className="text-slate-600">
          Access your complete history of AI-generated trading analysis reports
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => setFilterType('pre-market')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'pre-market' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Pre-Market
          </button>
          <button
            onClick={() => setFilterType('pre-close')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'pre-close' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Pre-Close
          </button>
          <button
            onClick={() => setFilterType('custom')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'custom' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Custom
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedReport(report)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                  {report.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <div className="flex items-center text-slate-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {report.time}
                </div>
              </div>
              
              <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{report.title}</h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3">{report.summary}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{report.date}</span>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <FileText className="w-4 h-4 mr-1" />
                  View Report
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};