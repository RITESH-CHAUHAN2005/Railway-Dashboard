import { Clock, MapPin, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TrainData {
  id: string;
  number: string;
  name: string;
  currentStation: string;
  nextStation: string;
  status: 'ontime' | 'delayed' | 'warning';
  delay: number;
  eta: string;
  speed: number;
  distance: number;
}

interface TrainStatusCardProps {
  train: TrainData;
  onClick: (train: TrainData) => void;
}

const TrainStatusCard = ({ train, onClick }: TrainStatusCardProps) => {
  const getStatusIcon = () => {
    switch (train.status) {
      case 'ontime':
        return <CheckCircle className="h-4 w-4 text-status-ontime" />;
      case 'delayed':
        return <AlertCircle className="h-4 w-4 text-status-delayed" />;
      case 'warning':
        return <Info className="h-4 w-4 text-status-warning" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (train.status) {
      case 'ontime':
        return 'On Time';
      case 'delayed':
        return `Delayed ${train.delay}min`;
      case 'warning':
        return 'Running Late';
      default:
        return 'Unknown';
    }
  };

  const getStatusBadgeVariant = () => {
    switch (train.status) {
      case 'ontime':
        return 'default';
      case 'delayed':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div 
      className="railway-card p-4 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 active:shadow-sm"
      onClick={() => onClick(train)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`status-indicator ${train.status === 'ontime' ? 'status-ontime' : train.status === 'delayed' ? 'status-delayed' : 'status-warning'}`}></div>
          <div>
            <h3 className="font-semibold text-sm">{train.name}</h3>
            <p className="text-xs text-muted-foreground">{train.number}</p>
          </div>
        </div>
        <Badge variant={getStatusBadgeVariant()} className="text-xs">
          {getStatusText()}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{train.currentStation}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          </div>
          <span>Next: {train.nextStation}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>ETA: {train.eta}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Speed: </span>
            <span className="font-medium">{train.speed} km/h</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/20 active:bg-primary/30"
        >
          Details
        </Button>
      </div>
    </div>
  );
};

export default TrainStatusCard;