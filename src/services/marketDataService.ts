import { format, subDays, isWeekend } from 'date-fns';

export interface MarketDataPoint {
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
    sma20: number;
    sma50: number;
    bollinger: {
      upper: number;
      middle: number;
      lower: number;
    };
  };
  fundamentals?: {
    pe: number;
    eps: number;
    dividend: number;
    beta: number;
  };
}

export interface HistoricalDataPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class MarketDataService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30000; // 30 seconds

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

  // Enhanced market data with realistic technical indicators
  private generateRealisticMarketData(): MarketDataPoint[] {
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
        beta: 1.0
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
        beta: 1.75
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
        beta: 2.1
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
        beta: 1.25
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
        beta: 1.8
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
        beta: 1.9
      }
    ];

    return baseData.map(item => {
      const priceChange = (Math.random() - 0.5) * 2 * item.volatility * item.basePrice;
      const newPrice = Math.max(item.basePrice + priceChange, item.basePrice * 0.5);
      const changePercent = (priceChange / item.basePrice) * 100;
      
      // Generate realistic technical indicators
      const rsi = 30 + Math.random() * 40; // RSI between 30-70
      const sma20 = newPrice * (0.98 + Math.random() * 0.04);
      const sma50 = newPrice * (0.95 + Math.random() * 0.1);
      
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
        technicals: {
          rsi: Number(rsi.toFixed(1)),
          macd: Number(((Math.random() - 0.5) * 2).toFixed(2)),
          sma20: Number(sma20.toFixed(2)),
          sma50: Number(sma50.toFixed(2)),
          bollinger: {
            upper: Number((sma20 * 1.02).toFixed(2)),
            middle: Number(sma20.toFixed(2)),
            lower: Number((sma20 * 0.98).toFixed(2))
          }
        },
        fundamentals: item.symbol.includes('-USD') ? undefined : {
          pe: item.pe,
          eps: item.eps,
          dividend: item.dividend,
          beta: item.beta
        }
      };
    });
  }

  async getMarketData(): Promise<MarketDataPoint[]> {
    const cached = this.getFromCache<MarketDataPoint[]>('marketData');
    if (cached) return cached;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const data = this.generateRealisticMarketData();
    this.setCache('marketData', data);
    return data;
  }

  async getHistoricalData(symbol: string, days: number = 30): Promise<HistoricalDataPoint[]> {
    const cacheKey = `historical_${symbol}_${days}`;
    const cached = this.getFromCache<HistoricalDataPoint[]>(cacheKey);
    if (cached) return cached;

    const marketData = await this.getMarketData();
    const symbolData = marketData.find(item => item.symbol === symbol);
    if (!symbolData) throw new Error(`Symbol ${symbol} not found`);

    const data: HistoricalDataPoint[] = [];
    const basePrice = symbolData.price;
    
    for (let i = days; i >= 0; i--) {
      const date = subDays(new Date(), i);
      if (isWeekend(date) && !symbol.includes('-USD')) continue; // Skip weekends for stocks
      
      const volatility = symbolData.symbol === 'NVDA' ? 0.035 : 
                        symbolData.symbol === 'TSLA' ? 0.045 : 
                        symbolData.symbol.includes('-USD') ? 0.055 : 0.025;
      
      const dailyChange = (Math.random() - 0.5) * 2 * volatility;
      const price = basePrice * (1 + dailyChange * (i / days));
      const volume = symbolData.volume * (0.7 + Math.random() * 0.6);
      
      data.push({
        timestamp: date.toISOString(),
        open: Number((price * (0.995 + Math.random() * 0.01)).toFixed(2)),
        high: Number((price * (1 + Math.random() * 0.02)).toFixed(2)),
        low: Number((price * (1 - Math.random() * 0.02)).toFixed(2)),
        close: Number(price.toFixed(2)),
        volume: Math.floor(volume)
      });
    }

    this.setCache(cacheKey, data);
    return data;
  }

  async getMarketNews(): Promise<Array<{
    id: string;
    title: string;
    summary: string;
    source: string;
    timestamp: Date;
    sentiment: 'positive' | 'negative' | 'neutral';
    relevantSymbols: string[];
  }>> {
    const cached = this.getFromCache('marketNews');
    if (cached) return cached;

    const news = [
      {
        id: '1',
        title: 'NVIDIA Reports Strong Q3 Earnings, AI Demand Continues',
        summary: 'NVIDIA exceeded expectations with $60.9B revenue, driven by data center growth and AI chip demand.',
        source: 'Reuters',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        sentiment: 'positive' as const,
        relevantSymbols: ['NVDA']
      },
      {
        id: '2',
        title: 'Federal Reserve Signals Potential Rate Cuts in 2024',
        summary: 'Fed officials hint at possible monetary policy easing if inflation continues to moderate.',
        source: 'Bloomberg',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        sentiment: 'positive' as const,
        relevantSymbols: ['SPY', 'QQQ']
      },
      {
        id: '3',
        title: 'Tesla Cybertruck Production Ramp Faces Challenges',
        summary: 'Manufacturing bottlenecks delay Tesla\'s ambitious Cybertruck delivery targets.',
        source: 'CNBC',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        sentiment: 'negative' as const,
        relevantSymbols: ['TSLA']
      }
    ];

    this.setCache('marketNews', news);
    return news;
  }
}

export const marketDataService = new MarketDataService();