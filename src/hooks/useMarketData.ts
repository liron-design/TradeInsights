import { useState, useEffect, useCallback } from 'react';
import { marketDataService, MarketDataPoint } from '../services/marketDataService';


export const useMarketData = (refreshInterval: number = 5000) => {
  const [marketData, setMarketData] = useState<MarketDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const updateMarketData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await marketDataService.getMarketData();
      setMarketData(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    updateMarketData(); // Initial load
    const interval = setInterval(updateMarketData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, updateMarketData]);

  return {
    marketData,
    isLoading,
    error,
    lastUpdate,
    refreshData: updateMarketData
  };
};