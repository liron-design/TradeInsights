import { MarketDataPoint } from './marketDataService';
import { format } from 'date-fns';

export interface AIAnalysis {
  symbol: string;
  confidence: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  reasoning: string;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
  technicalScore: number;
  fundamentalScore: number;
  sentimentScore: number;
  priceTarget: {
    short: number;
    medium: number;
    long: number;
  };
  keyLevels: {
    support: number[];
    resistance: number[];
  };
  strategies: Array<{
    type: string;
    description: string;
    riskReward: string;
  }>;
}

export interface ComprehensiveReport {
  id: string;
  title: string;
  timestamp: Date;
  marketOverview: {
    sentiment: number;
    volatility: number;
    trend: 'bullish' | 'bearish' | 'neutral';
    keyDrivers: string[];
  };
  deepDive: {
    macroeconomic: {
      gdpGrowth: number;
      inflation: number;
      unemployment: number;
      fedFundsRate: number;
      analysis: string;
    };
    technical: {
      marketBreadth: number;
      vixLevel: number;
      sectorRotation: string;
      analysis: string;
    };
    sentiment: {
      fearGreedIndex: number;
      socialSentiment: number;
      institutionalFlow: number;
      analysis: string;
    };
  };
  symbolAnalyses: AIAnalysis[];
  actionableInsights: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
    riskManagement: string[];
  };
  summary: string;
}

class AIAnalysisService {
  private generateTechnicalScore(data: MarketDataPoint): number {
    const { technicals } = data;
    let score = 50; // Neutral baseline
    
    // RSI analysis
    if (technicals.rsi > 70) score -= 15; // Overbought
    else if (technicals.rsi < 30) score += 15; // Oversold
    else if (technicals.rsi > 45 && technicals.rsi < 55) score += 5; // Neutral is good
    
    // MACD analysis
    if (technicals.macd > 0) score += 10;
    else score -= 10;
    
    // Moving average analysis
    if (data.price > technicals.sma20) score += 10;
    if (data.price > technicals.sma50) score += 10;
    if (technicals.sma20 > technicals.sma50) score += 5; // Bullish crossover
    
    return Math.max(0, Math.min(100, score));
  }

  private generateFundamentalScore(data: MarketDataPoint): number {
    if (!data.fundamentals) return 50; // Neutral for crypto
    
    const { pe, eps, beta } = data.fundamentals;
    let score = 50;
    
    // P/E ratio analysis
    if (pe < 15) score += 15; // Undervalued
    else if (pe > 30) score -= 10; // Overvalued
    
    // EPS growth (simulated)
    if (eps > 2) score += 10;
    
    // Beta analysis
    if (beta < 1.2) score += 5; // Lower volatility
    else if (beta > 1.8) score -= 5; // High volatility
    
    return Math.max(0, Math.min(100, score));
  }

  private generateSentimentScore(data: MarketDataPoint): number {
    // Simulate sentiment based on recent performance
    const recentPerformance = data.changePercent;
    let score = 50;
    
    if (recentPerformance > 2) score += 20;
    else if (recentPerformance > 0) score += 10;
    else if (recentPerformance < -2) score -= 20;
    else if (recentPerformance < 0) score -= 10;
    
    // Add some randomness for social sentiment
    score += (Math.random() - 0.5) * 20;
    
    return Math.max(0, Math.min(100, score));
  }

