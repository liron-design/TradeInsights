// Advanced validation utilities for enterprise security
export class ValidationUtils {
  // Input sanitization with comprehensive XSS prevention
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .trim()
      .substring(0, 1000); // Limit length
  }

  static sanitizeNumber(value: any, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number {
    const num = parseFloat(value);
    if (isNaN(num) || !isFinite(num)) return min;
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
    
    // Check for common disposable email domains
    const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && disposableDomains.includes(domain)) {
      return { isValid: false, error: 'Disposable email addresses not allowed' };
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
    
    // Check against known invalid symbols
    const invalidSymbols = ['TEST', 'NULL', 'VOID'];
    if (invalidSymbols.includes(cleanTicker)) {
      return { isValid: false, error: 'Invalid or reserved symbol' };
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
    
    // Remove duplicates
    const uniqueTickers = [...new Set(tickerArray)];
    
    uniqueTickers.forEach(ticker => {
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

  // Price validation with market-specific rules
  static validatePrice(price: any): { isValid: boolean; value?: number; error?: string } {
    const num = parseFloat(price);
    
    if (isNaN(num) || !isFinite(num)) {
      return { isValid: false, error: 'Price must be a valid number' };
    }
    
    if (num <= 0) {
      return { isValid: false, error: 'Price must be positive' };
    }
    
    if (num > 10000000) {
      return { isValid: false, error: 'Price too high (max $10,000,000)' };
    }
    
    // Check for reasonable decimal places
    const decimalPlaces = (num.toString().split('.')[1] || '').length;
    if (decimalPlaces > 4) {
      return { isValid: false, error: 'Maximum 4 decimal places allowed' };
    }
    
    return { isValid: true, value: Number(num.toFixed(4)) };
  }

  // Date validation with business rules
  static validateDate(date: string): { isValid: boolean; date?: Date; error?: string } {
    if (!date) return { isValid: false, error: 'Date is required' };
    
    const parsedDate = new Date(date);
    
    if (isNaN(parsedDate.getTime())) {
      return { isValid: false, error: 'Invalid date format' };
    }
    
    const now = new Date();
    const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    
    if (parsedDate < oneYearAgo) {
      return { isValid: false, error: 'Date cannot be more than 1 year in the past' };
    }
    
    if (parsedDate > oneYearFromNow) {
      return { isValid: false, error: 'Date cannot be more than 1 year in the future' };
    }
    
    return { isValid: true, date: parsedDate };
  }

  // Percentage validation
  static validatePercentage(value: any): { isValid: boolean; value?: number; error?: string } {
    const num = parseFloat(value);
    
    if (isNaN(num) || !isFinite(num)) {
      return { isValid: false, error: 'Percentage must be a valid number' };
    }
    
    if (num < -100 || num > 100) {
      return { isValid: false, error: 'Percentage must be between -100 and 100' };
    }
    
    return { isValid: true, value: Number(num.toFixed(2)) };
  }

  // File validation with security checks
  static validateFile(file: File, allowedTypes: string[], maxSizeMB: number = 10): { isValid: boolean; error?: string } {
    if (!file) return { isValid: false, error: 'File is required' };
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: `File type not allowed. Allowed: ${allowedTypes.join(', ')}` };
    }
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { isValid: false, error: `File too large. Maximum size: ${maxSizeMB}MB` };
    }
    
    // Check for suspicious file names
    const suspiciousPatterns = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js'];
    const fileName = file.name.toLowerCase();
    if (suspiciousPatterns.some(pattern => fileName.includes(pattern))) {
      return { isValid: false, error: 'Suspicious file type detected' };
    }
    
    return { isValid: true };
  }

  // XSS prevention with advanced encoding
  static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\//g, "&#x2F;");
  }

  // SQL injection prevention
  static sanitizeSqlInput(input: string): string {
    return input
      .replace(/['";\\]/g, '') // Remove dangerous characters
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove SQL block comments
      .replace(/\*\//g, '')
      .replace(/\bUNION\b/gi, '') // Remove UNION statements
      .replace(/\bSELECT\b/gi, '') // Remove SELECT statements
      .replace(/\bINSERT\b/gi, '') // Remove INSERT statements
      .replace(/\bUPDATE\b/gi, '') // Remove UPDATE statements
      .replace(/\bDELETE\b/gi, '') // Remove DELETE statements
      .replace(/\bDROP\b/gi, '') // Remove DROP statements
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
    
    // Clean up old entries
    setTimeout(() => {
      sessionStorage.removeItem(windowKey);
    }, windowMs);
    
    return true;
  }

  // Password strength validation with entropy calculation
  static validatePassword(password: string): { 
    isValid: boolean; 
    strength: 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong'; 
    errors: string[];
    entropy: number;
  } {
    const errors: string[] = [];
    let score = 0;
    
    // Length check
    if (password.length < 8) errors.push('At least 8 characters required');
    else if (password.length >= 12) score += 2;
    else score += 1;
    
    // Character variety checks
    if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter required');
    else score += 1;
    
    if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter required');
    else score += 1;
    
    if (!/\d/.test(password)) errors.push('At least one number required');
    else score += 1;
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('At least one special character required');
    else score += 1;
    
    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Avoid repeating characters');
      score -= 1;
    }
    
    if (/123|abc|qwe|password|admin/i.test(password)) {
      errors.push('Avoid common patterns');
      score -= 2;
    }
    
    // Calculate entropy
    const entropy = this.calculatePasswordEntropy(password);
    
    // Determine strength
    let strength: 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong' = 'very_weak';
    if (score >= 6 && entropy > 60) strength = 'very_strong';
    else if (score >= 5 && entropy > 50) strength = 'strong';
    else if (score >= 4 && entropy > 40) strength = 'medium';
    else if (score >= 2 && entropy > 30) strength = 'weak';
    
    return {
      isValid: errors.length === 0 && score >= 4,
      strength,
      errors,
      entropy: Math.round(entropy)
    };
  }

  private static calculatePasswordEntropy(password: string): number {
    const charSets = [
      { regex: /[a-z]/, size: 26 },
      { regex: /[A-Z]/, size: 26 },
      { regex: /\d/, size: 10 },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, size: 32 }
    ];
    
    let charsetSize = 0;
    charSets.forEach(set => {
      if (set.regex.test(password)) {
        charsetSize += set.size;
      }
    });
    
    return password.length * Math.log2(charsetSize);
  }

  // URL validation with security checks
  static validateUrl(url: string): { isValid: boolean; error?: string } {
    if (!url) return { isValid: false, error: 'URL is required' };
    
    try {
      const urlObj = new URL(url);
      
      // Only allow HTTP/HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'Only HTTP/HTTPS URLs allowed' };
      }
      
      // Block localhost and private IPs in production
      if (process.env.NODE_ENV === 'production') {
        const hostname = urlObj.hostname.toLowerCase();
        if (hostname === 'localhost' || 
            hostname.startsWith('127.') || 
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            hostname.match(/^172\.(1[6-9]|2\d|3[01])\./)) {
          return { isValid: false, error: 'Private network URLs not allowed' };
        }
      }
      
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }

  // JSON validation with size limits
  static validateJson(jsonString: string, maxSizeKB: number = 100): { isValid: boolean; data?: any; error?: string } {
    if (!jsonString) return { isValid: false, error: 'JSON is required' };
    
    // Check size
    const sizeKB = new Blob([jsonString]).size / 1024;
    if (sizeKB > maxSizeKB) {
      return { isValid: false, error: `JSON too large. Maximum size: ${maxSizeKB}KB` };
    }
    
    try {
      const data = JSON.parse(jsonString);
      
      // Check for dangerous properties
      const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
      if (this.containsDangerousKeys(data, dangerousKeys)) {
        return { isValid: false, error: 'JSON contains dangerous properties' };
      }
      
      return { isValid: true, data };
    } catch (error) {
      return { isValid: false, error: 'Invalid JSON format' };
    }
  }

  private static containsDangerousKeys(obj: any, dangerousKeys: string[]): boolean {
    if (typeof obj !== 'object' || obj === null) return false;
    
    for (const key in obj) {
      if (dangerousKeys.includes(key)) return true;
      if (typeof obj[key] === 'object' && this.containsDangerousKeys(obj[key], dangerousKeys)) {
        return true;
      }
    }
    
    return false;
  }

  // Phone number validation
  static validatePhoneNumber(phone: string): { isValid: boolean; formatted?: string; error?: string } {
    if (!phone) return { isValid: false, error: 'Phone number is required' };
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // US phone number validation
    if (digits.length === 10) {
      const formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      return { isValid: true, formatted };
    } else if (digits.length === 11 && digits[0] === '1') {
      const formatted = `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
      return { isValid: true, formatted };
    }
    
    return { isValid: false, error: 'Invalid phone number format' };
  }

  // Credit card validation (for premium features)
  static validateCreditCard(cardNumber: string): { isValid: boolean; type?: string; error?: string } {
    if (!cardNumber) return { isValid: false, error: 'Card number is required' };
    
    const digits = cardNumber.replace(/\D/g, '');
    
    // Luhn algorithm
    if (!this.luhnCheck(digits)) {
      return { isValid: false, error: 'Invalid card number' };
    }
    
    // Determine card type
    let type = 'Unknown';
    if (/^4/.test(digits)) type = 'Visa';
    else if (/^5[1-5]/.test(digits)) type = 'Mastercard';
    else if (/^3[47]/.test(digits)) type = 'American Express';
    else if (/^6/.test(digits)) type = 'Discover';
    
    return { isValid: true, type };
  }

  private static luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  // IP address validation
  static validateIpAddress(ip: string): { isValid: boolean; type?: 'ipv4' | 'ipv6'; error?: string } {
    if (!ip) return { isValid: false, error: 'IP address is required' };
    
    // IPv4 validation
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (ipv4Regex.test(ip)) {
      return { isValid: true, type: 'ipv4' };
    }
    
    // IPv6 validation (simplified)
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    if (ipv6Regex.test(ip)) {
      return { isValid: true, type: 'ipv6' };
    }
    
    return { isValid: false, error: 'Invalid IP address format' };
  }

  // Comprehensive input validation
  static validateInput(input: any, rules: {
    type: 'string' | 'number' | 'email' | 'url' | 'phone' | 'date' | 'json';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    customValidator?: (value: any) => { isValid: boolean; error?: string };
  }): { isValid: boolean; sanitized?: any; errors: string[] } {
    const errors: string[] = [];
    
    // Required check
    if (rules.required && (input === null || input === undefined || input === '')) {
      errors.push('This field is required');
      return { isValid: false, errors };
    }
    
    // Skip validation if not required and empty
    if (!rules.required && (input === null || input === undefined || input === '')) {
      return { isValid: true, sanitized: input, errors: [] };
    }
    
    let sanitized = input;
    
    // Type-specific validation
    switch (rules.type) {
      case 'string':
        sanitized = this.sanitizeString(input);
        if (rules.minLength && sanitized.length < rules.minLength) {
          errors.push(`Minimum length: ${rules.minLength} characters`);
        }
        if (rules.maxLength && sanitized.length > rules.maxLength) {
          errors.push(`Maximum length: ${rules.maxLength} characters`);
        }
        if (rules.pattern && !rules.pattern.test(sanitized)) {
          errors.push('Invalid format');
        }
        break;
        
      case 'number':
        const numResult = this.validatePrice(input);
        if (!numResult.isValid) {
          errors.push(numResult.error || 'Invalid number');
        } else {
          sanitized = numResult.value;
          if (rules.min !== undefined && sanitized < rules.min) {
            errors.push(`Minimum value: ${rules.min}`);
          }
          if (rules.max !== undefined && sanitized > rules.max) {
            errors.push(`Maximum value: ${rules.max}`);
          }
        }
        break;
        
      case 'email':
        const emailResult = this.validateEmail(input);
        if (!emailResult.isValid) {
          errors.push(emailResult.error || 'Invalid email');
        }
        break;
        
      case 'url':
        const urlResult = this.validateUrl(input);
        if (!urlResult.isValid) {
          errors.push(urlResult.error || 'Invalid URL');
        }
        break;
        
      case 'phone':
        const phoneResult = this.validatePhoneNumber(input);
        if (!phoneResult.isValid) {
          errors.push(phoneResult.error || 'Invalid phone number');
        } else {
          sanitized = phoneResult.formatted;
        }
        break;
        
      case 'date':
        const dateResult = this.validateDate(input);
        if (!dateResult.isValid) {
          errors.push(dateResult.error || 'Invalid date');
        } else {
          sanitized = dateResult.date;
        }
        break;
        
      case 'json':
        const jsonResult = this.validateJson(input);
        if (!jsonResult.isValid) {
          errors.push(jsonResult.error || 'Invalid JSON');
        } else {
          sanitized = jsonResult.data;
        }
        break;
    }
    
    // Custom validation
    if (rules.customValidator && errors.length === 0) {
      const customResult = rules.customValidator(sanitized);
      if (!customResult.isValid) {
        errors.push(customResult.error || 'Custom validation failed');
      }
    }
    
    return {
      isValid: errors.length === 0,
      sanitized: errors.length === 0 ? sanitized : undefined,
      errors
    };
  }
}