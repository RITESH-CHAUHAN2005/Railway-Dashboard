import React, { useState, useCallback, memo } from 'react';
import { MapPin, Maximize2, X, Train, Navigation, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

// Enhanced Map Display with better integration
const EnhancedMapDisplay = memo(({ 
  className, 
  isExpanded = false,
  onToggleExpanded 
}: { 
  className?: string; 
  isExpanded?: boolean;
  onToggleExpanded: () => void;
}) => (
  <div className={`${className} relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 overflow-hidden rounded-lg border border-border`}>
    {/* Interactive Google Maps Iframe */}
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30765978.00238801!2d61.00083698256397!3d19.729113061269324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2z4KSt4KS-4KSw4KSk!5e0!3m2!1shi!2sin!4v1757183514192!5m2!1shi!2sin"
      className="w-full h-full"
      style={{ border: 0, minHeight: isExpanded ? '80vh' : '400px' }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="India Railway Network Map"
    />
    
    {/* Map Controls Overlay */}
    <div className="absolute top-4 right-4 z-10">
      <Button
        variant="secondary"
        size="sm"
        onClick={onToggleExpanded}
        className="bg-background/90 backdrop-blur-sm shadow-lg hover:scale-105 transition-all duration-200"
      >
        {isExpanded ? (
          <>
            <Minimize2 className="h-4 w-4 mr-2" />
            Minimize
          </>
        ) : (
          <>
            <Maximize2 className="h-4 w-4 mr-2" />
            Expand
          </>
        )}
      </Button>
    </div>

    {/* Railway Network Legend */}
    <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg max-w-xs">
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Train className="h-4 w-4 text-primary" />
        Railway Network
      </h4>
      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span>Active Routes</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Major Stations</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-6 h-0.5 bg-red-500"></div>
          <span>Primary Lines</span>
        </div>
      </div>
    </div>

    {/* Status Indicator */}
    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg border border-border shadow-lg">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-medium">Live Tracking</span>
      </div>
    </div>
  </div>
));

EnhancedMapDisplay.displayName = 'EnhancedMapDisplay';

const EnhancedRailwayMap = memo(() => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const handleMapToggle = useCallback(() => {
    setIsMapExpanded(prev => !prev);
  }, []);

  return (
    <div className="railway-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          India Railway Network
        </h3>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Real-time
          </div>
        </div>
      </div>
      
      {/* Enhanced Map Container */}
      {isMapExpanded ? (
        <Dialog open={isMapExpanded} onOpenChange={setIsMapExpanded}>
          <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
            <div className="relative w-full h-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMapExpanded(false)}
                className="absolute top-2 right-2 z-20 bg-background/80 backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </Button>
              <EnhancedMapDisplay 
                className="w-full h-full" 
                isExpanded={true}
                onToggleExpanded={handleMapToggle}
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="relative w-full h-96">
          <EnhancedMapDisplay 
            className="w-full h-full" 
            isExpanded={false}
            onToggleExpanded={handleMapToggle}
          />
        </div>
      )}
      
      {/* Railway Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="railway-card p-4 text-center hover:shadow-lg transition-shadow">
          <div className="text-lg font-bold text-primary">68,155</div>
          <div className="text-xs text-muted-foreground">Route KM</div>
        </div>
        <div className="railway-card p-4 text-center hover:shadow-lg transition-shadow">
          <div className="text-lg font-bold text-green-500">7,349</div>
          <div className="text-xs text-muted-foreground">Stations</div>
        </div>
        <div className="railway-card p-4 text-center hover:shadow-lg transition-shadow">
          <div className="text-lg font-bold text-blue-500">13,169</div>
          <div className="text-xs text-muted-foreground">Daily Trains</div>
        </div>
        <div className="railway-card p-4 text-center hover:shadow-lg transition-shadow">
          <div className="text-lg font-bold text-orange-500">23M+</div>
          <div className="text-xs text-muted-foreground">Daily Passengers</div>
        </div>
      </div>
    </div>
  );
});

EnhancedRailwayMap.displayName = 'EnhancedRailwayMap';

export default EnhancedRailwayMap;