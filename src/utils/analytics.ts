// Analytics and error reporting utilities
export class Analytics {
  private static isProduction = process.env.NODE_ENV === 'production';
  private static events: Array<{ name: string; data: any; timestamp: Date }> = [];

  static track(eventName: string, data?: any) {
    const event = {
      name: eventName,
      data: data || {},
      timestamp: new Date()
    };

    this.events.push(event);

    if (this.isProduction) {
      // Send to analytics service (e.g., Google Analytics, Mixpanel)
      this.sendToAnalytics(event);
    } else {
      console.log('Analytics Event:', event);
    }
  }

  static trackError(error: Error, context?: string) {
    const errorEvent = {
      name: 'error',
      data: {
        message: error.message,
        stack: error.stack,
        context: context || 'unknown',
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date()
    };

    this.events.push(errorEvent);

    if (this.isProduction) {
      // Send to error reporting service (e.g., Sentry, Bugsnag)
      this.sendErrorReport(errorEvent);
    } else {
      console.error('Error tracked:', errorEvent);
    }
  }

  static trackPerformance(metric: string, value: number, context?: string) {
    const perfEvent = {
      name: 'performance',
      data: {
        metric,
        value,
        context: context || 'general',
        timestamp: new Date().toISOString()
      },
      timestamp: new Date()
    };

    if (this.isProduction) {
      this.sendToAnalytics(perfEvent);
    } else {
      console.log('Performance metric:', perfEvent);
    }
  }

  static trackUserAction(action: string, details?: any) {
    this.track('user_action', {
      action,
      details: details || {},
      sessionId: this.getSessionId()
    });
  }

  private static sendToAnalytics(event: any) {
    // Implementation for production analytics
    // Example: Google Analytics 4, Mixpanel, etc.
    if (typeof gtag !== 'undefined') {
      gtag('event', event.name, event.data);
    }
  }

  private static sendErrorReport(errorEvent: any) {
    // Implementation for error reporting
    // Example: Sentry, Bugsnag, etc.
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorEvent)
    }).catch(err => console.error('Failed to report error:', err));
  }

  private static getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  static getEvents() {
    return [...this.events];
  }

  static clearEvents() {
    this.events = [];
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static observers: PerformanceObserver[] = [];

  static init() {
    if (typeof PerformanceObserver === 'undefined') return;

    // Monitor long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          Analytics.trackPerformance('long_task', entry.duration, 'main_thread');
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (e) {
      console.warn('Long task observer not supported');
    }

    // Monitor layout shifts
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            Analytics.trackPerformance('layout_shift', (entry as any).value, 'cls');
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('Layout shift observer not supported');
    }

    // Monitor largest contentful paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        Analytics.trackPerformance('lcp', lastEntry.startTime, 'loading');
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observer not supported');
    }
  }

  static disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}