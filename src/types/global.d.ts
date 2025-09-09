// Global type definitions for the TradeInsight AI platform

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    gtag?: (...args: any[]) => void;
  }

  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

// Market data types
export interface BaseMarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdate: Date;
}

// Technical analysis types
export interface TechnicalIndicators {
  rsi: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  sma20: number;
  sma50: number;
  sma200: number;
  ema12: number;
  ema26: number;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
  stochastic: {
    k: number;
    d: number;
  };
  atr: number;
  adx: number;
}

// Options data types
export interface OptionsData {
  impliedVolatility: number;
  putCallRatio: number;
  openInterest: number;
  maxPain: number;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
}

// Sentiment analysis types
export interface SentimentData {
  score: number; // -100 to 100
  newsCount: number;
  socialMentions: number;
  institutionalFlow: number;
}

// Performance monitoring types
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentName: string;
  timestamp: number;
}

// Security types
export interface SecurityEvent {
  type: string;
  details: any;
  timestamp: Date;
  userAgent: string;
  url: string;
  sessionId: string;
}

// Notification types
export interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
}

// Advanced AI Analysis types
export interface AISignal {
  signal: 'strong_bullish' | 'bullish' | 'neutral' | 'bearish' | 'strong_bearish';
  confidence: number;
  timeframe: string;
  reasoning: string;
}

// Market microstructure types
export interface OrderFlow {
  buyVolume: number;
  sellVolume: number;
  netFlow: number;
  institutionalFlow: number;
  retailFlow: number;
}

// Risk management types
export interface RiskAssessment {
  portfolioVaR: number;
  sharpeRatio: number;
  maxDrawdown: number;
  beta: number;
  alpha: number;
}

// Chart data types
export interface ChartDataPoint {
  timestamp: string | number;
  price: number;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
  close?: number;
}

// Form validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

// Export utility types
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  includeCharts: boolean;
  includeData: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export {};