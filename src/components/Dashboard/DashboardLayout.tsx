import { useState, useCallback, memo } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import TrainStatusCard from './TrainStatusCard';
import AIRecommendations from './AIRecommendations';
import PerformanceMetrics from './PerformanceMetrics';
import TrainTrackingDashboard from '../TrainTracking/TrainTrackingDashboard';
import AnalyticsDashboard from './AnalyticsDashboard';
import TrainDetailsModal from '../TrainDetails/TrainDetailsModal';
import EnhancedRailwayMap from '../Map/EnhancedRailwayMap';
import AdditionalStats from './AdditionalStats';
import { mockTrains, type TrainData } from '@/data/trainData';
import { Search, Filter, RefreshCw, BarChart3, Settings, Train, TrendingUp, Activity, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const VIEWS = {
  DASHBOARD: 'dashboard' as const,
  TRACKING: 'tracking' as const,
  ANALYTICS: 'analytics' as const
};

type ActiveView = typeof VIEWS[keyof typeof VIEWS];

const DashboardLayout = memo(() => {
  const navigate = useNavigate();
  const [selectedTrain, setSelectedTrain] = useState<TrainData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>(VIEWS.DASHBOARD);
  const [showTrainDetails, setShowTrainDetails] = useState(false);

  const filteredTrains = mockTrains.filter(train => 
    train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    train.number.includes(searchTerm) ||
    train.currentStation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    train.nextStation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    train.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTrainClick = useCallback((train: TrainData) => {
    setSelectedTrain(train);
    setShowTrainDetails(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  }, []);

  const handleNavigation = useCallback((view: ActiveView) => {
    setActiveView(view);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowTrainDetails(false);
    setSelectedTrain(null);
  }, []);

  const isDashboardActive = activeView === VIEWS.DASHBOARD;
  const isTrackingActive = activeView === VIEWS.TRACKING;
  const isAnalyticsActive = activeView === VIEWS.ANALYTICS;

  // Render analytics dashboard view
  if (isAnalyticsActive) {
    return (
      <div className="h-screen flex flex-col bg-slate-900">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 h-full p-4 bg-slate-800/50 border-r border-slate-700">
            <Button
              variant="ghost"
              onClick={() => setActiveView(VIEWS.DASHBOARD)}
              className="w-full justify-start mb-4 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              ← Back to Dashboard
            </Button>
          </div>
          
          <main className="flex-1 overflow-auto bg-slate-900">
            <AnalyticsDashboard />
          </main>
        </div>
      </div>
    );
  }

  // Render train tracking dashboard view
  if (isTrackingActive) {
    return (
      <div className="h-screen flex flex-col bg-slate-900">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 h-full p-4 bg-slate-800/50 border-r border-slate-700">
            <Button
              variant="ghost"
              onClick={() => setActiveView(VIEWS.DASHBOARD)}
              className="w-full justify-start mb-4 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              ← Back to Dashboard
            </Button>
          </div>
          
          <main className="flex-1 overflow-auto bg-slate-900">
            <TrainTrackingDashboard />
          </main>
        </div>
      </div>
    );
  }

  // Render main dashboard view
  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Enhanced Sidebar */}
        <div className="w-64 h-full p-6 bg-slate-800/50 border-r border-slate-700/50 backdrop-blur-sm">
          <nav className="space-y-3">
            <button
              onClick={() => handleNavigation(VIEWS.DASHBOARD)}
              className={`${
                isDashboardActive 
                  ? 'w-full text-left p-3 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                  : 'w-full text-left p-3 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200'
              }`}
            >
              <Activity className="h-4 w-4 mr-3 inline" />
              <span className="font-medium">Main Dashboard</span>
            </button>
            <button
              onClick={() => handleNavigation(VIEWS.TRACKING)}
              className={`${
                isTrackingActive 
                  ? 'w-full text-left p-3 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                  : 'w-full text-left p-3 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200'
              }`}
            >
              <Train className="h-4 w-4 mr-3 inline" />
              <span className="font-medium">Train Tracking</span>
            </button>
            <button
              onClick={() => handleNavigation(VIEWS.ANALYTICS)}
              className={`${
                isAnalyticsActive 
                  ? 'w-full text-left p-3 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                  : 'w-full text-left p-3 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200'
              }`}
            >
              <BarChart3 className="h-4 w-4 mr-3 inline" />
              <span className="font-medium">Analytics Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-full text-left p-3 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
            >
              <Settings className="h-4 w-4 mr-3 inline" />
              <span className="font-medium">System Settings</span>
            </button>
          </nav>
        </div>
        
        {/* Fixed Main Content Container */}
        <main className="flex-1 overflow-auto bg-slate-900">
          <div className="p-8 min-h-full">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Enhanced Dashboard Header */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 via-slate-800 to-slate-700 p-6 border border-slate-700/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                      <Activity className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white">Railway Control Dashboard</h1>
                      <p className="text-slate-300">Real-time monitoring and management of railway operations</p>
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-sm text-slate-300 font-medium">System Online • All Services Active</span>
                  </div>
                </div>
              </div>

              {/* Main Content - Fixed Container with Proper Overflow Handling */}
              <div className="space-y-8">
                {/* Live Train Status Section - Fixed Container */}
                <div className="relative overflow-hidden rounded-xl bg-slate-800/90 backdrop-blur border border-slate-700/50 shadow-2xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  
                  {/* Fixed padding to prevent overflow */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                          <Train className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            Live Train Status
                            <span className="text-sm font-normal text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                              {filteredTrains.length} trains
                            </span>
                          </h2>
                          <p className="text-sm text-slate-400">Real-time tracking and monitoring</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefresh}
                          disabled={isRefreshing}
                          className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveView(VIEWS.TRACKING)}
                          className="bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30 hover:text-blue-200"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Detailed View
                        </Button>
                      </div>
                    </div>
                    
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search by train name, number, or station..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-slate-300 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    
                    {/* Fixed scrollable container with proper boundaries */}
                    <div className="overflow-hidden rounded-lg">
                      <div className="max-h-[500px] overflow-y-auto overflow-x-hidden space-y-4 pr-2 custom-scrollbar">
                        {filteredTrains.length > 0 ? (
                          filteredTrains.map((train) => (
                            <div key={train.id} className="hover:scale-[1.02] transition-transform duration-200 will-change-transform">
                              <TrainStatusCard
                                train={train}
                                onClick={handleTrainClick}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 bg-slate-700/30 rounded-lg border border-slate-600/50">
                            <Train className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                            <p className="text-slate-400">No trains found matching your search.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics Section - Fixed Container */}
                <div className="relative overflow-hidden rounded-xl bg-slate-800/90 backdrop-blur border border-slate-700/50 shadow-2xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
                  <div className="p-6">
                    <PerformanceMetrics />
                  </div>
                </div>

                {/* AI Recommendations Section - Fixed Container */}
                <div className="relative overflow-hidden rounded-xl bg-slate-800/90 backdrop-blur border border-slate-700/50 shadow-2xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <div className="p-6">
                    <AIRecommendations />
                  </div>
                </div>

                {/* Quick Actions - Fixed Container */}
                <div className="relative overflow-hidden rounded-xl bg-slate-800/90 backdrop-blur border border-slate-700/50 shadow-2xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center border border-amber-500/30">
                        <Zap className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                        <p className="text-sm text-slate-400">Frequently used dashboard functions</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button 
                        variant="outline"
                        onClick={() => setActiveView(VIEWS.ANALYTICS)}
                        className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white h-16 flex flex-col items-center justify-center space-y-2 transition-colors duration-200"
                      >
                        <BarChart3 className="h-5 w-5" />
                        <span className="text-sm">Analytics Dashboard</span>
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setActiveView(VIEWS.TRACKING)}
                        className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white h-16 flex flex-col items-center justify-center space-y-2 transition-colors duration-200"
                      >
                        <Filter className="h-5 w-5" />
                        <span className="text-sm">Advanced Tracking</span>
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/settings')}
                        className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white h-16 flex flex-col items-center justify-center space-y-2 transition-colors duration-200"
                      >
                        <Settings className="h-5 w-5" />
                        <span className="text-sm">System Settings</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Additional Statistics - Fixed Container */}
                <div className="relative overflow-hidden rounded-xl bg-slate-800/90 backdrop-blur border border-slate-700/50 shadow-2xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500"></div>
                  <div className="p-6">
                    <AdditionalStats />
                  </div>
                </div>

                {/* India Railway Map Footer - Fixed Container */}
                <div className="relative overflow-hidden rounded-xl bg-slate-800/90 backdrop-blur border border-slate-700/50 shadow-2xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  <div className="p-6">
                    <EnhancedRailwayMap />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Train Details Modal */}
          <TrainDetailsModal
            train={selectedTrain}
            onClose={handleCloseModal}
          />
        </main>
      </div>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
