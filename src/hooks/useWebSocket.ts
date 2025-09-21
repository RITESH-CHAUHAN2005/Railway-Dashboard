import { useState, useEffect, useCallback, useRef } from 'react';
import { TrainData } from '@/data/trainData';

interface WebSocketMessage {
  type: 'train_update' | 'system_alert' | 'emergency' | 'heartbeat';
  data: any;
  timestamp: number;
}

interface UseWebSocketOptions {
  onTrainUpdate?: (trains: TrainData[]) => void;
  onSystemAlert?: (alert: any) => void;
  onEmergency?: (emergency: any) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    onTrainUpdate,
    onSystemAlert,
    onEmergency,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5
  } = options;

  // Clean up all intervals and timeouts
  const cleanupIntervals = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Simulate WebSocket connection for demo purposes
  const connect = useCallback(() => {
    if (isConnected) return;

    setConnectionStatus('connecting');
    
    // Simulate WebSocket connection
    const connectionTimeout = setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      setReconnectAttempts(0);
      
      // Start heartbeat simulation
      heartbeatIntervalRef.current = setInterval(() => {
        const heartbeat: WebSocketMessage = {
          type: 'heartbeat',
          data: { timestamp: Date.now(), status: 'ok' },
          timestamp: Date.now()
        };
        setLastMessage(heartbeat);
      }, 30000);

      // Simulate random data updates with better performance
      updateIntervalRef.current = setInterval(() => {
        if (Math.random() > 0.7) {
          // Simulate train updates
          const trainUpdate: WebSocketMessage = {
            type: 'train_update',
            data: {
              trainId: `1200${Math.floor(Math.random() * 100)}`,
              position: {
                lat: 28.6139 + (Math.random() - 0.5) * 0.1,
                lng: 77.2090 + (Math.random() - 0.5) * 0.1
              },
              speed: Math.floor(Math.random() * 160),
              status: ['ontime', 'delayed', 'warning'][Math.floor(Math.random() * 3)]
            },
            timestamp: Date.now()
          };
          
          setLastMessage(trainUpdate);
          onTrainUpdate?.([]);
        }

        if (Math.random() > 0.95) {
          // Simulate system alerts with better variety
          const alertTypes = [
            { type: 'warning', message: 'Signal maintenance scheduled at Junction ABC' },
            { type: 'info', message: 'New train 12345 added to monitoring system' },
            { type: 'error', message: 'Communication lost with Station XYZ' }
          ];
          
          const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
          const systemAlert: WebSocketMessage = {
            type: 'system_alert',
            data: randomAlert,
            timestamp: Date.now()
          };
          
          setLastMessage(systemAlert);
          onSystemAlert?.(randomAlert);
        }
      }, 15000);
    }, 1000);
    
    return () => {
      clearTimeout(connectionTimeout);
    };
  }, [isConnected, onTrainUpdate, onSystemAlert]);

  const disconnect = useCallback(() => {
    cleanupIntervals();
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, [cleanupIntervals]);

  const reconnect = useCallback(() => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      setConnectionStatus('error');
      return;
    }

    setReconnectAttempts(prev => prev + 1);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, reconnectInterval);
  }, [connect, reconnectAttempts, maxReconnectAttempts, reconnectInterval]);

  // Auto-connect on mount with proper cleanup
  useEffect(() => {
    const cleanup = connect();
    
    return () => {
      if (cleanup) cleanup();
      cleanupIntervals();
    };
  }, []); // Empty dependency array - only run on mount

  const sendMessage = useCallback((message: any) => {
    if (!isConnected) {
      console.warn('WebSocket not connected. Cannot send message:', message);
      return false;
    }
    
    // In real implementation, would send via WebSocket
    console.log('Sending WebSocket message:', message);
    return true;
  }, [isConnected]);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    reconnectAttempts,
    connect,
    disconnect,
    reconnect,
    sendMessage
  };
};

export default useWebSocket;