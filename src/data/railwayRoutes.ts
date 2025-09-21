export interface Station {
  id: string;
  name: string;
  code: string;
  coordinates: [number, number]; // [longitude, latitude]
  type: 'major' | 'junction' | 'terminal';
  state: string;
}

export interface RailwayRoute {
  id: string;
  name: string;
  type: 'express' | 'local' | 'freight';
  color: string;
  stations: Station[];
  coordinates: [number, number][]; // Route polyline coordinates
}

export interface LiveTrain {
  id: string;
  number: string;
  name: string;
  type: 'express' | 'local' | 'freight';
  status: 'ontime' | 'delayed' | 'approaching';
  currentPosition: [number, number];
  routeId: string;
  currentStation: string;
  nextStation: string;
  delay: number;
  speed: number;
  direction: 'up' | 'down';
  progress: number; // 0-100% along route
  eta: string;
  departureTime: string;
  arrivalTime: string;
}

// Major railway stations in India
export const majorStations: Station[] = [
  {
    id: 'ndls',
    name: 'New Delhi',
    code: 'NDLS',
    coordinates: [77.2167, 28.6434],
    type: 'terminal',
    state: 'Delhi'
  },
  {
    id: 'cstm',
    name: 'Mumbai Central',
    code: 'CSTM',
    coordinates: [72.8347, 19.0176],
    type: 'terminal',
    state: 'Maharashtra'
  },
  {
    id: 'msc',
    name: 'Chennai Central',
    code: 'MAS',
    coordinates: [80.2707, 13.0827],
    type: 'terminal',
    state: 'Tamil Nadu'
  },
  {
    id: 'koaa',
    name: 'Kolkata',
    code: 'KOAA',
    coordinates: [88.3639, 22.5726],
    type: 'terminal',
    state: 'West Bengal'
  },
  {
    id: 'jp',
    name: 'Jaipur Junction',
    code: 'JP',
    coordinates: [75.7873, 26.9124],
    type: 'junction',
    state: 'Rajasthan'
  },
  {
    id: 'gzb',
    name: 'Ghaziabad',
    code: 'GZB',
    coordinates: [77.4538, 28.6692],
    type: 'junction',
    state: 'Uttar Pradesh'
  },
  {
    id: 'bpl',
    name: 'Bhopal Junction',
    code: 'BPL',
    coordinates: [77.4126, 23.2599],
    type: 'junction',
    state: 'Madhya Pradesh'
  },
  {
    id: 'bza',
    name: 'Vijayawada Junction',
    code: 'BZA',
    coordinates: [80.6480, 16.5062],
    type: 'junction',
    state: 'Andhra Pradesh'
  }
];

// Railway routes with coordinates
export const railwayRoutes: RailwayRoute[] = [
  {
    id: 'delhi-mumbai',
    name: 'Delhi - Mumbai Route',
    type: 'express',
    color: '#3B82F6', // Blue for express routes
    stations: [
      majorStations.find(s => s.id === 'ndls')!,
      majorStations.find(s => s.id === 'jp')!,
      majorStations.find(s => s.id === 'bpl')!,
      majorStations.find(s => s.id === 'cstm')!
    ],
    coordinates: [
      [77.2167, 28.6434], // New Delhi
      [77.4538, 28.6692], // Ghaziabad
      [75.7873, 26.9124], // Jaipur
      [77.4126, 23.2599], // Bhopal
      [72.8347, 19.0176]  // Mumbai
    ]
  },
  {
    id: 'delhi-chennai',
    name: 'Delhi - Chennai Route',
    type: 'express',
    color: '#3B82F6',
    stations: [
      majorStations.find(s => s.id === 'ndls')!,
      majorStations.find(s => s.id === 'bpl')!,
      majorStations.find(s => s.id === 'bza')!,
      majorStations.find(s => s.id === 'msc')!
    ],
    coordinates: [
      [77.2167, 28.6434], // New Delhi
      [77.4126, 23.2599], // Bhopal
      [80.6480, 16.5062], // Vijayawada
      [80.2707, 13.0827]  // Chennai
    ]
  },
  {
    id: 'delhi-kolkata',
    name: 'Delhi - Kolkata Route',
    type: 'express',
    color: '#3B82F6',
    stations: [
      majorStations.find(s => s.id === 'ndls')!,
      majorStations.find(s => s.id === 'gzb')!,
      majorStations.find(s => s.id === 'koaa')!
    ],
    coordinates: [
      [77.2167, 28.6434], // New Delhi
      [77.4538, 28.6692], // Ghaziabad
      [83.3732, 23.8103], // Allahabad (intermediate)
      [88.3639, 22.5726]  // Kolkata
    ]
  }
];

