import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useRailway } from '@/contexts/RailwayContext';
import { useToast } from '@/hooks/use-toast';
import EnhancedHeader from '@/components/Dashboard/EnhancedHeader';
import Breadcrumb from '@/components/Navigation/Breadcrumb';
import QuickActions from '@/components/Navigation/QuickActions';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { isConnected, emergencyMode, addNotification } = useRailway();
  const { toast } = useToast();

  // Connection status monitoring
  useEffect(() => {
    if (!isConnected) {
      toast({
        title: "Connection Lost",
        description: "Attempting to reconnect to railway systems...",
        variant: "destructive"
      });
    }
  }, [isConnected, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      if ((e.target as HTMLElement).tagName === 'INPUT' || 
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'r':
            e.preventDefault();
            // Refresh data
            window.location.reload();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [addNotification]);

  return (
    <div className="min-h-screen bg-background">
      {/* Connection Status */}
      {!isConnected && (
        <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground p-2 text-center font-medium z-50">
          <WifiOff className="inline h-4 w-4 mr-2" />
          CONNECTION LOST - Attempting to reconnect...
        </div>
      )}

      {/* Enhanced Header */}
      <EnhancedHeader />
      
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-6 py-3">
          <Breadcrumb />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;