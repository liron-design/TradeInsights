// Advanced validation utilities for enterprise security
export class ValidationUtils {
  // Input sanitization
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .substring(0, 1000); // Limit length
  }

  static sanitizeNumber(value: any, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number {
    const num = parseFloat(value);
    if (isNaN(num)) return min;
    return Math.max(min, Math.min(max, num));
  }

  // Email validation with comprehensive checks
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email) return { isValid: false, error: 'Email is required' };
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    if (email.length > 254) {
      return { isValid: false, error: 'Email too long' };
    }
    
    return { isValid: true };
  }

  // Ticker validation with market-specific rules
  static validateTicker(ticker: string): { isValid: boolean; error?: string } {
    if (!ticker) return { isValid: false, error: 'Ticker is required' };
    
    const cleanTicker = ticker.trim().toUpperCase();
    
    // Crypto pairs
    if (cleanTicker.includes('-USD')) {
      const cryptoRegex = /^[A-Z]{2,10}-USD$/;
      if (!cryptoRegex.test(cleanTicker)) {
        return { isValid: false, error: 'Invalid crypto pair format (e.g., BTC-USD)' };
      }
      return { isValid: true };
    }
    
    // Stock symbols
    const stockRegex = /^[A-Z]{1,5}$/;
    if (!stockRegex.test(cleanTicker)) {
      return { isValid: false, error: 'Invalid stock symbol (1-5 letters)' };
    }
    
    return { isValid: true };
  }

  // Validate and sanitize ticker list
  static validateTickerList(tickers: string): { valid: string[]; invalid: string[]; errors: string[] } {
    const tickerArray = tickers.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const valid: string[] = [];
    const invalid: string[] = [];
    const errors: string[] = [];
    
    if (tickerArray.length > 20) {
      errors.push('Maximum 20 tickers allowed');
      return { valid, invalid, errors };
    }
    
    tickerArray.forEach(ticker => {
      const validation = this.validateTicker(ticker);
      if (validation.isValid) {
        valid.push(ticker.toUpperCase());
      } else {
        invalid.push(ticker);
        if (validation.error) errors.push(`${ticker}: ${validation.error}`);
      }
    });
    
    return { valid, invalid, errors };
  }

  // Time horizon validation
  static validateTimeHorizon(horizon: string): boolean {
    const validHorizons = ['Intraday', 'Short-term', 'Medium-term', 'Long-term', 'Mixed'];
    return validHorizons.includes(horizon);
  }

  // Market validation
  static validateMarket(market: string): boolean {
    const validMarkets = ['US Equities', 'Cryptocurrencies', 'Commodities', 'Forex', 'Mixed Portfolio'];
    return validMarkets.includes(market);
  }

  // Price validation
  static validatePrice(price: any): { isValid: boolean; value?: number; error?: string } {
    const num = parseFloat(price);
    
    if (isNaN(num)) {
      return { isValid: false, error: 'Price must be a valid number' };
    }
    
    if (num <= 0) {
      return { isValid: false, error: 'Price must be positive' };
    }
    
    if (num > 1000000) {
      return { isValid: false, error: 'Price too high (max $1,000,000)' };
    }
    
    return { isValid: true, value: Number(num.toFixed(2)) };
  }

  // Date validation
  static validateDate(date: string): { isValid: boolean; date?: Date; error?: string } {
    if (!date) return { isValid: false, error: 'Date is required' };
    
    const parsedDate = new Date(date);
    
    if (isNaN(parsedDate.getTime())) {
      return { isValid: false, error: 'Invalid date format' };
    }
    
    const now = new Date();
    const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    
    if (parsedDate < now) {
      return { isValid: false, error: 'Date cannot be in the past' };
    }
    
    if (parsedDate > oneYearFromNow) {
      return { isValid: false, error: 'Date cannot be more than 1 year in the future' };
    }
    
    return { isValid: true, date: parsedDate };
  }

  // Percentage validation
  static validatePercentage(value: any): { isValid: boolean; value?: number; error?: string } {
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      return { isValid: false, error: 'Percentage must be a valid number' };
    }
    
    if (num < 0 || num > 100) {
      return { isValid: false, error: 'Percentage must be between 0 and 100' };
    }
    
    return { isValid: true, value: Number(num.toFixed(2)) };
  }

  // File validation
  static validateFile(file: File, allowedTypes: string[], maxSizeMB: number = 10): { isValid: boolean; error?: string } {
    if (!file) return { isValid: false, error: 'File is required' };
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: `File type not allowed. Allowed: ${allowedTypes.join(', ')}` };
    }
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { isValid: false, error: `File too large. Maximum size: ${maxSizeMB}MB` };
    }
    
    return { isValid: true };
  }

  // XSS prevention
  static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // SQL injection prevention
  static sanitizeSqlInput(input: string): string {
    return input
      .replace(/['";\\]/g, '') // Remove dangerous characters
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove SQL block comments
      .replace(/\*\//g, '')
      .trim();
  }

  // Rate limiting validation
  static validateRateLimit(key: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowKey = `${key}_${Math.floor(now / windowMs)}`;
    
    const stored = sessionStorage.getItem(windowKey);
    const count = stored ? parseInt(stored) : 0;
    
    if (count >= maxRequests) {
      return false;
    }
    
    sessionStorage.setItem(windowKey, (count + 1).toString());
    return true;
  }

  // Password strength validation
  static validatePassword(password: string): { isValid: boolean; strength: 'weak' | 'medium' | 'strong'; errors: string[] } {
    const errors: string[] = [];
    let score = 0;
    
    if (password.length < 8) errors.push('At least 8 characters required');
    else score += 1;
    
    if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter required');
    else score += 1;
    
    if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter required');
    else score += 1;
    
    if (!/\d/.test(password)) errors.push('At least one number required');
    else score += 1;
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('At least one special character required');
    else score += 1;
    
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (score >= 4) strength = 'strong';
    else if (score >= 2) strength = 'medium';
    
    return {
      isValid: errors.length === 0,
      strength,
      errors
    };
  }
}