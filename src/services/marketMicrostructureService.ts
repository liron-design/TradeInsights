// Advanced Market Microstructure Service - Institutional Grade
import { format, addMinutes, subMinutes, isWeekend } from 'date-fns';

export interface MarketMicrostructure {
  symbol: string;
  timestamp: number;
  price: number;
  volume: number;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  spread: number;
  spreadBps: number;
  vwap: number;
  twap: number;
  orderFlow: {
    buyVolume: number;
    sellVolume: number;
    netFlow: number;
    largeOrders: number;
    retailFlow: number;
    institutionalFlow: number;
  };
  marketImpact: {
    temporary: number;
    permanent: number;
    liquidityCost: number;
  };
  volatility: {
    realized: number;
    implied: number;
    garch: number;
    parkinson: number;
  };
}

export interface LiquidityMetrics {
  symbol: string;
  bidAskSpread: number;
  marketDepth: number;
  priceImpact: number;
  turnoverRate: number;
  amihudRatio: number;
  effectiveSpread: number;
  realizationShortfall: number;
}

export interface MarketRegime {
  regime: 'trending_bull' | 'trending_bear' | 'mean_reverting' | 'volatile' | 'low_vol';
  confidence: number;
  duration: number;
  characteristics: {
    volatility: number;
    correlation: number;
    momentum: number;
    meanReversion: number;
  };
  transitions: {
    probability: number;
    expectedDuration: number;
    triggers: string[];
  };
}

class MarketMicrostructureService {
  private tickData = new Map<string, MarketMicrostructure[]>();
  private regimeHistory = new Map<string, MarketRegime[]>();
  private liquidityProviders = new Map<string, any>();
  
  // Advanced volatility models
  private garchParams = new Map<string, { alpha: number; beta: number; omega: number }>();
  
  // Market maker simulation
  private marketMakers = new Map<string, {
    inventory: number;
    targetInventory: number;
    riskAversion: number;
    spreadWidening: number;
  }>();

  constructor() {
    this.initializeMarketMakers();
    this.initializeGarchModels();
  }

  private initializeMarketMakers() {
    const symbols = ['SPY', 'NVDA', 'TSLA', 'AAPL', 'BTC-USD', 'ETH-USD'];
    
    symbols.forEach(symbol => {
      this.marketMakers.set(symbol, {
        inventory: 0,
        targetInventory: 0,
        riskAversion: 0.1 + Math.random() * 0.2,
        spreadWidening: 1.0
      });
    });
  }

  private initializeGarchModels() {
    const symbols = ['SPY', 'NVDA', 'TSLA', 'AAPL', 'BTC-USD', 'ETH-USD'];
    
    symbols.forEach(symbol => {
      this.garchParams.set(symbol, {
        alpha: 0.05 + Math.random() * 0.1, // ARCH parameter
        beta: 0.85 + Math.random() * 0.1,  // GARCH parameter
        omega: 0.000001 + Math.random() * 0.000005 // Long-term variance
      });
    });
  }

  // Advanced GARCH volatility modeling
  private calculateGarchVolatility(symbol: string, returns: number[]): number {
    const params = this.garchParams.get(symbol);
    if (!params || returns.length < 2) return 0.02;

    let variance = 0.0004; // Initial variance
    
    for (let i = 1; i < returns.length; i++) {
      const return_t = returns[i];
      variance = params.omega + params.alpha * Math.pow(return_t, 2) + params.beta * variance;
    }
    
    return Math.sqrt(variance * 252); // Annualized volatility
  }

  // Parkinson volatility estimator (using high-low data)
  private calculateParkinsonVolatility(highs: number[], lows: number[]): number {
    if (highs.length !== lows.length || highs.length < 2) return 0.02;
    
    let sum = 0;
    for (let i = 0; i < highs.length; i++) {
      if (lows[i] > 0) {
        sum += Math.pow(Math.log(highs[i] / lows[i]), 2);
      }
    }
    
    return Math.sqrt(sum / (4 * Math.log(2) * highs.length) * 252);
  }

