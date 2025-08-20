import React, { useState } from 'react';
import { FileText, Zap, Settings, Download, Calendar, Clock } from 'lucide-react';
import { useReportGeneration } from '../hooks/useReportGeneration';
import { format } from 'date-fns';

export const ComprehensiveReportGenerator: React.FC = () => {
  const { generateReport, isGenerating, currentReport, error } = useReportGeneration();
  const [config, setConfig] = useState({
    market: 'U.S. Equities',
    focusTickers: ['SPY', 'NVDA', 'TSLA', 'AAPL'],
    timeHorizon: 'Mixed'
  });
  const [showConfig, setShowConfig] = useState(false);

  const handleGenerateReport = async () => {
    try {
      await generateReport(config);
    } catch (err) {
      console.error('Failed to generate report:', err);
    }
  };

  const handleTickerChange = (ticker: string, checked: boolean) => {
    if (checked) {
      setConfig(prev => ({
        ...prev,
        focusTickers: [...prev.focusTickers, ticker]
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        focusTickers: prev.focusTickers.filter(t => t !== ticker)
      }));
    }
  };

  const availableTickers = ['SPY', 'NVDA', 'TSLA', 'AAPL', 'BTC-USD', 'ETH-USD'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-slate-900">Report Generator</h3>
        </div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="p-2 text-slate-500 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {showConfig && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-4">Report Configuration</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Market Focus</label>
              <select
                value={config.market}
                onChange={(e) => setConfig(prev => ({ ...prev, market: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="U.S. Equities">U.S. Equities</option>
                <option value="Cryptocurrencies">Cryptocurrencies</option>
                <option value="Mixed Portfolio">Mixed Portfolio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Focus Tickers</label>
              <div className="grid grid-cols-3 gap-2">
                {availableTickers.map(ticker => (
                  <label key={ticker} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.focusTickers.includes(ticker)}
                      onChange={(e) => handleTickerChange(ticker, e.target.checked)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{ticker}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Time Horizon</label>
              <select
                value={config.timeHorizon}
                onChange={(e) => setConfig(prev => ({ ...prev, timeHorizon: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Intraday">Intraday Focus</option>
                <option value="Short-term">Short-term (1-7 days)</option>
                <option value="Medium-term">Medium-term (1-4 weeks)</option>
                <option value="Long-term">Long-term (1-12 months)</option>
                <option value="Mixed">Mixed Horizons</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {!currentReport ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <Zap className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Generate AI-Powered Analysis</h4>
            <p className="text-slate-600 max-w-md mx-auto">
              Create a comprehensive trading analysis report with deep-dive insights, 
              technical analysis, and actionable recommendations.
            </p>
          </div>
          
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 mx-auto"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Report...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Generate Report</span>
              </>
            )}
          </button>
          
          <div className="mt-4 text-xs text-slate-500">
            Focus: {config.focusTickers.join(', ')} • {config.timeHorizon} • {config.market}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-slate-900">{currentReport.title}</h4>
              <button className="p-2 text-slate-500 hover:text-slate-700 rounded-md hover:bg-slate-100">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{format(currentReport.timestamp, 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{format(currentReport.timestamp, 'HH:mm')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-2">Market Sentiment</h5>
              <div className="text-2xl font-bold text-blue-600">
                {currentReport.marketOverview.sentiment}%
              </div>
              <div className="text-sm text-blue-700 capitalize">
                {currentReport.marketOverview.trend}
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-900 mb-2">Volatility</h5>
              <div className="text-2xl font-bold text-green-600">
                {currentReport.marketOverview.volatility}%
              </div>
              <div className="text-sm text-green-700">
                Daily Range
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-900 mb-2">Analyses</h5>
              <div className="text-2xl font-bold text-purple-600">
                {currentReport.symbolAnalyses.length}
              </div>
              <div className="text-sm text-purple-700">
                Symbols Covered
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <h5 className="font-semibold text-slate-900 mb-3">Executive Summary</h5>
            <p className="text-slate-700 leading-relaxed">{currentReport.summary}</p>
          </div>

          <div className="space-y-4">
            <h5 className="font-semibold text-slate-900">Symbol Analyses</h5>
            {currentReport.symbolAnalyses.map((analysis) => (
              <div key={analysis.symbol} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-900">{analysis.symbol}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      analysis.signal === 'bullish' ? 'bg-green-100 text-green-700' :
                      analysis.signal === 'bearish' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {analysis.signal.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">{analysis.confidence}% Confidence</div>
                    <div className="text-xs text-slate-500">{analysis.timeframe}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3">{analysis.reasoning}</p>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Technical:</span>
                    <span className="ml-1 font-medium">{analysis.technicalScore}/100</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Fundamental:</span>
                    <span className="ml-1 font-medium">{analysis.fundamentalScore}/100</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Sentiment:</span>
                    <span className="ml-1 font-medium">{analysis.sentimentScore}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Regenerate Report
            </button>
            <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};