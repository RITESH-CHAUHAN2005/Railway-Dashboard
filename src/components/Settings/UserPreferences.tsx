import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  Clock, 
  Bell, 
  Mail, 
  Smartphone, 
  Monitor, 
  Palette,
  HelpCircle
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserPreferencesProps {
  onSettingChange: () => void;
}

const UserPreferences = ({ onSettingChange }: UserPreferencesProps) => {
  const [profile, setProfile] = useState({
    controllerName: 'Rajesh Kumar',
    stationAssignment: 'New Delhi Junction',
    shiftTiming: 'morning'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true
  });

  const [dashboard, setDashboard] = useState({
    refreshInterval: '30',
    widgetArrangement: 'compact'
  });

  const [theme, setTheme] = useState({
    mode: 'dark'
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    onSettingChange();
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
    onSettingChange();
  };

  const handleDashboardChange = (field: string, value: string) => {
    setDashboard(prev => ({ ...prev, [field]: value }));
    onSettingChange();
  };

  const handleThemeChange = (field: string, value: string) => {
    setTheme(prev => ({ ...prev, [field]: value }));
    onSettingChange();
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Configure your controller profile and station assignment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="controller-name">Controller Name</Label>
              <Input
                id="controller-name"
                value={profile.controllerName}
                onChange={(e) => handleProfileChange('controllerName', e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="station-assignment">Station Assignment</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your primary station for monitoring and control</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={profile.stationAssignment}
                onValueChange={(value) => handleProfileChange('stationAssignment', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Delhi Junction">New Delhi Junction</SelectItem>
                  <SelectItem value="Mumbai Central">Mumbai Central</SelectItem>
                  <SelectItem value="Chennai Central">Chennai Central</SelectItem>
                  <SelectItem value="Kolkata">Kolkata</SelectItem>
                  <SelectItem value="Bangalore City">Bangalore City</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="shift-timing">Shift Timing</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your designated work shift for proper handover management</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={profile.shiftTiming}
              onValueChange={(value) => handleProfileChange('shiftTiming', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning Shift (06:00 - 14:00)</SelectItem>
                <SelectItem value="afternoon">Afternoon Shift (14:00 - 22:00)</SelectItem>
                <SelectItem value="night">Night Shift (22:00 - 06:00)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure how you receive alerts and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <Label>Email Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Receive critical alerts via email
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.emailAlerts}
              onCheckedChange={(checked) => handleNotificationChange('emailAlerts', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <Label>SMS Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Receive urgent alerts via SMS
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.smsAlerts}
              onCheckedChange={(checked) => handleNotificationChange('smsAlerts', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <Label>Push Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Desktop notifications for real-time alerts
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            Dashboard Customization
          </CardTitle>
          <CardDescription>
            Customize your dashboard layout and refresh preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Widget Arrangement</Label>
              <Select
                value={dashboard.widgetArrangement}
                onValueChange={(value) => handleDashboardChange('widgetArrangement', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact View</SelectItem>
                  <SelectItem value="detailed">Detailed View</SelectItem>
                  <SelectItem value="grid">Grid Layout</SelectItem>
                  <SelectItem value="list">List Layout</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Refresh Interval</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>How often the dashboard updates with new data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={dashboard.refreshInterval}
                onValueChange={(value) => handleDashboardChange('refreshInterval', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Real-time (10 seconds)</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Theme Options
          </CardTitle>
          <CardDescription>
            Choose your preferred visual theme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Display Mode</Label>
              <p className="text-xs text-muted-foreground">
                Choose between light and dark theme
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={theme.mode === 'light' ? 'default' : 'outline'}>Light</Badge>
              <Switch
                checked={theme.mode === 'dark'}
                onCheckedChange={(checked) => handleThemeChange('mode', checked ? 'dark' : 'light')}
              />
              <Badge variant={theme.mode === 'dark' ? 'default' : 'outline'}>Dark</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferences;