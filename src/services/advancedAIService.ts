// Advanced AI Analysis Service with machine learning-inspired algorithms
import { EnhancedMarketDataPoint } from './enhancedMarketDataService';
import { format } from 'date-fns';

export interface AdvancedAIAnalysis {
  symbol: string;
  confidence: number;
  signal: 'strong_bullish' | 'bullish' | 'neutral' | 'bearish' | 'strong_bearish';
  reasoning: string;
  timeframe: string;
  riskLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  scores: {
    technical: number;
    fundamental: number;
    sentiment: number;
    momentum: number;
    volatility: number;
    volume: number;
  };
  priceTargets: {
    conservative: number;
    moderate: number;
    aggressive: number;
    stopLoss: number;
  };
  keyLevels: {
    support: number[];
    resistance: number[];
    pivot: number;
  };
  strategies: Array<{
    type: string;
    description: string;
    riskReward: string;
    probability: number;
    timeHorizon: string;
  }>;
  marketRegime: 'trending' | 'ranging' | 'volatile' | 'breakout';
  correlationImpact: number;
  newsImpact: number;
  optionsFlow?: {
    sentiment: 'bullish' | 'bearish' | 'neutral';
    unusualActivity: boolean;
    impliedMove: number;
  };
}

export interface MarketRegimeAnalysis {
  regime: 'bull_market' | 'bear_market' | 'sideways' | 'correction' | 'recovery';
  confidence: number;
  duration: string;
  characteristics: string[];
  recommendations: string[];
}

export interface RiskMetrics {
  portfolioVaR: number; // Value at Risk
  sharpeRatio: number;
  maxDrawdown: number;
  beta: number;
  alpha: number;
  correlationRisk: number;
}

class AdvancedAIService {
  private modelWeights = {
    technical: 0.35,
    fundamental: 0.25,
    sentiment: 0.20,
    momentum: 0.15,
    volume: 0.05
  };

  private marketRegimeCache = new Map<string, any>();

