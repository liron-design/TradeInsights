import React, { useState } from 'react';
import { Bell, Clock, Target, Globe, User, Shield, Download } from 'lucide-react';
import { loadSettings, saveSettings, UserSettings, ValidationUtils } from '../utils/storage';
import { useNotifications } from '../contexts/NotificationContext';

export const Settings: React.FC = () => {
  const { addNotification } = useNotifications();
  const [settings, setSettings] = useState<UserSettings>(loadSettings());
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (section: string, key: string) => {
    setHasChanges(true);
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: !prev[section as keyof typeof prev][key as keyof typeof prev[typeof section]]
      }
    }));
  };

  const handleInputChange = (section: string, key: string, value: string) => {
    let validatedValue = value;
    
    // Validate inputs
    if (key === 'focusTickers') {
      const tickers = ValidationUtils.validateTickerList(value);
      validatedValue = tickers.join(', ');
    } else if (key === 'market' && !ValidationUtils.validateMarket(value)) {
      return; // Invalid market
    } else if (key === 'timeHorizon' && !ValidationUtils.validateTimeHorizon(value)) {
      return; // Invalid time horizon
    }
    
    setHasChanges(true);
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: validatedValue
      }
    }));
  };

  const handleSave = () => {
    const success = saveSettings(settings);
    if (success) {
      setHasChanges(false);
      addNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your preferences have been saved successfully.'
      });
    } else {
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save settings. Please try again.'
      });
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      notifications: {
        preMarket: true,
        preClose: true,
        customAlerts: true,
        email: true,
        push: true
      },
      reporting: {
        market: 'US Equities',
        focusTickers: 'NVDA, TSLA, AAPL',
        timeHorizon: 'Mixed',
        weekendReports: false
      },
      preferences: {
        voiceMode: false,
        darkMode: false,
        compactView: false,
        autoRefresh: true
      }
    };
    
    setSettings(defaultSettings);
    setHasChanges(true);
    addNotification({
      type: 'info',
      title: 'Settings Reset',
      message: 'Settings have been reset to defaults. Click Save to apply.'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Settings</h2>
        <p className="text-slate-600">
          Customize your TradeInsight AI experience and notification preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Pre-Market Reports</h4>
                <p className="text-sm text-slate-600">Daily reports at 4:00 AM ET</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.preMarket}
                  onChange={() => handleToggle('notifications', 'preMarket')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Pre-Close Reports</h4>
                <p className="text-sm text-slate-600">Daily reports at 3:30 PM ET</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.preClose}
                  onChange={() => handleToggle('notifications', 'preClose')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Custom Alerts</h4>
                <p className="text-sm text-slate-600">Price and sentiment alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.customAlerts}
                  onChange={() => handleToggle('notifications', 'customAlerts')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-medium text-slate-900 mb-3">Delivery Methods</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={() => handleToggle('notifications', 'email')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Push Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={() => handleToggle('notifications', 'push')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-slate-900">Report Configuration</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Primary Market</label>
              <select
                value={settings.reporting.market}
                onChange={(e) => handleInputChange('reporting', 'market', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="US Equities">U.S. Equities</option>
                <option value="Cryptocurrencies">Cryptocurrencies</option>
                <option value="Commodities">Commodities</option>
                <option value="Forex">Foreign Exchange</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Focus Tickers</label>
              <input
                type="text"
                value={settings.reporting.focusTickers}
                onChange={(e) => handleInputChange('reporting', 'focusTickers', e.target.value)}
                placeholder="NVDA, TSLA, AAPL"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Comma-separated list of symbols for deeper analysis</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Time Horizon</label>
              <select
                value={settings.reporting.timeHorizon}
                onChange={(e) => handleInputChange('reporting', 'timeHorizon', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Intraday">Intraday Focus</option>
                <option value="Short-term">Short-term (1-7 days)</option>
                <option value="Medium-term">Medium-term (1-4 weeks)</option>
                <option value="Long-term">Long-term (1-12 months)</option>
                <option value="Mixed">Mixed Horizons</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Weekend Reports</h4>
                <p className="text-sm text-slate-600">Generate reports on non-trading days</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.reporting.weekendReports}
                  onChange={() => handleToggle('reporting', 'weekendReports')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* User Preferences */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-slate-900">User Preferences</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Voice Mode</h4>
                <p className="text-sm text-slate-600">Enable voice commands and audio responses</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.preferences.voiceMode}
                  onChange={(e) => {
                    handleToggle('preferences', 'voiceMode');
                    // Enable voice commands in parent component
                    window.dispatchEvent(new CustomEvent('voiceToggle', { detail: e.target.checked }));
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Auto-Refresh Data</h4>
                <p className="text-sm text-slate-600">Automatically update market data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.preferences.autoRefresh}
                  onChange={() => handleToggle('preferences', 'autoRefresh')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Compact View</h4>
                <p className="text-sm text-slate-600">Dense layout for mobile devices</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.preferences.compactView}
                  onChange={() => handleToggle('preferences', 'compactView')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account & Data */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-slate-900">Account & Data</h3>
          </div>

          <div className="space-y-4">
            <button className="w-full text-left p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">Export Data</h4>
                  <p className="text-sm text-slate-600">Download your reports and settings</p>
                </div>
                <Download className="w-5 h-5 text-slate-400" />
              </div>
            </button>

            <button className="w-full text-left p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">Privacy Settings</h4>
                  <p className="text-sm text-slate-600">Manage data collection and usage</p>
                </div>
                <Shield className="w-5 h-5 text-slate-400" />
              </div>
            </button>

            <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">
              onClick={handleReset}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Clear All Data</h4>
                  <p className="text-sm text-red-500">Remove all reports and reset settings</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <button className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
          onClick={handleReset}
          Reset to Defaults
        </button>
        <button 
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-6 py-2 rounded-lg transition-colors ${
            hasChanges 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};