// Advanced performance optimization utilities
import React from 'react';

export class PerformanceOptimizer {
  private static performanceEntries: PerformanceEntry[] = [];
  private static memoryBaseline: number = 0;
  private static renderMetrics = new Map<string, number[]>();

  // Initialize performance monitoring
  static init(): void {
    this.setupPerformanceObserver();
    this.setupMemoryMonitoring();
    this.setupRenderTracking();
  }

  private static setupPerformanceObserver(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
            this.reportPerformanceIssue('long_task', entry.duration);
          }
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });

      // Monitor layout shifts
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput && layoutShift.value > 0.1) {
            console.warn(`Layout shift detected: ${layoutShift.value.toFixed(3)}`);
            this.reportPerformanceIssue('layout_shift', layoutShift.value);
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Monitor largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry.startTime > 2500) {
          console.warn(`Slow LCP detected: ${lastEntry.startTime.toFixed(2)}ms`);
          this.reportPerformanceIssue('slow_lcp', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    } catch (error) {
      console.warn('Performance observer setup failed:', error);
    }
  }

  private static setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.memoryBaseline = memory.usedJSHeapSize;
      
      setInterval(() => {
        const currentMemory = memory.usedJSHeapSize;
        const memoryIncrease = currentMemory - this.memoryBaseline;
        
        if (memoryIncrease > 50 * 1024 * 1024) { // 50MB increase
          console.warn(`Memory usage increased by ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
          this.reportPerformanceIssue('memory_leak', memoryIncrease);
        }
      }, 30000); // Check every 30 seconds
    }
  }

  private static setupRenderTracking(): void {
    // Track component render times
    if (typeof React !== 'undefined' && React.Component) {
      const originalRender = React.Component.prototype.render;
    
      React.Component.prototype.render = function() {
        const start = performance.now();
        const result = originalRender.call(this);
        const end = performance.now();
      
        const componentName = this.constructor.name;
        const renderTime = end - start;
      
        if (renderTime > 16.67) { // Slower than 60fps
          console.warn(`Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
        }
      
        // Track render metrics
        const metrics = PerformanceOptimizer.renderMetrics.get(componentName) || [];
        metrics.push(renderTime);
        if (metrics.length > 100) metrics.shift(); // Keep last 100 renders
        PerformanceOptimizer.renderMetrics.set(componentName, metrics);
      
        return result;
      };
    }
  }

  // Debounce utility for performance optimization
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  // Throttle utility for performance optimization
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastExecTime = 0;
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
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
    };
  }

  // Memoization utility
  static memoize<T extends (...args: any[]) => any>(
    func: T,
    keyGenerator?: (...args: Parameters<T>) => string
  ): T {
    const cache = new Map<string, ReturnType<T>>();
    
    return ((...args: Parameters<T>) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key)!;
      }
      
      const result = func(...args);
      cache.set(key, result);
      
      // Limit cache size
      if (cache.size > 1000) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      
      return result;
    }) as T;
  }

  // Virtual scrolling optimization
  static calculateVisibleRange(
    scrollTop: number,
    containerHeight: number,
    itemHeight: number,
    totalItems: number,
    overscan: number = 5
  ): { start: number; end: number } {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(totalItems, start + visibleCount + overscan * 2);
    
    return { start, end };
  }

  // Image lazy loading
  static setupLazyLoading(selector: string = 'img[data-src]'): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll(selector).forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Bundle size analysis
  static analyzeBundleSize(): void {
    if (process.env.NODE_ENV === 'development') {
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      
      scripts.forEach(script => {
        fetch((script as HTMLScriptElement).src, { method: 'HEAD' })
          .then(response => {
            const size = parseInt(response.headers.get('content-length') || '0');
            totalSize += size;
            console.log(`Script: ${(script as HTMLScriptElement).src.split('/').pop()}, Size: ${(size / 1024).toFixed(2)}KB`);
          })
          .catch(() => {}); // Ignore CORS errors
      });
      
      setTimeout(() => {
        console.log(`Total bundle size: ${(totalSize / 1024).toFixed(2)}KB`);
      }, 1000);
    }
  }

  // Performance reporting
  private static reportPerformanceIssue(type: string, value: number): void {
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to analytics service
      fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          value,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(() => {}); // Ignore network errors
    }
  }

  // Get performance metrics
  static getMetrics(): {
    renderTimes: Map<string, number[]>;
    memoryUsage: number;
    performanceEntries: PerformanceEntry[];
  } {
    const memoryUsage = 'memory' in performance ? 
      (performance as any).memory.usedJSHeapSize : 0;
    
    return {
      renderTimes: new Map(this.renderMetrics),
      memoryUsage,
      performanceEntries: [...this.performanceEntries]
    };
  }

  // Clear performance data
  static clearMetrics(): void {
    this.renderMetrics.clear();
    this.performanceEntries = [];
    
    if ('memory' in performance) {
      this.memoryBaseline = (performance as any).memory.usedJSHeapSize;
    }
  }
}