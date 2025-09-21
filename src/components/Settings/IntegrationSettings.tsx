import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Link, 
  Database, 
  Brain, 
  Cloud,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Zap,
  HardDrive,
  Shield
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IntegrationSettingsProps {
  onSettingChange: () => void;
}

const IntegrationSettings = ({ onSettingChange }: IntegrationSettingsProps) => {
  const [apiConnections, setApiConnections] = useState([
    { name: 'Indian Railways API', status: 'connected', url: 'https://api.indianrail.gov.in', key: 'IR_****_****' },
    { name: 'Weather API', status: 'connected', url: 'https://api.openweathermap.org', key: 'OW_****_****' },
    { name: 'Traffic Management', status: 'disconnected', url: 'https://api.traffic.rail.in', key: '' },
  ]);

  const [aiIntegration, setAiIntegration] = useState({
    enabled: true,
    provider: 'openai',
    model: 'gpt-4',
    apiKey: 'sk-****-****',
    status: 'active',
    features: {
      predictiveAnalytics: true,
      naturalLanguageQueries: true,
      anomalyDetection: true,
      reportGeneration: false
    }
  });

  const [databaseSettings, setDatabaseSettings] = useState({
    provider: 'supabase',
    status: 'connected',
    autoBackup: true,
    backupFrequency: 'daily',
    retention: '30',
    encryption: true
  });

  const [syncSettings, setSyncSettings] = useState({
    cloudSync: true,
    offlineMode: true,
    conflictResolution: 'server-priority',
    syncFrequency: 'realtime'
  });

  const handleApiConnectionToggle = (index: number) => {
    const newConnections = [...apiConnections];
    newConnections[index].status = newConnections[index].status === 'connected' ? 'disconnected' : 'connected';
    setApiConnections(newConnections);
    onSettingChange();
  };

  const handleAiFeatureToggle = (feature: string) => {
    setAiIntegration(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature as keyof typeof prev.features]
      }
    }));
    onSettingChange();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <CheckCircle className="h-4 w-4 text-status-ontime" />;
      case 'disconnected':
      case 'inactive':
        return <WifiOff className="h-4 w-4 text-status-delayed" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-status-warning" />;
      default:
        return <Wifi className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <Badge className="bg-status-ontime text-white">Connected</Badge>;
      case 'disconnected':
      case 'inactive':
        return <Badge className="bg-status-delayed text-white">Disconnected</Badge>;
      case 'warning':
        return <Badge className="bg-status-warning text-black">Warning</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* API Configurations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />
            External API Connections
          </CardTitle>
          <CardDescription>
            Configure connections to external railway systems and services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiConnections.map((api, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(api.status)}
                  <div>
                    <span className="font-medium">{api.name}</span>
                    <p className="text-xs text-muted-foreground">{api.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(api.status)}
                  <Switch
                    checked={api.status === 'connected'}
                    onCheckedChange={() => handleApiConnectionToggle(index)}
                  />
                </div>
              </div>
              {api.status === 'connected' && (
                <div className="ml-7 text-xs text-muted-foreground">
                  API Key: {api.key}
                </div>
              )}
            </div>
          ))}

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="API URL" />
            <Button variant="outline">
              <Link className="h-4 w-4 mr-1" />
              Add Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Integration
          </CardTitle>
          <CardDescription>
            Configure artificial intelligence features and ChatGPT integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <Label>AI Features Enabled</Label>
                <p className="text-xs text-muted-foreground">
                  Enable AI-powered analysis and recommendations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(aiIntegration.status)}
              <Switch
                checked={aiIntegration.enabled}
                onCheckedChange={(checked) => {
                  setAiIntegration(prev => ({ ...prev, enabled: checked }));
                  onSettingChange();
                }}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>AI Provider</Label>
              <Select
                value={aiIntegration.provider}
                onValueChange={(value) => {
                  setAiIntegration(prev => ({ ...prev, provider: value }));
                  onSettingChange();
                }}
                disabled={!aiIntegration.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI (ChatGPT)</SelectItem>
                  <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                  <SelectItem value="google">Google (Gemini)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>AI Model</Label>
              <Select
                value={aiIntegration.model}
                onValueChange={(value) => {
                  setAiIntegration(prev => ({ ...prev, model: value }));
                  onSettingChange();
                }}
                disabled={!aiIntegration.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3">Claude 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>AI Features</Label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(aiIntegration.features).map(([feature, enabled]) => (
                <div key={feature} className="flex items-center justify-between">
                  <Label className="text-sm capitalize">
                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Switch
                    checked={enabled}
                    onCheckedChange={() => handleAiFeatureToggle(feature)}
                    disabled={!aiIntegration.enabled}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Database Connection
          </CardTitle>
          <CardDescription>
            Configure database settings and connection status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(databaseSettings.status)}
              <div>
                <span className="font-medium">Supabase Database</span>
                <p className="text-xs text-muted-foreground">Primary data store</p>
              </div>
            </div>
            {getStatusBadge(databaseSettings.status)}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <Select
                value={databaseSettings.backupFrequency}
                onValueChange={(value) => {
                  setDatabaseSettings(prev => ({ ...prev, backupFrequency: value }));
                  onSettingChange();
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Retention Period (days)</Label>
              <Input
                value={databaseSettings.retention}
                onChange={(e) => {
                  setDatabaseSettings(prev => ({ ...prev, retention: e.target.value }));
                  onSettingChange();
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <Label>Auto Backup</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically backup data at scheduled intervals
                </p>
              </div>
            </div>
            <Switch
              checked={databaseSettings.autoBackup}
              onCheckedChange={(checked) => {
                setDatabaseSettings(prev => ({ ...prev, autoBackup: checked }));
                onSettingChange();
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <Label>Data Encryption</Label>
                <p className="text-xs text-muted-foreground">
                  Encrypt sensitive data at rest
                </p>
              </div>
            </div>
            <Switch
              checked={databaseSettings.encryption}
              onCheckedChange={(checked) => {
                setDatabaseSettings(prev => ({ ...prev, encryption: checked }));
                onSettingChange();
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sync & Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            Sync & Backup Preferences
          </CardTitle>
          <CardDescription>
            Configure cloud synchronization and offline capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <Label>Cloud Synchronization</Label>
                <p className="text-xs text-muted-foreground">
                  Sync data across multiple devices
                </p>
              </div>
            </div>
            <Switch
              checked={syncSettings.cloudSync}
              onCheckedChange={(checked) => {
                setSyncSettings(prev => ({ ...prev, cloudSync: checked }));
                onSettingChange();
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WifiOff className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <Label>Offline Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Continue working without internet connection
                </p>
              </div>
            </div>
            <Switch
              checked={syncSettings.offlineMode}
              onCheckedChange={(checked) => {
                setSyncSettings(prev => ({ ...prev, offlineMode: checked }));
                onSettingChange();
              }}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sync Frequency</Label>
              <Select
                value={syncSettings.syncFrequency}
                onValueChange={(value) => {
                  setSyncSettings(prev => ({ ...prev, syncFrequency: value }));
                  onSettingChange();
                }}
                disabled={!syncSettings.cloudSync}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="5min">Every 5 minutes</SelectItem>
                  <SelectItem value="15min">Every 15 minutes</SelectItem>
                  <SelectItem value="1hour">Every hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Conflict Resolution</Label>
              <Select
                value={syncSettings.conflictResolution}
                onValueChange={(value) => {
                  setSyncSettings(prev => ({ ...prev, conflictResolution: value }));
                  onSettingChange();
                }}
                disabled={!syncSettings.cloudSync}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="server-priority">Server Priority</SelectItem>
                  <SelectItem value="client-priority">Client Priority</SelectItem>
                  <SelectItem value="manual">Manual Resolution</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;