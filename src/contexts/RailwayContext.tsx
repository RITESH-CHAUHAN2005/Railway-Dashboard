import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TrainData } from '@/data/trainData';

interface RailwaySystemStatus {
  network: 'online' | 'offline' | 'degraded';
  gps: 'active' | 'inactive' | 'limited';
  signals: 'operational' | 'maintenance' | 'error';
  communication: 'clear' | 'interference' | 'down';
}

interface EmergencyMode {
  active: boolean;
  level: 'none' | 'yellow' | 'orange' | 'red';
  reason?: string;
  activatedAt?: Date;
}

interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface RailwayContextType {
  // System Status
  systemStatus: RailwaySystemStatus;
  emergencyMode: EmergencyMode;
  lastUpdateTime: Date;
  isConnected: boolean;
  
  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  
  // Actions
  toggleEmergencyMode: (level?: EmergencyMode['level'], reason?: string) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  refreshSystemData: () => void;
  
  // Real-time data
  trains: TrainData[];
  updateTrainData: (trains: TrainData[]) => void;
}

const RailwayContext = createContext<RailwayContextType | undefined>(undefined);

export const useRailway = () => {
  const context = useContext(RailwayContext);
  if (!context) {
    throw new Error('useRailway must be used within a RailwayProvider');
  }
  return context;
};

interface RailwayProviderProps {
  children: ReactNode;
}

export const RailwayProvider: React.FC<RailwayProviderProps> = ({ children }) => {
  const [systemStatus, setSystemStatus] = useState<RailwaySystemStatus>({
    network: 'online',
    gps: 'active',
    signals: 'operational',
    communication: 'clear'
  });

  const [emergencyMode, setEmergencyMode] = useState<EmergencyMode>({
    active: false,
    level: 'none'
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [isConnected, setIsConnected] = useState(true);
  const [trains, setTrains] = useState<TrainData[]>([]);

  const addNotificationInternal = (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => {
      // Prevent duplicate notifications
      const isDuplicate = prev.some(n => 
        n.title === notification.title && 
        n.message === notification.message &&
        Date.now() - n.timestamp.getTime() < 5000 // Within 5 seconds
      );
      
      if (isDuplicate) return prev;
      
      return [newNotification, ...prev].slice(0, 3); // Keep max 3 notifications
    });
  };

  // Real-time system updates - no dummy notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdateTime(new Date());
    }, 60000); // Update timestamp every minute

    return () => clearInterval(interval);
  }, []);

  // Connection status simulation
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      // Simulate brief connection issues
      if (Math.random() > 0.995) {
        setIsConnected(false);
        setTimeout(() => setIsConnected(true), 2000);
      }
    }, 10000);

    return () => clearInterval(connectionInterval);
  }, []);

  const toggleEmergencyMode = (level: EmergencyMode['level'] = 'yellow', reason?: string) => {
    const isActivating = !emergencyMode.active || level !== 'none';
    
    setEmergencyMode({
      active: isActivating,
      level: isActivating ? level : 'none',
      reason: isActivating ? reason : undefined,
      activatedAt: isActivating ? new Date() : undefined
    });

    // Add notification about emergency mode change
    addNotification({
      type: isActivating ? 'error' : 'success',
      title: isActivating ? 'Emergency Mode Activated' : 'Emergency Mode Deactivated',
      message: isActivating 
        ? `Emergency Level: ${level.toUpperCase()}${reason ? ` - ${reason}` : ''}`
        : 'System returned to normal operation',
      priority: 'critical'
    });
  };

  const addNotification = addNotificationInternal;

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const refreshSystemData = () => {
    setLastUpdateTime(new Date());
    
    // Simulate data refresh
    addNotification({
      type: 'success',
      title: 'Data Refreshed',
      message: 'All system data has been updated successfully',
      priority: 'low'
    });
  };

  const updateTrainData = (newTrains: TrainData[]) => {
    setTrains(newTrains);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: RailwayContextType = {
    systemStatus,
    emergencyMode,
    lastUpdateTime,
    isConnected,
    notifications,
    unreadCount,
    toggleEmergencyMode,
    addNotification,
    markNotificationRead,
    clearAllNotifications,
    refreshSystemData,
    trains,
    updateTrainData
  };

  return (
    <RailwayContext.Provider value={value}>
      {children}
    </RailwayContext.Provider>
  );
};