// Live train positions - simulated real-time data
export const liveTrains: LiveTrain[] = [
  {
    id: 't1',
    number: '12951',
    name: 'Mumbai Rajdhani',
    type: 'express',
    status: 'delayed',
    currentPosition: [75.7873, 26.9124], // Near Jaipur
    routeId: 'delhi-mumbai',
    currentStation: 'Jaipur Junction',
    nextStation: 'Bhopal Junction',
    delay: 15,
    speed: 95,
    direction: 'down',
    progress: 35,
    eta: '14:30',
    departureTime: '16:55',
    arrivalTime: '08:35+1'
  },
  {
    id: 't2',
    number: '12002',
    name: 'Shatabdi Express',
    type: 'express',
    status: 'ontime',
    currentPosition: [77.4126, 23.2599], // Near Bhopal
    routeId: 'delhi-mumbai',
    currentStation: 'Bhopal Junction',
    nextStation: 'Mumbai Central',
    delay: 0,
    speed: 130,
    direction: 'down',
    progress: 65,
    eta: '15:45',
    departureTime: '06:00',
    arrivalTime: '14:05'
  },
  {
    id: 't3',
    number: '22691',
    name: 'Rajdhani Express',
    type: 'express',
    status: 'approaching',
    currentPosition: [80.6480, 16.5062], // Near Vijayawada
    routeId: 'delhi-chennai',
    currentStation: 'Vijayawada Junction',
    nextStation: 'Chennai Central',
    delay: 0,
    speed: 45,
    direction: 'down',
    progress: 85,
    eta: '16:20',
    departureTime: '20:05',
    arrivalTime: '11:30+1'
  },
  {
    id: 't4',
    number: '12615',
    name: 'Grand Trunk Express',
    type: 'express',
    status: 'delayed',
    currentPosition: [77.4538, 28.6692], // Near Ghaziabad
    routeId: 'delhi-kolkata',
    currentStation: 'Ghaziabad Junction',
    nextStation: 'Kolkata',
    delay: 45,
    speed: 65,
    direction: 'down',
    progress: 25,
    eta: '17:15',
    departureTime: '07:15',
    arrivalTime: '22:45+1'
  },
  {
    id: 't5',
    number: '12301',
    name: 'Howrah Rajdhani',
    type: 'express',
    status: 'ontime',
    currentPosition: [83.3732, 23.8103], // Mid-route to Kolkata
    routeId: 'delhi-kolkata',
    currentStation: 'Allahabad Junction',
    nextStation: 'Kolkata',
    delay: 0,
    speed: 120,
    direction: 'down',
    progress: 60,
    eta: '14:55',
    departureTime: '06:15',
    arrivalTime: '13:25'
  },
  {
    id: 't6',
    number: '12019',
    name: 'Bhopal Shatabdi',
    type: 'express',
    status: 'ontime',
    currentPosition: [72.8347, 19.0176], // At Mumbai
    routeId: 'delhi-mumbai',
    currentStation: 'Mumbai Central',
    nextStation: 'New Delhi',
    delay: 0,
    speed: 0,
    direction: 'up',
    progress: 100,
    eta: '15:30',
    departureTime: '06:50',
    arrivalTime: '12:15'
  }
];

export const getTrainsByRoute = (routeId: string) => {
  return liveTrains.filter(train => train.routeId === routeId);
};

export const getTrainsByStatus = (status: 'ontime' | 'delayed' | 'approaching') => {
  return liveTrains.filter(train => train.status === status);
};

export const getTrainsByType = (type: 'express' | 'local' | 'freight') => {
  return liveTrains.filter(train => train.type === type);
};