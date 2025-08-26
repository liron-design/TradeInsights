import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Shield, Target, BarChart3, AlertTriangle } from 'lucide-react';
import { enhancedMarketDataService, EnhancedMarketDataPoint } from '../services/enhancedMarketDataService';
import { advancedAIService, AdvancedAIAnalysis, RiskMetrics } from '../services/advancedAIService';
import { LoadingSpinner } from './LoadingSpinner';

export const AdvancedDashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<EnhancedMarketDataPoint[]>([]);
  const [aiAnalyses, setAiAnalyses] = useState<AdvancedAIAnalysis[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('SPY');

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load enhanced market data
      const data = await enhancedMarketDataService.getEnhancedMarketData();
      setMarketData(data);

      // Generate AI analyses for all symbols
      const analyses = await Promise.all(
        data.map(symbol => advancedAIService.analyzeSymbol(symbol))
      );
      setAiAnalyses(analyses);

      // Calculate portfolio risk metrics
      const risk = await advancedAIService.calculateRiskMetrics(data);
      setRiskMetrics(risk);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'strong_bullish': return 'text-green-700 bg-green-100 border-green-300';
      case 'bullish': return 'text-green-600 bg-green-50 border-green-200';
      case 'bearish': return 'text-red-600 bg-red-50 border-red-200';
      case 'strong_bearish': return 'text-red-700 bg-red-100 border-red-300';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'very_high': return 'text-red-700';
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      case 'very_low': return 'text-green-700';
      default: return 'text-slate-600';
    }
  };

  const selectedAnalysis = aiAnalyses.find(a => a.symbol === selectedSymbol);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading advanced analytics..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Advanced AI Dashboard</h2>
        <p className="text-slate-600">
          Institutional-grade analysis powered by advanced machine learning algorithms
        </p>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">AI Confidence</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {Math.round(aiAnalyses.reduce((sum, a) => sum + a.confidence, 0) / aiAnalyses.length)}%
          </div>
          <div className="text-sm text-slate-500">Average across all symbols</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium text-green-600">Bullish Signals</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {aiAnalyses.filter(a => a.signal.includes('bullish')).length}
          </div>
          <div className="text-sm text-slate-500">Out of {aiAnalyses.length} symbols</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Portfolio VaR</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {riskMetrics?.portfolioVaR.toFixed(2)}%
          </div>
          <div className="text-sm text-slate-500">95% confidence, 1-day</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Sharpe Ratio</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {riskMetrics?.sharpeRatio.toFixed(2)}
          </div>
          <div className="text-sm text-slate-500">Risk-adjusted returns</div>
        </div>
      </div>

      {/* Symbol Selection and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">AI Analysis Results</h3>
            
            {/* Symbol Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {marketData.map(data => (
                <button
                  key={data.symbol}
                  onClick={() => setSelectedSymbol(data.symbol)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSymbol === data.symbol
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {data.symbol}
                </button>
              ))}
            </div>

            {selectedAnalysis && (
              <div className="space-y-6">
                {/* Signal and Confidence */}
                <div className={`p-4 rounded-lg border ${getSignalColor(selectedAnalysis.signal)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span className="font-semibold capitalize">
                        {selectedAnalysis.signal.replace('_', ' ')} Signal
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{selectedAnalysis.confidence}% Confidence</div>
                      <div className="text-sm">{selectedAnalysis.timeframe}</div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{selectedAnalysis.reasoning}</p>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(selectedAnalysis.scores).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{value}</div>
                      <div className="text-sm text-slate-600 capitalize">{key}</div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Targets */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3">Price Targets</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Conservative:</span>
                      <div className="font-bold text-slate-900">
                        ${selectedAnalysis.priceTargets.conservative}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600">Moderate:</span>
                      <div className="font-bold text-slate-900">
                        ${selectedAnalysis.priceTargets.moderate}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600">Aggressive:</span>
                      <div className="font-bold text-slate-900">
                        ${selectedAnalysis.priceTargets.aggressive}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600">Stop Loss:</span>
                      <div className="font-bold text-red-600">
                        ${selectedAnalysis.priceTargets.stopLoss}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trading Strategies */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Recommended Strategies</h4>
                  <div className="space-y-3">
                    {selectedAnalysis.strategies.map((strategy, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900">{strategy.type}</span>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-slate-600">R/R: {strategy.riskReward}</span>
                            <span className="text-blue-600">{strategy.probability}% prob</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{strategy.description}</p>
                        <div className="text-xs text-slate-500">{strategy.timeHorizon}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Risk Metrics Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Portfolio Risk Metrics</h3>
            {riskMetrics && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Value at Risk (95%)</span>
                  <span className="font-bold text-red-600">{riskMetrics.portfolioVaR}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Sharpe Ratio</span>
                  <span className="font-bold text-slate-900">{riskMetrics.sharpeRatio}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Max Drawdown</span>
                  <span className="font-bold text-red-600">{riskMetrics.maxDrawdown}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Portfolio Beta</span>
                  <span className="font-bold text-slate-900">{riskMetrics.beta}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Alpha</span>
                  <span className={`font-bold ${riskMetrics.alpha >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {riskMetrics.alpha}%
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Market Signals Summary</h3>
            <div className="space-y-3">
              {aiAnalyses.map(analysis => (
                <div key={analysis.symbol} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-slate-900">{analysis.symbol}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSignalColor(analysis.signal)}`}>
                      {analysis.signal.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">{analysis.confidence}%</div>
                    <div className={`text-xs ${getRiskColor(analysis.riskLevel)}`}>
                      {analysis.riskLevel.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};