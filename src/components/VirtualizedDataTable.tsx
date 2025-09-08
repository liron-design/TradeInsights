import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataRow {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

interface VirtualizedDataTableProps {
  data: DataRow[];
  height?: number;
  onRowClick?: (row: DataRow) => void;
}

export const VirtualizedDataTable: React.FC<VirtualizedDataTableProps> = ({
  data,
  height = 400,
  onRowClick
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(height);

  // Simple virtualization implementation
  const itemHeight = 60;
  const overscan = 5;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(data.length, startIndex + Math.ceil(containerHeight / itemHeight) + overscan * 2);
  const visibleItems = data.slice(startIndex, endIndex);
  const totalHeight = data.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  React.useEffect(() => {
    setContainerHeight(height);
  }, [height]);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('en-US').format(value);

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return formatCurrency(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">Market Data ({data.length} symbols)</h3>
      </div>
      
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-7 gap-4 py-3 px-4 text-sm font-semibold text-slate-600">
          <div>Symbol</div>
          <div className="text-right">Price</div>
          <div className="text-right">Change</div>
          <div className="text-right">Change %</div>
          <div className="text-right">Volume</div>
          <div className="text-right">Market Cap</div>
          <div className="text-center">Trend</div>
        </div>
      </div>

      {/* Virtualized Rows */}
      <div
        ref={parentRef}
        onScroll={handleScroll}
        className="overflow-auto"
        style={{ height: `${height}px` }}
      >
        <div
          style={{
            height: `${totalHeight}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {visibleItems.map((row, index) => {
            const actualIndex = startIndex + index;
            return (
              <div
                key={row.symbol}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${itemHeight}px`,
                  transform: `translateY(${offsetY + index * itemHeight}px)`,
                }}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                <div className="grid grid-cols-7 gap-4 py-4 px-4 h-full items-center">
                  <div>
                    <div className="font-semibold text-slate-900">{row.symbol}</div>
                    <div className="text-xs text-slate-500 truncate">{row.name}</div>
                  </div>
                  <div className="text-right font-semibold text-slate-900">
                    {formatCurrency(row.price)}
                  </div>
                  <div className={`text-right font-semibold ${
                    row.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {row.change >= 0 ? '+' : ''}{formatCurrency(row.change)}
                  </div>
                  <div className={`text-right font-semibold ${
                    row.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {row.changePercent >= 0 ? '+' : ''}{row.changePercent.toFixed(2)}%
                  </div>
                  <div className="text-right font-medium text-slate-900">
                    {formatNumber(row.volume)}
                  </div>
                  <div className="text-right font-medium text-slate-900">
                    {formatMarketCap(row.marketCap)}
                  </div>
                  <div className="text-center">
                    {row.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};