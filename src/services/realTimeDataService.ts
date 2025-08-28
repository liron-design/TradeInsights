// Real-time WebSocket data service for live market feeds
export interface RealTimeDataPoint {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
  bid: number;
  ask: number;
  spread: number;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  side: 'bid' | 'ask';
}

export interface OptionsFlow {
  symbol: string;
  strike: number;
  expiry: string;
  type: 'call' | 'put';
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

class RealTimeDataService {
  private ws: WebSocket | null = null;
  private subscribers = new Map<string, Set<(data: any) => void>>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      // In production, this would connect to a real WebSocket feed
      // For demo, we'll simulate WebSocket behavior
      this.simulateWebSocketConnection();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  private simulateWebSocketConnection() {
    // Simulate WebSocket connection for demo purposes
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    // Simulate real-time data updates every 100ms
    setInterval(() => {
      this.generateRealTimeData();
    }, 100);

    // Simulate options flow data every 5 seconds
    setInterval(() => {
      this.generateOptionsFlow();
    }, 5000);
  }

  private generateRealTimeData() {
    const symbols = ['SPY', 'NVDA', 'TSLA', 'AAPL', 'BTC-USD', 'ETH-USD'];
    
    symbols.forEach(symbol => {
      const basePrice = this.getBasePrice(symbol);
      const volatility = this.getVolatility(symbol);
      
      const price = basePrice + (Math.random() - 0.5) * volatility * basePrice;
      const volume = Math.floor(Math.random() * 1000000);
      const spread = price * 0.001; // 0.1% spread
      
      const data: RealTimeDataPoint = {
        symbol,
        price: Number(price.toFixed(2)),
        volume,
        timestamp: Date.now(),
        bid: Number((price - spread/2).toFixed(2)),
        ask: Number((price + spread/2).toFixed(2)),
        spread: Number(spread.toFixed(4))
      };

      this.notifySubscribers(`realtime:${symbol}`, data);
    });
  }

  private generateOptionsFlow() {
    const symbols = ['SPY', 'NVDA', 'TSLA', 'AAPL'];
    
    symbols.forEach(symbol => {
      const basePrice = this.getBasePrice(symbol);
      const strikes = [
        basePrice * 0.95,
        basePrice,
        basePrice * 1.05,
        basePrice * 1.1
      ];

      strikes.forEach(strike => {
        const optionsData: OptionsFlow = {
          symbol,
          strike: Number(strike.toFixed(2)),
          expiry: this.getRandomExpiry(),
          type: Math.random() > 0.5 ? 'call' : 'put',
          volume: Math.floor(Math.random() * 10000),
          openInterest: Math.floor(Math.random() * 50000),
          impliedVolatility: 0.15 + Math.random() * 0.3,
          delta: Math.random() * 0.8 - 0.4,
          gamma: Math.random() * 0.1,
          theta: -Math.random() * 0.05,
          vega: Math.random() * 0.2
        };

        this.notifySubscribers(`options:${symbol}`, optionsData);
      });
    });
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

  private getRandomExpiry(): string {
    const dates = ['2024-01-19', '2024-02-16', '2024-03-15', '2024-04-19'];
    return dates[Math.floor(Math.random() * dates.length)];
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private notifySubscribers(channel: string, data: any) {
    const channelSubscribers = this.subscribers.get(channel);
    if (channelSubscribers) {
      channelSubscribers.forEach(callback => callback(data));
    }
  }

  subscribe(channel: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    
    this.subscribers.get(channel)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const channelSubscribers = this.subscribers.get(channel);
      if (channelSubscribers) {
        channelSubscribers.delete(callback);
        if (channelSubscribers.size === 0) {
          this.subscribers.delete(channel);
        }
      }
    };
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

export const realTimeDataService = new RealTimeDataService();