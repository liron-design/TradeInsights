import { useState, useEffect, useCallback } from 'react';
import { realTimeDataService, RealTimeDataPoint } from '../services/realTimeDataService';

export const useRealTimeData = (symbol: string) => {
  const [data, setData] = useState<RealTimeDataPoint | null>(null);
  const [history, setHistory] = useState<RealTimeDataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsConnected(realTimeDataService.getConnectionStatus());
    
    const unsubscribe = realTimeDataService.subscribe(
      `realtime:${symbol}`,
      (newData: RealTimeDataPoint) => {
        setData(newData);
        setHistory(prev => {
          const updated = [...prev, newData];
          // Keep last 1000 points for performance
          return updated.slice(-1000);
        });
        setError(null);
      }
    );

    return unsubscribe;
  }, [symbol]);

  const getLatestPrice = useCallback(() => {
    return data?.price || 0;
  }, [data]);

  const getPriceChange = useCallback(() => {
    if (history.length < 2) return { change: 0, changePercent: 0 };
    
    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    const change = current.price - previous.price;
    const changePercent = (change / previous.price) * 100;
    
    return { change, changePercent };
  }, [history]);

  const getSpread = useCallback(() => {
    return data ? data.ask - data.bid : 0;
  }, [data]);

  return {
    currentData: data,
    history,
    isConnected,
    error,
    getLatestPrice,
    getPriceChange,
    getSpread
  };
};