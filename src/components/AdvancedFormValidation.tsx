import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

// Simple validation schemas without external dependencies
interface AlertFormData {
  symbol: string;
  alertType: 'price_above' | 'price_below' | 'volume_spike' | 'sentiment_change';
  value: number;
  email?: string;
  notes?: string;
}

interface AdvancedFormValidationProps {
  onSubmit: (data: AlertFormData) => void;
  onCancel: () => void;
}

export const AdvancedFormValidation: React.FC<AdvancedFormValidationProps> = ({
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = React.useState<AlertFormData>({
    symbol: '',
    alertType: 'price_above',
    value: 0,
    email: '',
    notes: ''
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof AlertFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateField = (name: keyof AlertFormData, value: any): string | null => {
    switch (name) {
      case 'symbol':
        if (!value) return 'Symbol is required';
        if (typeof value !== 'string') return 'Symbol must be text';
        if (value.length > 10) return 'Symbol too long';
        if (!/^[A-Z0-9-]+$/i.test(value)) return 'Invalid symbol format';
        return null;
      
      case 'value':
        if (!value || value <= 0) return 'Value must be positive';
        if (value > 1000000) return 'Value too large';
        return null;
      
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Invalid email format';
        }
        return null;
      
      case 'notes':
        if (value && value.length > 500) return 'Notes too long';
        return null;
      
      default:
        return null;
    }
  };

  const handleChange = (name: keyof AlertFormData, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (name: keyof AlertFormData) => {
    const error = validateField(name, formData[name]);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const newErrors: Partial<Record<keyof AlertFormData, string>> = {};
    (Object.keys(formData) as Array<keyof AlertFormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await onSubmit({
          ...formData,
          symbol: formData.symbol.toUpperCase()
        });
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  };

  const getFieldStatus = (fieldName: keyof AlertFormData) => {
    if (errors[fieldName]) return 'error';
    if (formData[fieldName]) return 'success';
    return 'default';
  };

  const getInputClasses = (fieldName: keyof AlertFormData) => {
    const status = getFieldStatus(fieldName);
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors';
    
    switch (status) {
      case 'error':
        return `${baseClasses} border-red-300 focus:ring-red-500 focus:border-red-500`;
      case 'success':
        return `${baseClasses} border-green-300 focus:ring-green-500 focus:border-green-500`;
      default:
        return `${baseClasses} border-slate-300 focus:ring-blue-500 focus:border-blue-500`;
    }
  };

  const renderFieldIcon = (fieldName: keyof AlertFormData) => {
    const status = getFieldStatus(fieldName);
    
    if (status === 'error') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    } else if (status === 'success') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return null;
  };

  const isValid = Object.keys(errors).length === 0 && formData.symbol && formData.value > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Create Advanced Alert</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Symbol Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Symbol *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => handleChange('symbol', e.target.value)}
              onBlur={() => handleBlur('symbol')}
              placeholder="NVDA"
              className={getInputClasses('symbol')}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {renderFieldIcon('symbol')}
            </div>
          </div>
          {errors.symbol && (
            <p className="mt-1 text-sm text-red-600">{errors.symbol}</p>
          )}
          {formData.symbol && !errors.symbol && (
            <p className="mt-1 text-sm text-green-600">Symbol validated ✓</p>
          )}
        </div>

        {/* Alert Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Alert Type *
          </label>
          <select
            value={formData.alertType}
            onChange={(e) => handleChange('alertType', e.target.value)}
            className={getInputClasses('alertType')}
          >
            <option value="price_above">Price Above</option>
            <option value="price_below">Price Below</option>
            <option value="volume_spike">Volume Spike</option>
            <option value="sentiment_change">Sentiment Change</option>
          </select>
        </div>

        {/* Value Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Trigger Value *
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={formData.value || ''}
              onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)}
              onBlur={() => handleBlur('value')}
              placeholder="130.00"
              className={getInputClasses('value')}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {renderFieldIcon('value')}
            </div>
          </div>
          {errors.value && (
            <p className="mt-1 text-sm text-red-600">{errors.value}</p>
          )}
          {formData.value && !errors.value && (
            <p className="mt-1 text-sm text-blue-600">
              Alert will trigger when condition is met
            </p>
          )}
        </div>

        {/* Email Notification */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Notification (Optional)
          </label>
          <div className="relative">
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="trader@example.com"
              className={getInputClasses('email')}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {renderFieldIcon('email')}
            </div>
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            onBlur={() => handleBlur('notes')}
            rows={3}
            placeholder="Additional notes about this alert..."
            className={getInputClasses('notes')}
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Creating Alert...' : 'Create Alert'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Form Status */}
      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Form Status:</span>
          <span className={`font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? 'Valid' : 'Invalid'}
          </span>
        </div>
      </div>
    </div>
  );
};