import { useState, useEffect } from 'react';
import { RefreshCw, Filter, Search, Clock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import TrainTrackingCard from './TrainTrackingCard';
import TrainDetailsModal from '../TrainDetails/TrainDetailsModal';
import { type TrainData } from '@/data/trainData';

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

const initialTrains: TrainTrackingData[] = [
  {
    id: '1',
    number: '12951',
    name: 'Mumbai Rajdhani',
    route: 'Delhi to Mumbai',
    currentLocation: 'New Delhi Junction',
    nextStation: 'Gwalior Junction',
    nextETA: '14:30',
    status: 'delayed',
    delay: 15,
    currentSpeed: 85,
    journeyProgress: 25,
    lastUpdated: '2 min ago',
    departureTime: '16:55',
    arrivalTime: '08:35+1'
  },
  {
    id: '2',
    number: '12002',
    name: 'Shatabdi Express',
    route: 'Delhi to Bhopal',
    currentLocation: 'Gwalior Junction',
    nextStation: 'Jhansi Junction',
    nextETA: '15:45',
    status: 'ontime',
    delay: 0,
    currentSpeed: 130,
    journeyProgress: 45,
    lastUpdated: '1 min ago',
    departureTime: '06:00',
    arrivalTime: '14:05'
  },
  {
    id: '3',
    number: '22691',
    name: 'Rajdhani Express',
    route: 'Delhi to Bangalore',
    currentLocation: 'Bhopal Junction',
    nextStation: 'Itarsi Junction',
    nextETA: '16:20',
    status: 'early',
    delay: 5,
    currentSpeed: 110,
    journeyProgress: 35,
    lastUpdated: '3 min ago',
    departureTime: '20:05',
    arrivalTime: '11:30+1'
  },
  {
    id: '4',
    number: '12615',
    name: 'Grand Trunk Express',
    route: 'Delhi to Chennai',
    currentLocation: 'Agra Cantonment',
    nextStation: 'Gwalior Junction',
    nextETA: '17:15',
    status: 'delayed',
    delay: 45,
    currentSpeed: 65,
    journeyProgress: 15,
    lastUpdated: '4 min ago',
    departureTime: '07:15',
    arrivalTime: '22:45+1'
  },
  {
    id: '5',
    number: '12009',
    name: 'Shatabdi Express',
    route: 'Delhi to Lucknow',
    currentLocation: 'Ghaziabad Junction',
    nextStation: 'Aligarh Junction',
    nextETA: '14:55',
    status: 'ontime',
    delay: 0,
    currentSpeed: 125,
    journeyProgress: 20,
    lastUpdated: '1 min ago',
    departureTime: '06:15',
    arrivalTime: '13:25'
  },
  {
    id: '6',
    number: '12019',
    name: 'Shatabdi Express',
    route: 'Delhi to Dehradun',
    currentLocation: 'Saharanpur Junction',
    nextStation: 'Roorkee',
    nextETA: '15:30',
    status: 'approaching',
    delay: 0,
    currentSpeed: 45,
    journeyProgress: 75,
    lastUpdated: '30 sec ago',
    departureTime: '06:50',
    arrivalTime: '12:15'
  }
];

const TrainTrackingDashboard = () => {
  const [trains, setTrains] = useState<TrainTrackingData[]>(initialTrains);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ontime' | 'delayed' | 'early'>('all');
  const [lastGlobalUpdate, setLastGlobalUpdate] = useState(new Date());
  const [selectedTrain, setSelectedTrain] = useState<TrainData | null>(null);
  const [showTrainDetails, setShowTrainDetails] = useState(false);

  // Real-time simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(prevTrains => 
        prevTrains.map(train => {
          const shouldUpdate = Math.random() > 0.7; // 30% chance of update
          if (!shouldUpdate) return train;

          // Simulate status changes
          const statuses: ('ontime' | 'delayed' | 'early' | 'approaching')[] = ['ontime', 'delayed', 'early', 'approaching'];
          const newStatus = Math.random() > 0.8 ? statuses[Math.floor(Math.random() * statuses.length)] : train.status;
          
          // Simulate speed changes
          const speedVariation = (Math.random() - 0.5) * 20;
          const newSpeed = Math.max(0, Math.min(160, train.currentSpeed + speedVariation));
          
          // Simulate progress
          const progressIncrease = Math.random() * 2;
          const newProgress = Math.min(100, train.journeyProgress + progressIncrease);
          
          // Simulate delay changes
          let newDelay = train.delay;
          if (newStatus === 'delayed') {
            newDelay = Math.max(1, train.delay + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5));
          } else if (newStatus === 'early') {
            newDelay = Math.max(1, Math.floor(Math.random() * 10));
          } else if (newStatus === 'ontime') {
            newDelay = 0;
          }

          return {
            ...train,
            status: newStatus,
            delay: newDelay,
            currentSpeed: Math.round(newSpeed),
            journeyProgress: Math.round(newProgress),
            lastUpdated: 'Just now'
          };
        })
      );
      setLastGlobalUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Update "time ago" labels
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(prevTrains =>
        prevTrains.map(train => {
          if (train.lastUpdated === 'Just now') {
            return { ...train, lastUpdated: '1 min ago' };
          }
          return train;
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const filteredTrains = trains.filter(train => {
    const matchesSearch = train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         train.number.includes(searchTerm) ||
                         train.currentLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || train.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleTrainClick = (train: TrainTrackingData) => {
    // Convert TrainTrackingData to TrainData format for modal
    const convertedTrain: TrainData = {
      id: train.id,
      number: train.number,
      name: train.name,
      route: train.route,
      currentStation: train.currentLocation,
      nextStation: train.nextStation,
      status: train.status === 'approaching' ? 'warning' : train.status === 'early' ? 'ontime' : train.status,
      delay: train.delay,
      eta: train.nextETA,
      speed: train.currentSpeed,
      distance: Math.floor(Math.random() * 100), // Mock distance
      platform: (Math.floor(Math.random() * 10) + 1).toString() // Mock platform
    };
    setSelectedTrain(convertedTrain);
    setShowTrainDetails(true);
  };

  const getStatusCount = (status: string) => {
    return trains.filter(train => train.status === status).length;
  };

  const handleRefresh = () => {
    setTrains(prevTrains =>
      prevTrains.map(train => ({
        ...train,
        lastUpdated: 'Just now'
      }))
    );
    setLastGlobalUpdate(new Date());
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Train Tracking Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring of train movements and status
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>Live Updates</span>
            <div className="status-indicator status-ontime"></div>
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: {lastGlobalUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-5 gap-4">
        <div className="railway-card p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{trains.length}</div>
          <div className="text-sm text-muted-foreground">Total Trains</div>
        </div>
        <div className="railway-card p-4 text-center">
          <div className="text-2xl font-bold text-status-ontime">{getStatusCount('ontime')}</div>
          <div className="text-sm text-muted-foreground">On Time</div>
        </div>
        <div className="railway-card p-4 text-center">
          <div className="text-2xl font-bold text-status-delayed">{getStatusCount('delayed')}</div>
          <div className="text-sm text-muted-foreground">Delayed</div>
        </div>
        <div className="railway-card p-4 text-center">
          <div className="text-2xl font-bold text-status-ontime">{getStatusCount('early')}</div>
          <div className="text-sm text-muted-foreground">Early</div>
        </div>
        <div className="railway-card p-4 text-center">
          <div className="text-2xl font-bold text-status-warning">{getStatusCount('approaching')}</div>
          <div className="text-sm text-muted-foreground">Approaching</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trains, stations, or numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'ontime', 'delayed', 'early'].map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter as any)}
              className="capitalize hover:scale-105 transition-all duration-200"
            >
              {filter === 'all' ? 'All Trains' : filter.replace('ontime', 'On Time')}
            </Button>
          ))}
        </div>
        
        <Button variant="outline" onClick={handleRefresh} className="hover:bg-accent/10 transition-colors">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Train Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrains.map((train) => (
          <TrainTrackingCard
            key={train.id}
            train={train}
            onClick={handleTrainClick}
          />
        ))}
      </div>

      {filteredTrains.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No trains found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Train Details Modal */}
      <TrainDetailsModal
        train={selectedTrain}
        onClose={() => {
          setShowTrainDetails(false);
          setSelectedTrain(null);
        }}
      />
    </div>
  );
};

export default TrainTrackingDashboard;