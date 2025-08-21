// Input validation and sanitization
export class ValidationUtils {
  static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim()
      .substring(0, 1000); // Limit length
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateTicker(ticker: string): boolean {
    const tickerRegex = /^[A-Z]{1,5}(-USD)?$/;
    return tickerRegex.test(ticker.toUpperCase());
  }

  static validateTickerList(tickers: string): string[] {
    return tickers
      .split(',')
      .map(t => t.trim().toUpperCase())
      .filter(t => this.validateTicker(t))
      .slice(0, 10); // Limit to 10 tickers
  }

  static sanitizeNumber(value: number, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number {
    if (isNaN(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  static validateTimeHorizon(horizon: string): boolean {
    const validHorizons = ['Intraday', 'Short-term', 'Medium-term', 'Long-term', 'Mixed'];
    return validHorizons.includes(horizon);
  }

  static validateMarket(market: string): boolean {
    const validMarkets = ['US Equities', 'Cryptocurrencies', 'Commodities', 'Forex', 'Mixed Portfolio'];
    return validMarkets.includes(market);
  }
}