  async analyzeSymbol(data: MarketDataPoint): Promise<AIAnalysis> {
    const technicalScore = this.generateTechnicalScore(data);
    const fundamentalScore = this.generateFundamentalScore(data);
    const sentimentScore = this.generateSentimentScore(data);
    
    const overallScore = (technicalScore + fundamentalScore + sentimentScore) / 3;
    
    let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let confidence = 50;
    
    if (overallScore > 65) {
      signal = 'bullish';
      confidence = Math.min(90, overallScore + 10);
    } else if (overallScore < 35) {
      signal = 'bearish';
      confidence = Math.min(90, (100 - overallScore) + 10);
    } else {
      confidence = 40 + Math.random() * 20;
    }
    
    const volatility = Math.abs(data.changePercent);
    const riskLevel: 'low' | 'medium' | 'high' = 
      volatility > 3 ? 'high' : volatility > 1.5 ? 'medium' : 'low';
    
    // Generate price targets
    const currentPrice = data.price;
    const priceTarget = {
      short: Number((currentPrice * (signal === 'bullish' ? 1.02 : 0.98)).toFixed(2)),
      medium: Number((currentPrice * (signal === 'bullish' ? 1.05 : 0.95)).toFixed(2)),
      long: Number((currentPrice * (signal === 'bullish' ? 1.15 : 0.85)).toFixed(2))
    };
    
    // Generate key levels
    const keyLevels = {
      support: [
        Number((currentPrice * 0.98).toFixed(2)),
        Number((currentPrice * 0.95).toFixed(2))
      ],
      resistance: [
        Number((currentPrice * 1.02).toFixed(2)),
        Number((currentPrice * 1.05).toFixed(2))
      ]
    };
    
    // Generate strategies
    const strategies = this.generateStrategies(data, signal, riskLevel);
    
    // Generate reasoning
    const reasoning = this.generateReasoning(data, technicalScore, fundamentalScore, sentimentScore, signal);
    
    return {
      symbol: data.symbol,
      confidence: Math.round(confidence),
      signal,
      reasoning,
      timeframe: riskLevel === 'high' ? 'Short-term (1-3 days)' : 'Medium-term (1-2 weeks)',
      riskLevel,
      technicalScore: Math.round(technicalScore),
      fundamentalScore: Math.round(fundamentalScore),
      sentimentScore: Math.round(sentimentScore),
      priceTarget,
      keyLevels,
      strategies
    };
  }

  private generateStrategies(data: MarketDataPoint, signal: string, riskLevel: string): Array<{
    type: string;
    description: string;
    riskReward: string;
  }> {
    const strategies = [];
    
    if (signal === 'bullish') {
      strategies.push({
        type: 'Long Position',
        description: `Buy ${data.symbol} with stop loss at ${(data.price * 0.95).toFixed(2)}`,
        riskReward: '1:2'
      });
      
      if (data.fundamentals) {
        strategies.push({
          type: 'Bull Call Spread',
          description: `Buy calls at current price, sell calls 5% OTM`,
          riskReward: '1:3'
        });
      }
    } else if (signal === 'bearish') {
      strategies.push({
        type: 'Short Position',
        description: `Short ${data.symbol} with stop loss at ${(data.price * 1.05).toFixed(2)}`,
        riskReward: '1:2'
      });
      
      strategies.push({
        type: 'Protective Puts',
        description: `Buy puts 5% OTM as portfolio protection`,
        riskReward: 'Insurance'
      });
    } else {
      strategies.push({
        type: 'Range Trading',
        description: `Trade between support ${(data.price * 0.98).toFixed(2)} and resistance ${(data.price * 1.02).toFixed(2)}`,
        riskReward: '1:1.5'
      });
    }
    
    return strategies;
  }

  private generateReasoning(
    data: MarketDataPoint, 
    technical: number, 
    fundamental: number, 
    sentiment: number, 
    signal: string
  ): string {
    let reasoning = `Technical analysis shows ${technical > 60 ? 'bullish' : technical < 40 ? 'bearish' : 'neutral'} signals (${technical}/100). `;
    
    if (data.fundamentals) {
      reasoning += `Fundamental metrics are ${fundamental > 60 ? 'strong' : fundamental < 40 ? 'weak' : 'mixed'} (${fundamental}/100). `;
    }
    
    reasoning += `Market sentiment is ${sentiment > 60 ? 'positive' : sentiment < 40 ? 'negative' : 'neutral'} (${sentiment}/100). `;
    
    // Add symbol-specific insights
    if (data.symbol === 'NVDA') {
      reasoning += 'AI sector momentum and strong data center demand support the outlook. Options flow indicates institutional interest.';
    } else if (data.symbol === 'TSLA') {
      reasoning += 'EV market dynamics and production metrics influence sentiment. High retail trader activity creates volatility.';
    } else if (data.symbol.includes('-USD')) {
      reasoning += 'Crypto market correlation with tech stocks and regulatory developments impact pricing dynamics.';
    } else if (data.symbol === 'SPY') {
      reasoning += 'Broad market sentiment reflects macroeconomic conditions and sector rotation patterns.';
    }
    
    return reasoning;
  }

