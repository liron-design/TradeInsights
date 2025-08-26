import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, Database, Cpu, MemoryStick } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceMetric {
  timestamp: number;
  renderTime: number;
  memoryUsage: number;
  apiLatency: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    apiLatency: 0,
    fps: 60
  });

  useEffect(() => {
    const interval = setInterval(() => {
      collectMetrics();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const collectMetrics = () => {
    const now = Date.now();
    
    // Simulate performance metrics collection
    const renderTime = performance.now() % 100; // Simulated render time
    const memoryUsage = (performance as any).memory ? 
      (performance as any).memory.usedJSHeapSize / 1024 / 1024 : 
      Math.random() * 50 + 20; // MB
    const apiLatency = Math.random() * 200 + 50; // ms

    const newMetric: PerformanceMetric = {
      timestamp: now,
      renderTime,
      memoryUsage,
      apiLatency
    };

    setMetrics(prev => [...prev.slice(-29), newMetric]); // Keep last 30 points
    setCurrentMetrics({
      renderTime: Math.round(renderTime),
      memoryUsage: Math.round(memoryUsage),
      apiLatency: Math.round(apiLatency),
      fps: Math.round(60 - (renderTime / 16.67) * 10) // Estimate FPS
    });
  };

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatChartData = () => {
    return metrics.map((metric, index) => ({
      time: index,
      render: metric.renderTime,
      memory: metric.memoryUsage,
      api: metric.apiLatency
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-slate-900">Performance Monitor</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-500">Live</span>
        </div>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(currentMetrics.renderTime, { good: 16, warning: 33 })}`}>
            {currentMetrics.renderTime}ms
          </div>
          <div className="text-xs text-slate-500">Render Time</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <MemoryStick className="w-5 h-5 text-purple-600" />
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(currentMetrics.memoryUsage, { good: 30, warning: 50 })}`}>
            {currentMetrics.memoryUsage}MB
          </div>
          <div className="text-xs text-slate-500">Memory Usage</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Database className="w-5 h-5 text-orange-600" />
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(currentMetrics.apiLatency, { good: 100, warning: 300 })}`}>
            {currentMetrics.apiLatency}ms
          </div>
          <div className="text-xs text-slate-500">API Latency</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Cpu className="w-5 h-5 text-red-600" />
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(60 - currentMetrics.fps, { good: 5, warning: 15 })}`}>
            {currentMetrics.fps}
          </div>
          <div className="text-xs text-slate-500">FPS</div>
        </div>
      </div>

      {/* Performance Chart */}
      {metrics.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-slate-900 mb-3">Performance Trends</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={formatChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" hide />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}${name === 'memory' ? 'MB' : 'ms'}`,
                  name === 'render' ? 'Render Time' : 
                  name === 'memory' ? 'Memory' : 'API Latency'
                ]}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="render" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={false}
                name="render"
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="#8b5cf6" 
                strokeWidth={2} 
                dot={false}
                name="memory"
              />
              <Line 
                type="monotone" 
                dataKey="api" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                dot={false}
                name="api"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Performance Tips */}
      <div className="bg-slate-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-slate-900">Performance Tips</span>
        </div>
        <ul className="text-xs text-slate-600 space-y-1">
          <li>• Render times under 16ms ensure smooth 60fps performance</li>
          <li>• Memory usage should stay below 50MB for optimal performance</li>
          <li>• API latency under 100ms provides responsive user experience</li>
          <li>• Use React DevTools Profiler to identify performance bottlenecks</li>
        </ul>
      </div>
    </div>
  );
};