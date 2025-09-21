import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Train, 
  AlertTriangle, 
  Users, 
  Plus,
  X,
  Clock,
  Phone,
  User
} from 'lucide-react';

interface RailwayOperationsProps {
  onSettingChange: () => void;
}

const RailwayOperations = ({ onSettingChange }: RailwayOperationsProps) => {
  const [monitoredStations, setMonitoredStations] = useState([
    { id: 1, name: 'New Delhi Junction', code: 'NDLS', priority: 'high' },
    { id: 2, name: 'Mumbai Central', code: 'CSTM', priority: 'high' },
    { id: 3, name: 'Chennai Central', code: 'MAS', priority: 'medium' },
    { id: 4, name: 'Kolkata', code: 'KOAA', priority: 'medium' }
  ]);

  const [newStation, setNewStation] = useState({ name: '', code: '', priority: 'medium' });

  const [trainPriorities, setTrainPriorities] = useState({
    express: 1,
    passenger: 2,
    freight: 3,
    autoReorder: true
  });

  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'Station Manager', phone: '+91-11-23340000', role: 'Primary' },
    { id: 2, name: 'Control Room', phone: '+91-11-23340100', role: 'Secondary' },
    { id: 3, name: 'Emergency Services', phone: '112', role: 'Emergency' }
  ]);

  const [newContact, setNewContact] = useState({ name: '', phone: '', role: 'Secondary' });

  const [shiftNotes, setShiftNotes] = useState({
    currentNotes: 'All systems operational. Train 12951 delayed by 15 minutes due to signal issues.',
    autoHandover: true
  });

  const addStation = () => {
    if (newStation.name && newStation.code) {
      const station = {
        id: Date.now(),
        name: newStation.name,
        code: newStation.code.toUpperCase(),
        priority: newStation.priority
      };
      setMonitoredStations(prev => [...prev, station]);
      setNewStation({ name: '', code: '', priority: 'medium' });
      onSettingChange();
    }
  };

  const removeStation = (id: number) => {
    setMonitoredStations(prev => prev.filter(station => station.id !== id));
    onSettingChange();
  };

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact = {
        id: Date.now(),
        name: newContact.name,
        phone: newContact.phone,
        role: newContact.role
      };
      setEmergencyContacts(prev => [...prev, contact]);
      setNewContact({ name: '', phone: '', role: 'Secondary' });
      onSettingChange();
    }
  };

  const removeContact = (id: number) => {
    setEmergencyContacts(prev => prev.filter(contact => contact.id !== id));
    onSettingChange();
  };

  const handlePriorityChange = (field: string, value: any) => {
    setTrainPriorities(prev => ({ ...prev, [field]: value }));
    onSettingChange();
  };

  const handleShiftNotesChange = (field: string, value: any) => {
    setShiftNotes(prev => ({ ...prev, [field]: value }));
    onSettingChange();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-status-delayed text-white';
      case 'medium': return 'bg-status-warning text-black';
      case 'low': return 'bg-status-ontime text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Station Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Station Management
          </CardTitle>
          <CardDescription>
            Add or remove stations from your monitoring scope
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {monitoredStations.map((station) => (
              <div key={station.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">{station.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">({station.code})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(station.priority)}>{station.priority}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStation(station.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="grid grid-cols-4 gap-3">
            <Input
              placeholder="Station name"
              value={newStation.name}
              onChange={(e) => setNewStation(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Code"
              value={newStation.code}
              onChange={(e) => setNewStation(prev => ({ ...prev, code: e.target.value }))}
            />
            <Select
              value={newStation.priority}
              onValueChange={(value) => setNewStation(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addStation}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Train Priorities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" />
            Train Priorities
          </CardTitle>
          <CardDescription>
            Set priority levels for different train types
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto-reorder by priority</Label>
              <p className="text-xs text-muted-foreground">
                Automatically arrange trains by priority level
              </p>
            </div>
            <Switch
              checked={trainPriorities.autoReorder}
              onCheckedChange={(checked) => handlePriorityChange('autoReorder', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Train className="h-4 w-4 text-primary" />
                <span>Express Trains</span>
              </div>
              <Badge variant="outline">Priority {trainPriorities.express}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Train className="h-4 w-4 text-muted-foreground" />
                <span>Passenger Trains</span>
              </div>
              <Badge variant="outline">Priority {trainPriorities.passenger}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Train className="h-4 w-4 text-orange-500" />
                <span>Freight Trains</span>
              </div>
              <Badge variant="outline">Priority {trainPriorities.freight}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Protocols */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Emergency Protocols
          </CardTitle>
          <CardDescription>
            Configure emergency contact lists and escalation procedures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">{contact.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{contact.role}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContact(contact.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="grid grid-cols-4 gap-3">
            <Input
              placeholder="Contact name"
              value={newContact.name}
              onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Phone number"
              value={newContact.phone}
              onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
            />
            <Select
              value={newContact.role}
              onValueChange={(value) => setNewContact(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Primary">Primary</SelectItem>
                <SelectItem value="Secondary">Secondary</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addContact}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shift Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Shift Management
          </CardTitle>
          <CardDescription>
            Manage handover notes and shift schedules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto Handover</Label>
              <p className="text-xs text-muted-foreground">
                Automatically generate handover reports
              </p>
            </div>
            <Switch
              checked={shiftNotes.autoHandover}
              onCheckedChange={(checked) => handleShiftNotesChange('autoHandover', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Current Shift Notes</Label>
            <Textarea
              placeholder="Enter shift notes and important information for handover..."
              value={shiftNotes.currentNotes}
              onChange={(e) => handleShiftNotesChange('currentNotes', e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground">Current Controller</div>
              <div className="font-medium">Rajesh Kumar</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground">Shift</div>
              <div className="font-medium">06:00 - 14:00</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground">Next Controller</div>
              <div className="font-medium">Priya Sharma</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RailwayOperations;