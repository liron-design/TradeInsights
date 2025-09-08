import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentName: string;
  timestamp: number;
}

interface PerformanceConfig {
  enableProfiling: boolean;
  memoryThreshold: number; // MB
  renderThreshold: number; // ms
  onSlowRender?: (metrics: PerformanceMetrics) => void;
  onMemoryLeak?: (metrics: PerformanceMetrics) => void;
}

export const useAdvancedPerformance = (
  componentName: string,
  config: PerformanceConfig = {
    enableProfiling: process.env.NODE_ENV === 'development',
    memoryThreshold: 50,
    renderThreshold: 16.67 // 60fps threshold
  }
) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const lastMemoryUsage = useRef<number>(0);
  const performanceObserver = useRef<PerformanceObserver | null>(null);

  // Start performance measurement
  const startMeasurement = useCallback(() => {
    if (!config.enableProfiling) return;
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  }, [config.enableProfiling]);

  // End performance measurement
  const endMeasurement = useCallback(() => {
    if (!config.enableProfiling) return;
    
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    // Memory usage monitoring
    let memoryUsage = 0;
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }

    const metrics: PerformanceMetrics = {
      renderTime,
      memoryUsage,
      componentName,
      timestamp: Date.now()
    };

    // Log performance metrics
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms, Memory: ${memoryUsage.toFixed(2)}MB`);
    }

    // Check thresholds and trigger callbacks
    if (renderTime > config.renderThreshold && config.onSlowRender) {
      config.onSlowRender(metrics);
    }

    if (memoryUsage > config.memoryThreshold && config.onMemoryLeak) {
      config.onMemoryLeak(metrics);
    }

    // Detect memory leaks
    if (lastMemoryUsage.current > 0 && memoryUsage > lastMemoryUsage.current * 1.5) {
      console.warn(`Potential memory leak detected in ${componentName}: ${memoryUsage.toFixed(2)}MB (was ${lastMemoryUsage.current.toFixed(2)}MB)`);
    }

    lastMemoryUsage.current = memoryUsage;

    return metrics;
  }, [componentName, config]);

  // Measure async operations
  const measureAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const start = performance.now();
    
    try {
      const result = await operation();
      const end = performance.now();
      const duration = end - start;
      
      if (config.enableProfiling) {
        console.log(`${componentName}.${operationName}: ${duration.toFixed(2)}ms`);
      }
      
      // Track slow async operations
      if (duration > 1000) { // 1 second threshold
        console.warn(`Slow async operation in ${componentName}.${operationName}: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${componentName}.${operationName} failed after ${(end - start).toFixed(2)}ms:`, error);
      throw error;
    }
  }, [componentName, config.enableProfiling]);

  // Initialize performance observer for advanced metrics
  useEffect(() => {
    if (!config.enableProfiling || typeof PerformanceObserver === 'undefined') return;

    try {
      // Observe long tasks
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn(`Long task detected in ${componentName}: ${entry.duration.toFixed(2)}ms`);
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
      performanceObserver.current = observer;

      // Observe layout shifts
      const layoutObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput && layoutShift.value > 0.1) {
            console.warn(`Layout shift detected in ${componentName}: ${layoutShift.value.toFixed(3)}`);
          }
        }
      });

      layoutObserver.observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }

    return () => {
      if (performanceObserver.current) {
        performanceObserver.current.disconnect();
      }
    };
  }, [componentName, config.enableProfiling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (performanceObserver.current) {
        performanceObserver.current.disconnect();
      }
    };
  }, []);

  // Performance optimization utilities
  const optimizeRender = useCallback((dependencies: any[]) => {
    // Memoization helper
    return dependencies;
  }, []);

  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    
    return ((...args: Parameters<T>) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    });
  }, []);

  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    });
  }, []);

  return {
    startMeasurement,
    endMeasurement,
    measureAsync,
    optimizeRender,
    throttle,
    debounce,
    metrics: {
      renderCount: renderCount.current,
      lastMemoryUsage: lastMemoryUsage.current
    }
  };
};