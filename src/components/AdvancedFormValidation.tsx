import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CheckCircle } from 'lucide-react';

// Advanced validation schemas
const alertSchema = z.object({
  symbol: z.string()
    .min(1, 'Symbol is required')
    .max(10, 'Symbol too long')
    .regex(/^[A-Z0-9-]+$/, 'Invalid symbol format')
    .transform(val => val.toUpperCase()),
  
  alertType: z.enum(['price_above', 'price_below', 'volume_spike', 'sentiment_change']),
  
  value: z.number()
    .min(0.01, 'Value must be positive')
    .max(1000000, 'Value too large'),
  
  email: z.string()
    .email('Invalid email format')
    .optional(),
  
  notes: z.string()
    .max(500, 'Notes too long')
    .optional()
});

type AlertFormData = z.infer<typeof alertSchema>;

interface AdvancedFormValidationProps {
  onSubmit: (data: AlertFormData) => void;
  onCancel: () => void;
}

export const AdvancedFormValidation: React.FC<AdvancedFormValidationProps> = ({
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch
  } = useForm<AlertFormData>({
    resolver: zodResolver(alertSchema),
    mode: 'onChange'
  });

  const watchedSymbol = watch('symbol');
  const watchedValue = watch('value');

  const getFieldError = (fieldName: keyof AlertFormData) => {
    return errors[fieldName]?.message;
  };

  const getFieldStatus = (fieldName: keyof AlertFormData) => {
    if (errors[fieldName]) return 'error';
    if (watch(fieldName)) return 'success';
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Create Advanced Alert</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Symbol Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Symbol *
          </label>
          <div className="relative">
            <input
              {...register('symbol')}
              type="text"
              placeholder="NVDA"
              className={getInputClasses('symbol')}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {renderFieldIcon('symbol')}
            </div>
          </div>
          {getFieldError('symbol') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('symbol')}</p>
          )}
          {watchedSymbol && !errors.symbol && (
            <p className="mt-1 text-sm text-green-600">Symbol validated ✓</p>
          )}
        </div>

        {/* Alert Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Alert Type *
          </label>
          <select
            {...register('alertType')}
            className={getInputClasses('alertType')}
          >
            <option value="">Select alert type</option>
            <option value="price_above">Price Above</option>
            <option value="price_below">Price Below</option>
            <option value="volume_spike">Volume Spike</option>
            <option value="sentiment_change">Sentiment Change</option>
          </select>
          {getFieldError('alertType') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('alertType')}</p>
          )}
        </div>

        {/* Value Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Trigger Value *
          </label>
          <div className="relative">
            <input
              {...register('value', { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="130.00"
              className={getInputClasses('value')}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {renderFieldIcon('value')}
            </div>
          </div>
          {getFieldError('value') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('value')}</p>
          )}
          {watchedValue && !errors.value && (
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
              {...register('email')}
              type="email"
              placeholder="trader@example.com"
              className={getInputClasses('email')}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {renderFieldIcon('email')}
            </div>
          </div>
          {getFieldError('email') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Additional notes about this alert..."
            className={getInputClasses('notes')}
          />
          {getFieldError('notes') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('notes')}</p>
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