// Enterprise-grade security utilities
export class SecurityManager {
  private static readonly CSP_NONCE = this.generateNonce();
  private static securityEvents: Array<{ type: string; details: any; timestamp: Date }> = [];

  // Generate cryptographically secure nonce
  private static generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Content Security Policy implementation
  static implementCSP(): void {
    const cspDirectives = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${this.CSP_NONCE}' 'unsafe-eval'`, // unsafe-eval needed for dev
      "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for Tailwind
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' wss: https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ];

    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = cspDirectives.join('; ');
    document.head.appendChild(meta);
  }

  // XSS protection
  static sanitizeInput(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  // CSRF protection
  static generateCSRFToken(): string {
    const token = this.generateNonce();
    sessionStorage.setItem('csrf_token', token);
    return token;
  }

  static validateCSRFToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token;
  }

  // Rate limiting
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(key: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const stored = this.rateLimitStore.get(key);
    
    if (!stored || now > stored.resetTime) {
      this.rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (stored.count >= maxRequests) {
      this.logSecurityEvent('rate_limit_exceeded', { key, count: stored.count });
      return false;
    }
    
    stored.count++;
    return true;
  }

  // Input validation and sanitization
  static validateAndSanitizeInput(input: any, type: 'string' | 'number' | 'email' | 'url'): { isValid: boolean; sanitized?: any; error?: string } {
    if (input === null || input === undefined) {
      return { isValid: false, error: 'Input is required' };
    }

    switch (type) {
      case 'string':
        if (typeof input !== 'string') {
          return { isValid: false, error: 'Input must be a string' };
        }
        const sanitized = this.sanitizeInput(input);
        if (sanitized.length > 10000) {
          return { isValid: false, error: 'Input too long' };
        }
        return { isValid: true, sanitized };

      case 'number':
        const num = parseFloat(input);
        if (isNaN(num)) {
          return { isValid: false, error: 'Input must be a valid number' };
        }
        if (!isFinite(num)) {
          return { isValid: false, error: 'Input must be finite' };
        }
        return { isValid: true, sanitized: num };

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) {
          return { isValid: false, error: 'Invalid email format' };
        }
        return { isValid: true, sanitized: input.toLowerCase().trim() };

      case 'url':
        try {
          const url = new URL(input);
          if (!['http:', 'https:'].includes(url.protocol)) {
            return { isValid: false, error: 'Only HTTP/HTTPS URLs allowed' };
          }
          return { isValid: true, sanitized: url.toString() };
        } catch {
          return { isValid: false, error: 'Invalid URL format' };
        }

      default:
        return { isValid: false, error: 'Unknown validation type' };
    }
  }

  // Secure random number generation
  static secureRandom(min: number = 0, max: number = 1): number {
    const range = max - min;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] / (0xFFFFFFFF + 1)) * range;
  }

  // Secure token generation
  static generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Password hashing (client-side for demo - use server-side in production)
  static async hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const encoder = new TextEncoder();
    const usedSalt = salt || this.generateSecureToken(16);
    
    const data = encoder.encode(password + usedSalt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return { hash, salt: usedSalt };
  }

  // Secure data encryption (for local storage)
  static async encryptData(data: string, key?: string): Promise<{ encrypted: string; key: string }> {
    const encoder = new TextEncoder();
    const usedKey = key || this.generateSecureToken(32);
    
    // Import key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(usedKey),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt data
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encoder.encode(data)
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    const encrypted = Array.from(combined, byte => byte.toString(16).padStart(2, '0')).join('');
    
    return { encrypted, key: usedKey };
  }

  // Secure data decryption
  static async decryptData(encryptedData: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    // Convert hex string back to bytes
    const combined = new Uint8Array(encryptedData.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    // Import key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // Decrypt data
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    );
    
    return decoder.decode(decryptedBuffer);
  }

  // Security event logging
  static logSecurityEvent(type: string, details: any): void {
    const event = {
      type,
      details,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getSessionId()
    };
    
    this.securityEvents.push(event);
    
    // Keep only last 1000 events
    if (this.securityEvents.length > 1000) {
      this.securityEvents.shift();
    }
    
    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.reportSecurityEvent(event);
    } else {
      console.warn('Security event:', event);
    }
  }

  private static reportSecurityEvent(event: any): void {
    fetch('/api/security/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(() => {}); // Ignore network errors
  }

  private static reportPerformanceIssue(type: string, value: number): void {
    fetch('/api/performance/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        value,
        timestamp: Date.now(),
        url: window.location.href
      })
    }).catch(() => {}); // Ignore network errors
  }

  private static getSessionId(): string {
    let sessionId = sessionStorage.getItem('security_session_id');
    if (!sessionId) {
      sessionId = this.generateSecureToken(32);
      sessionStorage.setItem('security_session_id', sessionId);
    }
    return sessionId;
  }

  // Secure local storage
  static async setSecureItem(key: string, value: any): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      const { encrypted, key: encryptionKey } = await this.encryptData(serialized);
      
      localStorage.setItem(`secure_${key}`, encrypted);
      sessionStorage.setItem(`key_${key}`, encryptionKey);
      
      return true;
    } catch (error) {
      this.logSecurityEvent('encryption_failed', { key, error: error.message });
      return false;
    }
  }

  static async getSecureItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      const encryptionKey = sessionStorage.getItem(`key_${key}`);
      
      if (!encrypted || !encryptionKey) return defaultValue;
      
      const decrypted = await this.decryptData(encrypted, encryptionKey);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      this.logSecurityEvent('decryption_failed', { key, error: error.message });
      return defaultValue;
    }
  }

  // Security audit
  static performSecurityAudit(): {
    score: number;
    issues: Array<{ severity: 'low' | 'medium' | 'high'; description: string; recommendation: string }>;
  } {
    const issues: Array<{ severity: 'low' | 'medium' | 'high'; description: string; recommendation: string }> = [];
    let score = 100;

    // Check HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      issues.push({
        severity: 'high',
        description: 'Site not served over HTTPS',
        recommendation: 'Enable HTTPS to protect data in transit'
      });
      score -= 30;
    }

    // Check for mixed content
    const scripts = document.querySelectorAll('script[src]');
    const hasInsecureScripts = Array.from(scripts).some(script => 
      (script as HTMLScriptElement).src.startsWith('http:')
    );
    
    if (hasInsecureScripts) {
      issues.push({
        severity: 'medium',
        description: 'Mixed content detected',
        recommendation: 'Ensure all resources are loaded over HTTPS'
      });
      score -= 15;
    }

    // Check for inline scripts
    const inlineScripts = document.querySelectorAll('script:not([src])');
    if (inlineScripts.length > 0) {
      issues.push({
        severity: 'medium',
        description: 'Inline scripts detected',
        recommendation: 'Move scripts to external files with CSP nonces'
      });
      score -= 10;
    }

    // Check localStorage usage
    const localStorageKeys = Object.keys(localStorage);
    const hasUnencryptedData = localStorageKeys.some(key => !key.startsWith('secure_'));
    
    if (hasUnencryptedData) {
      issues.push({
        severity: 'low',
        description: 'Unencrypted data in localStorage',
        recommendation: 'Encrypt sensitive data before storing locally'
      });
      score -= 5;
    }

    return { score: Math.max(0, score), issues };
  }

  // Get security events
  static getSecurityEvents(): typeof SecurityManager.securityEvents {
    return [...this.securityEvents];
  }

  // Clear security events
  static clearSecurityEvents(): void {
    this.securityEvents = [];
  }
}