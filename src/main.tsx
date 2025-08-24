import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Analytics, PerformanceMonitor } from './utils/analytics';

// Initialize analytics and performance monitoring
Analytics.track('app_start');
PerformanceMonitor.init();

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
