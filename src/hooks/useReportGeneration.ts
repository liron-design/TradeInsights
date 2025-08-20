import { useState, useCallback } from 'react';
import { aiAnalysisService, ComprehensiveReport } from '../services/aiAnalysisService';
import { marketDataService } from '../services/marketDataService';

export const useReportGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState<ComprehensiveReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (config?: {
    market?: string;
    focusTickers?: string[];
    timeHorizon?: string;
  }) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Fetch latest market data
      const marketData = await marketDataService.getMarketData();
      
      // Filter data based on focus tickers if provided
      const filteredData = config?.focusTickers?.length 
        ? marketData.filter(item => config.focusTickers!.includes(item.symbol))
        : marketData;

      // Generate comprehensive analysis
      const report = await aiAnalysisService.generateComprehensiveReport(filteredData);
      
      setCurrentReport(report);
      return report;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearReport = useCallback(() => {
    setCurrentReport(null);
    setError(null);
  }, []);

  return {
    generateReport,
    clearReport,
    isGenerating,
    currentReport,
    error
  };
};