import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Analytics } from './utils/analytics';
import { PerformanceOptimizer } from './utils/performance';
import { SecurityManager } from './utils/security';
import { AccessibilityUtils } from './utils/accessibility';

// Initialize analytics and performance monitoring
Analytics.track('app_start');
PerformanceOptimizer.init();

// Initialize security measures
SecurityManager.implementCSP();

// Initialize accessibility features
AccessibilityUtils.init();

// Register service worker for PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        Analytics.track('sw_registered');
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
        Analytics.trackError(registrationError, 'service_worker_registration');
      });
  });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  PerformanceOptimizer.cleanup();
  AccessibilityUtils.cleanup();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
