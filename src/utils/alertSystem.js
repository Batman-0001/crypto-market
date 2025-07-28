/**
 * Alert System for Interactive Crypto Calendar
 * Manages volatility and performance threshold alerts
 */

import { format } from "date-fns";

// Alert types and severities
export const ALERT_TYPES = {
  VOLATILITY: "volatility",
  PERFORMANCE: "performance",
  VOLUME: "volume",
  PRICE: "price",
  TREND: "trend",
  ANOMALY: "anomaly",
};

export const ALERT_SEVERITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

export const ALERT_CONDITIONS = {
  GREATER_THAN: "greater_than",
  LESS_THAN: "less_than",
  EQUALS: "equals",
  BETWEEN: "between",
  PERCENTAGE_CHANGE: "percentage_change",
};

// Default alert configurations
export const DEFAULT_ALERTS = {
  volatility: {
    high: { threshold: 15, condition: ALERT_CONDITIONS.GREATER_THAN },
    critical: { threshold: 25, condition: ALERT_CONDITIONS.GREATER_THAN },
  },
  performance: {
    bull: { threshold: 5, condition: ALERT_CONDITIONS.GREATER_THAN },
    bear: { threshold: -5, condition: ALERT_CONDITIONS.LESS_THAN },
    extreme_bull: { threshold: 15, condition: ALERT_CONDITIONS.GREATER_THAN },
    extreme_bear: { threshold: -15, condition: ALERT_CONDITIONS.LESS_THAN },
  },
  volume: {
    high: { threshold: 2, condition: ALERT_CONDITIONS.PERCENTAGE_CHANGE }, // 200% of average
    low: { threshold: 0.5, condition: ALERT_CONDITIONS.PERCENTAGE_CHANGE }, // 50% of average
  },
};

// Alert storage and management
class AlertManager {
  constructor() {
    this.alerts = this.loadAlerts();
    this.activeAlerts = [];
    this.alertHistory = this.loadAlertHistory();
    this.callbacks = [];
    this.isEnabled = this.loadAlertSettings().enabled;
  }

  // Save/Load alert configurations
  saveAlerts() {
    localStorage.setItem("crypto-calendar-alerts", JSON.stringify(this.alerts));
  }

  loadAlerts() {
    try {
      const saved = localStorage.getItem("crypto-calendar-alerts");
      return saved ? JSON.parse(saved) : { ...DEFAULT_ALERTS };
    } catch (error) {
      console.error("Error loading alerts:", error);
      return { ...DEFAULT_ALERTS };
    }
  }

  saveAlertHistory() {
    localStorage.setItem(
      "crypto-calendar-alert-history",
      JSON.stringify(this.alertHistory)
    );
  }

  loadAlertHistory() {
    try {
      const saved = localStorage.getItem("crypto-calendar-alert-history");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading alert history:", error);
      return [];
    }
  }

  saveAlertSettings() {
    localStorage.setItem(
      "crypto-calendar-alert-settings",
      JSON.stringify({
        enabled: this.isEnabled,
      })
    );
  }

  loadAlertSettings() {
    try {
      const saved = localStorage.getItem("crypto-calendar-alert-settings");
      return saved ? JSON.parse(saved) : { enabled: true };
    } catch (error) {
      return { enabled: true };
    }
  }

  // Enable/disable alerts
  enableAlerts() {
    this.isEnabled = true;
    this.saveAlertSettings();
  }

  disableAlerts() {
    this.isEnabled = false;
    this.saveAlertSettings();
  }

  // Subscribe to alert notifications
  subscribe(callback) {
    this.callbacks.push(callback);
  }

