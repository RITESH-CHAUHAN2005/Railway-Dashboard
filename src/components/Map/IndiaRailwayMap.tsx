import React, { useState, useCallback, memo } from 'react';
import { MapPin, Maximize2, X, Train, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import indiaMapImage from '@/assets/india-railway-map.png';

// MapDisplay component moved outside to prevent re-creation
const MapDisplay = memo(({ className, onInteractiveMapOpen }: { 
  className?: string; 
  onInteractiveMapOpen: () => void;
}) => (
  <div className={`${className} relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 flex items-center justify-center overflow-hidden`}>
    <img 
      src={indiaMapImage}
      alt="India Railway Network Map"
      className="w-full h-full object-contain"
    />
    
    {/* Interactive overlay for Google Maps */}
    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
      <Button
        variant="secondary"
        className="bg-white/90 text-black hover:bg-white"
        onClick={onInteractiveMapOpen}
      >
        <Navigation className="h-4 w-4 mr-2" />
        Open Interactive Map
      </Button>
    </div>
  </div>
));

MapDisplay.displayName = 'MapDisplay';

const IndiaRailwayMap = memo(() => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const handleMapToggle = useCallback((value: boolean) => {
    setIsMapExpanded(value);
  }, []);

  const handleInteractiveMapOpen = useCallback(() => {
    window.open('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30765978.00238801!2d61.00083698256397!3d19.729113061269324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2z4KSt4KS-4KSw4KSk!5e0!3m2!1shi!2sin!4v1757183514192!5m2!1shi!2sin', '_blank');
  }, []);

  return (
    <div className="railway-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          India Railway Network
        </h3>
        
        <Dialog open={isMapExpanded} onOpenChange={handleMapToggle}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="responsive-btn">
              <Maximize2 className="h-4 w-4 mr-2" />
              Expand Map
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl w-full h-[80vh] p-0">
            <div className="relative w-full h-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMapToggle(false)}
                className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </Button>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30765978.00238801!2d61.00083698256397!3d19.729113061269324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2z4KSt4KS-4KSw4KSk!5e0!3m2!1shi!2sin!4v1757183514192!5m2!1shi!2sin"
                className="w-full h-full rounded-lg"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Interactive India Railway Network Map"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative w-full h-96 rounded-lg overflow-hidden border border-border">
        <MapDisplay className="w-full h-full" onInteractiveMapOpen={handleInteractiveMapOpen} />
        
        {/* Overlay with railway info */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Train className="h-4 w-4 text-primary" />
            Railway Network Overview
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Active Train Routes</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Major Railway Stations</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-6 h-0.5 bg-red-500"></div>
              <span>Primary Railway Lines</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-6 h-0.5 bg-orange-500"></div>
              <span>Secondary Routes</span>
            </div>
          </div>
        </div>
        
        {/* Map type indicator */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg border border-border shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">India Railway Network</span>
          </div>
        </div>
      </div>
      
      {/* Additional Railway Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="railway-card p-4 text-center">
          <div className="text-lg font-bold text-primary">68,000+</div>
          <div className="text-xs text-muted-foreground">Route Kilometers</div>
        </div>
        <div className="railway-card p-4 text-center">
          <div className="text-lg font-bold text-green-500">7,349</div>
          <div className="text-xs text-muted-foreground">Railway Stations</div>
        </div>
        <div className="railway-card p-4 text-center">
          <div className="text-lg font-bold text-blue-500">13,000+</div>
          <div className="text-xs text-muted-foreground">Daily Trains</div>
        </div>
        <div className="railway-card p-4 text-center">
          <div className="text-lg font-bold text-orange-500">23M+</div>
          <div className="text-xs text-muted-foreground">Daily Passengers</div>
        </div>
      </div>
    </div>
  );
});

IndiaRailwayMap.displayName = 'IndiaRailwayMap';

export default IndiaRailwayMap;