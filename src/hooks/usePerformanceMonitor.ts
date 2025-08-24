import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentName: string;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
      
      // Memory usage monitoring
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log(`Memory usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      }
    }

    // Report to analytics in production
    if (process.env.NODE_ENV === 'production' && renderTime > 100) {
      // Report slow renders to monitoring service
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  });

  const measureAsync = async <T>(operation: () => Promise<T>, operationName: string): Promise<T> => {
    const start = performance.now();
    try {
      const result = await operation();
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName}.${operationName}: ${(end - start).toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${componentName}.${operationName} failed after ${(end - start).toFixed(2)}ms:`, error);
      throw error;
    }
  };

  return { measureAsync };
};