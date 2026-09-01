import { DashboardMetrics } from '../types';

export const mockDashboardMetrics: DashboardMetrics = {
  totalStaff: 172,
  doctors: 48,
  nurses: 94,
  departments: 6,
  availableResources: 28,
  pendingLeaves: 5,
  activeShifts: 34
};

export const workloadData = [
  { name: 'Mon', Doctors: 36, Nurses: 68, Emergency: 12 },
  { name: 'Tue', Doctors: 40, Nurses: 72, Emergency: 14 },
  { name: 'Wed', Doctors: 38, Nurses: 70, Emergency: 16 },
  { name: 'Thu', Doctors: 42, Nurses: 75, Emergency: 18 },
  { name: 'Fri', Doctors: 44, Nurses: 80, Emergency: 22 },
  { name: 'Sat', Doctors: 30, Nurses: 55, Emergency: 25 },
  { name: 'Sun', Doctors: 28, Nurses: 50, Emergency: 20 },
];

export const departmentStaffingData = [
  { name: 'Cardiology', Staff: 24, Optimal: 25 },
  { name: 'Emergency', Staff: 42, Optimal: 40 },
  { name: 'Pediatrics', Staff: 18, Optimal: 20 },
  { name: 'Neurology', Staff: 16, Optimal: 15 },
  { name: 'ICU', Staff: 35, Optimal: 36 },
  { name: 'Orthopedics', Staff: 15, Optimal: 18 },
];

export const resourceUtilizationData = [
  { name: 'ICU Beds', Occupied: 36, Total: 40, percentage: 90 },
  { name: 'Operation Theatres', Occupied: 3, Total: 5, percentage: 60 },
  { name: 'General Beds', Occupied: 95, Total: 120, percentage: 79 },
  { name: 'Scanners/Equipment', Occupied: 14, Total: 18, percentage: 77 },
];

export const shiftDistributionData = [
  { name: 'Morning', value: 65, color: '#2563eb' },
  { name: 'Afternoon', value: 45, color: '#0d9488' },
  { name: 'Night', value: 30, color: '#4f46e5' },
  { name: 'On-Call', value: 15, color: '#d97706' },
];
