interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: number;
}

interface NotificationCallback {
  (notification: Notification): void;
}

export class NotificationService {
  private static instance: NotificationService;
  private subscribers: NotificationCallback[] = [];
  private notifications: Notification[] = [];

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  subscribe(callback: NotificationCallback): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify(type: Notification['type'], message: string): void {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: Date.now(),
    };

    this.notifications.push(notification);
    this.subscribers.forEach(callback => callback(notification));

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  }

  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Position-specific notifications
  notifyPositionRisk(positionId: string, riskLevel: number): void {
    if (riskLevel > 0.8) {
      this.notify(
        'warning',
        `Position ${positionId} is at high risk (${(riskLevel * 100).toFixed(1)}%)`
      );
    }
  }

  notifyBetterPoolAvailable(positionId: string, currentApy: number, betterApy: number): void {
    this.notify(
      'info',
      `Better APY available for position ${positionId}: ${betterApy.toFixed(2)}% vs current ${currentApy.toFixed(2)}%`
    );
  }

  notifyLiquidationRisk(positionId: string, healthFactor: number): void {
    if (healthFactor < 1.1) {
      this.notify(
        'error',
        `Position ${positionId} is at risk of liquidation! Health factor: ${healthFactor.toFixed(2)}`
      );
    }
  }

  // Pool-specific notifications
  notifyPoolUtilization(poolId: string, utilization: number): void {
    if (utilization > 0.9) {
      this.notify(
        'warning',
        `Pool ${poolId} is highly utilized (${(utilization * 100).toFixed(1)}%)`
      );
    }
  }

  notifyPoolRisk(poolId: string, riskLevel: number): void {
    if (riskLevel > 0.7) {
      this.notify(
        'warning',
        `Pool ${poolId} has elevated risk level (${(riskLevel * 100).toFixed(1)}%)`
      );
    }
  }
} 