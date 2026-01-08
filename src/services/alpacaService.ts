import { AlpacaConfig } from '../utils/storage';

export interface AlpacaMarketData {
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
  change: number;
  changePercent: number;
}

export interface AlpacaPosition {
  symbol: string;
  qty: number;
  avg_fill_price: number;
  current_price?: number;
  market_value?: number;
  unrealized_pl?: number;
  unrealized_plpc?: number;
}

export interface AlpacaAccount {
  cash: number;
  portfolio_value: number;
  buying_power: number;
  account_type: string;
  daytrading_buying_power: number;
  regt_buying_power: number;
}

export interface AlpacaOrder {
  id: string;
  symbol: string;
  qty: number;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  status: string;
  filled_qty?: number;
  filled_avg_price?: number;
  created_at: string;
  updated_at: string;
}

class AlpacaService {
  private config: AlpacaConfig | null = null;

  setConfig(config: AlpacaConfig): void {
    this.config = config;
  }

  isConfigured(): boolean {
    return !!this.config?.apiKey && !!this.config?.secretKey;
  }

  private getAuthHeaders(): HeadersInit {
    if (!this.config) throw new Error('Alpaca not configured');
    return {
      'APCA-API-KEY-ID': this.config.apiKey,
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async getAccount(): Promise<AlpacaAccount> {
    try {
      const response = await fetch(`${this.config?.baseUrl}/v2/account`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error(`Alpaca error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get account:', error);
      throw error;
    }
  }

  async getPositions(): Promise<AlpacaPosition[]> {
    try {
      const response = await fetch(`${this.config?.baseUrl}/v2/positions`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error(`Alpaca error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get positions:', error);
      throw error;
    }
  }

  async getOrderHistory(limit: number = 10): Promise<AlpacaOrder[]> {
    try {
      const response = await fetch(`${this.config?.baseUrl}/v2/orders?status=all&limit=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error(`Alpaca error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get order history:', error);
      throw error;
    }
  }

  async placeOrder(
    symbol: string,
    qty: number,
    side: 'buy' | 'sell',
    type: 'market' | 'limit' = 'market',
    limitPrice?: number
  ): Promise<AlpacaOrder> {
    try {
      const payload: Record<string, any> = {
        symbol,
        qty,
        side,
        type,
        time_in_force: 'day'
      };

      if (limitPrice) {
        payload.limit_price = limitPrice;
      }

      const response = await fetch(`${this.config?.baseUrl}/v2/orders`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to place order: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to place order:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    try {
      const response = await fetch(`${this.config?.baseUrl}/v2/orders/${orderId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error(`Alpaca error: ${response.statusText}`);
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  }

  async getLatestQuote(symbol: string): Promise<AlpacaMarketData> {
    try {
      const response = await fetch(
        `${this.config?.dataUrl}/v2/stocks/${symbol}/quotes/latest`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) throw new Error(`Alpaca error: ${response.statusText}`);
      const data = await response.json();

      return {
        symbol,
        price: data.quote?.ap || 0,
        open: data.quote?.o || 0,
        high: data.quote?.h || 0,
        low: data.quote?.l || 0,
        close: data.quote?.c || 0,
        volume: data.quote?.v || 0,
        timestamp: data.quote?.t || new Date().toISOString(),
        change: 0,
        changePercent: 0
      };
    } catch (error) {
      console.error(`Failed to get quote for ${symbol}:`, error);
      throw error;
    }
  }

  async getHistoricalBars(symbol: string, timeframe: string = '1Day', limit: number = 100) {
    try {
      const response = await fetch(
        `${this.config?.dataUrl}/v2/stocks/${symbol}/bars?timeframe=${timeframe}&limit=${limit}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) throw new Error(`Alpaca error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error(`Failed to get bars for ${symbol}:`, error);
      throw error;
    }
  }

  async closePosition(symbol: string): Promise<AlpacaOrder> {
    try {
      const response = await fetch(
        `${this.config?.baseUrl}/v2/positions/${symbol}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) throw new Error(`Alpaca error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error(`Failed to close position for ${symbol}:`, error);
      throw error;
    }
  }

  async getWatchlist(): Promise<string[]> {
    try {
      const response = await fetch(`${this.config?.baseUrl}/v2/watchlists`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error(`Alpaca error: ${response.statusText}`);
      const watchlists = await response.json();

      if (Array.isArray(watchlists) && watchlists.length > 0) {
        return watchlists[0].assets || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to get watchlist:', error);
      return [];
    }
  }
}

export const alpacaService = new AlpacaService();
