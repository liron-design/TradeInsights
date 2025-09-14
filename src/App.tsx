import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationSystem } from './components/NotificationSystem';
import { MobileOptimizedHeader } from './components/MobileOptimizedHeader';
import { Dashboard } from './components/Dashboard';
import { ReportViewer } from './components/ReportViewer';
import { Settings } from './components/Settings';
import { SecurityEnhancements } from './components/SecurityEnhancements';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { NotificationProvider } from './contexts/NotificationContext';
import { ReportProvider } from './contexts/ReportContext';
import { VoiceCommands } from './components/VoiceCommands';
import { loadSettings, saveSettings, UserSettings } from './utils/storage';

type View = 'dashboard' | 'reports' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [settings, setSettings] = useState<UserSettings>(loadSettings());
  const [voiceEnabled, setVoiceEnabled] = useState(settings.preferences.voiceMode);

  // Save settings when they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Listen for voice toggle events from settings
  useEffect(() => {
    const handleVoiceToggle = (event: CustomEvent) => {
      setVoiceEnabled(event.detail);
      setSettings(prev => ({
        ...prev,
        preferences: { ...prev.preferences, voiceMode: event.detail }
      }));
    };

    window.addEventListener('voiceToggle', handleVoiceToggle as EventListener);
    return () => window.removeEventListener('voiceToggle', handleVoiceToggle as EventListener);
  }, []);

  const handleVoiceCommand = (command: string) => {
    switch (command) {
      case 'show_dashboard':
        setCurrentView('dashboard');
        break;
      case 'show_reports':
        setCurrentView('reports');
        break;
      case 'show_settings':
        setCurrentView('settings');
        break;
      case 'refresh_data':
        window.location.reload();
        break;
      default:
        console.log('Unknown voice command:', command);
    }
  };
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'reports':
        return <ReportViewer />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
    <NotificationProvider>
      <ReportProvider>
        <div className={`min-h-screen transition-colors duration-200 ${
          settings.preferences.darkMode ? 'bg-slate-900' : 'bg-slate-50'
        }`}>
          <MobileOptimizedHeader currentView={currentView} onViewChange={setCurrentView} />
          <NotificationSystem />
          <main className="pb-20 md:pb-0">
            <div className={settings.preferences.compactView ? 'compact-view' : ''}>
              {renderView()}
            </div>
          </main>
          <VoiceCommands 
            onCommand={handleVoiceCommand}
            isEnabled={voiceEnabled}
          />
        </div>
      </ReportProvider>
    </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;