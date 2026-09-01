import { HealthcareResource } from '../types';

export const initialResources: HealthcareResource[] = [
  {
    id: 'RES-101',
    name: 'ICU Bed 04 (Cardiac)',
    type: 'ICU',
    location: 'Building C, ICU Room 104',
    status: 'Occupied',
    assignedTo: 'Patient #8849 (Cardiac)',
    lastMaintenance: '2026-08-15',
    notes: 'Ventilator & ECG monitor attached'
  },
  {
    id: 'RES-102',
    name: 'Operation Theatre 01',
    type: 'Operation Theatre',
    location: 'Surgical Suite, 2nd Floor',
    status: 'Occupied',
    assignedTo: 'Dr. Marcus Vance (Trauma)',
    lastMaintenance: '2026-08-28',
    notes: 'Occupied for emergency laprascopy'
  },
  {
    id: 'RES-103',
    name: 'Operation Theatre 03',
    type: 'Operation Theatre',
    location: 'Surgical Suite, 2nd Floor',
    status: 'Available',
    lastMaintenance: '2026-08-30',
    notes: 'Sterilized and ready for orthopedic surgeries'
  },
  {
    id: 'RES-104',
    name: 'High-Field MRI Scanner 3T',
    type: 'Medical Equipment',
    location: 'Radiology Dept, B1 Floor',
    status: 'Maintenance',
    assignedTo: 'Siemens Healthineers Tech',
    lastMaintenance: '2026-08-31',
    notes: 'Scheduled magnet coil calibration'
  },
  {
    id: 'RES-105',
    name: 'Pediatric Bed 12',
    type: 'Hospital Bed',
    location: 'Building B, Room 212',
    status: 'Available',
    lastMaintenance: '2026-08-25',
    notes: 'Sanitized post-discharge'
  },
  {
    id: 'RES-106',
    name: 'Emergency Resuscitation Bay 02',
    type: 'Emergency Unit',
    location: 'Emergency Department',
    status: 'Available',
    lastMaintenance: '2026-08-30',
    notes: 'Fully stocked crash cart & defibrillator'
  },
  {
    id: 'RES-107',
    name: 'Portable Ultrasound Machine U-2',
    type: 'Medical Equipment',
    location: 'Cardiology Ward 3',
    status: 'Available',
    lastMaintenance: '2026-08-20',
    notes: 'Battery charged 100%'
  },
  {
    id: 'RES-108',
    name: 'General Ward Bed W-208',
    type: 'Ward',
    location: 'Building A, 4th Floor',
    status: 'Occupied',
    assignedTo: 'Patient #9120',
    lastMaintenance: '2026-08-10'
  }
];
