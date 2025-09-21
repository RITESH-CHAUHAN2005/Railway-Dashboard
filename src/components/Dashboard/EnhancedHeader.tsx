import React from 'react';
import { Clock, Wifi, WifiOff, Shield, AlertTriangle } from 'lucide-react';
import { useRailway } from '@/contexts/RailwayContext';
import { Badge } from '@/components/ui/badge';
import NotificationCenter from '@/components/Notifications/NotificationCenter';
import QuickActions from '@/components/Navigation/QuickActions';
import { formatDistanceToNow } from 'date-fns';

const EnhancedHeader: React.FC = () => {
  const { 
    isConnected, 
    lastUpdateTime, 
    emergencyMode, 
    systemStatus,
    unreadCount 
  } = useRailway();

  return (
    <header className="railway-header sticky top-0 z-30">
      <div className="container mx-auto px-4 lg:px-6 py-2 lg:py-3">
        <div className="flex items-center justify-between">
          {/* Left: Branding & System Info */}
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Indian Railway Logo */}
              <div className="relative">
                <div className="h-8 w-8 lg:h-10 w-10 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="/indian-railways-logo.png" 
                    alt="Indian Railways Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                {emergencyMode.active && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 lg:h-4 w-4 bg-destructive rounded-full flex items-center justify-center animate-pulse">
                    <AlertTriangle className="h-1.5 w-1.5 lg:h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </div>
              
              <div className="min-w-0">
                <h1 className="text-sm lg:text-lg xl:text-xl font-bold text-foreground bg-gradient-to-r from-railway-primary to-railway-accent bg-clip-text text-transparent truncate">
                  <span className="hidden lg:inline">भारतीय रेल नियंत्रण केंद्र</span>
                  <span className="lg:hidden">IR Control</span>
                </h1>
                <p className="text-xs lg:text-sm xl:text-lg font-semibold text-foreground truncate">
                  <span className="hidden lg:inline">Indian Railway Control Center</span>
                  <span className="lg:hidden">Control Center</span>
                </p>
                <div className="hidden md:flex items-center gap-2 lg:gap-4 mt-1">
                  <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm text-muted-foreground">
                    <Clock className="h-2.5 w-2.5 lg:h-3 w-3" />
                    <span className="hidden lg:inline">Last update: {formatDistanceToNow(lastUpdateTime, { addSuffix: true })}</span>
                    <span className="lg:hidden">{formatDistanceToNow(lastUpdateTime, { addSuffix: true })}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 lg:gap-2">
                    {isConnected ? (
                      <Wifi className="h-2.5 w-2.5 lg:h-3 w-3 text-status-ontime" />
                    ) : (
                      <WifiOff className="h-2.5 w-2.5 lg:h-3 w-3 text-destructive animate-pulse" />
                    )}
                    <span className={`text-xs ${isConnected ? 'text-status-ontime' : 'text-destructive'}`}>
                      {isConnected ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Emergency Status */}
          {emergencyMode.active && (
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-destructive/20 border border-destructive/30 rounded-lg">
              <Shield className="h-5 w-5 text-destructive animate-pulse" />
              <div>
                <div className="text-sm font-bold text-destructive">
                  EMERGENCY MODE ACTIVE
                </div>
                <div className="text-xs text-destructive/80">
                  Level: {emergencyMode.level?.toUpperCase()}
                  {emergencyMode.reason && ` - ${emergencyMode.reason}`}
                </div>
              </div>
            </div>
          )}

          {/* Right: Actions & Status */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* System Status Indicators */}
            <div className="hidden xl:flex items-center gap-2 lg:gap-4 px-2 lg:px-4 py-1 lg:py-2 railway-card">
              <div className="text-xs text-muted-foreground">Status:</div>
              
              <div className="flex items-center gap-1">
                <div className={`status-indicator ${
                  systemStatus.network === 'online' ? 'status-ontime' : 
                  systemStatus.network === 'degraded' ? 'status-warning' : 'status-delayed'
                }`}></div>
                <span className="text-xs">Net</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className={`status-indicator ${
                  systemStatus.gps === 'active' ? 'status-ontime' : 'status-delayed'
                }`}></div>
                <span className="text-xs">GPS</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className={`status-indicator ${
                  systemStatus.signals === 'operational' ? 'status-ontime' : 'status-warning'
                }`}></div>
                <span className="text-xs">Sig</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <NotificationCenter />
            </div>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </div>

        {/* Emergency Alert Bar */}
        {emergencyMode.active && (
          <div className="mt-2 lg:mt-4 p-2 lg:p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 lg:gap-3">
                <AlertTriangle className="h-4 w-4 lg:h-5 w-5 text-destructive animate-pulse flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold text-destructive text-sm lg:text-base">
                    <span className="hidden sm:inline">EMERGENCY PROTOCOL ACTIVE - LEVEL {emergencyMode.level?.toUpperCase()}</span>
                    <span className="sm:hidden">EMERGENCY - {emergencyMode.level?.toUpperCase()}</span>
                  </span>
                  {emergencyMode.reason && (
                    <span className="ml-2 text-destructive/80 text-xs lg:text-sm block sm:inline">
                      Reason: {emergencyMode.reason}
                    </span>
                  )}
                </div>
              </div>
              
              {emergencyMode.activatedAt && (
                <div className="text-xs lg:text-sm text-destructive/80 flex-shrink-0">
                  Activated: {formatDistanceToNow(emergencyMode.activatedAt, { addSuffix: true })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default EnhancedHeader;