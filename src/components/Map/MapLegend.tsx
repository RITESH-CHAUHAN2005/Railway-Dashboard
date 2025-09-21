import React from 'react';
import { Train, MapPin, Circle } from 'lucide-react';

const MapLegend = () => {
  return (
    <div className="railway-card p-4">
      <h4 className="font-medium mb-3">Map Legend</h4>
      
      <div className="space-y-3">
        {/* Train Status */}
        <div>
          <p className="text-sm font-medium mb-2">Train Status</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-status-ontime rounded-full"></div>
              <span>On Time</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-status-delayed rounded-full"></div>
              <span>Delayed</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-status-warning rounded-full"></div>
              <span>Approaching Station</span>
            </div>
          </div>
        </div>

        {/* Train Types */}
        <div>
          <p className="text-sm font-medium mb-2">Train Types</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Train className="h-4 w-4 text-primary" />
              <span>Express Trains</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Train className="h-3 w-3 text-muted-foreground" />
              <span>Local Trains</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Train className="h-4 w-4 text-orange-500" />
              <span>Freight Trains</span>
            </div>
          </div>
        </div>

        {/* Route Colors */}
        <div>
          <p className="text-sm font-medium mb-2">Route Types</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-2 bg-blue-500 rounded"></div>
              <span>Express Routes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-2 bg-green-500 rounded"></div>
              <span>Local Routes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-2 bg-amber-600 rounded"></div>
              <span>Freight Routes</span>
            </div>
          </div>
        </div>

        {/* Stations */}
        <div>
          <p className="text-sm font-medium mb-2">Stations</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-primary rounded-full border border-background"></div>
              <span>Major Junctions</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Terminal Stations</span>
            </div>
          </div>
        </div>

        {/* Interactive Elements */}
        <div>
          <p className="text-sm font-medium mb-2">Interactive</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Circle className="h-3 w-3 text-muted-foreground" />
              <span>Click trains for details</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Circle className="h-3 w-3 text-muted-foreground" />
              <span>Click stations to zoom</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;