  // Advanced technical analysis with multiple indicators
  private analyzeTechnicalIndicators(data: EnhancedMarketDataPoint): number {
    const { technicals, price } = data;
    let score = 50; // Neutral baseline

    // RSI Analysis (30% weight)
    if (technicals.rsi > 80) score -= 20; // Extremely overbought
    else if (technicals.rsi > 70) score -= 10; // Overbought
    else if (technicals.rsi < 20) score += 20; // Extremely oversold
    else if (technicals.rsi < 30) score += 10; // Oversold
    else if (technicals.rsi >= 45 && technicals.rsi <= 55) score += 5; // Neutral zone

    // MACD Analysis (25% weight)
    if (technicals.macd > technicals.macdSignal && technicals.macdHistogram > 0) {
      score += 15; // Bullish MACD
    } else if (technicals.macd < technicals.macdSignal && technicals.macdHistogram < 0) {
      score -= 15; // Bearish MACD
    }

    // Moving Average Analysis (25% weight)
    let maScore = 0;
    if (price > technicals.sma20) maScore += 5;
    if (price > technicals.sma50) maScore += 5;
    if (price > technicals.sma200) maScore += 5;
    if (technicals.sma20 > technicals.sma50) maScore += 3;
    if (technicals.sma50 > technicals.sma200) maScore += 3;
    score += maScore;

    // Bollinger Bands Analysis (10% weight)
    if (price > technicals.bollinger.upper) score -= 8; // Overbought
    else if (price < technicals.bollinger.lower) score += 8; // Oversold
    else if (price > technicals.bollinger.middle) score += 3; // Above middle

    // Stochastic Analysis (10% weight)
    if (technicals.stochastic.k > 80) score -= 5;
    else if (technicals.stochastic.k < 20) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  // Enhanced fundamental analysis
  private analyzeFundamentals(data: EnhancedMarketDataPoint): number {
    if (!data.fundamentals) return 50; // Neutral for crypto

    const { fundamentals } = data;
    let score = 50;

    // P/E Ratio Analysis
    if (fundamentals.pe < 10) score += 15; // Very undervalued
    else if (fundamentals.pe < 15) score += 10; // Undervalued
    else if (fundamentals.pe > 40) score -= 15; // Overvalued
    else if (fundamentals.pe > 25) score -= 10; // Expensive

    // ROE Analysis
    if (fundamentals.roe > 20) score += 10; // Excellent
    else if (fundamentals.roe > 15) score += 5; // Good
    else if (fundamentals.roe < 5) score -= 10; // Poor

    // Debt to Equity Analysis
    if (fundamentals.debtToEquity < 0.3) score += 5; // Low debt
    else if (fundamentals.debtToEquity > 2) score -= 10; // High debt

    // Dividend Analysis
    if (fundamentals.dividend > 0) {
      const dividendYield = (fundamentals.dividend / data.price) * 100;
      if (dividendYield > 3) score += 5; // Good dividend yield
    }

    return Math.max(0, Math.min(100, score));
  }

  // Advanced sentiment analysis
  private analyzeSentiment(data: EnhancedMarketDataPoint): number {
    const { sentiment } = data;
    let score = 50 + (sentiment.score * 0.3); // Base sentiment

    // News impact
    if (sentiment.newsCount > 20) {
      score += sentiment.score > 0 ? 5 : -5; // High news volume amplifies sentiment
    }

    // Social media impact
    if (sentiment.socialMentions > 500) {
      score += sentiment.score > 0 ? 3 : -3; // High social activity
    }

    // Institutional flow impact
    score += sentiment.institutionalFlow * 0.2;

    return Math.max(0, Math.min(100, score));
  }

  // Momentum analysis
  private analyzeMomentum(data: EnhancedMarketDataPoint): number {
    const { changePercent, technicals } = data;
    let score = 50;

    // Price momentum
    if (Math.abs(changePercent) > 5) {
      score += changePercent > 0 ? 20 : -20; // Strong momentum
    } else if (Math.abs(changePercent) > 2) {
      score += changePercent > 0 ? 10 : -10; // Moderate momentum
    }

    // ADX for trend strength
    if (technicals.adx > 50) score += 10; // Strong trend
    else if (technicals.adx < 20) score -= 5; // Weak trend

    return Math.max(0, Math.min(100, score));
  }

  // Volume analysis
  private analyzeVolume(data: EnhancedMarketDataPoint): number {
    const { volume, changePercent } = data;
    let score = 50;

    // Volume-price relationship
    if (volume > 0) {
      const avgVolume = volume; // Simplified - would use historical average
      const volumeRatio = volume / avgVolume;

      if (volumeRatio > 1.5 && changePercent > 0) score += 15; // High volume + up = bullish
      else if (volumeRatio > 1.5 && changePercent < 0) score -= 15; // High volume + down = bearish
      else if (volumeRatio < 0.5) score -= 5; // Low volume = weak signal
    }

    return Math.max(0, Math.min(100, score));
  }

  // Market regime detection
  private detectMarketRegime(data: EnhancedMarketDataPoint[]): MarketRegimeAnalysis {
    const spyData = data.find(d => d.symbol === 'SPY');
    if (!spyData) {
      return {
        regime: 'sideways',
        confidence: 50,
        duration: 'Unknown',
        characteristics: ['Insufficient data'],
        recommendations: ['Gather more market data']
      };
    }

    const { technicals, changePercent } = spyData;
    let regime: MarketRegimeAnalysis['regime'] = 'sideways';
    let confidence = 50;
    const characteristics: string[] = [];
    const recommendations: string[] = [];

    // Trend analysis
    if (technicals.sma20 > technicals.sma50 && technicals.sma50 > technicals.sma200) {
      regime = 'bull_market';
      confidence += 20;
      characteristics.push('Strong uptrend in moving averages');
      recommendations.push('Consider growth stocks and momentum strategies');
    } else if (technicals.sma20 < technicals.sma50 && technicals.sma50 < technicals.sma200) {
      regime = 'bear_market';
      confidence += 20;
      characteristics.push('Strong downtrend in moving averages');
      recommendations.push('Consider defensive positions and hedging');
    }

    // Volatility analysis
    if (technicals.atr > spyData.price * 0.03) {
      if (regime === 'sideways') regime = 'volatile';
      characteristics.push('High volatility environment');
      recommendations.push('Use smaller position sizes and wider stops');
    }

    // Recent performance
    if (Math.abs(changePercent) > 2) {
      characteristics.push(`Strong recent ${changePercent > 0 ? 'upward' : 'downward'} movement`);
    }

    return {
      regime,
      confidence: Math.min(95, confidence),
      duration: 'Current',
      characteristics,
      recommendations
    };
  }

  // Generate trading strategies based on analysis
  private generateStrategies(analysis: AdvancedAIAnalysis, data: EnhancedMarketDataPoint): AdvancedAIAnalysis['strategies'] {
    const strategies: AdvancedAIAnalysis['strategies'] = [];
    const { signal, scores, priceTargets } = analysis;

    if (signal === 'strong_bullish' || signal === 'bullish') {
      strategies.push({
        type: 'Long Position',
        description: `Buy ${data.symbol} with target at $${priceTargets.moderate.toFixed(2)}`,
        riskReward: '1:2.5',
        probability: analysis.confidence,
        timeHorizon: scores.momentum > 70 ? 'Short-term (1-5 days)' : 'Medium-term (1-4 weeks)'
      });

      if (data.options && scores.technical > 60) {
        strategies.push({
          type: 'Bull Call Spread',
          description: `Buy calls at current price, sell calls at $${priceTargets.conservative.toFixed(2)}`,
          riskReward: '1:3',
          probability: analysis.confidence * 0.8,
          timeHorizon: 'Short-term (1-2 weeks)'
        });
      }
    }

    if (signal === 'strong_bearish' || signal === 'bearish') {
      strategies.push({
        type: 'Short Position',
        description: `Short ${data.symbol} with target at $${priceTargets.moderate.toFixed(2)}`,
        riskReward: '1:2',
        probability: analysis.confidence,
        timeHorizon: 'Short-term (1-3 weeks)'
      });

      strategies.push({
        type: 'Protective Puts',
        description: `Buy puts as portfolio protection`,
        riskReward: 'Insurance',
        probability: 70,
        timeHorizon: 'Medium-term (1-2 months)'
      });
    }

    if (signal === 'neutral') {
      strategies.push({
        type: 'Range Trading',
        description: `Trade between support $${analysis.keyLevels.support[0]?.toFixed(2)} and resistance $${analysis.keyLevels.resistance[0]?.toFixed(2)}`,
        riskReward: '1:1.5',
        probability: 60,
        timeHorizon: 'Short-term (days)'
      });

      if (data.options) {
        strategies.push({
          type: 'Iron Condor',
          description: `Sell options at current levels to profit from low volatility`,
          riskReward: '1:0.3',
          probability: 65,
          timeHorizon: 'Short-term (2-4 weeks)'
        });
      }
    }

    return strategies;
  }

  // Main analysis function
  async analyzeSymbol(data: EnhancedMarketDataPoint): Promise<AdvancedAIAnalysis> {
    // Calculate individual scores
    const technicalScore = this.analyzeTechnicalIndicators(data);
    const fundamentalScore = this.analyzeFundamentals(data);
    const sentimentScore = this.analyzeSentiment(data);
    const momentumScore = this.analyzeMomentum(data);
    const volumeScore = this.analyzeVolume(data);

    // Calculate weighted overall score
    const overallScore = 
      (technicalScore * this.modelWeights.technical) +
      (fundamentalScore * this.modelWeights.fundamental) +
      (sentimentScore * this.modelWeights.sentiment) +
      (momentumScore * this.modelWeights.momentum) +
      (volumeScore * this.modelWeights.volume);

    // Determine signal strength
    let signal: AdvancedAIAnalysis['signal'] = 'neutral';
    let confidence = 50;

    if (overallScore > 80) {
      signal = 'strong_bullish';
      confidence = Math.min(95, overallScore + 5);
    } else if (overallScore > 65) {
      signal = 'bullish';
      confidence = Math.min(90, overallScore);
    } else if (overallScore < 20) {
      signal = 'strong_bearish';
      confidence = Math.min(95, (100 - overallScore) + 5);
    } else if (overallScore < 35) {
      signal = 'bearish';
      confidence = Math.min(90, 100 - overallScore);
    } else {
      confidence = 40 + Math.random() * 20;
    }

    // Determine risk level
    const volatility = Math.abs(data.changePercent);
    let riskLevel: AdvancedAIAnalysis['riskLevel'] = 'medium';
    
    if (volatility > 5) riskLevel = 'very_high';
    else if (volatility > 3) riskLevel = 'high';
    else if (volatility > 1.5) riskLevel = 'medium';
    else if (volatility > 0.5) riskLevel = 'low';
    else riskLevel = 'very_low';

    // Generate price targets
    const currentPrice = data.price;
    const atr = data.technicals.atr;
    
    const priceTargets = {
      conservative: signal.includes('bullish') 
        ? currentPrice + (atr * 1.5) 
        : currentPrice - (atr * 1.5),
      moderate: signal.includes('bullish') 
        ? currentPrice + (atr * 2.5) 
        : currentPrice - (atr * 2.5),
      aggressive: signal.includes('bullish') 
        ? currentPrice + (atr * 4) 
        : currentPrice - (atr * 4),
      stopLoss: signal.includes('bullish') 
        ? currentPrice - (atr * 2) 
        : currentPrice + (atr * 2)
    };

    // Generate key levels
    const keyLevels = {
      support: [
        currentPrice - atr,
        currentPrice - (atr * 2),
        data.technicals.sma50
      ].sort((a, b) => b - a),
      resistance: [
        currentPrice + atr,
        currentPrice + (atr * 2),
        data.technicals.bollinger.upper
      ].sort((a, b) => a - b),
      pivot: data.technicals.sma20
    };

    // Market regime detection
    let marketRegime: AdvancedAIAnalysis['marketRegime'] = 'ranging';
    if (data.technicals.adx > 40) marketRegime = 'trending';
    else if (volatility > 3) marketRegime = 'volatile';
    else if (Math.abs(data.changePercent) > 2) marketRegime = 'breakout';

    // Options flow analysis
    const optionsFlow = data.options ? {
      sentiment: data.options.putCallRatio < 0.7 ? 'bullish' as const : 
                data.options.putCallRatio > 1.3 ? 'bearish' as const : 'neutral' as const,
      unusualActivity: data.options.openInterest > 50000,
      impliedMove: data.options.impliedVolatility * currentPrice / 100
    } : undefined;

    const analysis: AdvancedAIAnalysis = {
      symbol: data.symbol,
      confidence: Math.round(confidence),
      signal,
      reasoning: this.generateReasoning(data, {
        technicalScore,
        fundamentalScore,
        sentimentScore,
        momentumScore,
        volumeScore
      }, signal),
      timeframe: this.determineTimeframe(riskLevel, momentumScore),
      riskLevel,
      scores: {
        technical: Math.round(technicalScore),
        fundamental: Math.round(fundamentalScore),
        sentiment: Math.round(sentimentScore),
        momentum: Math.round(momentumScore),
        volatility: Math.round(100 - (volatility * 10)),
        volume: Math.round(volumeScore)
      },
      priceTargets: {
        conservative: Number(priceTargets.conservative.toFixed(2)),
        moderate: Number(priceTargets.moderate.toFixed(2)),
        aggressive: Number(priceTargets.aggressive.toFixed(2)),
        stopLoss: Number(priceTargets.stopLoss.toFixed(2))
      },
      keyLevels,
      strategies: [],
      marketRegime,
      correlationImpact: Math.random() * 20 - 10, // Simplified
      newsImpact: data.sentiment.newsCount > 10 ? data.sentiment.score * 0.1 : 0,
      optionsFlow
    };

    // Generate strategies
    analysis.strategies = this.generateStrategies(analysis, data);

    return analysis;
  }

  private generateReasoning(
    data: EnhancedMarketDataPoint, 
    scores: any, 
    signal: string
  ): string {
    let reasoning = '';

    // Technical analysis reasoning
    if (scores.technicalScore > 70) {
      reasoning += `Strong technical setup with RSI at ${data.technicals.rsi.toFixed(1)} and bullish MACD signals. `;
    } else if (scores.technicalScore < 30) {
      reasoning += `Weak technical indicators with oversold RSI and bearish momentum signals. `;
    } else {
      reasoning += `Mixed technical signals with neutral momentum indicators. `;
    }

    // Fundamental reasoning
    if (data.fundamentals && scores.fundamentalScore > 60) {
      reasoning += `Solid fundamentals with P/E of ${data.fundamentals.pe.toFixed(1)} and ROE of ${data.fundamentals.roe.toFixed(1)}%. `;
    } else if (data.fundamentals && scores.fundamentalScore < 40) {
      reasoning += `Concerning fundamentals with elevated valuation metrics. `;
    }

    // Sentiment reasoning
    if (scores.sentimentScore > 60) {
      reasoning += `Positive market sentiment with ${data.sentiment.newsCount} recent news items and institutional inflows. `;
    } else if (scores.sentimentScore < 40) {
      reasoning += `Negative sentiment backdrop with bearish news flow and institutional selling. `;
    }

    // Symbol-specific insights
    if (data.symbol === 'NVDA') {
      reasoning += 'AI sector leadership and data center demand growth support the outlook. ';
    } else if (data.symbol === 'TSLA') {
      reasoning += 'EV market dynamics and production scaling influence near-term performance. ';
    } else if (data.symbol.includes('-USD')) {
      reasoning += 'Crypto market correlation with risk assets and regulatory developments impact pricing. ';
    } else if (data.symbol === 'SPY') {
      reasoning += 'Broad market sentiment reflects macroeconomic conditions and Fed policy expectations. ';
    }

    return reasoning.trim();
  }

  private determineTimeframe(riskLevel: string, momentumScore: number): string {
    if (riskLevel === 'very_high') return 'Very Short-term (1-2 days)';
    if (riskLevel === 'high') return 'Short-term (1-5 days)';
    if (momentumScore > 70) return 'Short-term (3-10 days)';
    if (momentumScore < 30) return 'Long-term (1-3 months)';
    return 'Medium-term (1-4 weeks)';
  }

  // Calculate portfolio risk metrics
  async calculateRiskMetrics(portfolio: EnhancedMarketDataPoint[]): Promise<RiskMetrics> {
    const returns = portfolio.map(asset => asset.changePercent / 100);
    const weights = portfolio.map(() => 1 / portfolio.length); // Equal weight

    // Portfolio return
    const portfolioReturn = returns.reduce((sum, ret, i) => sum + (ret * weights[i]), 0);

    // Portfolio variance (simplified)
    const portfolioVariance = returns.reduce((sum, ret, i) => 
      sum + Math.pow(ret * weights[i], 2), 0);

    // VaR calculation (95% confidence)
    const portfolioStdDev = Math.sqrt(portfolioVariance);
    const portfolioVaR = portfolioReturn - (1.645 * portfolioStdDev); // 95% VaR

    // Sharpe ratio (assuming 2% risk-free rate)
    const riskFreeRate = 0.02 / 252; // Daily risk-free rate
    const sharpeRatio = (portfolioReturn - riskFreeRate) / portfolioStdDev;

    // Beta calculation (vs SPY)
    const spyAsset = portfolio.find(asset => asset.symbol === 'SPY');
    const marketReturn = spyAsset ? spyAsset.changePercent / 100 : 0;
    const beta = portfolioReturn / marketReturn || 1;

    return {
      portfolioVaR: Number((portfolioVaR * 100).toFixed(2)),
      sharpeRatio: Number(sharpeRatio.toFixed(2)),
      maxDrawdown: Number((Math.max(...returns.map(r => Math.abs(r))) * 100).toFixed(2)),
      beta: Number(beta.toFixed(2)),
      alpha: Number(((portfolioReturn - (beta * marketReturn)) * 100).toFixed(2)),
      correlationRisk: Number((Math.random() * 50).toFixed(1)) // Simplified
    };
  }
}

export const advancedAIService = new AdvancedAIService();