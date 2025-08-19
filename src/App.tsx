import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ReportViewer } from './components/ReportViewer';
import { Settings } from './components/Settings';
import { NotificationProvider } from './contexts/NotificationContext';
import { ReportProvider } from './contexts/ReportContext';
import { VoiceCommands } from './components/VoiceCommands';

type View = 'dashboard' | 'reports' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [voiceEnabled, setVoiceEnabled] = useState(false);

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
    <NotificationProvider>
      <ReportProvider>
        <div className="min-h-screen bg-slate-50">
          <Header currentView={currentView} onViewChange={setCurrentView} />
          <main className="pb-20 md:pb-0">
            {renderView()}
          </main>
          <VoiceCommands 
            onCommand={handleVoiceCommand}
            isEnabled={voiceEnabled}
          />
        </div>
      </ReportProvider>
    </NotificationProvider>
  );
}

export default App;