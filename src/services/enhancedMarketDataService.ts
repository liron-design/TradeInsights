// Enhanced Market Data Service with realistic market behavior
import { format, subDays, isWeekend, addMinutes } from 'date-fns';

export interface EnhancedMarketDataPoint {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  lastUpdate: Date;
  technicals: {
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
    atr: number; // Average True Range
    adx: number; // Average Directional Index
  };
  fundamentals?: {
    pe: number;
    eps: number;
    dividend: number;
    beta: number;
    marketCap: number;
    bookValue: number;
    debtToEquity: number;
    roe: number; // Return on Equity
    roa: number; // Return on Assets
  };
  sentiment: {
    score: number; // -100 to 100
    newsCount: number;
    socialMentions: number;
    institutionalFlow: number;
  };
  options?: {
    impliedVolatility: number;
    putCallRatio: number;
    openInterest: number;
    maxPain: number;
  };
}

export interface MarketCorrelation {
  symbol1: string;
  symbol2: string;
  correlation: number;
  period: string;
}

export interface MarketSector {
  name: string;
  performance: number;
  symbols: string[];
  weight: number;
}

class EnhancedMarketDataService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 15000; // 15 seconds for real-time feel
  private priceHistory = new Map<string, number[]>();
  private correlationMatrix = new Map<string, Map<string, number>>();

  // Market sectors with realistic weights
  private sectors: MarketSector[] = [
    { name: 'Technology', performance: 0, symbols: ['NVDA', 'AAPL', 'MSFT'], weight: 0.28 },
    { name: 'Healthcare', performance: 0, symbols: ['JNJ', 'PFE'], weight: 0.13 },
    { name: 'Financial', performance: 0, symbols: ['JPM', 'BAC'], weight: 0.11 },
    { name: 'Consumer Discretionary', performance: 0, symbols: ['TSLA', 'AMZN'], weight: 0.12 },
    { name: 'Energy', performance: 0, symbols: ['XOM', 'CVX'], weight: 0.04 },
    { name: 'Crypto', performance: 0, symbols: ['BTC-USD', 'ETH-USD'], weight: 0.02 }
  ];

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Generate realistic price movements with market correlations
  private generateRealisticPrice(symbol: string, basePrice: number, volatility: number): number {
    const history = this.priceHistory.get(symbol) || [];
    
    // Market regime detection (trending vs ranging)
    const isMarketOpen = this.isMarketOpen();
    const timeOfDay = new Date().getHours();
    
    // Adjust volatility based on market hours
    let adjustedVolatility = volatility;
    if (!isMarketOpen) {
      adjustedVolatility *= 0.3; // Lower volatility after hours
    } else if (timeOfDay >= 9 && timeOfDay <= 10) {
      adjustedVolatility *= 1.5; // Higher volatility at market open
    } else if (timeOfDay >= 15 && timeOfDay <= 16) {
      adjustedVolatility *= 1.3; // Higher volatility at market close
    }

    // Mean reversion component
    const meanReversionStrength = 0.1;
    const recentAvg = history.slice(-20).reduce((sum, price) => sum + price, 0) / Math.min(20, history.length);
    const meanReversionForce = recentAvg ? (recentAvg - basePrice) * meanReversionStrength : 0;

    // Trend component
    const trendStrength = this.calculateTrend(history);
    const trendForce = trendStrength * basePrice * 0.001;

    // Random walk component
    const randomComponent = (Math.random() - 0.5) * 2 * adjustedVolatility * basePrice;

    // Market correlation component
    const correlationForce = this.calculateCorrelationForce(symbol, basePrice);

    const priceChange = randomComponent + meanReversionForce + trendForce + correlationForce;
    const newPrice = Math.max(basePrice + priceChange, basePrice * 0.01); // Prevent negative prices

    // Update price history
    history.push(newPrice);
    if (history.length > 200) history.shift(); // Keep last 200 prices
    this.priceHistory.set(symbol, history);

    return newPrice;
  }

  private calculateTrend(history: number[]): number {
    if (history.length < 10) return 0;
    
    const recent = history.slice(-10);
    const older = history.slice(-20, -10);
    
    const recentAvg = recent.reduce((sum, price) => sum + price, 0) / recent.length;
    const olderAvg = older.reduce((sum, price) => sum + price, 0) / older.length;
    
    return (recentAvg - olderAvg) / olderAvg;
  }

  private calculateCorrelationForce(symbol: string, basePrice: number): number {
    // Simplified correlation - in production, this would use real correlation data
    if (symbol === 'NVDA' || symbol === 'AAPL') {
      // Tech stocks correlate with each other
      const spyHistory = this.priceHistory.get('SPY') || [];
      if (spyHistory.length > 0) {
        const spyChange = spyHistory[spyHistory.length - 1] - spyHistory[spyHistory.length - 2];
        return spyChange * 0.3; // 30% correlation
      }
    }
    return 0;
  }

  private isMarketOpen(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Market is open Monday-Friday, 9:30 AM - 4:00 PM ET
    return day >= 1 && day <= 5 && hour >= 9 && hour < 16;
  }

  private calculateTechnicalIndicators(prices: number[]): any {
    if (prices.length < 50) {
      // Return default values if not enough data
      return {
        rsi: 50,
        macd: 0,
        macdSignal: 0,
        macdHistogram: 0,
        sma20: prices[prices.length - 1] || 0,
        sma50: prices[prices.length - 1] || 0,
        sma200: prices[prices.length - 1] || 0,
        ema12: prices[prices.length - 1] || 0,
        ema26: prices[prices.length - 1] || 0,
        bollinger: {
          upper: (prices[prices.length - 1] || 0) * 1.02,
          middle: prices[prices.length - 1] || 0,
          lower: (prices[prices.length - 1] || 0) * 0.98
        },
        stochastic: { k: 50, d: 50 },
        atr: (prices[prices.length - 1] || 0) * 0.02,
        adx: 25
      };
    }

    const currentPrice = prices[prices.length - 1];
    
    // RSI Calculation
    const rsi = this.calculateRSI(prices, 14);
    
    // Moving Averages
    const sma20 = this.calculateSMA(prices, 20);
    const sma50 = this.calculateSMA(prices, 50);
    const sma200 = this.calculateSMA(prices, 200);
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    
    // MACD
    const macd = ema12 - ema26;
    const macdSignal = this.calculateEMA([macd], 9);
    const macdHistogram = macd - macdSignal;
    
    // Bollinger Bands
    const sma20Value = sma20;
    const stdDev = this.calculateStandardDeviation(prices.slice(-20));
    const bollinger = {
      upper: sma20Value + (stdDev * 2),
      middle: sma20Value,
      lower: sma20Value - (stdDev * 2)
    };
    
    // Stochastic
    const stochastic = this.calculateStochastic(prices, 14);
    
    // ATR (Average True Range)
    const atr = this.calculateATR(prices, 14);
    
    // ADX (Average Directional Index)
    const adx = this.calculateADX(prices, 14);

    return {
      rsi,
      macd,
      macdSignal,
      macdHistogram,
      sma20,
      sma50,
      sma200,
      ema12,
      ema26,
      bollinger,
      stochastic,
      atr,
      adx
    };
  }

  private calculateRSI(prices: number[], period: number): number {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = prices.length - period; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    
    const slice = prices.slice(-period);
    return slice.reduce((sum, price) => sum + price, 0) / period;
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    if (prices.length === 1) return prices[0];
    
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  private calculateStandardDeviation(prices: number[]): number {
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / prices.length;
    return Math.sqrt(avgSquaredDiff);
  }

  private calculateStochastic(prices: number[], period: number): { k: number; d: number } {
    if (prices.length < period) return { k: 50, d: 50 };
    
    const slice = prices.slice(-period);
    const high = Math.max(...slice);
    const low = Math.min(...slice);
    const current = prices[prices.length - 1];
    
    const k = ((current - low) / (high - low)) * 100;
    const d = k; // Simplified - normally would be SMA of %K
    
    return { k, d };
  }

  private calculateATR(prices: number[], period: number): number {
    if (prices.length < period + 1) return prices[prices.length - 1] * 0.02;
    
    const trueRanges = [];
    for (let i = prices.length - period; i < prices.length; i++) {
      const high = prices[i];
      const low = prices[i] * 0.98; // Simplified - normally would use actual high/low
      const prevClose = prices[i - 1];
      
      const tr = Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      );
      trueRanges.push(tr);
    }
    
    return trueRanges.reduce((sum, tr) => sum + tr, 0) / period;
  }

  private calculateADX(prices: number[], period: number): number {
    // Simplified ADX calculation
    if (prices.length < period + 1) return 25;
    
    let upMoves = 0;
    let downMoves = 0;
    
    for (let i = prices.length - period; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) upMoves++;
      else if (change < 0) downMoves++;
    }
    
    const directionalMovement = Math.abs(upMoves - downMoves) / period;
    return Math.min(100, directionalMovement * 100);
  }

  // Enhanced market data generation with realistic behavior
  private generateEnhancedMarketData(): EnhancedMarketDataPoint[] {
    const baseData = [
      { 
        symbol: 'SPY', 
        name: 'SPDR S&P 500 ETF', 
        basePrice: 545.23, 
        volatility: 0.015,
        marketCap: 500000000000,
        volume: 45000000,
        pe: 22.5,
        eps: 24.32,
        dividend: 1.85,
        beta: 1.0,
        sector: 'ETF'
      },
      { 
        symbol: 'NVDA', 
        name: 'NVIDIA Corporation', 
        basePrice: 128.45, 
        volatility: 0.035,
        marketCap: 3200000000000,
        volume: 28000000,
        pe: 65.2,
        eps: 1.97,
        dividend: 0.16,
        beta: 1.75,
        sector: 'Technology'
      },
      { 
        symbol: 'TSLA', 
        name: 'Tesla Inc', 
        basePrice: 242.87, 
        volatility: 0.045,
        marketCap: 780000000000,
        volume: 35000000,
        pe: 85.3,
        eps: 2.85,
        dividend: 0,
        beta: 2.1,
        sector: 'Consumer Discretionary'
      },
      { 
        symbol: 'AAPL', 
        name: 'Apple Inc', 
        basePrice: 191.23, 
        volatility: 0.025,
        marketCap: 2900000000000,
        volume: 42000000,
        pe: 28.7,
        eps: 6.67,
        dividend: 0.96,
        beta: 1.25,
        sector: 'Technology'
      },
      { 
        symbol: 'BTC-USD', 
        name: 'Bitcoin', 
        basePrice: 67245.32, 
        volatility: 0.055,
        marketCap: 1300000000000,
        volume: 0,
        pe: 0,
        eps: 0,
        dividend: 0,
        beta: 1.8,
        sector: 'Crypto'
      },
      { 
        symbol: 'ETH-USD', 
        name: 'Ethereum', 
        basePrice: 3456.78, 
        volatility: 0.065,
        marketCap: 415000000000,
        volume: 0,
        pe: 0,
        eps: 0,
        dividend: 0,
        beta: 1.9,
        sector: 'Crypto'
      }
    ];

    return baseData.map(item => {
      const newPrice = this.generateRealisticPrice(item.symbol, item.basePrice, item.volatility);
      const priceChange = newPrice - item.basePrice;
      const changePercent = (priceChange / item.basePrice) * 100;
      
      const priceHistory = this.priceHistory.get(item.symbol) || [item.basePrice];
      const technicals = this.calculateTechnicalIndicators(priceHistory);
      
      // Generate sentiment data
      const sentiment = {
        score: Math.round((Math.random() - 0.5) * 200), // -100 to 100
        newsCount: Math.floor(Math.random() * 50),
        socialMentions: Math.floor(Math.random() * 1000),
        institutionalFlow: Math.round((Math.random() - 0.5) * 100)
      };

      // Generate options data for stocks
      const options = !item.symbol.includes('-USD') ? {
        impliedVolatility: item.volatility * 100 + (Math.random() - 0.5) * 10,
        putCallRatio: 0.5 + (Math.random() - 0.5) * 0.4,
        openInterest: Math.floor(Math.random() * 100000),
        maxPain: newPrice * (0.95 + Math.random() * 0.1)
      } : undefined;
      
      return {
        symbol: item.symbol,
        name: item.name,
        price: Number(newPrice.toFixed(2)),
        change: Number(priceChange.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2)),
        volume: Math.floor(item.volume * (0.8 + Math.random() * 0.4)),
        marketCap: item.marketCap,
        high: Number((newPrice * (1 + Math.random() * 0.02)).toFixed(2)),
        low: Number((newPrice * (1 - Math.random() * 0.02)).toFixed(2)),
        open: Number((item.basePrice * (0.99 + Math.random() * 0.02)).toFixed(2)),
        previousClose: item.basePrice,
        lastUpdate: new Date(),
        technicals,
        fundamentals: item.symbol.includes('-USD') ? undefined : {
          pe: item.pe,
          eps: item.eps,
          dividend: item.dividend,
          beta: item.beta,
          marketCap: item.marketCap,
          bookValue: newPrice * 0.8,
          debtToEquity: Math.random() * 2,
          roe: Math.random() * 30,
          roa: Math.random() * 15
        },
        sentiment,
        options
      };
    });
  }

  async getEnhancedMarketData(): Promise<EnhancedMarketDataPoint[]> {
    const cached = this.getFromCache<EnhancedMarketDataPoint[]>('enhancedMarketData');
    if (cached) return cached;

    // Simulate realistic API delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    const data = this.generateEnhancedMarketData();
    this.setCache('enhancedMarketData', data);
    return data;
  }

  async getMarketCorrelations(): Promise<MarketCorrelation[]> {
    const cached = this.getFromCache<MarketCorrelation[]>('correlations');
    if (cached) return cached;

    const correlations: MarketCorrelation[] = [
      { symbol1: 'NVDA', symbol2: 'AAPL', correlation: 0.65, period: '30D' },
      { symbol1: 'TSLA', symbol2: 'NVDA', correlation: 0.45, period: '30D' },
      { symbol1: 'BTC-USD', symbol2: 'ETH-USD', correlation: 0.85, period: '30D' },
      { symbol1: 'SPY', symbol2: 'NVDA', correlation: 0.72, period: '30D' },
      { symbol1: 'SPY', symbol2: 'AAPL', correlation: 0.78, period: '30D' }
    ];

    this.setCache('correlations', correlations);
    return correlations;
  }

  async getSectorPerformance(): Promise<MarketSector[]> {
    const cached = this.getFromCache<MarketSector[]>('sectors');
    if (cached) return cached;

    // Update sector performance based on constituent stocks
    const marketData = await this.getEnhancedMarketData();
    
    this.sectors.forEach(sector => {
      const sectorStocks = marketData.filter(stock => 
        sector.symbols.includes(stock.symbol)
      );
      
      if (sectorStocks.length > 0) {
        sector.performance = sectorStocks.reduce((sum, stock) => 
          sum + stock.changePercent, 0) / sectorStocks.length;
      }
    });

    this.setCache('sectors', this.sectors);
    return this.sectors;
  }
}

export const enhancedMarketDataService = new EnhancedMarketDataService();