  // Advanced order flow simulation
  private simulateOrderFlow(symbol: string, price: number, volume: number): MarketMicrostructure['orderFlow'] {
    const marketMaker = this.marketMakers.get(symbol);
    if (!marketMaker) {
      return {
        buyVolume: volume * 0.5,
        sellVolume: volume * 0.5,
        netFlow: 0,
        largeOrders: 0,
        retailFlow: volume * 0.3,
        institutionalFlow: volume * 0.7
      };
    }

    // Simulate informed trading vs noise trading
    const informedRatio = 0.3; // 30% informed trading
    const noiseRatio = 0.7;   // 70% noise trading
    
    // Large order detection (>10,000 shares or >$1M notional)
    const largeOrderThreshold = Math.max(10000, 1000000 / price);
    const largeOrders = Math.floor(volume / largeOrderThreshold * Math.random());
    
    // Retail vs institutional flow
    const retailFlow = volume * (0.2 + Math.random() * 0.3); // 20-50% retail
    const institutionalFlow = volume - retailFlow;
    
    // Buy/sell imbalance based on market maker inventory
    const inventoryImbalance = marketMaker.inventory / 100000; // Normalize
    const buyProbability = 0.5 - (inventoryImbalance * 0.1); // Adjust based on inventory
    
    const buyVolume = volume * Math.max(0.1, Math.min(0.9, buyProbability + (Math.random() - 0.5) * 0.2));
    const sellVolume = volume - buyVolume;
    const netFlow = buyVolume - sellVolume;
    
    // Update market maker inventory
    marketMaker.inventory += netFlow * 0.1; // Market maker absorbs 10% of flow
    
    return {
      buyVolume: Math.round(buyVolume),
      sellVolume: Math.round(sellVolume),
      netFlow: Math.round(netFlow),
      largeOrders,
      retailFlow: Math.round(retailFlow),
      institutionalFlow: Math.round(institutionalFlow)
    };
  }

  // Market impact modeling
  private calculateMarketImpact(symbol: string, orderSize: number, price: number): MarketMicrostructure['marketImpact'] {
    const adv = this.getAverageDailyVolume(symbol); // Average Daily Volume
    const participation = orderSize / adv;
    
    // Square root law for market impact
    const temporaryImpact = 0.1 * Math.sqrt(participation) * this.getVolatility(symbol);
    const permanentImpact = temporaryImpact * 0.3; // 30% of temporary becomes permanent
    
    // Liquidity cost (bid-ask spread + market impact)
    const spread = this.getBidAskSpread(symbol, price);
    const liquidityCost = spread + temporaryImpact;
    
    return {
      temporary: temporaryImpact * price,
      permanent: permanentImpact * price,
      liquidityCost: liquidityCost * price
    };
  }

  // VWAP and TWAP calculations
  private calculateVWAP(trades: Array<{ price: number; volume: number }>): number {
    const totalValue = trades.reduce((sum, trade) => sum + (trade.price * trade.volume), 0);
    const totalVolume = trades.reduce((sum, trade) => sum + trade.volume, 0);
    return totalVolume > 0 ? totalValue / totalVolume : 0;
  }

  private calculateTWAP(prices: number[]): number {
    return prices.reduce((sum, price) => sum + price, 0) / prices.length;
  }

  // Liquidity metrics calculation
  async calculateLiquidityMetrics(symbol: string): Promise<LiquidityMetrics> {
    const tickData = this.tickData.get(symbol) || [];
    if (tickData.length < 100) {
      return {
        symbol,
        bidAskSpread: 0.01,
        marketDepth: 1000000,
        priceImpact: 0.001,
        turnoverRate: 0.1,
        amihudRatio: 0.00001,
        effectiveSpread: 0.015,
        realizationShortfall: 0.002
      };
    }

    const recentTicks = tickData.slice(-100);
    
    // Bid-ask spread
    const avgSpread = recentTicks.reduce((sum, tick) => sum + tick.spread, 0) / recentTicks.length;
    
    // Market depth (average bid/ask sizes)
    const avgDepth = recentTicks.reduce((sum, tick) => 
      sum + (tick.bidSize + tick.askSize), 0) / recentTicks.length;
    
    // Price impact (price change per unit volume)
    const priceImpact = this.calculateAverageImpact(recentTicks);
    
    // Turnover rate
    const avgVolume = recentTicks.reduce((sum, tick) => sum + tick.volume, 0) / recentTicks.length;
    const marketCap = this.getMarketCap(symbol);
    const turnoverRate = (avgVolume * recentTicks[0].price) / marketCap;
    
    // Amihud illiquidity ratio
    const amihudRatio = this.calculateAmihudRatio(recentTicks);
    
    return {
      symbol,
      bidAskSpread: avgSpread,
      marketDepth: avgDepth,
      priceImpact,
      turnoverRate,
      amihudRatio,
      effectiveSpread: avgSpread * 1.5, // Effective spread is typically 1.5x quoted spread
      realizationShortfall: priceImpact * 0.5
    };
  }

