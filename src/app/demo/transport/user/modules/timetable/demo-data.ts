export interface TimetableTrip {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  type: 'bus' | 'minibus' | 'trolleybus' | 'tram';
  typeLabel: string;
  icon: string;
  number: string;
  carrier: string;
  status: 'ontime' | 'delayed' | 'cancelled';
  delay?: string;
  stops: number;
  freeSeats: number;
}

export const timetableDemoData: TimetableTrip[] = [
  {
    id: '1',
    from: 'Москва',
    to: 'Санкт-Петербург',
    departureTime: '08:00',
    arrivalTime: '16:30',
    duration: '8ч 30м',
    price: 2500,
    type: 'bus',
    typeLabel: 'Автобус',
    icon: '🚌',
    number: '101А',
    carrier: 'Газпромтранс',
    status: 'ontime',
    stops: 3,
    freeSeats: 12
  },
  {
    id: '2',
    from: 'Москва',
    to: 'Санкт-Петербург',
    departureTime: '10:30',
    arrivalTime: '19:15',
    duration: '8ч 45м',
    price: 2100,
    type: 'minibus',
    typeLabel: 'Маршрутка',
    icon: '🚐',
    number: '202Б',
    carrier: 'Экспресс-Линии',
    status: 'delayed',
    delay: '15 мин',
    stops: 2,
    freeSeats: 6
  },
  {
    id: '3',
    from: 'Москва',
    to: 'Санкт-Петербург',
    departureTime: '14:00',
    arrivalTime: '22:45',
    duration: '8ч 45м',
    price: 1800,
    type: 'bus',
    typeLabel: 'Автобус',
    icon: '🚌',
    number: '303В',
    carrier: 'Северный путь',
    status: 'ontime',
    stops: 5,
    freeSeats: 24
  },
  {
    id: '4',
    from: 'Москва',
    to: 'Санкт-Петербург',
    departureTime: '22:00',
    arrivalTime: '06:30+1',
    duration: '8ч 30м',
    price: 2900,
    type: 'bus',
    typeLabel: 'Автобус',
    icon: '🚌',
    number: '404Г',
    carrier: 'Люкс-Транс',
    status: 'cancelled',
    stops: 2,
    freeSeats: 0
  }
];