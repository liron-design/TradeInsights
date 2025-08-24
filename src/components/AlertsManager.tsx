import React, { useState } from 'react';
import { Bell, Plus, X, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface Alert {
  id: string;
  symbol: string;
  type: 'price_above' | 'price_below' | 'volume_spike' | 'sentiment_change';
  condition: string;
  value: number;
  isActive: boolean;
  triggered: boolean;
  createdAt: Date;
}

export const AlertsManager: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      symbol: 'NVDA',
      type: 'price_above',
      condition: 'Price above',
      value: 130,
      isActive: true,
      triggered: false,
      createdAt: new Date()
    },
    {
      id: '2',
      symbol: 'TSLA',
      type: 'price_below',
      condition: 'Price below',
      value: 240,
      isActive: true,
      triggered: true,
      createdAt: new Date()
    },
    {
      id: '3',
      symbol: 'SPY',
      type: 'volume_spike',
      condition: 'Volume spike',
      value: 150,
      isActive: true,
      triggered: false,
      createdAt: new Date()
    }
  ]);

  const [showAddAlert, setShowAddAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    type: 'price_above' as Alert['type'],
    value: 0
  });

  const handleAddAlert = () => {
    if (!newAlert.symbol || !newAlert.value) return;

    const alert: Alert = {
      id: Date.now().toString(),
      symbol: newAlert.symbol.toUpperCase(),
      type: newAlert.type,
      condition: getConditionText(newAlert.type),
      value: newAlert.value,
      isActive: true,
      triggered: false,
      createdAt: new Date()
    };

    setAlerts(prev => [alert, ...prev]);
    setNewAlert({ symbol: '', type: 'price_above', value: 0 });
    setShowAddAlert(false);
  };

  const getConditionText = (type: Alert['type']): string => {
    switch (type) {
      case 'price_above': return 'Price above';
      case 'price_below': return 'Price below';
      case 'volume_spike': return 'Volume spike';
      case 'sentiment_change': return 'Sentiment change';
      default: return 'Unknown';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'price_above': return <TrendingUp className="w-4 h-4" />;
      case 'price_below': return <TrendingDown className="w-4 h-4" />;
      case 'volume_spike': return <Target className="w-4 h-4" />;
      case 'sentiment_change': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-yellow-600" />
          <h3 className="text-xl font-bold text-slate-900">Price Alerts</h3>
        </div>
        <button
          onClick={() => setShowAddAlert(true)}
          className="p-2 text-blue-600 hover:text-blue-700 rounded-md hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showAddAlert && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-4">Create New Alert</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Symbol</label>
              <input
                type="text"
                value={newAlert.symbol}
                onChange={(e) => setNewAlert(prev => ({ ...prev, symbol: e.target.value }))}
                placeholder="NVDA"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert(prev => ({ ...prev, type: e.target.value as Alert['type'] }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="price_above">Price Above</option>
                <option value="price_below">Price Below</option>
                <option value="volume_spike">Volume Spike</option>
                <option value="sentiment_change">Sentiment Change</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Value</label>
              <input
                type="number"
                value={newAlert.value || ''}
                onChange={(e) => setNewAlert(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                placeholder="130.00"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleAddAlert}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Create Alert
            </button>
            <button
              onClick={() => setShowAddAlert(false)}
              className="border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
              alert.triggered 
                ? 'border-red-200 bg-red-50' 
                : alert.isActive 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                alert.triggered 
                  ? 'text-red-600 bg-red-100' 
                  : alert.isActive 
                    ? 'text-green-600 bg-green-100' 
                    : 'text-slate-600 bg-slate-100'
              }`}>
                {getAlertIcon(alert.type)}
              </div>
              <div>
                <div className="font-semibold text-slate-900">
                  {alert.symbol} - {alert.condition} ${alert.value}
                </div>
                <div className="text-sm text-slate-500">
                  Created {alert.createdAt.toLocaleDateString()}
                  {alert.triggered && <span className="ml-2 text-red-600 font-medium">• TRIGGERED</span>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleAlert(alert.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  alert.isActive 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {alert.isActive ? 'Active' : 'Paused'}
              </button>
              <button
                onClick={() => deleteAlert(alert.id)}
                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No alerts configured</p>
          <button
            onClick={() => setShowAddAlert(true)}
            className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first alert
          </button>
        </div>
      )}
    </div>
  );
};