  unsubscribe(callback) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }

  // Trigger alert notifications
  notifySubscribers(alert) {
    if (!this.isEnabled) return;

    this.callbacks.forEach((callback) => {
      try {
        callback(alert);
      } catch (error) {
        console.error("Error in alert callback:", error);
      }
    });
  }

  // Check data against alert conditions
  checkAlerts(data, symbol, date) {
    if (!this.isEnabled || !data) return [];

    const triggeredAlerts = [];
    const currentPrice = data.price || data.close || 0;
    const volume = data.volume || 0;
    const volatility = data.volatility || 0;
    const changePercent = data.changePercent || 0;

    // Check volatility alerts
    if (this.alerts.volatility) {
      Object.entries(this.alerts.volatility).forEach(([level, config]) => {
        if (this.checkCondition(volatility, config)) {
          const alert = this.createAlert({
            type: ALERT_TYPES.VOLATILITY,
            severity:
              level === "critical"
                ? ALERT_SEVERITIES.CRITICAL
                : ALERT_SEVERITIES.HIGH,
            symbol,
            date,
            message: `High volatility detected: ${volatility.toFixed(2)}%`,
            value: volatility,
            threshold: config.threshold,
            data: { volatility, price: currentPrice },
          });
          triggeredAlerts.push(alert);
        }
      });
    }

    // Check performance alerts
    if (this.alerts.performance) {
      Object.entries(this.alerts.performance).forEach(([level, config]) => {
        if (this.checkCondition(changePercent, config)) {
          const severity = level.includes("extreme")
            ? ALERT_SEVERITIES.CRITICAL
            : Math.abs(changePercent) > 10
            ? ALERT_SEVERITIES.HIGH
            : ALERT_SEVERITIES.MEDIUM;

          const alert = this.createAlert({
            type: ALERT_TYPES.PERFORMANCE,
            severity,
            symbol,
            date,
            message: `${
              changePercent > 0 ? "Strong gain" : "Strong loss"
            }: ${changePercent.toFixed(2)}%`,
            value: changePercent,
            threshold: config.threshold,
            data: { changePercent, price: currentPrice },
          });
          triggeredAlerts.push(alert);
        }
      });
    }

    // Check volume alerts (requires historical data for comparison)
    if (this.alerts.volume && data.avgVolume) {
      const volumeRatio = volume / data.avgVolume;
      Object.entries(this.alerts.volume).forEach(([level, config]) => {
        if (this.checkCondition(volumeRatio, config)) {
          const alert = this.createAlert({
            type: ALERT_TYPES.VOLUME,
            severity: ALERT_SEVERITIES.MEDIUM,
            symbol,
            date,
            message: `Unusual volume: ${((volumeRatio - 1) * 100).toFixed(
              0
            )}% of average`,
            value: volumeRatio,
            threshold: config.threshold,
            data: { volume, avgVolume: data.avgVolume, ratio: volumeRatio },
          });
          triggeredAlerts.push(alert);
        }
      });
    }

    // Process triggered alerts
    triggeredAlerts.forEach((alert) => {
      this.addToHistory(alert);
      this.notifySubscribers(alert);
    });

    return triggeredAlerts;
  }

  // Check if a condition is met
  checkCondition(value, config) {
    const { threshold, condition } = config;

    switch (condition) {
      case ALERT_CONDITIONS.GREATER_THAN:
        return value > threshold;
      case ALERT_CONDITIONS.LESS_THAN:
        return value < threshold;
      case ALERT_CONDITIONS.EQUALS:
        return Math.abs(value - threshold) < 0.01;
      case ALERT_CONDITIONS.BETWEEN:
        return (
          Array.isArray(threshold) &&
          value >= threshold[0] &&
          value <= threshold[1]
        );
      case ALERT_CONDITIONS.PERCENTAGE_CHANGE:
        return Math.abs(value - 1) >= Math.abs(threshold - 1);
      default:
        return false;
    }
  }

  // Create alert object
  createAlert({
    type,
    severity,
    symbol,
    date,
    message,
    value,
    threshold,
    data,
  }) {
    return {
      id: Date.now() + Math.random(),
      type,
      severity,
      symbol,
      date: format(new Date(date), "yyyy-MM-dd HH:mm:ss"),
      timestamp: Date.now(),
      message,
      value,
      threshold,
      data,
      acknowledged: false,
    };
  }

  // Add alert to history
  addToHistory(alert) {
    this.alertHistory.unshift(alert);

    // Keep only last 1000 alerts
    if (this.alertHistory.length > 1000) {
      this.alertHistory = this.alertHistory.slice(0, 1000);
    }

    this.saveAlertHistory();
  }

  // Get alert history with filters
  getAlertHistory(filters = {}) {
    let filteredHistory = [...this.alertHistory];

    if (filters.type) {
      filteredHistory = filteredHistory.filter(
        (alert) => alert.type === filters.type
      );
    }

    if (filters.severity) {
      filteredHistory = filteredHistory.filter(
        (alert) => alert.severity === filters.severity
      );
    }

    if (filters.symbol) {
      filteredHistory = filteredHistory.filter(
        (alert) => alert.symbol === filters.symbol
      );
    }

    if (filters.dateFrom) {
      const fromTime = new Date(filters.dateFrom).getTime();
      filteredHistory = filteredHistory.filter(
        (alert) => alert.timestamp >= fromTime
      );
    }

    if (filters.dateTo) {
      const toTime = new Date(filters.dateTo).getTime();
      filteredHistory = filteredHistory.filter(
        (alert) => alert.timestamp <= toTime
      );
    }

    if (filters.acknowledged !== undefined) {
      filteredHistory = filteredHistory.filter(
        (alert) => alert.acknowledged === filters.acknowledged
      );
    }

    return filteredHistory;
  }

  // Acknowledge alert
  acknowledgeAlert(alertId) {
    const alertIndex = this.alertHistory.findIndex(
      (alert) => alert.id === alertId
    );
    if (alertIndex !== -1) {
      this.alertHistory[alertIndex].acknowledged = true;
      this.saveAlertHistory();
      return true;
    }
    return false;
  }

  // Acknowledge all alerts
  acknowledgeAllAlerts(filters = {}) {
    const alertsToAck = this.getAlertHistory(filters);
    alertsToAck.forEach((alert) => {
      const alertIndex = this.alertHistory.findIndex((a) => a.id === alert.id);
      if (alertIndex !== -1) {
        this.alertHistory[alertIndex].acknowledged = true;
      }
    });
    this.saveAlertHistory();
  }

  // Clear alert history
  clearHistory(olderThan = null) {
    if (olderThan) {
      const cutoffTime = new Date(olderThan).getTime();
      this.alertHistory = this.alertHistory.filter(
        (alert) => alert.timestamp >= cutoffTime
      );
    } else {
      this.alertHistory = [];
    }
    this.saveAlertHistory();
  }

  // Custom alert configuration
  addCustomAlert(config) {
    const { name, type, condition, threshold, severity } = config;

    if (!this.alerts.custom) {
      this.alerts.custom = {};
    }

    this.alerts.custom[name] = {
      type,
      condition,
      threshold,
      severity,
      enabled: true,
      created: Date.now(),
    };

    this.saveAlerts();
  }

  removeCustomAlert(name) {
    if (this.alerts.custom && this.alerts.custom[name]) {
      delete this.alerts.custom[name];
      this.saveAlerts();
    }
  }

  // Get alert statistics
  getAlertStatistics(days = 30) {
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    const recentAlerts = this.alertHistory.filter(
      (alert) => alert.timestamp >= cutoffTime
    );

    const stats = {
      total: recentAlerts.length,
      byType: {},
      bySeverity: {},
      bySymbol: {},
      acknowledged: recentAlerts.filter((alert) => alert.acknowledged).length,
    };

    recentAlerts.forEach((alert) => {
      // Count by type
      stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1;

      // Count by severity
      stats.bySeverity[alert.severity] =
        (stats.bySeverity[alert.severity] || 0) + 1;

      // Count by symbol
      stats.bySymbol[alert.symbol] = (stats.bySymbol[alert.symbol] || 0) + 1;
    });

    return stats;
  }
}

