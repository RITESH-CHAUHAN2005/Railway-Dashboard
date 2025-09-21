import { Train, Clock, MapPin, Gauge, Navigation, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface TrainTrackingData {
  id: string;
  number: string;
  name: string;
  route: string;
  currentLocation: string;
  nextStation: string;
  nextETA: string;
  status: 'ontime' | 'delayed' | 'early' | 'approaching';
  delay: number;
  currentSpeed: number;
  journeyProgress: number;
  lastUpdated: string;
  departureTime: string;
  arrivalTime: string;
}

interface TrainTrackingCardProps {
  train: TrainTrackingData;
  onClick: (train: TrainTrackingData) => void;
}

const TrainTrackingCard = ({ train, onClick }: TrainTrackingCardProps) => {
  const getStatusBadge = () => {
    switch (train.status) {
      case 'ontime':
        return <Badge className="bg-status-ontime text-white">On Time</Badge>;
      case 'early':
        return <Badge className="bg-status-ontime text-white">{train.delay} min early</Badge>;
      case 'delayed':
        return <Badge className="bg-status-delayed text-white">{train.delay} min delayed</Badge>;
      case 'approaching':
        return <Badge className="bg-status-warning text-black">Approaching Station</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusColor = () => {
    switch (train.status) {
      case 'ontime':
      case 'early':
        return 'status-ontime';
      case 'delayed':
        return 'status-delayed';
      case 'approaching':
        return 'status-warning';
      default:
        return 'muted';
    }
  };

  const getSpeedColor = () => {
    if (train.currentSpeed > 100) return 'text-status-ontime';
    if (train.currentSpeed > 60) return 'text-status-warning';
    if (train.currentSpeed > 0) return 'text-status-delayed';
    return 'text-muted-foreground';
  };

  return (
    <div 
      className="railway-card p-6 cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 active:shadow-lg"
      onClick={() => onClick(train)}
    >
      {/* Header with Train Icon and Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-railway rounded-lg flex items-center justify-center shadow-lg">
              <Train className="h-6 w-6 text-white" />
            </div>
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor()}`}></div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{train.name}</h3>
            <p className="text-sm text-muted-foreground">{train.number}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Route Information */}
      <div className="mb-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Navigation className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{train.route}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-status-ontime" />
            <span className="text-foreground">Currently at: <strong>{train.currentLocation}</strong></span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Next: <strong>{train.nextStation}</strong> - ETA {train.nextETA}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">Journey Progress</span>
          <span className="text-xs font-medium text-foreground">{train.journeyProgress}%</span>
        </div>
        <Progress 
          value={train.journeyProgress} 
          className="h-2 bg-muted/50"
        />
      </div>

      {/* Speed and Timing Information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-background/50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Gauge className={`h-4 w-4 ${getSpeedColor()}`} />
            <span className="text-xs text-muted-foreground">Speed</span>
          </div>
          <div className={`text-lg font-bold ${getSpeedColor()}`}>
            {train.currentSpeed} km/h
          </div>
        </div>
        
        <div className="text-center p-3 bg-background/50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Departure</span>
          </div>
          <div className="text-sm font-medium text-foreground">
            {train.departureTime}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          Last updated: {train.lastUpdated}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-7 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/20 active:bg-primary/30 active:scale-95"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default TrainTrackingCard;