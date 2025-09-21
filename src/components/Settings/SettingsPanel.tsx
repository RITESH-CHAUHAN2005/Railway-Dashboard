import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Settings, User, Cog, Train, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserPreferences from './UserPreferences';
import SystemConfiguration from './SystemConfiguration';
import RailwayOperations from './RailwayOperations';
import IntegrationSettings from './IntegrationSettings';

const SettingsPanel = () => {
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSaveSettings = () => {
    // In a real app, this would save to backend/database
    toast({
      title: "Settings Saved",
      description: "All configurations have been saved successfully.",
    });
    setHasUnsavedChanges(false);
  };

  const handleResetSettings = () => {
    // In a real app, this would reset to defaults
    toast({
      title: "Settings Reset",
      description: "All configurations have been reset to default values.",
      variant: "destructive"
    });
    setHasUnsavedChanges(false);
  };

  const markAsChanged = () => {
    setHasUnsavedChanges(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Railway Control Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure system preferences, operations, and integrations
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="text-xs text-status-warning flex items-center gap-1">
              <div className="w-2 h-2 bg-status-warning rounded-full animate-pulse" />
              Unsaved changes
            </span>
          )}
          
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All
          </Button>
          
          <Button 
            onClick={handleSaveSettings}
            className={hasUnsavedChanges ? 'bg-status-warning hover:bg-status-warning/80' : ''}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Settings Tabs */}
      <div className="railway-card">
        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              User Preferences
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Cog className="h-4 w-4" />
              System Config
            </TabsTrigger>
            <TabsTrigger value="operations" className="flex items-center gap-2">
              <Train className="h-4 w-4" />
              Railway Operations
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="space-y-6">
            <UserPreferences onSettingChange={markAsChanged} />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <SystemConfiguration onSettingChange={markAsChanged} />
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <RailwayOperations onSettingChange={markAsChanged} />
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <IntegrationSettings onSettingChange={markAsChanged} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPanel;