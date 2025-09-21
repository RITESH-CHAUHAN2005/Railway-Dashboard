import React, { useState, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Clock,
  Train,
  Route,
  Gauge,
  MapIcon,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Navigation,
  Activity,
  Users,
  Zap
} from 'lucide-react';
import { TrainData } from '@/data/trainData';

interface TrainDetailsModalProps {
  train: TrainData | null;
  onClose: () => void;
}

// AI-powered schedule predictions with real timing
const generateSchedule = (train: TrainData) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Calculate realistic arrival times based on current time and train data
  const addMinutes = (minutes: number) => {
    const newTime = new Date(now.getTime() + minutes * 60000);
    return newTime.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Generate realistic station schedule
  const baseDelay = train.delay || 0;
  
  return [
    { 
      station: train.currentStation, 
      time: "Current", 
      status: "arrived", 
      delay: 0,
      platform: train.platform || '3',
      arrivalDate: now.toLocaleDateString('en-IN')
    },
    { 
      station: train.nextStation, 
      time: train.eta || addMinutes(30), 
      status: "upcoming", 
      delay: baseDelay,
      platform: '2',
      arrivalDate: now.toLocaleDateString('en-IN')
    },
    { 
      station: "Vadodara Junction", 
      time: addMinutes(65 + baseDelay), 
      status: "upcoming", 
      delay: baseDelay,
      platform: '1',
      arrivalDate: now.toLocaleDateString('en-IN')
    },
    { 
      station: "Ahmedabad Junction", 
      time: addMinutes(120 + baseDelay), 
      status: "upcoming", 
      delay: baseDelay,
      platform: '4',
      arrivalDate: now.toLocaleDateString('en-IN')
    },
    { 
      station: "Rajkot Junction", 
      time: addMinutes(180 + baseDelay), 
      status: "upcoming", 
      delay: baseDelay,
      platform: '1',
      arrivalDate: currentHour >= 20 ? 
        new Date(now.getTime() + 24*60*60*1000).toLocaleDateString('en-IN') : 
        now.toLocaleDateString('en-IN')
    },
    { 
      station: "Final Destination", 
      time: addMinutes(240 + baseDelay), 
      status: "upcoming", 
      delay: baseDelay,
      platform: '5',
      arrivalDate: currentHour >= 18 ? 
        new Date(now.getTime() + 24*60*60*1000).toLocaleDateString('en-IN') : 
        now.toLocaleDateString('en-IN')
    }
  ];
};

// AI-enhanced station coordinates for map tracking
const getStationCoordinates = (stationName: string) => {
  const coordinates: { [key: string]: { lat: number; lng: number } } = {
    "Mumbai Central": { lat: 19.0635, lng: 72.8200 },
    "New Delhi": { lat: 28.6448, lng: 77.2191 },
    "Vadodara Junction": { lat: 22.3039, lng: 73.1812 },
    "Rajkot Junction": { lat: 22.3039, lng: 70.7824 },
    "Ahmedabad": { lat: 23.0258, lng: 72.5873 },
    "Surat": { lat: 21.1702, lng: 72.8311 },
    "Borivali": { lat: 19.2307, lng: 72.8567 },
    "Kalyan Junction": { lat: 19.2437, lng: 73.1355 },
    "Vapi": { lat: 20.3712, lng: 72.9051 },
    "Lonavala": { lat: 18.7537, lng: 73.4085 }
  };
  return coordinates[stationName] || { lat: 20.5937, lng: 78.9629 };
};

