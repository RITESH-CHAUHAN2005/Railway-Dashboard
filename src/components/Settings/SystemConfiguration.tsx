import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  Ruler,
  HelpCircle,
  Zap
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SystemConfigurationProps {
  onSettingChange: () => void;
}

const SystemConfiguration = ({ onSettingChange }: SystemConfigurationProps) => {
  const [aiSettings, setAiSettings] = useState({
    recommendationsEnabled: true,
    frequency: 'normal',
    confidenceThreshold: 80
  });

  const [alertSettings, setAlertSettings] = useState({
    minorDelayThreshold: 5,
    majorDelayThreshold: 15,
    criticalDelayThreshold: 30
  });

  const [dataSettings, setDataSettings] = useState({
    refreshRate: 'realtime',
    autoRefresh: true
  });

  const [displaySettings, setDisplaySettings] = useState({
    timeFormat: '24',
    distanceUnit: 'km',
    temperatureUnit: 'celsius'
  });

  const handleAiChange = (field: string, value: any) => {
    setAiSettings(prev => ({ ...prev, [field]: value }));
    onSettingChange();
  };

  const handleAlertChange = (field: string, value: number) => {
    setAlertSettings(prev => ({ ...prev, [field]: value }));
    onSettingChange();
  };

  const handleDataChange = (field: string, value: any) => {
    setDataSettings(prev => ({ ...prev, [field]: value }));
    onSettingChange();
  };

  const handleDisplayChange = (field: string, value: string) => {
    setDisplaySettings(prev => ({ ...prev, [field]: value }));
    onSettingChange();
  };

  return (
    <div className="space-y-6">
      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI & Recommendations
          </CardTitle>
          <CardDescription>
            Configure artificial intelligence features and recommendation system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <Label>AI Recommendations</Label>
                <p className="text-xs text-muted-foreground">
                  Enable intelligent system recommendations
                </p>
              </div>
            </div>
            <Switch
              checked={aiSettings.recommendationsEnabled}
              onCheckedChange={(checked) => handleAiChange('recommendationsEnabled', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label>Recommendation Frequency</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How often AI generates new recommendations</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={aiSettings.frequency}
              onValueChange={(value) => handleAiChange('frequency', value)}
              disabled={!aiSettings.recommendationsEnabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (Every 30 minutes)</SelectItem>
                <SelectItem value="normal">Normal (Every 15 minutes)</SelectItem>
                <SelectItem value="high">High (Every 5 minutes)</SelectItem>
                <SelectItem value="realtime">Real-time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>Confidence Threshold</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Minimum confidence level to show recommendations</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Badge variant="outline">{aiSettings.confidenceThreshold}%</Badge>
            </div>
            <Slider
              value={[aiSettings.confidenceThreshold]}
              onValueChange={(value) => handleAiChange('confidenceThreshold', value[0])}
              disabled={!aiSettings.recommendationsEnabled}
              max={100}
              min={50}
              step={5}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Alert Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Alert Thresholds
          </CardTitle>
          <CardDescription>
            Set delay limits for different alert levels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-status-warning rounded-full"></div>
                <Label>Minor Delay Alert</Label>
              </div>
              <Badge variant="outline">{alertSettings.minorDelayThreshold} minutes</Badge>
            </div>
            <Slider
              value={[alertSettings.minorDelayThreshold]}
              onValueChange={(value) => handleAlertChange('minorDelayThreshold', value[0])}
              max={30}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-status-delayed rounded-full"></div>
                <Label>Major Delay Alert</Label>
              </div>
              <Badge variant="outline">{alertSettings.majorDelayThreshold} minutes</Badge>
            </div>
            <Slider
              value={[alertSettings.majorDelayThreshold]}
              onValueChange={(value) => handleAlertChange('majorDelayThreshold', value[0])}
              max={60}
              min={5}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <Label>Critical Delay Alert</Label>
              </div>
              <Badge variant="outline">{alertSettings.criticalDelayThreshold} minutes</Badge>
            </div>
            <Slider
              value={[alertSettings.criticalDelayThreshold]}
              onValueChange={(value) => handleAlertChange('criticalDelayThreshold', value[0])}
              max={120}
              min={15}
              step={5}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Refresh Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Data Refresh Settings
          </CardTitle>
          <CardDescription>
            Configure how often system data is updated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <Label>Auto Refresh</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically update data in real-time
                </p>
              </div>
            </div>
            <Switch
              checked={dataSettings.autoRefresh}
              onCheckedChange={(checked) => handleDataChange('autoRefresh', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Refresh Rate</Label>
            <Select
              value={dataSettings.refreshRate}
              onValueChange={(value) => handleDataChange('refreshRate', value)}
              disabled={!dataSettings.autoRefresh}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select refresh rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time (Live)</SelectItem>
                <SelectItem value="30sec">30 seconds</SelectItem>
                <SelectItem value="1min">1 minute</SelectItem>
                <SelectItem value="5min">5 minutes</SelectItem>
                <SelectItem value="manual">Manual only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Display Preferences
          </CardTitle>
          <CardDescription>
            Configure time format, units, and display options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Time Format</Label>
              <Select
                value={displaySettings.timeFormat}
                onValueChange={(value) => handleDisplayChange('timeFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                  <SelectItem value="24">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Distance Unit</Label>
              <Select
                value={displaySettings.distanceUnit}
                onValueChange={(value) => handleDisplayChange('distanceUnit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Kilometers (km)</SelectItem>
                  <SelectItem value="miles">Miles (mi)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Temperature Unit</Label>
              <Select
                value={displaySettings.temperatureUnit}
                onValueChange={(value) => handleDisplayChange('temperatureUnit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">Celsius (°C)</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemConfiguration;