import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Train, 
  Zap, 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut,
  Search,
  Filter,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  railwayRoutes, 
  liveTrains, 
  majorStations,
  type LiveTrain,
  type RailwayRoute,
  type Station 
} from '@/data/railwayRoutes';
import MapLegend from './MapLegend';
import TrainPopup from './TrainPopup';
import NetworkStatus from './NetworkStatus';

const InteractiveRailwayMap = () => {
  const { toast } = useToast();
  const [selectedTrain, setSelectedTrain] = useState<LiveTrain | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    express: true,
    local: true,
    freight: true,
    ontime: true,
    delayed: true,
    approaching: true
  });
  const [zoomLevel, setZoomLevel] = useState(5);
  const [mapCenter, setMapCenter] = useState<[number, number]>([77.1025, 28.7041]); // New Delhi Railway Station
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);

  // Simulate real-time updates
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      // In a real app, this would fetch updated train positions from API
      console.log('Refreshing train positions...');
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const filteredTrains = liveTrains.filter(train => {
    const matchesSearch = train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         train.number.includes(searchTerm) ||
                         train.currentStation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTypeFilter = filters[train.type];
    const matchesStatusFilter = filters[train.status];
    
    return matchesSearch && matchesTypeFilter && matchesStatusFilter;
  });

  const handleTrainClick = (train: LiveTrain) => {
    setSelectedTrain(train);
    setSelectedRoute(train.routeId);
    // Center map on train position
    setMapCenter(train.currentPosition);
  };

  const handleStationClick = (station: Station) => {
    setMapCenter(station.coordinates);
    setZoomLevel(8);
  };

  const handleRouteHighlight = (routeId: string) => {
    setSelectedRoute(selectedRoute === routeId ? null : routeId);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 10));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 3));
  };

  const handleCenterMap = () => {
    setMapCenter([77.1025, 28.7041]); // New Delhi Railway Station coordinates
    setZoomLevel(8);
  };

  const toggleFilter = (filterKey: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const getTrainIcon = (train: LiveTrain) => {
    switch (train.type) {
      case 'express':
        return <Train className="h-4 w-4" />;
      case 'local':
        return <Train className="h-3 w-3" />;
      case 'freight':
        return <Train className="h-4 w-4" />;
      default:
        return <Train className="h-4 w-4" />;
    }
  };

  const getTrainStatusColor = (status: string) => {
    switch (status) {
      case 'ontime':
        return 'bg-status-ontime';
      case 'delayed':
        return 'bg-status-delayed';
      case 'approaching':
        return 'bg-status-warning';
      default:
        return 'bg-muted';
    }
  };

  const calculateTrainPosition = (train: LiveTrain) => {
    // In a real implementation, this would calculate exact position based on route progress
    const route = railwayRoutes.find(r => r.id === train.routeId);
    if (!route) return train.currentPosition;
    
    // Simple interpolation based on progress
    const coords = route.coordinates;
    const progress = train.progress / 100;
    const segmentIndex = Math.floor(progress * (coords.length - 1));
    
    if (segmentIndex >= coords.length - 1) return coords[coords.length - 1];
    
    const segmentProgress = (progress * (coords.length - 1)) - segmentIndex;
    const start = coords[segmentIndex];
    const end = coords[segmentIndex + 1];
    
    return [
      start[0] + (end[0] - start[0]) * segmentProgress,
      start[1] + (end[1] - start[1]) * segmentProgress
    ] as [number, number];
  };

  return (
    <div className="railway-card p-4 h-full">
      {/* Map Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Live Railway Network Map</h3>
          <Badge variant="secondary" className="text-xs">
            {filteredTrains.length} trains active
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isAutoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setIsAutoRefresh(!isAutoRefresh);
              toast({
                title: `Auto Refresh ${!isAutoRefresh ? 'Enabled' : 'Disabled'}`,
                description: !isAutoRefresh ? 'Map will refresh every 30 seconds' : 'Auto refresh turned off',
              });
            }}
            className="hover:scale-105 transition-all duration-200"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isAutoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleCenterMap} className="hover:bg-accent/10 transition-colors">
            <Navigation className="h-4 w-4 mr-1" />
            Center
          </Button>
        </div>
      </div>

      <div className="flex gap-4 h-full">
        {/* Main Map Area */}
        <div className="flex-1 relative">
          <div 
            ref={mapRef}
            className="relative bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg border border-border overflow-hidden"
            style={{ 
              height: '500px',
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          >
            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <Button variant="outline" size="sm" onClick={handleZoomIn} className="hover:scale-110 transition-transform duration-200">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomOut} className="hover:scale-110 transition-transform duration-200">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Railway Routes */}
            {railwayRoutes.map((route) => {
              const isHighlighted = selectedRoute === route.id;
              return (
                <div key={route.id} className="absolute inset-0">
                  {/* Route Line Visualization */}
                  <div 
                    className={`absolute pointer-events-none ${
                      isHighlighted ? 'opacity-100' : 'opacity-60'
                    }`}
                    style={{
                      background: `linear-gradient(45deg, ${route.color} 0%, ${route.color}80 100%)`,
                      height: isHighlighted ? '4px' : '2px',
                      transform: 'rotate(45deg)',
                      transformOrigin: 'center',
                      top: '20%',
                      left: '10%',
                      width: '80%'
                    }}
                  />
                </div>
              );
            })}

            {/* Major Stations */}
            {majorStations.map((station) => (
              <div
                key={station.id}
                className="absolute cursor-pointer group"
                style={{
                  left: `${((station.coordinates[0] - 68) / 30) * 100}%`,
                  top: `${((28 - station.coordinates[1]) / 16) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleStationClick(station)}
              >
                <div className="w-3 h-3 bg-primary rounded-full border-2 border-background shadow-lg group-hover:scale-125 transition-transform" />
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/90 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {station.name}
                </div>
              </div>
            ))}

            {/* Live Trains */}
            {filteredTrains.map((train) => {
              const position = calculateTrainPosition(train);
              return (
                <div
                  key={train.id}
                  className="absolute cursor-pointer group animate-pulse"
                  style={{
                    left: `${((position[0] - 68) / 30) * 100}%`,
                    top: `${((28 - position[1]) / 16) * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleTrainClick(train)}
                >
                  <div 
                    className={`w-4 h-4 rounded-full border-2 border-background shadow-lg flex items-center justify-center text-white group-hover:scale-125 transition-transform ${getTrainStatusColor(train.status)}`}
                  >
                    {getTrainIcon(train)}
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background/90 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {train.number}
                  </div>
                </div>
              );
            })}

            {/* Selected Train Route Highlight */}
            {selectedTrain && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full border-2 border-primary/50 rounded animate-pulse" />
              </div>
            )}
          </div>

          {/* Network Status */}
          <NetworkStatus />
        </div>

        {/* Control Panel */}
        <div className="w-80 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trains or stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="railway-card p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Train Filters
            </h4>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Type</p>
                <div className="flex flex-wrap gap-2">
                  {['express', 'local', 'freight'].map((type) => (
                    <Button
                      key={type}
                      variant={filters[type as keyof typeof filters] ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleFilter(type as keyof typeof filters)}
                      className="capitalize"
                    >
                      {filters[type as keyof typeof filters] ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {['ontime', 'delayed', 'approaching'].map((status) => (
                    <Button
                      key={status}
                      variant={filters[status as keyof typeof filters] ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleFilter(status as keyof typeof filters)}
                      className="capitalize"
                    >
                      {filters[status as keyof typeof filters] ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                      {status === 'ontime' ? 'On Time' : status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Route Selector */}
          <div className="railway-card p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Railway Routes
            </h4>
            <div className="space-y-2">
              {railwayRoutes.map((route) => (
                <Button
                  key={route.id}
                  variant={selectedRoute === route.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRouteHighlight(route.id)}
                  className="w-full justify-start"
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: route.color }}
                  />
                  {route.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Map Legend */}
          <MapLegend />

          {/* Selected Train Details */}
          {selectedTrain && (
            <TrainPopup 
              train={selectedTrain} 
              onClose={() => setSelectedTrain(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveRailwayMap;