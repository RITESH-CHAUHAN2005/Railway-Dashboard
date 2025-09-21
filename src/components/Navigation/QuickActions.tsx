import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  RefreshCw, 
  Bell, 
  Phone, 
  Shield, 
  Zap,
  Clock,
  Radio
} from 'lucide-react';
import { useRailway } from '@/contexts/RailwayContext';
import { useToast } from '@/hooks/use-toast';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  action: () => void;
  shortcut?: string;
  requiresConfirmation?: boolean;
}

const QuickActions: React.FC = () => {
  const { 
    emergencyMode, 
    toggleEmergencyMode, 
    refreshSystemData, 
    unreadCount,
    addNotification 
  } = useRailway();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleEmergencyToggle = () => {
    if (emergencyMode.active) {
      toggleEmergencyMode('none');
    } else {
      toggleEmergencyMode('yellow', 'Manual activation from control panel');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    refreshSystemData();
    setIsRefreshing(false);
    
    toast({
      title: "System Refreshed",
      description: "All data has been updated successfully",
    });
  };

  const handleEmergencyCall = () => {
    addNotification({
      type: 'info',
      title: 'Emergency Call Initiated',
      message: 'Connecting to Railway Emergency Hotline...',
      priority: 'high'
    });
    
    toast({
      title: "Emergency Call",
      description: "Connecting to Railway Emergency Services",
      variant: "destructive"
    });
  };

  const handleSystemCheck = () => {
    addNotification({
      type: 'info',
      title: 'System Health Check',
      message: 'Running comprehensive system diagnostics...',
      priority: 'medium'
    });
  };

  const quickActions: QuickAction[] = [
    {
      id: 'emergency',
      label: emergencyMode.active ? 'Deactivate Emergency' : 'Emergency Mode',
      icon: emergencyMode.active ? Shield : AlertTriangle,
      variant: emergencyMode.active ? 'destructive' : 'outline',
      action: handleEmergencyToggle,
      shortcut: 'E',
      requiresConfirmation: true
    },
    {
      id: 'refresh',
      label: 'Refresh Data',
      icon: RefreshCw,
      variant: 'outline',
      action: handleRefresh,
      shortcut: 'R'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      variant: 'outline',
      action: () => {
        // This would open notification panel
        console.log('Opening notifications');
      },
      shortcut: 'N'
    },
    {
      id: 'emergency-call',
      label: 'Emergency Call',
      icon: Phone,
      variant: 'destructive',
      action: handleEmergencyCall,
      shortcut: 'Ctrl+E',
      requiresConfirmation: true
    },
    {
      id: 'system-check',
      label: 'System Check',
      icon: Zap,
      variant: 'secondary',
      action: handleSystemCheck,
      shortcut: 'S'
    }
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Emergency Mode Indicator */}
      {emergencyMode.active && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/20 border border-destructive/30 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
          <span className="text-sm font-medium text-destructive">
            EMERGENCY MODE - {emergencyMode.level?.toUpperCase()}
          </span>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant={emergencyMode.active ? 'destructive' : 'outline'}
          size="sm"
          onClick={handleEmergencyToggle}
          className={`${emergencyMode.active ? 'animate-pulse' : ''} hover:scale-105 transition-all duration-200`}
        >
          {emergencyMode.active ? (
            <Shield className="h-4 w-4 mr-1" />
          ) : (
            <AlertTriangle className="h-4 w-4 mr-1" />
          )}
          {emergencyMode.active ? 'Deactivate' : 'Emergency'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="hover:bg-accent/10 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>

        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="relative hover:bg-accent/10 transition-colors"
            onClick={() => {
              toast({
                title: "Notifications",
                description: `You have ${unreadCount} unread notifications`,
              });
            }}
          >
            <Bell className="h-4 w-4 mr-1" />
            Alerts
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleEmergencyCall}
          className="hover:scale-105 transition-all duration-200"
        >
          <Phone className="h-4 w-4 mr-1" />
          Emergency Call
        </Button>
      </div>

      {/* System Status Indicators */}
      <div className="hidden lg:flex items-center gap-3 ml-4 pl-4 border-l border-border">
        <div className="flex items-center gap-2">
          <div className="status-indicator status-ontime"></div>
          <span className="text-xs text-muted-foreground">Network</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Radio className="h-3 w-3 text-status-ontime" />
          <span className="text-xs text-muted-foreground">GPS</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-status-ontime" />
          <span className="text-xs text-muted-foreground">Sync</span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;