// Create singleton instance
export const alertManager = new AlertManager();

// Utility functions for alert UI
export const getAlertIcon = (type) => {
  switch (type) {
    case ALERT_TYPES.VOLATILITY:
      return "⚡";
    case ALERT_TYPES.PERFORMANCE:
      return "📊";
    case ALERT_TYPES.VOLUME:
      return "📈";
    case ALERT_TYPES.PRICE:
      return "💰";
    case ALERT_TYPES.TREND:
      return "📉";
    case ALERT_TYPES.ANOMALY:
      return "🔍";
    default:
      return "⚠️";
  }
};

export const getAlertColor = (severity) => {
  switch (severity) {
    case ALERT_SEVERITIES.LOW:
      return "#2196f3";
    case ALERT_SEVERITIES.MEDIUM:
      return "#ff9800";
    case ALERT_SEVERITIES.HIGH:
      return "#f44336";
    case ALERT_SEVERITIES.CRITICAL:
      return "#9c27b0";
    default:
      return "#757575";
  }
};

export const formatAlertMessage = (alert) => {
  const { type, symbol, value, threshold } = alert;

  switch (type) {
    case ALERT_TYPES.VOLATILITY:
      return `${symbol}: Volatility ${value.toFixed(
        2
      )}% (threshold: ${threshold}%)`;
    case ALERT_TYPES.PERFORMANCE:
      return `${symbol}: ${value > 0 ? "Gained" : "Lost"} ${Math.abs(
        value
      ).toFixed(2)}%`;
    case ALERT_TYPES.VOLUME:
      return `${symbol}: Volume ${((value - 1) * 100).toFixed(0)}% of average`;
    default:
      return alert.message;
  }
};

// Browser notification support
export const requestNotificationPermission = async () => {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
};

export const showBrowserNotification = (alert) => {
  if ("Notification" in window && Notification.permission === "granted") {
    const notification = new Notification(`Crypto Alert: ${alert.symbol}`, {
      body: alert.message,
      icon: getAlertIcon(alert.type),
      tag: `crypto-alert-${alert.id}`,
      requireInteraction: alert.severity === ALERT_SEVERITIES.CRITICAL,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 5 seconds for non-critical alerts
    if (alert.severity !== ALERT_SEVERITIES.CRITICAL) {
      setTimeout(() => notification.close(), 5000);
    }
  }
};

// Export default manager
export default alertManager;
