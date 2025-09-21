import { useState, useEffect } from 'react';
import { Brain, CheckCircle, XCircle, Clock, AlertTriangle, Train, Bot, History, ChevronDown, Zap, Shield, Target, FileText, Cpu, TrendingUp, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Recommendation {
  id: string;
  type: 'platform_conflict' | 'route_optimization' | 'priority_precedence' | 'delay_minimization' | 'track_utilization';
  trainNumber: string;
  recommendationText: string;
  aiReasoning: string;
  impactPrediction: string;
  confidence: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'accepted' | 'overridden';
  timestamp: Date;
  overrideReason?: string;
  acceptanceReason?: string;
  conflictDetails: string;
  systemAnalysis: string;
  dataPoints: {
    passengerCount?: number;
    delayRisk?: number;
    alternativeOptions?: number;
    costImpact?: string;
    timeWindow?: string;
  };
}

interface HistoryItem extends Recommendation {
  outcome?: string;
  actualImpact?: string;
  performanceScore?: number;
}

const generateRecommendations = (): Recommendation[] => [
  {
    id: '1',
    type: 'platform_conflict',
    trainNumber: '12951',
    recommendationText: 'Hold Train 12951 at current station for 8 minutes',
    aiReasoning: 'Platform conflict detected with incoming Train 12002 at Delhi Junction',
    impactPrediction: 'Prevents 20-minute delay for both trains, optimizes passenger flow',
    conflictDetails: 'Platform 2 double-booking detected: Train 12951 (arriving 14:25) conflicts with Train 12002 (scheduled departure 14:20). Both trains require 6-minute platform occupancy.',
    systemAnalysis: 'AI Traffic Controller analyzed 847 similar scenarios. Success rate: 94%. Alternative platforms unavailable due to maintenance on Track 3.',
    confidence: 89,
    priority: 'critical',
    status: 'pending',
    timestamp: new Date(),
    dataPoints: {
      passengerCount: 234,
      delayRisk: 85,
      alternativeOptions: 0,
      costImpact: '₹12,400 penalty savings',
      timeWindow: '6-10 minutes'
    }
  },
  {
    id: '2',
    type: 'priority_precedence',
    trainNumber: '12002',
    recommendationText: 'Grant priority to Train 12002 over regional services',
    aiReasoning: 'Express service optimization with higher passenger throughput efficiency',
    impactPrediction: 'Reduces system-wide delay by 15 minutes, improves passenger satisfaction score',
    conflictDetails: 'Priority conflict: Express Train 12002 (284 passengers) vs Regional Train 12951 (67 passengers). Both requesting same time slot at Delhi Junction.',
    systemAnalysis: 'ML algorithm weighted passenger density (4.2:1 ratio), revenue impact (₹45,000 vs ₹8,900), and connecting train dependencies. Express prioritization optimal.',
    confidence: 94,
    priority: 'high',
    status: 'pending',
    timestamp: new Date(),
    dataPoints: {
      passengerCount: 284,
      delayRisk: 72,
      alternativeOptions: 2,
      costImpact: '₹25,600 revenue protection',
      timeWindow: '12-18 minutes'
    }
  },
  {
    id: '3',
    type: 'route_optimization',
    trainNumber: '22691',
    recommendationText: 'Redirect Train 22691 to Platform 3 via Track 7',
    aiReasoning: 'Maintenance activity on primary route causing bottleneck congestion',
    impactPrediction: 'Eliminates 12-minute delay, improves junction efficiency by 18%',
    conflictDetails: 'Route bottleneck identified: Primary Track 2 blocked by maintenance crew (EST completion: 45 minutes). Current route causing cascade delays.',
    systemAnalysis: 'Real-time traffic analysis identified Platform 3 via Track 7 as optimal alternative. Signal coordination confirmed. No passenger service impact expected.',
    confidence: 87,
    priority: 'high',
    status: 'pending',
    timestamp: new Date(),
    dataPoints: {
      passengerCount: 156,
      delayRisk: 78,
      alternativeOptions: 3,
      costImpact: '₹18,200 operational savings',
      timeWindow: '8-15 minutes'
    }
  },
  {
    id: '4',
    type: 'delay_minimization',
    trainNumber: 'FREIGHT-001',
    recommendationText: 'Hold freight operations for express train corridor',
    aiReasoning: 'Three high-priority passenger trains approaching within 30-minute window',
    impactPrediction: 'Reduces passenger service delays by average 12 minutes per train',
    conflictDetails: 'Freight-passenger priority conflict: FREIGHT-001 blocking Track 4, required by incoming Express trains 12019, 12005, and 22126 between 14:30-15:00.',
    systemAnalysis: 'Passenger-freight optimization algorithm calculated minimal freight delay (15 min) vs massive passenger impact (36 min combined). Cost-benefit ratio: 1:4.8.',
    confidence: 91,
    priority: 'medium',
    status: 'pending',
    timestamp: new Date(),
    dataPoints: {
      passengerCount: 892,
      delayRisk: 82,
      alternativeOptions: 1,
      costImpact: '₹67,500 passenger compensation avoided',
      timeWindow: '15-30 minutes'
    }
  },
  {
    id: '5',
    type: 'track_utilization',
    trainNumber: '16345',
    recommendationText: 'Optimize track switching sequence for improved throughput',
    aiReasoning: 'Dynamic load balancing shows Track 2 has superior utilization metrics',
    impactPrediction: 'Improves junction efficiency by 12% for next 2-hour window',
    conflictDetails: 'Track utilization imbalance: Current Track 4 assignment shows 89% capacity vs Track 2 at 67%. Switch timing optimization reduces overall congestion.',
    systemAnalysis: 'Predictive analytics model forecasted 2-hour traffic pattern. Track 2 assignment reduces waiting time by 7.3 minutes average and improves signal coordination.',
    confidence: 82,
    priority: 'medium',
    status: 'pending',
    timestamp: new Date(),
    dataPoints: {
      passengerCount: 203,
      delayRisk: 45,
      alternativeOptions: 4,
      costImpact: '₹9,800 efficiency improvement',
      timeWindow: '5-12 minutes'
    }
  }
];

const mockHistory: HistoryItem[] = [
  {
    id: 'h1',
    type: 'platform_conflict',
    trainNumber: '12301',
    recommendationText: 'Redirect to Platform 5',
    aiReasoning: 'Platform conflict with Train 12009',
    impactPrediction: 'Prevent 15-minute delay',
    conflictDetails: 'Platform double-booking resolved by alternative routing',
    systemAnalysis: 'Successful conflict resolution with zero passenger impact',
    confidence: 93,
    priority: 'high',
    status: 'accepted',
    timestamp: new Date(Date.now() - 3600000),
    acceptanceReason: 'Operator confirmed alternative platform availability and passenger safety protocols',
    outcome: 'Successfully implemented - Zero delays reported',
    actualImpact: 'Prevented 18-minute delay, saved ₹15,400 in penalties',
    performanceScore: 97,
    dataPoints: {
      passengerCount: 178,
      delayRisk: 88,
      alternativeOptions: 1,
      costImpact: '₹15,400 saved'
    }
  },
  {
    id: 'h2',
    type: 'delay_minimization',
    trainNumber: '19216',
    recommendationText: 'Hold at Dadar for 5 minutes',
    aiReasoning: 'Express train priority passage optimization',
    impactPrediction: 'Optimize overall system flow',
    conflictDetails: 'Express corridor management for high-priority services',
    systemAnalysis: 'Standard delay minimization protocol applied',
    confidence: 88,
    priority: 'medium',
    status: 'overridden',
    timestamp: new Date(Date.now() - 7200000),
    overrideReason: 'Station master reported unexpected passenger medical emergency requiring immediate platform clearance',
    actualImpact: '8-minute delay occurred, but emergency protocols successfully executed',
    performanceScore: 76,
    dataPoints: {
      passengerCount: 134,
      delayRisk: 65,
      alternativeOptions: 2,
      costImpact: '₹4,200 penalty incurred'
    }
  }
];

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(generateRecommendations());
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [overrideDialogId, setOverrideDialogId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Real-time recommendations simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && recommendations.length < 8) {
        const newRec: Recommendation = {
          id: `new-${Date.now()}`,
          type: 'platform_conflict',
          trainNumber: `${12000 + Math.floor(Math.random() * 1000)}`,
          recommendationText: 'New traffic optimization detected by AI system',
          aiReasoning: 'Real-time pattern analysis identified potential system improvement',
          impactPrediction: `Reduces delay by ${5 + Math.floor(Math.random() * 10)} minutes`,
          conflictDetails: 'Dynamic conflict resolution based on real-time traffic analysis',
          systemAnalysis: 'Machine learning model detected optimization opportunity in current traffic pattern',
          confidence: 75 + Math.floor(Math.random() * 20),
          priority: 'medium',
          status: 'pending',
          timestamp: new Date(),
          dataPoints: {
            passengerCount: 100 + Math.floor(Math.random() * 200),
            delayRisk: 50 + Math.floor(Math.random() * 40),
            alternativeOptions: Math.floor(Math.random() * 3),
            costImpact: `₹${(Math.random() * 20000).toFixed(0)} impact`,
            timeWindow: '5-15 minutes'
          }
        };
        setRecommendations(prev => [newRec, ...prev]);
      }
    }, 120000);

    return () => clearInterval(interval);
  }, [recommendations.length]);

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'platform_conflict':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'route_optimization':
        return <Brain className="h-4 w-4 text-blue-400" />;
      case 'priority_precedence':
        return <Target className="h-4 w-4 text-purple-400" />;
      case 'delay_minimization':
        return <Clock className="h-4 w-4 text-amber-400" />;
      case 'track_utilization':
        return <Zap className="h-4 w-4 text-green-400" />;
      default:
        return <Bot className="h-4 w-4 text-blue-400" />;
    }
  };

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'platform_conflict':
        return 'bg-slate-800/90 border-red-800/50 shadow-lg shadow-red-900/20';
      case 'route_optimization':
        return 'bg-slate-800/90 border-blue-800/50 shadow-lg shadow-blue-900/20';
      case 'priority_precedence':
        return 'bg-slate-800/90 border-purple-800/50 shadow-lg shadow-purple-900/20';
      case 'delay_minimization':
        return 'bg-slate-800/90 border-amber-800/50 shadow-lg shadow-amber-900/20';
      case 'track_utilization':
        return 'bg-slate-800/90 border-green-800/50 shadow-lg shadow-green-900/20';
      default:
        return 'bg-slate-800/90 border-slate-700/50 shadow-lg';
    }
  };

  const getPriorityBadge = (priority: Recommendation['priority']) => {
    const colors = {
      critical: 'bg-red-600 text-white shadow-md',
      high: 'bg-orange-500 text-white shadow-md',
      medium: 'bg-amber-500 text-black shadow-md',
      low: 'bg-green-600 text-white shadow-md'
    };
    return colors[priority];
  };

  const toggleCardExpansion = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const generateAcceptanceReason = (rec: Recommendation): string => {
    const reasons = {
      platform_conflict: `AI analysis confirmed with station supervisor. Platform conflict resolution optimal. Zero passenger service disruption expected. Alternative platforms verified unavailable.`,
      route_optimization: `Traffic control verified route optimization benefits. Signal coordination confirmed. No safety protocol violations. Passenger journey time improved.`,
      priority_precedence: `Priority matrix calculation verified by duty officer. Higher passenger count and revenue optimization confirmed. Connecting services coordination maintained.`,
      delay_minimization: `System-wide delay analysis approved by control room. Passenger flow optimization prioritized over freight scheduling. Cost-benefit analysis favorable.`,
      track_utilization: `Track capacity analysis confirmed by signal department. Infrastructure utilization optimization approved. Maintenance schedule coordination verified.`
    };
    return reasons[rec.type] || 'Standard operational procedure approved by duty controller.';
  };

  const handleAccept = (id: string) => {
    const recommendation = recommendations.find(r => r.id === id);
    if (recommendation) {
      const acceptanceReason = generateAcceptanceReason(recommendation);
      
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === id ? { ...rec, status: 'accepted' as const, acceptanceReason } : rec
        )
      );
      
      setTimeout(() => {
        const acceptedRec = recommendations.find(r => r.id === id);
        if (acceptedRec) {
          const historyItem: HistoryItem = {
            ...acceptedRec,
            status: 'accepted',
            acceptanceReason,
            outcome: 'Successfully implemented by traffic control',
            actualImpact: acceptedRec.impactPrediction,
            performanceScore: Math.floor(85 + Math.random() * 15)
          };
          setHistory(prev => [historyItem, ...prev]);
          setRecommendations(prev => prev.filter(r => r.id !== id));
        }
      }, 2000);
    }
  };

  const handleOverride = (id: string, reason: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, status: 'overridden' as const, overrideReason: reason } : rec
      )
    );
    
    setTimeout(() => {
      const overriddenRec = recommendations.find(r => r.id === id);
      if (overriddenRec) {
        const historyItem: HistoryItem = {
          ...overriddenRec,
          status: 'overridden',
          overrideReason: reason,
          outcome: `Manual override implemented: ${reason}`,
          actualImpact: 'Alternative solution applied by station controller',
          performanceScore: Math.floor(60 + Math.random() * 25)
        };
        setHistory(prev => [historyItem, ...prev]);
        setRecommendations(prev => prev.filter(r => r.id !== id));
      }
    }, 2000);
    
    setOverrideDialogId(null);
  };

  const overrideReasons = [
    'Local station conditions override AI assessment',
    'Emergency passenger service requirements',
    'Maintenance crew safety protocols active',
    'Manual traffic control decision preferred',
    'Weather conditions affecting operations',
    'VIP train movement takes priority',
    'Signal system maintenance in progress',
    'Platform passenger safety concerns'
  ];

  const pendingRecommendations = recommendations.filter(r => r.status === 'pending');
  const acceptedHistory = history.filter(h => h.status === 'accepted');
  const overriddenHistory = history.filter(h => h.status === 'overridden');
  const avgConfidence = recommendations.length > 0 
    ? Math.round(recommendations.reduce((acc, r) => acc + r.confidence, 0) / recommendations.length) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 p-6 text-white shadow-2xl border border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 backdrop-blur rounded-xl flex items-center justify-center border border-blue-500/30">
              <Bot className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                AI Traffic Control Recommendations
                <Shield className="h-5 w-5 text-green-400" />
              </h2>
              <p className="text-slate-300 text-sm">
                Machine learning powered optimization with detailed analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur rounded-lg px-3 py-2 border border-green-500/30">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-sm font-medium text-green-300">Live AI Analysis</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { 
            label: 'Active', 
            value: pendingRecommendations.length,
            gradient: 'from-blue-600 to-blue-700',
            icon: <Bot className="h-5 w-5" />
          },
          { 
            label: 'Accepted', 
            value: acceptedHistory.length,
            gradient: 'from-green-600 to-green-700',
            icon: <CheckCircle className="h-5 w-5" />
          },
          { 
            label: 'Overridden', 
            value: overriddenHistory.length,
            gradient: 'from-orange-600 to-orange-700',
            icon: <XCircle className="h-5 w-5" />
          },
          { 
            label: 'Avg. Confidence', 
            value: `${avgConfidence}%`,
            gradient: 'from-purple-600 to-purple-700',
            icon: <Target className="h-5 w-5" />
          }
        ].map((stat, index) => (
          <Card key={index} className="bg-slate-800/90 border-slate-700/50 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-400" />
          Active Recommendations
          <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
            {pendingRecommendations.length} pending
          </Badge>
        </h3>
        
        {pendingRecommendations.map((rec) => (
          <Card key={rec.id} className={`${getTypeColor(rec.type)} transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 border`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Train Icon */}
                <div className="w-16 h-16 bg-slate-700/80 rounded-xl flex items-center justify-center flex-shrink-0 relative shadow-lg border border-slate-600/50">
                  <Train className="h-7 w-7 text-slate-300" />
                  <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-600 rounded-full px-2 py-0.5 shadow-md">
                    <span className="text-xs font-bold text-white">{rec.trainNumber}</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 space-y-4 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(rec.type)}
                        <span className="text-sm font-medium text-slate-400">
                          {rec.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      <h4 className="font-bold text-lg text-white leading-tight mb-2">
                        {rec.recommendationText}
                      </h4>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge className={`${getPriorityBadge(rec.priority)} shadow-lg`}>
                          {rec.priority.toUpperCase()}
                        </Badge>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                          {rec.confidence}% confident
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300 border border-blue-500/30">
                          {rec.dataPoints.passengerCount} passengers
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-amber-600/20 text-amber-300 border border-amber-500/30">
                          {rec.dataPoints.delayRisk}% delay risk
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Information Sections */}
                  <div className="space-y-3">
                    {/* Conflict Details */}
                    <div className="bg-red-900/20 backdrop-blur border border-red-700/50 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <span className="text-sm font-medium text-red-300">Conflict Analysis</span>
                      </div>
                      <p className="text-sm text-red-200 leading-relaxed">{rec.conflictDetails}</p>
                    </div>

                    {/* AI Analysis */}
                    <div className="bg-slate-700/50 backdrop-blur border border-slate-600/50 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium text-slate-300">AI System Analysis</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{rec.systemAnalysis}</p>
                    </div>

                    {/* AI Reasoning */}
                    <div className="bg-blue-900/20 backdrop-blur border border-blue-700/50 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-300">AI Reasoning</span>
                      </div>
                      <p className="text-sm text-blue-200 leading-relaxed">{rec.aiReasoning}</p>
                    </div>
                    
                    {/* Predicted Impact */}
                    <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-700/50 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-green-300">Predicted Impact</span>
                      </div>
                      <p className="text-sm font-medium text-green-200 mb-2">{rec.impactPrediction}</p>
                      
                      {/* Data Points */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-green-300">Cost Impact:</span>
                          <span className="text-green-200 font-medium">{rec.dataPoints.costImpact}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-300">Time Window:</span>
                          <span className="text-green-200 font-medium">{rec.dataPoints.timeWindow}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-300">Alternatives:</span>
                          <span className="text-green-200 font-medium">{rec.dataPoints.alternativeOptions} options</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-300">Risk Level:</span>
                          <span className="text-green-200 font-medium">{rec.dataPoints.delayRisk}% risk</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Indicators */}
                    {rec.status === 'accepted' && rec.acceptanceReason && (
                      <div className="bg-green-900/20 backdrop-blur border border-green-700/50 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-sm font-medium text-green-300">Acceptance Reason</span>
                        </div>
                        <p className="text-sm text-green-200 leading-relaxed">{rec.acceptanceReason}</p>
                      </div>
                    )}

                    {rec.status === 'overridden' && rec.overrideReason && (
                      <div className="bg-orange-900/20 backdrop-blur border border-orange-700/50 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="h-4 w-4 text-orange-400" />
                          <span className="text-sm font-medium text-orange-300">Override Reason</span>
                        </div>
                        <p className="text-sm text-orange-200 leading-relaxed">{rec.overrideReason}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{rec.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="h-3 w-3" />
                        <span>ML Model v2.1</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Real-time</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {rec.status === 'pending' && (
                    <>
                      <Button 
                        onClick={() => handleAccept(rec.id)}
                        className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      
                      {overrideDialogId === rec.id ? (
                        <div className="space-y-2 min-w-[200px]">
                          <Select onValueChange={(reason) => handleOverride(rec.id, reason)}>
                            <SelectTrigger className="text-xs bg-slate-700 border-slate-600 text-slate-300">
                              <SelectValue placeholder="Select override reason..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              {overrideReasons.map((reason) => (
                                <SelectItem key={reason} value={reason} className="text-xs text-slate-300 hover:bg-slate-700">
                                  {reason}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            onClick={() => setOverrideDialogId(null)}
                            variant="ghost"
                            size="sm"
                            className="text-xs w-full text-slate-300 hover:bg-slate-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => setOverrideDialogId(rec.id)}
                          variant="outline"
                          className="border-orange-500 text-orange-400 hover:bg-orange-900/20 hover:border-orange-400 shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                          size="sm"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Override
                        </Button>
                      )}
                    </>
                  )}
                  
                  {rec.status === 'accepted' && (
                    <Badge className="bg-green-600 text-white shadow-lg justify-center">
                      ✓ Accepted
                    </Badge>
                  )}
                  
                  {rec.status === 'overridden' && (
                    <Badge className="bg-orange-600 text-white shadow-lg justify-center">
                      ⚠ Overridden
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* History Panel */}
      <Collapsible open={showHistory} onOpenChange={setShowHistory}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full bg-slate-800/50 hover:bg-slate-700 border-slate-600 text-slate-300 shadow-md"
          >
            <History className="h-4 w-4 mr-2" />
            Decision History ({history.length})
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-3 mt-4">
          {history.slice(0, 5).map((item) => (
            <Card key={item.id} className="bg-slate-800/70 border-slate-700/50 shadow-md">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600">
                        <Train className="h-4 w-4 text-slate-300" />
                      </div>
                      <span className="font-medium text-white">{item.trainNumber}</span>
                      <Badge 
                        className={item.status === 'accepted' 
                          ? 'bg-green-600 text-white shadow-sm' 
                          : 'bg-red-600 text-white shadow-sm'
                        }
                      >
                        {item.status}
                      </Badge>
                      {item.performanceScore && (
                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                          {item.performanceScore}% success
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-slate-300 pl-11">{item.recommendationText}</div>
                    <div className="text-sm font-medium text-green-400 pl-11">{item.actualImpact}</div>
                    
                    {/* Detailed Reason */}
                    {item.acceptanceReason && (
                      <div className="pl-11 text-xs text-green-300 bg-green-900/20 p-2 rounded border border-green-700/50">
                        <strong>Acceptance:</strong> {item.acceptanceReason}
                      </div>
                    )}
                    
                    {item.overrideReason && (
                      <div className="pl-11 text-xs text-orange-300 bg-orange-900/20 p-2 rounded border border-orange-700/50">
                        <strong>Override:</strong> {item.overrideReason}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {item.timestamp.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AIRecommendations;