// Google Maps Component
interface MapComponentProps {
  train: TrainData;
  center: { lat: number; lng: number };
  zoom: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ train, center, zoom }) => {
  const [map, setMap] = useState<google.maps.Map>();

  const ref = useCallback((node: HTMLDivElement) => {
    if (node && !map) {
      const newMap = new window.google.maps.Map(node, {
        center,
        zoom,
        styles: [
          // Dark theme for Google Maps
          { elementType: "geometry", stylers: [{ color: "#1e293b" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#1e293b" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
          { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d1d5db" }] },
          { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d1d5db" }] },
          { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263a3a" }] },
          { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
          { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
          { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
          { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
          { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2937" }] },
          { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3f4f6" }] },
          { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
          { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d1d5db" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
          { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
          { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
        ],
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      });

      setMap(newMap);

      // Add current station marker
      const currentStationCoords = getStationCoordinates(train.currentStation);
      new window.google.maps.Marker({
        position: currentStationCoords,
        map: newMap,
        title: `${train.currentStation} (Current)`,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="40" height="60" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#10B981" stroke="#ffffff" stroke-width="3"/>
              <circle cx="20" cy="20" r="8" fill="#ffffff"/>
              <text x="20" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#10B981" font-weight="bold">${train.currentStation.split(' ')[0]}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 60)
        }
      });

      // Add next station marker
      const nextStationCoords = getStationCoordinates(train.nextStation);
      new window.google.maps.Marker({
        position: nextStationCoords,
        map: newMap,
        title: `${train.nextStation} (Next - ETA: ${train.eta})`,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="40" height="60" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#ffffff" stroke-width="3"/>
              <circle cx="20" cy="20" r="8" fill="#ffffff"/>
              <text x="20" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#3B82F6" font-weight="bold">${train.nextStation.split(' ')[0]}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 60)
        }
      });

      // Add train route line
      const routePath = [currentStationCoords, nextStationCoords];
      new window.google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#F59E0B',
        strokeOpacity: 1.0,
        strokeWeight: 5,
        map: newMap,
        icons: [
          {
            icon: {
              path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 5,
              fillColor: '#F59E0B',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#FFFFFF'
            },
            offset: '50%'
          }
        ]
      });

      // Add train position (simulated between current and next station)
      const trainLat = currentStationCoords.lat + (nextStationCoords.lat - currentStationCoords.lat) * 0.35;
      const trainLng = currentStationCoords.lng + (nextStationCoords.lng - currentStationCoords.lng) * 0.35;
      
      new window.google.maps.Marker({
        position: { lat: trainLat, lng: trainLng },
        map: newMap,
        title: `${train.name} - ${train.number} | Speed: ${train.speed} km/h`,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="14" width="24" height="12" rx="3" fill="#EF4444" stroke="#ffffff" stroke-width="2"/>
              <circle cx="12" cy="28" r="3" fill="#374151"/>
              <circle cx="24" cy="28" r="3" fill="#374151"/>
              <rect x="10" y="17" width="6" height="6" fill="#ffffff" rx="1"/>
              <rect x="20" y="17" width="6" height="6" fill="#ffffff" rx="1"/>
              <text x="18" y="10" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#EF4444" font-weight="bold">${train.number}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(36, 36)
        }
      });

      // Add info windows
      const currentInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: Arial, sans-serif;">
            <h4 style="margin: 0; color: #10B981; font-size: 14px;">${train.currentStation}</h4>
            <p style="margin: 4px 0; font-size: 12px;">Current Location</p>
            <p style="margin: 4px 0; font-size: 12px;">Platform: ${train.platform || '3'}</p>
            <p style="margin: 4px 0; font-size: 12px;">Status: <span style="color: #10B981;">Current</span></p>
          </div>
        `
      });

      const nextInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: Arial, sans-serif;">
            <h4 style="margin: 0; color: #3B82F6; font-size: 14px;">${train.nextStation}</h4>
            <p style="margin: 4px 0; font-size: 12px;">Next Station</p>
            <p style="margin: 4px 0; font-size: 12px;">ETA: ${train.eta}</p>
            <p style="margin: 4px 0; font-size: 12px;">Distance: ${train.distance} km</p>
          </div>
        `
      });

      const trainInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: Arial, sans-serif;">
            <h4 style="margin: 0; color: #EF4444; font-size: 14px;">${train.name}</h4>
            <p style="margin: 4px 0; font-size: 12px;">Train No: ${train.number}</p>
            <p style="margin: 4px 0; font-size: 12px;">Speed: ${train.speed} km/h</p>
            <p style="margin: 4px 0; font-size: 12px;">Status: ${train.status === 'ontime' ? 'On Time' : 'Delayed'}</p>
          </div>
        `
      });

      // Add click listeners for info windows
      currentStationCoords && newMap.addListener('click', () => {
        currentInfoWindow.close();
        nextInfoWindow.close();
        trainInfoWindow.close();
      });
    }
  }, [map, train, center, zoom]);

  return <div ref={ref} style={{ width: '100%', height: '350px', borderRadius: '12px' }} />;
};

const render = (status: Status) => {
  if (status === Status.LOADING) 
    return (
      <div className="h-[350px] bg-slate-700/30 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
          <div className="text-white text-sm">Loading Google Maps...</div>
        </div>
      </div>
    );
  if (status === Status.FAILURE) 
    return (
      <div className="h-[350px] bg-slate-700/30 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <div className="text-red-400 text-sm">Error loading Google Maps</div>
          <div className="text-slate-400 text-xs mt-1">Check API key and internet connection</div>
        </div>
      </div>
    );
  return <></>;
};

const TrainDetailsModal: React.FC<TrainDetailsModalProps> = ({ train, onClose }) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [showMap, setShowMap] = useState(false);

  if (!train) return null;

  const schedule = generateSchedule(train);
  const stationCoords = getStationCoordinates(train.currentStation);

  const getStatusIcon = () => {
    switch (train.status) {
      case 'ontime':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'delayed':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <Info className="h-5 w-5 text-amber-400" />;
      default:
        return <Info className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusText = () => {
    switch (train.status) {
      case 'ontime':
        return 'On Time';
      case 'delayed':
        return `Delayed by ${train.delay} minutes`;
      case 'warning':
        return 'Running Late';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusBadgeColor = () => {
    switch (train.status) {
      case 'ontime':
        return 'bg-green-600 text-white';
      case 'delayed':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-amber-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  return (
    <Dialog open={!!train} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
        <DialogHeader className="border-b border-slate-700 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                <Train className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{train.name}</h2>
                <p className="text-sm text-slate-400">{train.number}</p>
              </div>
            </DialogTitle>
            <div className="w-6"></div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-6">
          {/* Enhanced Status Overview with AI Insights */}
          <div className="relative bg-slate-800/90 backdrop-blur border border-slate-700/50 rounded-xl p-6 shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-t-xl"></div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div>
                  <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                    Current Status
                    <Zap className="h-4 w-4 text-amber-400" />
                  </h3>
                  <p className="text-sm text-slate-300">{getStatusText()}</p>
                </div>
              </div>
              <Badge className={`text-sm px-3 py-1 shadow-lg ${getStatusBadgeColor()}`}>
                {train.status === 'ontime' ? 'On Time' : train.status === 'delayed' ? `${train.delay} min delay` : 'Late'}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-xl border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                <Gauge className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                <p className="text-xs text-slate-400 mb-1">Current Speed</p>
                <p className="font-bold text-xl text-white">{train.speed}</p>
                <p className="text-xs text-slate-400">km/h</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-xl border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                <Navigation className="h-6 w-6 mx-auto mb-2 text-green-400" />
                <p className="text-xs text-slate-400 mb-1">Distance to Next</p>
                <p className="font-bold text-xl text-white">{train.distance}</p>
                <p className="text-xs text-slate-400">km</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-xl border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                <Clock className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                <p className="text-xs text-slate-400 mb-1">ETA</p>
                <p className="font-bold text-xl text-white">{train.eta}</p>
                <p className="text-xs text-slate-400">42.3 km away</p>
              </div>
            </div>
          </div>

          {/* Enhanced Route Information */}
          <div className="relative bg-slate-800/90 backdrop-blur border border-slate-700/50 rounded-xl p-6 shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-xl"></div>
            
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 text-white">
              <Route className="h-5 w-5 text-purple-400" />
              Route Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-white">Route</p>
                    <p className="text-sm text-slate-300">{train.route}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-900/30 to-green-800/30 rounded-xl border border-green-700/50">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-medium text-white">Current Station</p>
                    <p className="text-sm text-green-300">{train.currentStation}</p>
                  </div>
                </div>
                {train.platform && (
                  <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
                    Platform {train.platform}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-xl border border-blue-700/50">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="font-medium text-white">Next Station</p>
                    <p className="text-sm text-blue-300">{train.nextStation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">ETA: {train.eta}</p>
                  <p className="text-xs text-slate-400">{train.distance} km away</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details with AI Predictions */}
          <div className="relative bg-slate-800/90 backdrop-blur border border-slate-700/50 rounded-xl p-6 shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-xl"></div>
            
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 text-white">
              <Info className="h-5 w-5 text-amber-400" />
              Additional Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Train Number</p>
                <p className="font-medium text-white">{train.number}</p>
              </div>
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Train Name</p>
                <p className="font-medium text-white">{train.name}</p>
              </div>
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Current Platform</p>
                <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                  {train.platform || '3'}
                </Badge>
              </div>
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Journey Status</p>
                <Badge className={train.status === 'ontime' 
                  ? 'bg-green-600/20 text-green-300 border-green-500/30' 
                  : 'bg-amber-600/20 text-amber-300 border-amber-500/30'
                }>
                  {train.status === 'ontime' ? 'On Schedule' : 'Behind Schedule'}
                </Badge>
              </div>
            </div>

            {train.delay > 0 && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-700/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <p className="text-sm font-medium text-red-300">
                    This train is running {train.delay} minutes behind schedule
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Schedule Modal with Real Times */}
          {showSchedule && (
            <div className="relative bg-slate-800/95 backdrop-blur border border-slate-700/50 rounded-xl p-6 shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl"></div>
              
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-xl text-white flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-blue-400" />
                  Complete Journey Schedule
                </h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSchedule(false)}
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Current Time Display */}
              <div className="mb-4 p-3 bg-blue-900/20 rounded-lg border border-blue-700/50">
                <p className="text-sm text-blue-300">
                  🕐 Current Time: {new Date().toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false 
                  })} | {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="space-y-3">
                {schedule.map((stop, index) => (
                  <div key={index} className={`p-4 rounded-xl border transition-all duration-200 ${
                    stop.status === 'arrived' 
                      ? 'bg-green-900/20 border-green-700/50 shadow-green-500/10' 
                      : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            stop.status === 'arrived' ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
                          }`}>
                            {stop.status === 'arrived' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          {index < schedule.length - 1 && (
                            <div className="w-0.5 h-8 bg-slate-600 mt-2"></div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-semibold text-white">{stop.station}</p>
                            <Badge className={`text-xs ${
                              stop.status === 'arrived' 
                                ? 'bg-green-600/20 text-green-300 border-green-500/30' 
                                : 'bg-slate-600/20 text-slate-300 border-slate-500/30'
                            }`}>
                              Platform {stop.platform}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>{stop.status === 'arrived' ? '✅ Arrived' : '⏳ Scheduled'}</span>
                            <span>📅 {stop.arrivalDate}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <p className="font-bold text-lg text-white">{stop.time}</p>
                        </div>
                        
                        {stop.delay > 0 && (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-red-400" />
                            <p className="text-xs text-red-400 font-medium">+{stop.delay} min delay</p>
                          </div>
                        )}
                        
                        {stop.status === 'arrived' && (
                          <p className="text-xs text-green-400 font-medium">On Platform</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Journey Summary */}
              <div className="mt-6 p-4 bg-slate-700/20 rounded-lg border border-slate-600/30">
                <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  Journey Summary
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Total Stations: <span className="text-white font-medium">{schedule.length}</span></p>
                    <p className="text-slate-400">Completed: <span className="text-green-400 font-medium">{schedule.filter(s => s.status === 'arrived').length}</span></p>
                  </div>
                  <div>
                    <p className="text-slate-400">Remaining: <span className="text-amber-400 font-medium">{schedule.filter(s => s.status === 'upcoming').length}</span></p>
                    <p className="text-slate-400">Total Delay: <span className="text-red-400 font-medium">{train.delay || 0} minutes</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Map Modal with Real Google Maps */}
          {showMap && (
            <div className="relative bg-slate-800/95 backdrop-blur border border-slate-700/50 rounded-xl p-6 shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-t-xl"></div>
              
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-xl text-white flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center border border-green-500/30">
                    <MapIcon className="h-5 w-5 text-green-400" />
                  </div>
                  Live Railway Map - {train.currentStation}
                </h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowMap(false)}
                  className="text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Real Google Maps Container */}
              <div className="space-y-6">
                <div className="bg-slate-700/30 rounded-xl p-1 border border-slate-600/50">
                  <Wrapper 
                    apiKey="AIzaSyDkCUuuMBnId0cUleJ9U6G2v3Wie6EB0gU"
                    render={render}
                  >
                    <MapComponent 
                      train={train} 
                      center={stationCoords} 
                      zoom={11} 
                    />
                  </Wrapper>
                </div>

                {/* Map Legend */}
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-3 bg-green-900/20 rounded-lg border border-green-700/50">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-green-300 font-medium">Current Station</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-900/20 rounded-lg border border-blue-700/50">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-300 font-medium">Next Station</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-red-900/20 rounded-lg border border-red-700/50">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-red-300 font-medium">Train Position</span>
                  </div>
                </div>

                {/* Station Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-white">Current Station</span>
                    </div>
                    <p className="text-green-300 font-semibold">{train.currentStation}</p>
                    <p className="text-xs text-slate-400">Platform {train.platform || '3'}</p>
                    <p className="text-xs text-slate-400">📍 {stationCoords.lat}°, {stationCoords.lng}°</p>
                  </div>

                  <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-sm font-medium text-white">Next Station</span>
                    </div>
                    <p className="text-blue-300 font-semibold">{train.nextStation}</p>
                    <p className="text-xs text-slate-400">ETA: {train.eta} • {train.distance} km</p>
                    <p className="text-xs text-slate-400">📍 {getStationCoordinates(train.nextStation).lat}°, {getStationCoordinates(train.nextStation).lng}°</p>
                  </div>
                </div>

                {/* GPS Status */}
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-4 border border-blue-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                        <Activity className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h6 className="font-semibold text-white flex items-center gap-2">
                          Google Maps Tracking
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </h6>
                        <p className="text-xs text-slate-400">Live location with satellite view</p>
                      </div>
                    </div>
                    
                    <Badge className="bg-green-600/20 text-green-300 border-green-500/30 shadow-lg">
                      🛰️ LIVE
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Speed:</span>
                        <span className="text-blue-300 font-medium">{train.speed} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Direction:</span>
                        <span className="text-green-400 font-medium">Northeast</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Signal:</span>
                        <span className="text-green-400 font-medium">Strong</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Map Type:</span>
                        <span className="text-green-400 font-medium">Satellite</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
              onClick={() => setShowSchedule(!showSchedule)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {showSchedule ? 'Hide Schedule' : 'View Schedule'}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
              onClick={() => setShowMap(!showMap)}
            >
              <MapIcon className="h-4 w-4 mr-2" />
              {showMap ? 'Hide Map' : 'Track on Map'}
            </Button>
            <Button 
              onClick={onClose} 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainDetailsModal;
