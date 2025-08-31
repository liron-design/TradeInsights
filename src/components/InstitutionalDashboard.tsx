import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Shield, Target, BarChart3, AlertTriangle, Activity, Zap } from 'lucide-react';
import { marketMicrostructureService, MarketMicrostructure, LiquidityMetrics, MarketRegime } from '../services/marketMicrostructureService';
import { LoadingSpinner } from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

export const InstitutionalDashboard: React.FC = () => {
  const [microstructureData, setMicrostructureData] = useState<MarketMicrostructure[]>([]);
  const [liquidityMetrics, setLiquidityMetrics] = useState<Map<string, LiquidityMetrics>>(new Map());
  const [marketRegimes, setMarketRegimes] = useState<Map<string, MarketRegime>>(new Map());
  const [selectedSymbol, setSelectedSymbol] = useState<string>('SPY');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const symbols = ['SPY', 'NVDA', 'TSLA', 'AAPL', 'BTC-USD', 'ETH-USD'];

  useEffect(() => {
    loadInstitutionalData();
    const interval = setInterval(loadInstitutionalData, 1000); // Update every second for real-time feel
    return () => clearInterval(interval);
  }, []);

  const loadInstitutionalData = async () => {
    try {
      // Load market microstructure data
      const microData = await marketMicrostructureService.getMarketMicrostructure(symbols);
      setMicrostructureData(microData);

      // Load liquidity metrics for each symbol
      const liquidityMap = new Map<string, LiquidityMetrics>();
      const regimeMap = new Map<string, MarketRegime>();
      
      for (const symbol of symbols) {
        const [liquidity, regime] = await Promise.all([
          marketMicrostructureService.getLiquidityAnalysis(symbol),
          marketMicrostructureService.getMarketRegimeAnalysis(symbol)
        ]);
        liquidityMap.set(symbol, liquidity);
        regimeMap.set(symbol, regime);
      }
      
      setLiquidityMetrics(liquidityMap);
      setMarketRegimes(regimeMap);
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('Failed to load institutional data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedData = microstructureData.find(data => data.symbol === selectedSymbol);
  const selectedLiquidity = liquidityMetrics.get(selectedSymbol);
  const selectedRegime = marketRegimes.get(selectedSymbol);

  const getRegimeColor = (regime: string) => {
    switch (regime) {
      case 'trending_bull': return 'text-green-700 bg-green-100 border-green-300';
      case 'trending_bear': return 'text-red-700 bg-red-100 border-red-300';
      case 'volatile': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'low_vol': return 'text-blue-700 bg-blue-100 border-blue-300';
      default: return 'text-purple-700 bg-purple-100 border-purple-300';
    }
  };

  const formatBasisPoints = (value: number) => `${value.toFixed(1)} bps`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading institutional analytics..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Institutional Trading Dashboard</h2>
        <p className="text-slate-600">
          Advanced market microstructure analysis with real-time liquidity metrics and regime detection
        </p>
      </motion.div>

      {/* Real-Time Market Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium text-green-600">Live Feed</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {microstructureData.length}
          </div>
          <div className="text-sm text-slate-500">Active Symbols</div>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-slate-500">Updated {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Avg Spread</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {microstructureData.length > 0 ? 
              (microstructureData.reduce((sum, data) => sum + data.spreadBps, 0) / microstructureData.length).toFixed(1) : '0'
            } bps
          </div>
          <div className="text-sm text-slate-500">Across all symbols</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Order Flow</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {microstructureData.length > 0 ? 
              Math.round(microstructureData.reduce((sum, data) => sum + Math.abs(data.orderFlow.netFlow), 0) / 1000000) : 0
            }M
          </div>
          <div className="text-sm text-slate-500">Net flow volume</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Volatility</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {microstructureData.length > 0 ? 
              (microstructureData.reduce((sum, data) => sum + data.volatility.realized, 0) / microstructureData.length * 100).toFixed(1) : '0'
            }%
          </div>
          <div className="text-sm text-slate-500">Realized vol</div>
        </div>
      </motion.div>

      {/* Symbol Selection */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Symbol Analysis</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {symbols.map(symbol => (
              <motion.button
                key={symbol}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSymbol(symbol)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedSymbol === symbol
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {symbol}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedData && (
              <motion.div
                key={selectedSymbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Price & Spread Info */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3">Market Data</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Price:</span>
                      <span className="font-bold text-slate-900">${selectedData.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bid:</span>
                      <span className="font-medium text-green-600">${selectedData.bid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ask:</span>
                      <span className="font-medium text-red-600">${selectedData.ask}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Spread:</span>
                      <span className="font-medium text-slate-900">{formatBasisPoints(selectedData.spreadBps)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">VWAP:</span>
                      <span className="font-medium text-blue-600">${selectedData.vwap}</span>
                    </div>
                  </div>
                </div>

                {/* Order Flow */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3">Order Flow</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Buy Volume:</span>
                      <span className="font-medium text-green-600">{selectedData.orderFlow.buyVolume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sell Volume:</span>
                      <span className="font-medium text-red-600">{selectedData.orderFlow.sellVolume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Net Flow:</span>
                      <span className={`font-bold ${selectedData.orderFlow.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedData.orderFlow.netFlow >= 0 ? '+' : ''}{selectedData.orderFlow.netFlow.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Large Orders:</span>
                      <span className="font-medium text-purple-600">{selectedData.orderFlow.largeOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Institutional:</span>
                      <span className="font-medium text-slate-900">{formatPercentage(selectedData.orderFlow.institutionalFlow / selectedData.volume)}</span>
                    </div>
                  </div>
                </div>

                {/* Volatility Metrics */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3">Volatility</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Realized:</span>
                      <span className="font-medium text-slate-900">{formatPercentage(selectedData.volatility.realized)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Implied:</span>
                      <span className="font-medium text-blue-600">{formatPercentage(selectedData.volatility.implied / 100)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">GARCH:</span>
                      <span className="font-medium text-purple-600">{formatPercentage(selectedData.volatility.garch)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Parkinson:</span>
                      <span className="font-medium text-orange-600">{formatPercentage(selectedData.volatility.parkinson)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Liquidity Analysis */}
      {selectedLiquidity && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Liquidity Metrics: {selectedSymbol}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatBasisPoints(selectedLiquidity.bidAskSpread / selectedData!.price * 10000)}
                </div>
                <div className="text-sm text-slate-600">Bid-Ask Spread</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {(selectedLiquidity.marketDepth / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-slate-600">Market Depth</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {formatPercentage(selectedLiquidity.priceImpact)}
                </div>
                <div className="text-sm text-slate-600">Price Impact</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {(selectedLiquidity.amihudRatio * 1000000).toFixed(2)}
                </div>
                <div className="text-sm text-slate-600">Amihud Ratio</div>
              </div>
            </div>
          </div>

          {/* Market Regime Analysis */}
          {selectedRegime && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Market Regime: {selectedSymbol}</h3>
              
              <div className={`p-4 rounded-lg border mb-4 ${getRegimeColor(selectedRegime.regime)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold capitalize">
                    {selectedRegime.regime.replace('_', ' ')} Regime
                  </span>
                  <span className="text-sm font-medium">{selectedRegime.confidence}% Confidence</span>
                </div>
                <div className="text-sm">Expected Duration: {selectedRegime.duration.toFixed(0)} days</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Volatility</div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, selectedRegime.characteristics.volatility * 500)}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{formatPercentage(selectedRegime.characteristics.volatility)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Momentum</div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.abs(selectedRegime.characteristics.momentum) * 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{(selectedRegime.characteristics.momentum * 100).toFixed(1)}%</div>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <div className="mb-1"><strong>Transition Probability:</strong> {formatPercentage(selectedRegime.transitions.probability)} daily</div>
                <div><strong>Key Triggers:</strong> {selectedRegime.transitions.triggers.join(', ')}</div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Real-Time Market Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Real-Time Market Microstructure</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-500">Live Updates</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Symbol</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Price</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Bid/Ask</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Spread (bps)</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Volume</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Net Flow</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">VWAP</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Volatility</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {microstructureData.map((data, index) => (
                  <motion.tr
                    key={data.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedSymbol(data.symbol)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-900">{data.symbol}</span>
                        {marketRegimes.get(data.symbol) && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getRegimeColor(marketRegimes.get(data.symbol)!.regime)
                          }`}>
                            {marketRegimes.get(data.symbol)!.regime.split('_')[0]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 font-bold text-slate-900">
                      ${data.price}
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="text-sm">
                        <div className="text-green-600">${data.bid}</div>
                        <div className="text-red-600">${data.ask}</div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 font-medium">
                      <span className={`${data.spreadBps > 5 ? 'text-red-600' : data.spreadBps > 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {data.spreadBps.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-right py-4 px-4 font-medium text-slate-900">
                      {(data.volume / 1000).toFixed(0)}K
                    </td>
                    <td className={`text-right py-4 px-4 font-medium ${
                      data.orderFlow.netFlow >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {data.orderFlow.netFlow >= 0 ? '+' : ''}{(data.orderFlow.netFlow / 1000).toFixed(0)}K
                    </td>
                    <td className="text-right py-4 px-4 font-medium text-blue-600">
                      ${data.vwap}
                    </td>
                    <td className="text-right py-4 px-4 font-medium text-purple-600">
                      {formatPercentage(data.volatility.realized)}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Market Impact Analysis */}
      {selectedData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">Market Impact Analysis: {selectedSymbol}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">Temporary Impact</h4>
              <div className="text-2xl font-bold text-red-600">
                ${selectedData.marketImpact.temporary.toFixed(4)}
              </div>
              <div className="text-sm text-red-700">Per share traded</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">Permanent Impact</h4>
              <div className="text-2xl font-bold text-orange-600">
                ${selectedData.marketImpact.permanent.toFixed(4)}
              </div>
              <div className="text-sm text-orange-700">Lasting price effect</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Liquidity Cost</h4>
              <div className="text-2xl font-bold text-purple-600">
                ${selectedData.marketImpact.liquidityCost.toFixed(4)}
              </div>
              <div className="text-sm text-purple-700">Total execution cost</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};