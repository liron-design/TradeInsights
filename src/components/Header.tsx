import React from 'react';
import { TrendingUp, FileText, Settings, Bell } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'reports' | 'settings') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold">TradeInsight AI</h1>
              <p className="text-xs text-slate-400">Powered by xAI Technology</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onViewChange('reports')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'reports'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Reports</span>
            </button>
            <button
              onClick={() => onViewChange('settings')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="text-right">
              <p className="text-xs text-slate-400">Next Report</p>
              <p className="text-sm font-medium">3:30 PM ET</p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800">
          <div className="flex justify-around py-2">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex flex-col items-center py-2 px-4 ${
                currentView === 'dashboard' ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </button>
            <button
              onClick={() => onViewChange('reports')}
              className={`flex flex-col items-center py-2 px-4 ${
                currentView === 'reports' ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs mt-1">Reports</span>
            </button>
            <button
              onClick={() => onViewChange('settings')}
              className={`flex flex-col items-center py-2 px-4 ${
                currentView === 'settings' ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs mt-1">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};