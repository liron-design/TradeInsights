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

export {};