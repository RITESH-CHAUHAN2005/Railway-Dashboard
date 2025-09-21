export interface TrainData {
  id: string;
  number: string;
  name: string;
  currentStation: string;
  nextStation: string;
  status: 'ontime' | 'delayed' | 'warning';
  delay: number;
  eta: string;
  speed: number;
  distance: number;
  route: string;
  platform?: string;
}

export const mockTrains: TrainData[] = [
  {
    id: '1',
    number: '12301',
    name: 'Rajdhani Express',
    currentStation: 'Mumbai Central',
    nextStation: 'Vadodara Junction',
    status: 'ontime',
    delay: 0,
    eta: '15:45',
    speed: 95,
    distance: 45.2,
    route: 'Mumbai - New Delhi',
    platform: '3'
  },
  {
    id: '2',
    number: '12951',
    name: 'Mumbai Rajdhani',
    currentStation: 'Borivali',
    nextStation: 'Vapi',
    status: 'delayed',
    delay: 25,
    eta: '16:10',
    speed: 78,
    distance: 28.7,
    route: 'Mumbai - New Delhi',
    platform: '5'
  },
  {
    id: '3',
    number: '12009',
    name: 'Shatabdi Express',
    currentStation: 'Kalyan Junction',
    nextStation: 'Lonavala',
    status: 'ontime',
    delay: 2,
    eta: '14:30',
    speed: 120,
    distance: 32.1,
    route: 'Mumbai - Pune',
    platform: '2'
  },
  {
    id: '4',
    number: '19216',
    name: 'Saurashtra Express',
    currentStation: 'Dadar Central',
    nextStation: 'Andheri',
    status: 'warning',
    delay: 8,
    eta: '15:22',
    speed: 45,
    distance: 12.5,
    route: 'Mumbai - Ahmedabad',
    platform: '7'
  },
  {
    id: '5',
    number: '10103',
    name: 'Mandovi Express',
    currentStation: 'Thane',
    nextStation: 'Dombivli',
    status: 'delayed',
    delay: 45,
    eta: '16:45',
    speed: 35,
    distance: 8.9,
    route: 'Mumbai - Madgaon',
    platform: '1'
  },
  {
    id: '6',
    number: '16345',
    name: 'Netravati Express',
    currentStation: 'Kurla',
    nextStation: 'Ghatkopar',
    status: 'ontime',
    delay: 0,
    eta: '14:55',
    speed: 85,
    distance: 6.2,
    route: 'Mumbai - Mangalore',
    platform: '4'
  }
];

export const getTrainsByStatus = (status: 'ontime' | 'delayed' | 'warning') => {
  return mockTrains.filter(train => train.status === status);
};

export const getDelayedTrains = () => {
  return mockTrains.filter(train => train.delay > 0);
};

export const getTrainById = (id: string) => {
  return mockTrains.find(train => train.id === id);
};