import { LayoutDashboard, MapPin, BarChart3, Settings, Train, AlertTriangle, Users } from 'lucide-react';
import { useState } from 'react';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tracking', label: 'Live Tracking', icon: MapPin },
  { id: 'trains', label: 'Train Management', icon: Train },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'alerts', label: 'Alert Center', icon: AlertTriangle },
  { id: 'personnel', label: 'Personnel', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <aside className="railway-sidebar w-64 h-full p-4">
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`nav-item w-full text-left ${isActive ? 'active' : ''}`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-8 p-4 railway-card">
        <h3 className="font-semibold text-sm mb-3">System Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Network</span>
            <div className="flex items-center gap-2">
              <div className="status-indicator status-ontime"></div>
              <span className="text-xs">Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">GPS</span>
            <div className="flex items-center gap-2">
              <div className="status-indicator status-ontime"></div>
              <span className="text-xs">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Alerts</span>
            <div className="flex items-center gap-2">
              <div className="status-indicator status-warning"></div>
              <span className="text-xs">3 Active</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;