  private calculateAverageImpact(ticks: MarketMicrostructure[]): number {
    let totalImpact = 0;
    let count = 0;
    
    for (let i = 1; i < ticks.length; i++) {
      const priceChange = Math.abs(ticks[i].price - ticks[i-1].price);
      const volume = ticks[i].volume;
      if (volume > 0) {
        totalImpact += priceChange / volume;
        count++;
      }
    }
    
    return count > 0 ? totalImpact / count : 0.001;
  }

  private calculateAmihudRatio(ticks: MarketMicrostructure[]): number {
    let sum = 0;
    let count = 0;
    
    for (let i = 1; i < ticks.length; i++) {
      const priceChange = Math.abs(ticks[i].price - ticks[i-1].price) / ticks[i-1].price;
      const dollarVolume = ticks[i].volume * ticks[i].price;
      if (dollarVolume > 0) {
        sum += priceChange / dollarVolume;
        count++;
      }
    }
    
    return count > 0 ? sum / count * 1000000 : 0.00001; // Scale to readable units
  }

  // Market regime detection using advanced statistical methods
  async detectMarketRegime(symbol: string): Promise<MarketRegime> {
    const tickData = this.tickData.get(symbol) || [];
    if (tickData.length < 200) {
      return {
        regime: 'mean_reverting',
        confidence: 50,
        duration: 0,
        characteristics: {
          volatility: 0.02,
          correlation: 0.5,
          momentum: 0,
          meanReversion: 0.1
        },
        transitions: {
          probability: 0.1,
          expectedDuration: 5,
          triggers: ['Insufficient data']
        }
      };
    }

    const recentTicks = tickData.slice(-200);
    const prices = recentTicks.map(tick => tick.price);
    const returns = this.calculateReturns(prices);
    
    // Volatility clustering detection
    const volatilityClustering = this.detectVolatilityClustering(returns);
    
    // Momentum vs mean reversion
    const momentum = this.calculateMomentum(prices);
    const meanReversion = this.calculateMeanReversion(prices);
    
    // Correlation with market
    const marketCorrelation = await this.calculateMarketCorrelation(symbol, prices);
    
    // Regime classification
    let regime: MarketRegime['regime'] = 'mean_reverting';
    let confidence = 50;
    
    if (momentum > 0.3 && volatilityClustering < 0.5) {
      regime = returns[returns.length - 1] > 0 ? 'trending_bull' : 'trending_bear';
      confidence = 70 + momentum * 20;
    } else if (volatilityClustering > 0.7) {
      regime = 'volatile';
      confidence = 60 + volatilityClustering * 30;
    } else if (volatilityClustering < 0.3 && Math.abs(momentum) < 0.1) {
      regime = 'low_vol';
      confidence = 65;
    }
    
    return {
      regime,
      confidence: Math.min(95, confidence),
      duration: this.estimateRegimeDuration(regime, returns),
      characteristics: {
        volatility: this.calculateRealizedVolatility(returns),
        correlation: marketCorrelation,
        momentum,
        meanReversion
      },
      transitions: {
        probability: this.calculateTransitionProbability(regime, returns),
        expectedDuration: this.estimateRegimeDuration(regime, returns),
        triggers: this.identifyRegimeTriggers(regime)
      }
    };
  }

