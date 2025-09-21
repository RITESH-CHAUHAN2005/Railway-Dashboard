import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Train, 
  Target, 
  Download, 
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Sample data for charts
const dailyPerformanceData = [
  { date: '15 Jan', onTime: 89.2, avgDelay: 8.5, trainsHandled: 245 },
  { date: '16 Jan', onTime: 87.8, avgDelay: 9.2, trainsHandled: 238 },
  { date: '17 Jan', onTime: 91.4, avgDelay: 7.1, trainsHandled: 252 },
  { date: '18 Jan', onTime: 85.6, avgDelay: 11.8, trainsHandled: 229 },
  { date: '19 Jan', onTime: 88.9, avgDelay: 8.9, trainsHandled: 241 },
  { date: '20 Jan', onTime: 90.3, avgDelay: 7.8, trainsHandled: 248 },
  { date: '21 Jan', onTime: 87.3, avgDelay: 12.5, trainsHandled: 234 }
];

const stationDelayData = [
  { station: 'New Delhi', avgDelay: 8.2, trainsCount: 45 },
  { station: 'Mumbai Central', avgDelay: 12.5, trainsCount: 38 },
  { station: 'Chennai Central', avgDelay: 6.8, trainsCount: 32 },
  { station: 'Howrah Junction', avgDelay: 15.2, trainsCount: 28 },
  { station: 'Bangalore City', avgDelay: 9.1, trainsCount: 25 },
  { station: 'Pune Junction', avgDelay: 7.4, trainsCount: 22 }
];

const delayReasonsData = [
  { name: 'Technical Issues', value: 35, color: '#ef4444' },
  { name: 'Weather Conditions', value: 28, color: '#f59e0b' },
  { name: 'Traffic Congestion', value: 22, color: '#3b82f6' },
  { name: 'Signal Problems', value: 10, color: '#8b5cf6' },
  { name: 'Other', value: 5, color: '#6b7280' }
];

const hourlyTrafficData = [
  { hour: '00:00', volume: 12 },
  { hour: '03:00', volume: 8 },
  { hour: '06:00', volume: 45 },
  { hour: '09:00', volume: 89 },
  { hour: '12:00', volume: 76 },
  { hour: '15:00', volume: 82 },
  { hour: '18:00', volume: 95 },
  { hour: '21:00', volume: 67 }
];

const topPerformingRoutes = [
  { route: 'Delhi - Mumbai (Rajdhani)', onTimePercentage: 94.2, avgDelay: 5.8 },
  { route: 'Mumbai - Chennai (Coromandel)', onTimePercentage: 91.7, avgDelay: 6.9 },
  { route: 'Delhi - Kolkata (Rajdhani)', onTimePercentage: 89.4, avgDelay: 8.1 },
  { route: 'Delhi - Chennai (Tamil Nadu)', onTimePercentage: 87.8, avgDelay: 9.2 },
  { route: 'Mumbai - Bangalore (Udyan)', onTimePercentage: 86.5, avgDelay: 10.1 }
];

const criticalAlerts = [
  { trainNumber: '12951', currentDelay: 45, expectedImpact: 'High', reason: 'Signal failure' },
  { trainNumber: '12002', currentDelay: 32, expectedImpact: 'Medium', reason: 'Weather delay' },
  { trainNumber: '22691', currentDelay: 28, expectedImpact: 'Medium', reason: 'Traffic congestion' },
  { trainNumber: '12615', currentDelay: 52, expectedImpact: 'High', reason: 'Technical issue' }
];

const decisionHistory = [
  { time: '14:30', decision: 'AI Recommendation', action: 'Platform reallocation', outcome: 'Accepted', impact: 'Saved 15 min' },
  { time: '13:45', decision: 'Manual Override', action: 'Route change', outcome: 'Implemented', impact: 'Added 8 min' },
  { time: '12:20', decision: 'AI Recommendation', action: 'Priority adjustment', outcome: 'Accepted', impact: 'Saved 22 min' },
  { time: '11:15', decision: 'Manual Override', action: 'Hold at station', outcome: 'Implemented', impact: 'Added 12 min' }
];

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('7days');
  
  const handleExport = (format: string) => {
    console.log(`Exporting data as ${format}`);
    // Implementation for export functionality
  };

  const formatTooltip = (value: any, name: string) => {
    if (name === 'onTime') return [`${value}%`, 'On-Time Performance'];
    if (name === 'avgDelay') return [`${value} min`, 'Average Delay'];
    if (name === 'trainsHandled') return [value, 'Trains Handled'];
    if (name === 'volume') return [value, 'Trains'];
    return [value, name];
  };

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Railway Operations Analytics</h1>
          <p className="text-muted-foreground mt-1">Performance insights and operational metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => handleExport('PDF')}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* On-Time Performance */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On-Time Performance</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-3xl font-bold text-foreground">87.3%</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-xs text-green-600 mt-1">+2.1% from yesterday</p>
              </div>
              <div className="relative w-16 h-16">
                <Progress 
                  value={87.3} 
                  className="w-16 h-16 rotate-0" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Delay */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Delay</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-3xl font-bold text-foreground">12.5</span>
                  <span className="text-lg text-muted-foreground">min</span>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-xs text-red-600 mt-1">+3.2 min from yesterday</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Trains Handled Today */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trains Handled Today</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-3xl font-bold text-foreground">234</span>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-xs text-green-600 mt-1">+8 from yesterday</p>
              </div>
              <Train className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Efficiency Score */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency Score</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-3xl font-bold text-foreground">91%</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Excellent
                  </Badge>
                </div>
                <p className="text-xs text-green-600 mt-1">+1.5% improvement</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Daily Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  formatter={formatTooltip}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="onTime" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Station-wise Delay Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Station-wise Delay Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stationDelayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="station" 
                  stroke="#64748b" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  formatter={(value) => [`${value} min`, 'Average Delay']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="avgDelay" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Delay Reasons Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delay Reasons Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={delayReasonsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                >
                  {delayReasonsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Traffic Volume */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="h-5 w-5 text-green-500" />
              Hourly Traffic Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hourlyTrafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  formatter={formatTooltip}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Route</TableHead>
                  <TableHead className="text-xs">On-Time %</TableHead>
                  <TableHead className="text-xs">Avg Delay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformingRoutes.map((route, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs font-medium">{route.route}</TableCell>
                    <TableCell className="text-xs">
                      <span className="text-green-600 font-semibold">{route.onTimePercentage}%</span>
                    </TableCell>
                    <TableCell className="text-xs">{route.avgDelay} min</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Critical Delay Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Critical Delay Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Train</TableHead>
                  <TableHead className="text-xs">Delay</TableHead>
                  <TableHead className="text-xs">Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criticalAlerts.map((alert, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs font-medium">{alert.trainNumber}</TableCell>
                    <TableCell className="text-xs text-red-600 font-semibold">
                      {alert.currentDelay} min
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge 
                        variant={alert.expectedImpact === 'High' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {alert.expectedImpact}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Controller Decision History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Decision History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Time</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decisionHistory.map((decision, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs">{decision.time}</TableCell>
                    <TableCell className="text-xs">
                      <Badge 
                        variant={decision.decision === 'AI Recommendation' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {decision.decision === 'AI Recommendation' ? 'AI' : 'Manual'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium">{decision.impact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;