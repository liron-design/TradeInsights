import React, { useState, useEffect } from 'react';
import { Brain, Cpu, Zap, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MLModel {
  name: string;
  type: 'classification' | 'regression' | 'clustering';
  accuracy: number;
  confidence: number;
  lastTrained: Date;
  features: string[];
  prediction: {
    signal: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
    probability: number;
    timeHorizon: string;
    reasoning: string[];
  };
}

interface FeatureImportance {
  feature: string;
  importance: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export const AdvancedAnalyticsEngine: React.FC = () => {
  const [models, setModels] = useState<MLModel[]>([]);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('ensemble');

  useEffect(() => {
    initializeModels();
    const interval = setInterval(updatePredictions, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const initializeModels = () => {
    const mlModels: MLModel[] = [
      {
        name: 'Random Forest Classifier',
        type: 'classification',
        accuracy: 0.73,
        confidence: 0.85,
        lastTrained: new Date(Date.now() - 2 * 60 * 60 * 1000),
        features: ['RSI', 'MACD', 'Volume', 'Sentiment', 'Options Flow'],
        prediction: {
          signal: 'buy',
          probability: 0.73,
          timeHorizon: '1-3 days',
          reasoning: [
            'Strong technical momentum detected',
            'Positive sentiment shift in options flow',
            'Volume confirmation above average'
          ]
        }
      },
      {
        name: 'LSTM Neural Network',
        type: 'regression',
        accuracy: 0.68,
        confidence: 0.79,
        lastTrained: new Date(Date.now() - 4 * 60 * 60 * 1000),
        features: ['Price History', 'Volume Profile', 'Volatility Surface', 'Market Regime'],
        prediction: {
          signal: 'hold',
          probability: 0.68,
          timeHorizon: '1-5 days',
          reasoning: [
            'Price pattern suggests consolidation',
            'Volatility clustering indicates uncertainty',
            'Mixed signals from volume analysis'
          ]
        }
      },
      {
        name: 'Gradient Boosting',
        type: 'classification',
        accuracy: 0.71,
        confidence: 0.82,
        lastTrained: new Date(Date.now() - 1 * 60 * 60 * 1000),
        features: ['Technical Indicators', 'Market Microstructure', 'Cross-Asset Signals'],
        prediction: {
          signal: 'buy',
          probability: 0.71,
          timeHorizon: '2-7 days',
          reasoning: [
            'Cross-asset momentum alignment',
            'Microstructure shows institutional buying',
            'Technical breakout pattern confirmed'
          ]
        }
      },
      {
        name: 'Ensemble Model',
        type: 'classification',
        accuracy: 0.76,
        confidence: 0.88,
        lastTrained: new Date(Date.now() - 30 * 60 * 1000),
        features: ['All Model Outputs', 'Meta-Features', 'Regime Adjustments'],
        prediction: {
          signal: 'buy',
          probability: 0.76,
          timeHorizon: '1-5 days',
          reasoning: [
            'Consensus across multiple models',
            'High confidence from ensemble voting',
            'Regime-adjusted signal strength'
          ]
        }
      }
    ];

    setModels(mlModels);

    // Generate feature importance
    const features: FeatureImportance[] = [
      { feature: 'Options Flow', importance: 0.23, impact: 'positive' },
      { feature: 'Volume Profile', importance: 0.19, impact: 'positive' },
      { feature: 'RSI Divergence', importance: 0.16, impact: 'negative' },
      { feature: 'MACD Signal', importance: 0.14, impact: 'positive' },
      { feature: 'Market Regime', importance: 0.12, impact: 'neutral' },
      { feature: 'Sentiment Score', importance: 0.10, impact: 'positive' },
      { feature: 'Cross-Asset Correlation', importance: 0.06, impact: 'neutral' }
    ];

    setFeatureImportance(features);
  };

  const updatePredictions = () => {
    setModels(prev => prev.map(model => ({
      ...model,
      confidence: Math.max(0.5, Math.min(0.95, model.confidence + (Math.random() - 0.5) * 0.1)),
      prediction: {
        ...model.prediction,
        probability: Math.max(0.5, Math.min(0.95, model.prediction.probability + (Math.random() - 0.5) * 0.05))
      }
    })));
  };

  const trainModels = async () => {
    setIsTraining(true);
    
    // Simulate model training
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setModels(prev => prev.map(model => ({
      ...model,
      accuracy: Math.min(0.85, model.accuracy + Math.random() * 0.05),
      confidence: Math.min(0.95, model.confidence + Math.random() * 0.1),
      lastTrained: new Date()
    })));
    
    setIsTraining(false);
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'strong_buy': return 'text-green-700 bg-green-100 border-green-300';
      case 'buy': return 'text-green-600 bg-green-50 border-green-200';
      case 'sell': return 'text-red-600 bg-red-50 border-red-200';
      case 'strong_sell': return 'text-red-700 bg-red-100 border-red-300';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'strong_buy':
      case 'buy':
        return <TrendingUp className="w-4 h-4" />;
      case 'strong_sell':
      case 'sell':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const selectedModelData = models.find(m => m.name.toLowerCase().includes(selectedModel)) || models[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Advanced Analytics Engine</h2>
        <p className="text-slate-600">
          Machine learning models for institutional-grade trading signal generation
        </p>
      </motion.div>

      {/* Model Performance Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {models.map((model, index) => (
          <motion.div
            key={model.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-lg p-6 border cursor-pointer transition-all duration-200 ${
              selectedModel === model.name.toLowerCase().split(' ')[0] 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedModel(model.name.toLowerCase().split(' ')[0])}
          >
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSignalColor(model.prediction.signal)}`}>
                {model.prediction.signal.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-sm">{model.name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Accuracy:</span>
                <span className="font-medium text-slate-900">{(model.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Confidence:</span>
                <span className="font-medium text-slate-900">{(model.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${model.accuracy * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Selected Model Details */}
      {selectedModelData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{selectedModelData.name} Analysis</h3>
            
            <div className={`p-4 rounded-lg border mb-4 ${getSignalColor(selectedModelData.prediction.signal)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getSignalIcon(selectedModelData.prediction.signal)}
                  <span className="font-semibold capitalize">
                    {selectedModelData.prediction.signal.replace('_', ' ')} Signal
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{(selectedModelData.prediction.probability * 100).toFixed(1)}%</div>
                  <div className="text-sm">{selectedModelData.prediction.timeHorizon}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Model Reasoning:</h4>
              <ul className="space-y-2">
                {selectedModelData.prediction.reasoning.map((reason, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-2 text-sm text-slate-700"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{reason}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Model Type:</span>
                  <span className="ml-2 font-medium text-slate-900 capitalize">{selectedModelData.type}</span>
                </div>
                <div>
                  <span className="text-slate-600">Last Trained:</span>
                  <span className="ml-2 font-medium text-slate-900">
                    {selectedModelData.lastTrained.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Importance */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Feature Importance</h3>
            
            <div className="space-y-3">
              {featureImportance.map((feature, index) => (
                <motion.div
                  key={feature.feature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      feature.impact === 'positive' ? 'bg-green-500' :
                      feature.impact === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="text-sm font-medium text-slate-900">{feature.feature}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <motion.div 
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${feature.importance * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900 w-12 text-right">
                      {(feature.importance * 100).toFixed(0)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={trainModels}
                disabled={isTraining}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isTraining ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Retraining Models...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Retrain All Models</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Model Ensemble Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">Ensemble Model Consensus</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Consensus Signal</span>
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-2">BUY</div>
            <div className="text-sm text-blue-700">76% Model Agreement</div>
            <div className="mt-4 w-full bg-blue-200 rounded-full h-3">
              <motion.div 
                className="bg-blue-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '76%' }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-green-600" />
              <span className="text-sm font-medium text-green-600">Confidence</span>
            </div>
            <div className="text-3xl font-bold text-green-900 mb-2">88%</div>
            <div className="text-sm text-green-700">High Confidence</div>
            <div className="mt-4 w-full bg-green-200 rounded-full h-3">
              <motion.div 
                className="bg-green-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '88%' }}
                transition={{ duration: 1.5, delay: 0.2 }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Time Horizon</span>
            </div>
            <div className="text-3xl font-bold text-purple-900 mb-2">1-5</div>
            <div className="text-sm text-purple-700">Days</div>
            <div className="mt-4 text-xs text-purple-600">
              Optimal holding period based on signal strength
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-3">Ensemble Reasoning:</h4>
          <ul className="space-y-1 text-sm text-slate-700">
            <li>• 3 out of 4 models show bullish signals with high confidence</li>
            <li>• Options flow analysis indicates institutional accumulation</li>
            <li>• Technical momentum confirmed across multiple timeframes</li>
            <li>• Market microstructure shows positive order flow imbalance</li>
            <li>• Risk-adjusted returns favor long positioning</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};