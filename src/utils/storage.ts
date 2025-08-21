// Local storage utilities with error handling
export class StorageManager {
  private static prefix = 'tradeinsight_';

  static set<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return defaultValue;
    }
  }

  static remove(key: string): boolean {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  }

  static clear(): boolean {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.prefix)
      );
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }
}

// Settings persistence
export interface UserSettings {
  notifications: {
    preMarket: boolean;
    preClose: boolean;
    customAlerts: boolean;
    email: boolean;
    push: boolean;
  };
  reporting: {
    market: string;
    focusTickers: string;
    timeHorizon: string;
    weekendReports: boolean;
  };
  preferences: {
    voiceMode: boolean;
    darkMode: boolean;
    compactView: boolean;
    autoRefresh: boolean;
  };
}

export const defaultSettings: UserSettings = {
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

export const saveSettings = (settings: UserSettings): boolean => {
  return StorageManager.set('user_settings', settings);
};

export const loadSettings = (): UserSettings => {
  return StorageManager.get('user_settings', defaultSettings);
};