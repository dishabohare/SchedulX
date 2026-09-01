import { AvailabilitySlot } from '../types';

export const initialAvailability: AvailabilitySlot[] = [
  { id: 'AV-1', dayOfWeek: 'Monday', startTime: '09:00 AM', endTime: '05:00 PM', isAvailable: true },
  { id: 'AV-2', dayOfWeek: 'Tuesday', startTime: '09:00 AM', endTime: '05:00 PM', isAvailable: true },
  { id: 'AV-3', dayOfWeek: 'Wednesday', startTime: '09:00 AM', endTime: '05:00 PM', isAvailable: false },
  { id: 'AV-4', dayOfWeek: 'Thursday', startTime: '10:00 AM', endTime: '04:00 PM', isAvailable: true },
  { id: 'AV-5', dayOfWeek: 'Friday', startTime: '09:00 AM', endTime: '01:00 PM', isAvailable: true },
  { id: 'AV-6', dayOfWeek: 'Saturday', startTime: '—', endTime: '—', isAvailable: false },
  { id: 'AV-7', dayOfWeek: 'Sunday', startTime: '—', endTime: '—', isAvailable: false }
];
