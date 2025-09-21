import React from 'react';
import { X, Train, Clock, MapPin, Gauge, Navigation, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LiveTrain } from '@/data/railwayRoutes';

interface TrainPopupProps {
  train: LiveTrain;
  onClose: () => void;
}

const TrainPopup = ({ train, onClose }: TrainPopupProps) => {
  const getStatusBadge = () => {
    switch (train.status) {
      case 'ontime':
        return <Badge className="bg-status-ontime text-white">On Time</Badge>;
      case 'delayed':
        return <Badge className="bg-status-delayed text-white">{train.delay} min delayed</Badge>;
      case 'approaching':
        return <Badge className="bg-status-warning text-black">Approaching Station</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getSpeedColor = () => {
    if (train.speed > 100) return 'text-status-ontime';
    if (train.speed > 60) return 'text-status-warning';
    if (train.speed > 0) return 'text-status-delayed';
    return 'text-muted-foreground';
  };

  return (
    <div className="railway-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-railway rounded-lg flex items-center justify-center">
            <Train className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{train.number}</h4>
            <p className="text-xs text-muted-foreground">{train.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current Position */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-status-ontime" />
          <span className="text-foreground">Currently at: <strong>{train.currentStation}</strong></span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Next: <strong>{train.nextStation}</strong> - ETA {train.eta}</span>
        </div>
      </div>

      {/* Journey Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">Journey Progress</span>
          <span className="text-xs font-medium text-foreground">{train.progress}%</span>
        </div>
        <Progress 
          value={train.progress} 
          className="h-2 bg-muted/50"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-3 bg-background/50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Gauge className={`h-4 w-4 ${getSpeedColor()}`} />
            <span className="text-xs text-muted-foreground">Speed</span>
          </div>
          <div className={`text-sm font-bold ${getSpeedColor()}`}>
            {train.speed} km/h
          </div>
        </div>
        
        <div className="text-center p-3 bg-background/50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Navigation className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Direction</span>
          </div>
          <div className="text-sm font-medium text-foreground capitalize">
            {train.direction}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-2 bg-muted/20 rounded">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Departure</span>
          </div>
          <div className="text-xs font-medium text-foreground">
            {train.departureTime}
          </div>
        </div>
        
        <div className="text-center p-2 bg-muted/20 rounded">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Arrival</span>
          </div>
          <div className="text-xs font-medium text-foreground">
            {train.arrivalTime}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button variant="outline" className="w-full mt-4" size="sm">
        <Train className="h-4 w-4 mr-2" />
        Track This Train
      </Button>
    </div>
  );
};

export default TrainPopup;