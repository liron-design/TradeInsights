import React, { useState, useEffect } from 'react';
import { Brain, Zap, TrendingUp, AlertTriangle, Target } from 'lucide-react';

interface AnalysisResult {
  confidence: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  reasoning: string;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface AIAnalysisEngineProps {
  symbol: string;
  price: number;
  change: number;
  volume?: number;
}

export const AIAnalysisEngine: React.FC<AIAnalysisEngineProps> = ({
  symbol,
  price,
  change,
  volume
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic logic
    setTimeout(() => {
      const priceDirection = change > 0 ? 'bullish' : change < 0 ? 'bearish' : 'neutral';
      const volatility = Math.abs(change / price) * 100;
      
      let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      let confidence = 50;
      let reasoning = '';
      let riskLevel: 'low' | 'medium' | 'high' = 'medium';

      // Advanced analysis logic
      if (Math.abs(change) > price * 0.02) { // >2% move
        signal = change > 0 ? 'bullish' : 'bearish';
        confidence = Math.min(85, 60 + volatility * 5);
        reasoning = `Strong ${signal} momentum detected with ${volatility.toFixed(1)}% intraday movement. `;
        riskLevel = volatility > 3 ? 'high' : 'medium';
      } else if (Math.abs(change) > price * 0.01) { // >1% move
        signal = change > 0 ? 'bullish' : 'bearish';
        confidence = Math.min(75, 55 + volatility * 3);
        reasoning = `Moderate ${signal} bias with ${volatility.toFixed(1)}% price action. `;
        riskLevel = 'medium';
      } else {
        signal = 'neutral';
        confidence = 45 + Math.random() * 20;
        reasoning = `Consolidation pattern with low volatility (${volatility.toFixed(1)}%). `;
        riskLevel = 'low';
      }

      // Add symbol-specific insights
      if (symbol === 'NVDA') {
        reasoning += 'AI sector momentum and earnings proximity factor into analysis. Options flow suggests institutional interest.';
      } else if (symbol === 'TSLA') {
        reasoning += 'EV market dynamics and production metrics influence sentiment. High retail trader activity observed.';
      } else if (symbol === 'BTC-USD') {
        reasoning += 'Crypto market correlation with tech stocks and regulatory sentiment impact pricing.';
      } else if (symbol === 'SPY') {
        reasoning += 'Broad market sentiment reflects macro conditions and sector rotation patterns.';
      }

      setAnalysis({
        confidence: Math.round(confidence),
        signal,
        reasoning,
        timeframe: volatility > 2 ? 'Short-term (1-3 days)' : 'Medium-term (1-2 weeks)',
        riskLevel
      });
      
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    generateAnalysis();
  }, [symbol, price, change]);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish': return 'text-green-600 bg-green-50 border-green-200';
      case 'bearish': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'bullish': return <TrendingUp className="w-5 h-5" />;
      case 'bearish': return <AlertTriangle className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-900">AI Analysis Engine</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-blue-600 animate-bounce" />
            <span className="text-slate-600">Analyzing {symbol}...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">AI Analysis: {symbol}</h3>
        </div>
        <button
          onClick={generateAnalysis}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Refresh
        </button>
      </div>

      <div className={`p-4 rounded-lg border ${getSignalColor(analysis.signal)} mb-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getSignalIcon(analysis.signal)}
            <span className="font-semibold capitalize">{analysis.signal} Signal</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{analysis.confidence}% Confidence</div>
            <div className="text-xs">{analysis.timeframe}</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed">{analysis.reasoning}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-slate-600">Risk Level:</span>
          <span className={`ml-2 font-medium capitalize ${getRiskColor(analysis.riskLevel)}`}>
            {analysis.riskLevel}
          </span>
        </div>
        <div>
          <span className="text-slate-600">Last Updated:</span>
          <span className="ml-2 font-medium text-slate-900">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};