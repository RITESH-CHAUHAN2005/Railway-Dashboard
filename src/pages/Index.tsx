import React, { useState, useEffect, useCallback } from 'react';
import { useRailway } from '@/contexts/RailwayContext';
import useWebSocket from '@/hooks/useWebSocket';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { DashboardLoadingSkeleton, TrainLoading } from '@/components/UI/LoadingStates';
import { mockTrains } from '@/data/trainData';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { updateTrainData, addNotification } = useRailway();

  // Memoize callbacks to prevent infinite loops
  const handleTrainUpdate = useCallback((trains) => {
    updateTrainData(trains);
  }, [updateTrainData]);

  const handleSystemAlert = useCallback((alert) => {
    addNotification({
      type: alert.type === 'error' ? 'error' : alert.type === 'warning' ? 'warning' : 'info',
      title: 'System Alert',
      message: alert.message,
      priority: alert.type === 'error' ? 'high' : 'medium'
    });
  }, [addNotification]);

  // Initialize WebSocket connection
  const { isConnected, connectionStatus } = useWebSocket({
    onTrainUpdate: handleTrainUpdate,
    onSystemAlert: handleSystemAlert
  });

  // Load initial data only once
  useEffect(() => {
    const loadInitialData = () => {
      // Load initial train data immediately
      updateTrainData(mockTrains);
      setIsLoading(false);
    };

    // Delay to prevent notification spam
    const timer = setTimeout(loadInitialData, 100);
    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <TrainLoading message="Initializing Railway Control Center..." />
      </div>
    );
  }

  return <DashboardLayout />;
};

export default Index;
