import { Bell, User, Settings, Shield, Activity, Clock, Wifi, ChevronDown, LogOut, UserCog, Database, Monitor, Zap, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications] = useState(3);
  const [showSystemStatus, setShowSystemStatus] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    online: true,
    connected: true,
    performance: 98,
    activeTrains: 47,
    alerts: 2,
    lastUpdate: new Date()
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate real-time system updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        performance: Math.max(92, Math.min(100, prev.performance + (Math.random() - 0.5) * 2)),
        activeTrains: Math.max(40, Math.min(55, prev.activeTrains + Math.floor((Math.random() - 0.5) * 3))),
        lastUpdate: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handler functions
  const handleLogoClick = () => {
    console.log('Redirecting to home page...');
    window.location.href = '/';
  };

  const handleSystemStatusClick = () => {
    setShowSystemStatus(!showSystemStatus);
    setShowUserMenu(false);
  };

  const handleTimeClick = () => {
    console.log('Time clicked - Current time info displayed');
  };

  const handleUserProfileClick = () => {
    setShowUserMenu(!showUserMenu);
    setShowSystemStatus(false);
  };

  const handleProfileSettings = () => {
    console.log('Opening profile settings...');
    setShowUserMenu(false);
    alert('Profile Settings would open here');
  };

  const handleSystemSettings = () => {
    console.log('Opening system settings...');
    setShowUserMenu(false);
    alert('System Settings would open here');
  };

  const handleActivityLog = () => {
    console.log('Opening activity log...');
    setShowUserMenu(false);
    alert('Activity Log would open here');
  };

  const handleLogout = () => {
    console.log('Logging out user...');
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      setShowUserMenu(false);
      alert('Logout successful! Redirecting to login...');
    }
  };

  const handleControlCenterClick = () => {
    console.log('Control Center - No action needed');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.dropdown-container')) {
        setShowSystemStatus(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <header className="relative h-16 px-6 flex items-center justify-between bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 shadow-xl z-50">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-slate-900 to-purple-900/20"></div>
        
        {/* Left section */}
        <div className="relative flex items-center gap-6">
          {/* Logo and Brand - Clickable for Home Redirect */}
          <div 
            className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-500/30 hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg tracking-wide">IR</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2 hover:text-blue-300 transition-colors">
                Indian Railway Control Center
                <Shield className="h-5 w-5 text-green-400" />
              </h1>
              <p className="text-sm text-slate-400 font-medium hover:text-slate-300 transition-colors">Mumbai Division - Central Zone</p>
            </div>
          </div>

          {/* Control Center Badge - Non-clickable Display Only */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/60 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-600/50">
            <Activity className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-medium text-slate-300">Control Center</span>
          </div>
        </div>
        
        {/* Right section */}
        <div className="relative flex items-center gap-4">
          {/* System Status - Clickable */}
          <div className="relative dropdown-container">
            <div 
              className="flex items-center gap-3 bg-slate-800/60 backdrop-blur px-4 py-2 rounded-lg border border-slate-600/50 shadow-lg cursor-pointer hover:bg-slate-700/60 transition-colors"
              onClick={handleSystemStatusClick}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-lg ${
                  systemStatus.online ? 'bg-green-400 shadow-green-400/50' : 'bg-red-400 shadow-red-400/50'
                }`}></div>
                <span className={`text-sm font-medium ${
                  systemStatus.online ? 'text-green-300' : 'text-red-300'
                }`}>
                  {systemStatus.online ? 'System Online' : 'System Offline'}
                </span>
              </div>
              <div className="w-px h-4 bg-slate-600"></div>
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-400">Connected</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform ${showSystemStatus ? 'rotate-180' : ''}`} />
            </div>

            {/* System Status Dropdown - Less White/More Transparent */}
            {showSystemStatus && (
              <div className="absolute top-full mt-2 right-0 w-80 bg-white/80 backdrop-blur-lg shadow-2xl rounded-lg p-4 z-[60] animate-in slide-in-from-top-2 border border-slate-300/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      System Status
                    </h4>
                    <Badge className="bg-green-600 text-white shadow-lg">{systemStatus.performance}%</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2 p-3 bg-slate-100/70 rounded-lg border border-slate-300/40 hover:bg-slate-200/60 transition-colors backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-slate-700 font-medium">Database</span>
                      </div>
                      <div className="text-xs text-green-600 font-semibold">✓ Operational</div>
                    </div>
                    
                    <div className="space-y-2 p-3 bg-slate-100/70 rounded-lg border border-slate-300/40 hover:bg-slate-200/60 transition-colors backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-slate-700 font-medium">Monitoring</span>
                      </div>
                      <div className="text-xs text-green-600 font-semibold">✓ Active</div>
                    </div>
                    
                    <div className="space-y-2 p-3 bg-slate-100/70 rounded-lg border border-slate-300/40 hover:bg-slate-200/60 transition-colors backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-600" />
                        <span className="text-sm text-slate-700 font-medium">Active Trains</span>
                      </div>
                      <div className="text-xs text-amber-600 font-semibold">{systemStatus.activeTrains} trains</div>
                    </div>
                    
                    <div className="space-y-2 p-3 bg-slate-100/70 rounded-lg border border-slate-300/40 hover:bg-slate-200/60 transition-colors backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-slate-700 font-medium">Alerts</span>
                      </div>
                      <div className="text-xs text-red-600 font-semibold">{systemStatus.alerts} pending</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-300/50">
                    Last updated: {systemStatus.lastUpdate.toLocaleTimeString('en-IN')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Time Display - Clickable (No Dropdown) */}
          <div 
            className="hidden md:flex items-center gap-2 bg-slate-800/60 backdrop-blur px-3 py-2 rounded-lg border border-slate-600/50 cursor-pointer hover:bg-slate-700/60 transition-colors"
            onClick={handleTimeClick}
          >
            <Clock className="h-4 w-4 text-amber-400" />
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-white">
                {currentTime.toLocaleTimeString('en-IN', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className="text-xs text-slate-400">
                {currentTime.toLocaleDateString('en-IN', { 
                  day: '2-digit',
                  month: 'short'
                })}
              </div>
            </div>
          </div>
          
          {/* User Profile - Clickable */}
          <div className="relative dropdown-container">
            <div 
              className="flex items-center gap-3 pl-4 border-l border-slate-600/50 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleUserProfileClick}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">Operator Singh</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30 text-xs px-2 py-0">
                    Shift Lead
                  </Badge>
                  <span className="text-xs text-slate-400">Online</span>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-600/50 hover:scale-105 transition-transform">
                  <User className="h-5 w-5 text-white" />
                </div>
                {/* Online status indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 shadow-lg">
                  <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </div>

            {/* User Menu Dropdown - Less White/More Transparent */}
            {showUserMenu && (
              <div className="absolute top-full mt-2 right-0 w-64 bg-white/85 backdrop-blur-lg shadow-2xl rounded-lg py-2 z-[60] animate-in slide-in-from-top-2 border border-slate-300/50">
                <div className="px-4 py-3 border-b border-slate-300/40">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-semibold">Operator Singh</p>
                      <p className="text-xs text-slate-600">singh.operator@railway.gov.in</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-blue-200/80 text-blue-700 border border-blue-300/60 text-xs px-2 py-0">
                          Shift Lead
                        </Badge>
                        <span className="text-xs text-green-600 font-medium">● Online</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button 
                    onClick={handleProfileSettings}
                    className="w-full text-left px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-200/50 flex items-center gap-3 transition-colors border-l-2 border-transparent hover:border-blue-500 backdrop-blur-sm"
                  >
                    <UserCog className="h-4 w-4 text-blue-600" />
                    <span>Profile Settings</span>
                  </button>
                  
                  <button 
                    onClick={handleSystemSettings}
                    className="w-full text-left px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-200/50 flex items-center gap-3 transition-colors border-l-2 border-transparent hover:border-purple-500 backdrop-blur-sm"
                  >
                    <Settings className="h-4 w-4 text-purple-600" />
                    <span>System Settings</span>
                  </button>
                  
                  <button 
                    onClick={handleActivityLog}
                    className="w-full text-left px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-200/50 flex items-center gap-3 transition-colors border-l-2 border-transparent hover:border-green-500 backdrop-blur-sm"
                  >
                    <Activity className="h-4 w-4 text-green-600" />
                    <span>Activity Log</span>
                  </button>
                </div>
                
                <div className="border-t border-slate-300/40 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-100/60 flex items-center gap-3 transition-colors border-l-2 border-transparent hover:border-red-500 backdrop-blur-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Invisible Click Area - No visual overlay */}
      {(showSystemStatus || showUserMenu) && (
        <div 
          className="fixed inset-0 z-[55]" 
          onClick={() => {
            setShowSystemStatus(false);
            setShowUserMenu(false);
          }}
        ></div>
      )}
    </>
  );
};

export default Header;
