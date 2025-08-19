import { useState, useEffect } from 'react';

export interface MarketDataPoint {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
  lastUpdate: Date;
}

// Simulated real-time market data with realistic price movements
const generateRealisticPrice = (basePrice: number, volatility: number = 0.02) => {
  const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
  return Math.max(basePrice + change, basePrice * 0.5); // Prevent negative prices
};

const initialMarketData: MarketDataPoint[] = [
  { symbol: 'SPY', name: 'S&P 500 ETF', price: 545.23, change: 2.45, changePercent: 0.45, volume: 45000000, marketCap: 0, lastUpdate: new Date() },
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 128.45, change: -1.23, changePercent: -0.95, volume: 28000000, marketCap: 3200000000000, lastUpdate: new Date() },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 242.87, change: 5.67, changePercent: 2.39, volume: 35000000, marketCap: 780000000000, lastUpdate: new Date() },
  { symbol: 'AAPL', name: 'Apple Inc', price: 191.23, change: 1.45, changePercent: 0.76, volume: 42000000, marketCap: 2900000000000, lastUpdate: new Date() },
  { symbol: 'BTC-USD', name: 'Bitcoin', price: 67245.32, change: 1234.56, changePercent: 1.87, volume: 0, marketCap: 1300000000000, lastUpdate: new Date() },
  { symbol: 'ETH-USD', name: 'Ethereum', price: 3456.78, change: -89.34, changePercent: -2.52, volume: 0, marketCap: 415000000000, lastUpdate: new Date() }
];

export const useMarketData = (refreshInterval: number = 5000) => {
  const [marketData, setMarketData] = useState<MarketDataPoint[]>(initialMarketData);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const updateMarketData = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setMarketData(prevData => 
        prevData.map(item => {
          const oldPrice = item.price;
          const newPrice = generateRealisticPrice(oldPrice, 0.015);
          const change = newPrice - oldPrice;
          const changePercent = (change / oldPrice) * 100;
          
          return {
            ...item,
            price: Number(newPrice.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            lastUpdate: new Date()
          };
        })
      );
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(updateMarketData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return {
    marketData,
    isLoading,
    lastUpdate,
    refreshData: updateMarketData
  };
};