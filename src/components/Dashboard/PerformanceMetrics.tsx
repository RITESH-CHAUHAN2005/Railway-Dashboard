import { TrendingUp, TrendingDown, Clock, Train, AlertTriangle, Target } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

const MetricCard = ({ title, value, change, icon, trend }: MetricCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-status-ontime';
      case 'down':
        return 'text-status-delayed';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-2">
        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
          {getTrendIcon()}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
};

const PerformanceMetrics = () => {
  const metrics = [
    {
      title: 'On-Time Performance',
      value: '87.3%',
      change: 2.1,
      icon: <Target className="h-5 w-5 text-primary" />,
      trend: 'up' as const
    },
    {
      title: 'Average Delay',
      value: '12.5 min',
      change: -1.8,
      icon: <Clock className="h-5 w-5 text-primary" />,
      trend: 'up' as const
    },
    {
      title: 'Active Trains',
      value: '148',
      change: 5.2,
      icon: <Train className="h-5 w-5 text-primary" />,
      trend: 'neutral' as const
    },
    {
      title: 'Critical Alerts',
      value: '3',
      change: -2.1,
      icon: <AlertTriangle className="h-5 w-5 text-primary" />,
      trend: 'up' as const
    }
  ];

  return (
    // Performance Overview section को Live Train Status के नीचे show करने के लिए
    // इसको आप main dashboard component में इस order में रखिए:
    // 1. Live Train Status पहले
    // 2. Performance Overview नीचे
    
    <div className="space-y-4 mt-6"> {/* mt-6 added for spacing after Live Train Status */}
      <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            trend={metric.trend}
          />
        ))}
      </div>
      
      <div className="railway-card p-4 mt-6">
        <h3 className="font-semibold text-sm mb-3">Today's Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Trains Departed</span>
            <span className="font-medium">142</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">On Schedule</span>
            <span className="font-medium text-status-ontime">124</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delayed</span>
            <span className="font-medium text-status-delayed">18</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Avg Load Factor</span>
            <span className="font-medium">78.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
