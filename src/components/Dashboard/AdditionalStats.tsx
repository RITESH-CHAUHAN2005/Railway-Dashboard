import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Fuel, 
  MapPin, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Train,
  Activity
} from 'lucide-react';

const AdditionalStats = () => {
  const [stats, setStats] = useState({
    totalPassengers: 2847651,
    fuelEfficiency: 87.3,
    routesActive: 1247,
    maintenanceScheduled: 23,
    revenueToday: 34567890,
    carbonFootprint: 12.4,
    networkUtilization: 76.8,
    safetyIncidents: 0
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalPassengers: prev.totalPassengers + Math.floor(Math.random() * 100),
        fuelEfficiency: 85 + Math.random() * 5,
        networkUtilization: 70 + Math.random() * 15,
        revenueToday: prev.revenueToday + Math.floor(Math.random() * 10000)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Passenger & Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="railway-card hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Passenger Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Passengers Today</span>
              <span className="text-2xl font-bold text-blue-600">{formatNumber(stats.totalPassengers)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Revenue Generated</span>
              <span className="text-lg font-semibold text-green-600">{formatCurrency(stats.revenueToday)}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">+12.3% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="railway-card hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Operational Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Network Utilization</span>
                <span className="text-sm font-medium">{stats.networkUtilization.toFixed(1)}%</span>
              </div>
              <Progress value={stats.networkUtilization} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fuel Efficiency</span>
                <span className="text-sm font-medium">{stats.fuelEfficiency.toFixed(1)}%</span>
              </div>
              <Progress value={stats.fuelEfficiency} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="railway-card text-center p-4">
          <div className="flex flex-col items-center gap-2">
            <MapPin className="h-6 w-6 text-orange-500" />
            <div className="text-2xl font-bold text-orange-600">{stats.routesActive}</div>
            <div className="text-xs text-muted-foreground">Active Routes</div>
          </div>
        </Card>

        <Card className="railway-card text-center p-4">
          <div className="flex flex-col items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-500" />
            <div className="text-2xl font-bold text-blue-600">{stats.maintenanceScheduled}</div>
            <div className="text-xs text-muted-foreground">Scheduled Maintenance</div>
          </div>
        </Card>

        <Card className="railway-card text-center p-4">
          <div className="flex flex-col items-center gap-2">
            <Fuel className="h-6 w-6 text-green-500" />
            <div className="text-2xl font-bold text-green-600">{stats.carbonFootprint}</div>
            <div className="text-xs text-muted-foreground">Carbon Index (Low)</div>
          </div>
        </Card>

        <Card className="railway-card text-center p-4">
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="h-6 w-6 text-emerald-500" />
            <div className="text-2xl font-bold text-emerald-600">{stats.safetyIncidents}</div>
            <div className="text-xs text-muted-foreground">Safety Incidents</div>
            <Badge variant="secondary" className="text-xs">24h</Badge>
          </div>
        </Card>
      </div>

      {/* System Health */}
      <Card className="railway-card hover-glow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Signal Systems</span>
                <Badge variant="default" className="bg-green-500">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Communication Network</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">GPS Tracking</span>
                <Badge variant="default" className="bg-green-500">Online</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Power Grid</span>
                <Badge variant="default" className="bg-green-500">Stable</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Weather Monitoring</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Emergency Systems</span>
                <Badge variant="default" className="bg-green-500">Ready</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Sync</span>
                <Badge variant="default" className="bg-blue-500">Syncing</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Backup Systems</span>
                <Badge variant="default" className="bg-green-500">Ready</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Analytics</span>
                <Badge variant="default" className="bg-purple-500">Processing</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="railway-card hover-glow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Recent System Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '14:32', action: 'Train 12951 departed Platform 2', status: 'success' },
              { time: '14:28', action: 'Signal maintenance completed at Junction AB', status: 'info' },
              { time: '14:25', action: 'Weather alert issued for Eastern zone', status: 'warning' },
              { time: '14:20', action: 'New train schedule uploaded to system', status: 'info' },
              { time: '14:15', action: 'Emergency drill completed successfully', status: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <div className="text-xs font-mono text-muted-foreground">{activity.time}</div>
                <div className="flex-1 text-sm">{activity.action}</div>
                <Badge 
                  variant={activity.status === 'success' ? 'default' : activity.status === 'warning' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalStats;