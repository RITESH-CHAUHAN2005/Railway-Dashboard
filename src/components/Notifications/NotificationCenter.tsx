import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { useRailway } from '@/contexts/RailwayContext';
import { formatDistanceToNow } from 'date-fns';

const getNotificationIcon = (type: 'info' | 'warning' | 'error' | 'success') => {
  switch (type) {
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-status-warning" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-status-delayed" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-status-ontime" />;
  }
};

const getPriorityBadge = (priority: 'low' | 'medium' | 'high' | 'critical') => {
  const variants = {
    low: 'secondary',
    medium: 'default',
    high: 'destructive',
    critical: 'destructive'
  } as const;

  const colors = {
    low: 'text-muted-foreground',
    medium: 'text-blue-500',
    high: 'text-orange-500',
    critical: 'text-red-500'
  };

  return (
    <Badge variant={variants[priority]} className={`text-xs ${colors[priority]}`}>
      {priority.toUpperCase()}
    </Badge>
  );
};

const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markNotificationRead, 
    clearAllNotifications 
  } = useRailway();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setIsOpen(false);
  };

                  // Limit notifications to 6 maximum
  const limitedNotifications = notifications.slice(0, 6);
  const criticalNotifications = limitedNotifications.filter(n => n.priority === 'critical');
  const otherNotifications = limitedNotifications.filter(n => n.priority !== 'critical');

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Railway Control Notifications</SheetTitle>
              <SheetDescription>
                {notifications.length === 0 
                  ? "No notifications" 
                  : `${notifications.length} total, ${unreadCount} unread`
                }
              </SheetDescription>
            </div>
            
            {notifications.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearAll}
                className="text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                All systems operating normally
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4">
                {/* Critical Notifications */}
                {criticalNotifications.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-destructive mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Critical Alerts
                    </h4>
                    <div className="space-y-2">
                      {criticalNotifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`railway-card p-4 cursor-pointer transition-all border-l-4 border-destructive ${
                            !notification.read ? 'bg-destructive/5' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h5 className="font-medium text-sm truncate">
                                  {notification.title}
                                </h5>
                                {getPriorityBadge(notification.priority)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                              </div>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-destructive rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Notifications */}
                {otherNotifications.length > 0 && (
                  <div>
                    {criticalNotifications.length > 0 && (
                      <h4 className="text-sm font-medium text-foreground mb-2 mt-6">
                        Other Notifications
                      </h4>
                    )}
                    <div className="space-y-2">
                      {otherNotifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`railway-card p-4 cursor-pointer transition-all ${
                            !notification.read ? 'bg-accent/5 border-l-4 border-accent' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h5 className="font-medium text-sm truncate">
                                  {notification.title}
                                </h5>
                                {getPriorityBadge(notification.priority)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                              </div>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
