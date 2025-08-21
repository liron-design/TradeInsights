// Report scheduling system
export class ReportScheduler {
  private static timers: Map<string, NodeJS.Timeout> = new Map();

  static scheduleReport(
    type: 'pre-market' | 'pre-close',
    callback: () => void,
    customTime?: { hour: number; minute: number }
  ): void {
    const now = new Date();
    const scheduledTime = new Date();
    
    // Default times
    const times = {
      'pre-market': { hour: 4, minute: 0 },
      'pre-close': { hour: 15, minute: 30 }
    };
    
    const targetTime = customTime || times[type];
    scheduledTime.setHours(targetTime.hour, targetTime.minute, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    // Skip weekends for market reports
    while (scheduledTime.getDay() === 0 || scheduledTime.getDay() === 6) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const delay = scheduledTime.getTime() - now.getTime();
    
    const timerId = setTimeout(() => {
      callback();
      // Reschedule for next day
      this.scheduleReport(type, callback, customTime);
    }, delay);
    
    this.timers.set(type, timerId);
    
    console.log(`${type} report scheduled for ${scheduledTime.toLocaleString()}`);
  }

  static cancelSchedule(type: string): void {
    const timer = this.timers.get(type);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(type);
    }
  }

  static cancelAllSchedules(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }

  static getNextScheduledTime(type: 'pre-market' | 'pre-close'): Date {
    const now = new Date();
    const scheduledTime = new Date();
    
    const times = {
      'pre-market': { hour: 4, minute: 0 },
      'pre-close': { hour: 15, minute: 30 }
    };
    
    const targetTime = times[type];
    scheduledTime.setHours(targetTime.hour, targetTime.minute, 0, 0);
    
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    while (scheduledTime.getDay() === 0 || scheduledTime.getDay() === 6) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    return scheduledTime;
  }
}