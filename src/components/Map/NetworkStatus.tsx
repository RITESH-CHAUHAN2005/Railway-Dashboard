import React, { useState, useEffect } from 'react';
import { Activity, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { liveTrains } from '@/data/railwayRoutes';

const NetworkStatus = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [networkStatus, setNetworkStatus] = useState<'operational' | 'warning' | 'error'>('operational');

  useEffect(() => {
    // Simulate network status updates
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Simulate occasional network issues
      const random = Math.random();
      if (random > 0.95) {
        setNetworkStatus('error');
      } else if (random > 0.85) {
        setNetworkStatus('warning');
      } else {
        setNetworkStatus('operational');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (networkStatus) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-status-ontime" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-status-warning" />;
      case 'error':
        return <Wifi className="h-4 w-4 text-status-delayed" />;
    }
  };

  const getStatusText = () => {
    switch (networkStatus) {
      case 'operational':
        return 'All Systems Operational';
      case 'warning':
        return 'Minor Delays Detected';
      case 'error':
        return 'Network Issues';
    }
  };

  const getStatusColor = () => {
    switch (networkStatus) {
      case 'operational':
        return 'bg-status-ontime';
      case 'warning':
        return 'bg-status-warning';
      case 'error':
        return 'bg-status-delayed';
    }
  };

  const trafficDensity = liveTrains.length > 4 ? 'high' : liveTrains.length > 2 ? 'medium' : 'low';
  
  const getDensityColor = () => {
    switch (trafficDensity) {
      case 'high':
        return 'text-status-delayed';
      case 'medium':
        return 'text-status-warning';
      case 'low':
        return 'text-status-ontime';
    }
  };

  return (
    <div className="absolute bottom-4 left-4 railway-card p-3 min-w-64">
      {/* Network Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-foreground">{getStatusText()}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
      </div>

      {/* Traffic Density */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">Traffic Density</span>
        </div>
        <Badge 
          variant="outline" 
          className={`text-xs capitalize ${getDensityColor()}`}
        >
          {trafficDensity}
        </Badge>
      </div>

      {/* Active Trains */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">Active Trains</span>
        <span className="text-sm font-medium text-foreground">{liveTrains.length}</span>
      </div>

      {/* Route Status */}
      <div className="space-y-1 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Delhi-Mumbai</span>
          <span className="text-status-ontime">●</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Delhi-Chennai</span>
          <span className="text-status-ontime">●</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Delhi-Kolkata</span>
          <span className="text-status-warning">●</span>
        </div>
      </div>

      {/* Last Update */}
      <div className="text-xs text-muted-foreground border-t border-border pt-2">
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default NetworkStatus;