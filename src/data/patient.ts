import { Patient } from '../types';

export const mockPatient: Patient = {
  id: 'PAT-2026-8842',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 98765 43210',
  dob: '1992-05-14',
  gender: 'Male',
  bloodGroup: 'O+',
  emergencyContact: {
    name: 'Priya Sharma',
    relationship: 'Spouse',
    phone: '+91 98765 43211',
  },
  address: '42 MG Road, Sector 4, Bangalore, Karnataka',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  treatmentStatus: 'Under Active Care',
  activeTreatmentCount: 1,
  totalVisits: 8,
  completedTreatments: 6,
};