  async generateComprehensiveReport(marketData: MarketDataPoint[]): Promise<ComprehensiveReport> {
    const symbolAnalyses = await Promise.all(
      marketData.map(data => this.analyzeSymbol(data))
    );
    
    // Calculate market overview
    const avgSentiment = symbolAnalyses.reduce((sum, analysis) => sum + analysis.sentimentScore, 0) / symbolAnalyses.length;
    const volatility = marketData.reduce((sum, data) => sum + Math.abs(data.changePercent), 0) / marketData.length;
    
    const bullishCount = symbolAnalyses.filter(a => a.signal === 'bullish').length;
    const bearishCount = symbolAnalyses.filter(a => a.signal === 'bearish').length;
    
    let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (bullishCount > bearishCount + 1) trend = 'bullish';
    else if (bearishCount > bullishCount + 1) trend = 'bearish';
    
    const report: ComprehensiveReport = {
      id: `report_${Date.now()}`,
      title: `Pre-Trading Analysis Report: ${format(new Date(), 'MMMM dd, yyyy')}`,
      timestamp: new Date(),
      marketOverview: {
        sentiment: Math.round(avgSentiment),
        volatility: Math.round(volatility * 10) / 10,
        trend,
        keyDrivers: [
          'Federal Reserve policy expectations',
          'AI sector momentum',
          'Earnings season results',
          'Geopolitical developments'
        ]
      },
      deepDive: {
        macroeconomic: {
          gdpGrowth: 2.8,
          inflation: 3.2,
          unemployment: 3.8,
          fedFundsRate: 5.25,
          analysis: 'Economic indicators suggest continued resilience with moderating inflation pressures. Fed policy remains data-dependent with potential for rate cuts in H2 2024.'
        },
        technical: {
          marketBreadth: Math.round(avgSentiment),
          vixLevel: 15 + Math.random() * 10,
          sectorRotation: trend === 'bullish' ? 'Growth sectors leading' : 'Defensive rotation observed',
          analysis: `Market technicals show ${trend} bias with ${volatility > 2 ? 'elevated' : 'moderate'} volatility. Key support and resistance levels are holding.`
        },
        sentiment: {
          fearGreedIndex: Math.round(avgSentiment * 0.8),
          socialSentiment: Math.round(avgSentiment),
          institutionalFlow: Math.round(avgSentiment * 1.1),
          analysis: `Sentiment indicators are ${avgSentiment > 60 ? 'optimistic' : avgSentiment < 40 ? 'pessimistic' : 'mixed'} with institutional flows ${avgSentiment > 50 ? 'supporting' : 'pressuring'} equity markets.`
        }
      },
      symbolAnalyses,
      actionableInsights: {
        shortTerm: [
          `Monitor ${symbolAnalyses.find(a => a.signal === 'bullish')?.symbol || 'SPY'} for breakout above resistance`,
          'Watch VIX for volatility expansion signals',
          'Track sector rotation patterns'
        ],
        mediumTerm: [
          'Position for potential Fed policy shifts',
          'Accumulate quality growth names on dips',
          'Maintain defensive allocation'
        ],
        longTerm: [
          'Focus on AI and technology secular trends',
          'Diversify across geographies and sectors',
          'Build positions in quality dividend stocks'
        ],
        riskManagement: [
          'Maintain 20% cash allocation for opportunities',
          'Use stop losses on momentum positions',
          'Hedge portfolio with protective puts if VIX < 15'
        ]
      },
      summary: `Market conditions show ${trend} bias with ${Math.round(avgSentiment)}% sentiment score. Key focus areas include ${symbolAnalyses.filter(a => a.confidence > 70).map(a => a.symbol).join(', ')} based on high-confidence analysis. Risk management remains paramount given current volatility levels.`
    };
    
    return report;
  }
}

export const aiAnalysisService = new AIAnalysisService();