  private calculateReturns(prices: number[]): number[] {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i-1]) / prices[i-1]);
    }
    return returns;
  }

  private detectVolatilityClustering(returns: number[]): number {
    if (returns.length < 20) return 0.5;
    
    // Calculate rolling volatility
    const windowSize = 10;
    const rollingVols = [];
    
    for (let i = windowSize; i < returns.length; i++) {
      const window = returns.slice(i - windowSize, i);
      const vol = Math.sqrt(window.reduce((sum, r) => sum + r * r, 0) / windowSize);
      rollingVols.push(vol);
    }
    
    // Measure volatility of volatility
    const volOfVol = Math.sqrt(
      rollingVols.reduce((sum, vol, i) => {
        if (i === 0) return 0;
        const change = vol - rollingVols[i-1];
        return sum + change * change;
      }, 0) / (rollingVols.length - 1)
    );
    
    // Normalize to 0-1 scale
    return Math.min(1, volOfVol * 100);
  }

  private calculateMomentum(prices: number[]): number {
    if (prices.length < 20) return 0;
    
    const shortMA = this.calculateMA(prices.slice(-10));
    const longMA = this.calculateMA(prices.slice(-20));
    
    return (shortMA - longMA) / longMA;
  }

  private calculateMeanReversion(prices: number[]): number {
    if (prices.length < 50) return 0.1;
    
    const longTermMean = this.calculateMA(prices.slice(-50));
    const currentPrice = prices[prices.length - 1];
    const deviation = Math.abs(currentPrice - longTermMean) / longTermMean;
    
    // Higher values indicate stronger mean reversion tendency
    return Math.min(1, deviation * 5);
  }

  private calculateMA(prices: number[]): number {
    return prices.reduce((sum, price) => sum + price, 0) / prices.length;
  }

  private calculateRealizedVolatility(returns: number[]): number {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance * 252); // Annualized
  }

  private async calculateMarketCorrelation(symbol: string, prices: number[]): Promise<number> {
    // Simplified correlation with SPY
    if (symbol === 'SPY') return 1.0;
    
    const spyTicks = this.tickData.get('SPY') || [];
    if (spyTicks.length < prices.length) return 0.5;
    
    const spyPrices = spyTicks.slice(-prices.length).map(tick => tick.price);
    const spyReturns = this.calculateReturns(spyPrices);
    const symbolReturns = this.calculateReturns(prices);
    
    if (spyReturns.length !== symbolReturns.length) return 0.5;
    
    return this.calculateCorrelation(symbolReturns, spyReturns);
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length < 2) return 0;
    
    const meanX = x.reduce((sum, val) => sum + val, 0) / x.length;
    const meanY = y.reduce((sum, val) => sum + val, 0) / y.length;
    
    let numerator = 0;
    let sumXSquared = 0;
    let sumYSquared = 0;
    
    for (let i = 0; i < x.length; i++) {
      const deltaX = x[i] - meanX;
      const deltaY = y[i] - meanY;
      numerator += deltaX * deltaY;
      sumXSquared += deltaX * deltaX;
      sumYSquared += deltaY * deltaY;
    }
    
    const denominator = Math.sqrt(sumXSquared * sumYSquared);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private estimateRegimeDuration(regime: MarketRegime['regime'], returns: number[]): number {
    // Estimate how long the current regime will last (in days)
    const volatility = this.calculateRealizedVolatility(returns);
    
    switch (regime) {
      case 'trending_bull':
      case 'trending_bear':
        return Math.max(5, 30 - volatility * 100); // Trends last 5-30 days
      case 'volatile':
        return Math.max(2, 10 - volatility * 50); // Volatile periods are shorter
      case 'low_vol':
        return Math.max(10, 60 - volatility * 200); // Low vol can persist longer
      default:
        return 15; // Mean reverting default
    }
  }

  private calculateTransitionProbability(regime: MarketRegime['regime'], returns: number[]): number {
    const recentVolatility = this.calculateRealizedVolatility(returns.slice(-10));
    const longTermVolatility = this.calculateRealizedVolatility(returns);
    
    // Higher probability of regime change when volatility changes significantly
    const volRatio = recentVolatility / longTermVolatility;
    
    if (volRatio > 1.5 || volRatio < 0.67) {
      return Math.min(0.3, 0.1 + Math.abs(volRatio - 1) * 0.2);
    }
    
    return 0.05; // Base 5% daily transition probability
  }

  private identifyRegimeTriggers(regime: MarketRegime['regime']): string[] {
    const triggers = {
      trending_bull: ['Positive earnings surprises', 'Fed dovish signals', 'Economic data beats'],
      trending_bear: ['Recession fears', 'Fed hawkish stance', 'Geopolitical tensions'],
      volatile: ['Earnings season', 'FOMC meetings', 'Economic uncertainty'],
      low_vol: ['Summer trading', 'Holiday periods', 'Stable macro environment'],
      mean_reverting: ['Range-bound markets', 'Balanced sentiment', 'Technical consolidation']
    };
    
    return triggers[regime] || ['Market dynamics'];
  }

  // Helper methods
  private getAverageDailyVolume(symbol: string): number {
    const volumes = {
      'SPY': 45000000,
      'NVDA': 28000000,
      'TSLA': 35000000,
      'AAPL': 42000000,
      'BTC-USD': 1000000000, // In USD terms
      'ETH-USD': 500000000
    };
    return volumes[symbol as keyof typeof volumes] || 10000000;
  }

  private getVolatility(symbol: string): number {
    const volatilities = {
      'SPY': 0.015,
      'NVDA': 0.035,
      'TSLA': 0.045,
      'AAPL': 0.025,
      'BTC-USD': 0.055,
      'ETH-USD': 0.065
    };
    return volatilities[symbol as keyof typeof volatilities] || 0.02;
  }

  private getBidAskSpread(symbol: string, price: number): number {
    const spreadBps = {
      'SPY': 1,    // 1 basis point
      'NVDA': 3,   // 3 basis points
      'TSLA': 4,   // 4 basis points
      'AAPL': 2,   // 2 basis points
      'BTC-USD': 5, // 5 basis points
      'ETH-USD': 6  // 6 basis points
    };
    
    const bps = spreadBps[symbol as keyof typeof spreadBps] || 3;
    return price * (bps / 10000); // Convert basis points to dollar amount
  }

  private getMarketCap(symbol: string): number {
    const marketCaps = {
      'SPY': 500000000000,
      'NVDA': 3200000000000,
      'TSLA': 780000000000,
      'AAPL': 2900000000000,
      'BTC-USD': 1300000000000,
      'ETH-USD': 415000000000
    };
    return marketCaps[symbol as keyof typeof marketCaps] || 100000000000;
  }

  // Main method to generate enhanced market microstructure data
  async generateMarketMicrostructure(symbol: string): Promise<MarketMicrostructure> {
    const basePrice = this.getBasePrice(symbol);
    const volatility = this.getVolatility(symbol);
    
    // Generate realistic price with microstructure effects
    const tickData = this.tickData.get(symbol) || [];
    const priceChange = this.generatePriceChange(symbol, basePrice, volatility, tickData);
    const newPrice = Math.max(basePrice + priceChange, basePrice * 0.01);
    
    // Generate volume with realistic patterns
    const volume = this.generateRealisticVolume(symbol);
    
    // Calculate bid-ask spread with market maker effects
    const marketMaker = this.marketMakers.get(symbol);
    const baseSpread = this.getBidAskSpread(symbol, newPrice);
    const adjustedSpread = baseSpread * (marketMaker?.spreadWidening || 1.0);
    
    const bid = newPrice - adjustedSpread / 2;
    const ask = newPrice + adjustedSpread / 2;
    
    // Generate order book depth
    const bidSize = Math.floor(Math.random() * 10000 + 1000);
    const askSize = Math.floor(Math.random() * 10000 + 1000);
    
    // Calculate VWAP and TWAP
    const recentTrades = tickData.slice(-20).map(tick => ({ price: tick.price, volume: tick.volume }));
    const vwap = recentTrades.length > 0 ? this.calculateVWAP(recentTrades) : newPrice;
    const twap = tickData.length > 0 ? this.calculateTWAP(tickData.slice(-20).map(t => t.price)) : newPrice;
    
    // Generate order flow
    const orderFlow = this.simulateOrderFlow(symbol, newPrice, volume);
    
    // Calculate market impact
    const marketImpact = this.calculateMarketImpact(symbol, volume, newPrice);
    
    // Calculate volatility metrics
    const returns = tickData.length > 1 ? this.calculateReturns(tickData.slice(-50).map(t => t.price)) : [0];
    const garchVol = this.calculateGarchVolatility(symbol, returns);
    const parkinsonVol = this.calculateParkinsonVolatility(
      tickData.slice(-20).map(t => t.price * 1.01), // Simulate highs
      tickData.slice(-20).map(t => t.price * 0.99)  // Simulate lows
    );
    
    const microstructure: MarketMicrostructure = {
      symbol,
      timestamp: Date.now(),
      price: Number(newPrice.toFixed(2)),
      volume,
      bid: Number(bid.toFixed(2)),
      ask: Number(ask.toFixed(2)),
      bidSize,
      askSize,
      spread: Number(adjustedSpread.toFixed(4)),
      spreadBps: Number((adjustedSpread / newPrice * 10000).toFixed(1)),
      vwap: Number(vwap.toFixed(2)),
      twap: Number(twap.toFixed(2)),
      orderFlow,
      marketImpact,
      volatility: {
        realized: this.calculateRealizedVolatility(returns),
        implied: volatility * 100,
        garch: garchVol,
        parkinson: parkinsonVol
      }
    };
    
    // Store tick data
    const currentTicks = this.tickData.get(symbol) || [];
    currentTicks.push(microstructure);
    if (currentTicks.length > 1000) currentTicks.shift(); // Keep last 1000 ticks
    this.tickData.set(symbol, currentTicks);
    
    return microstructure;
  }

  private generatePriceChange(symbol: string, basePrice: number, volatility: number, history: MarketMicrostructure[]): number {
    // Advanced price generation with multiple factors
    
    // 1. Random walk component
    const randomComponent = (Math.random() - 0.5) * 2 * volatility * basePrice;
    
    // 2. Mean reversion component
    const meanReversionStrength = 0.05;
    const longTermMean = history.length > 50 ? 
      this.calculateMA(history.slice(-50).map(h => h.price)) : basePrice;
    const meanReversionForce = (longTermMean - basePrice) * meanReversionStrength;
    
    // 3. Momentum component
    const momentum = history.length > 10 ? 
      this.calculateMomentum(history.slice(-10).map(h => h.price)) : 0;
    const momentumForce = momentum * basePrice * 0.001;
    
    // 4. Order flow impact
    const orderFlowImpact = history.length > 0 ? 
      history[history.length - 1].orderFlow.netFlow * 0.000001 : 0;
    
    // 5. Market maker inventory effect
    const marketMaker = this.marketMakers.get(symbol);
    const inventoryEffect = marketMaker ? 
      -marketMaker.inventory * 0.00001 : 0; // Market makers push price opposite to inventory
    
    return randomComponent + meanReversionForce + momentumForce + orderFlowImpact + inventoryEffect;
  }

  private generateRealisticVolume(symbol: string): number {
    const baseVolume = this.getAverageDailyVolume(symbol);
    const timeOfDay = new Date().getHours();
    
    // Volume patterns throughout the day
    let volumeMultiplier = 1.0;
    if (timeOfDay >= 9 && timeOfDay <= 10) {
      volumeMultiplier = 2.5; // High volume at open
    } else if (timeOfDay >= 15 && timeOfDay <= 16) {
      volumeMultiplier = 2.0; // High volume at close
    } else if (timeOfDay >= 11 && timeOfDay <= 14) {
      volumeMultiplier = 0.6; // Lower volume midday
    }
    
    // Add randomness
    const randomFactor = 0.5 + Math.random();
    
    return Math.floor(baseVolume * volumeMultiplier * randomFactor / 390); // Divide by minutes in trading day
  }

  private getBasePrice(symbol: string): number {
    const prices = {
      'SPY': 545.23,
      'NVDA': 128.45,
      'TSLA': 242.87,
      'AAPL': 191.23,
      'BTC-USD': 67245.32,
      'ETH-USD': 3456.78
    };
    return prices[symbol as keyof typeof prices] || 100;
  }

  // Public API methods
  async getMarketMicrostructure(symbols: string[]): Promise<MarketMicrostructure[]> {
    return Promise.all(symbols.map(symbol => this.generateMarketMicrostructure(symbol)));
  }

  async getLiquidityAnalysis(symbol: string): Promise<LiquidityMetrics> {
    return this.calculateLiquidityMetrics(symbol);
  }

  async getMarketRegimeAnalysis(symbol: string): Promise<MarketRegime> {
    return this.detectMarketRegime(symbol);
  }
}

export const marketMicrostructureService = new MarketMicrostructureService();