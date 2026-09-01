import { ScheduleItem, ScheduleConflict } from '../types';

export const initialSchedules: ScheduleItem[] = [
  {
    id: 'SCH-501',
    staffId: 'USR-DOC-01',
    staffName: 'Dr. Sarah Jenkins',
    staffRole: 'DOCTOR',
    departmentId: 'DEP-01',
    departmentName: 'Cardiology',
    resourceId: 'RES-103',
    resourceName: 'Operation Theatre 03',
    date: '2026-08-31',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    shiftType: 'Morning',
    status: 'SCHEDULED'
  },
  {
    id: 'SCH-502',
    staffId: 'STF-102',
    staffName: 'Dr. Marcus Vance',
    staffRole: 'DOCTOR',
    departmentId: 'DEP-02',
    departmentName: 'Emergency Unit',
    resourceId: 'RES-102',
    resourceName: 'Operation Theatre 01',
    date: '2026-08-31',
    startTime: '04:00 PM',
    endTime: '12:00 AM',
    shiftType: 'Afternoon',
    status: 'SCHEDULED'
  },
  {
    id: 'SCH-503',
    staffId: 'USR-STAFF-01',
    staffName: 'Anita Verma, RN',
    staffRole: 'STAFF',
    departmentId: 'DEP-02',
    departmentName: 'Emergency Unit',
    resourceId: 'RES-106',
    resourceName: 'Emergency Resuscitation Bay 02',
    date: '2026-08-31',
    startTime: '07:00 AM',
    endTime: '03:00 PM',
    shiftType: 'Morning',
    status: 'SCHEDULED'
  },
  {
    id: 'SCH-504',
    staffId: 'STF-105',
    staffName: 'James Thornton, BSN',
    staffRole: 'STAFF',
    departmentId: 'DEP-01',
    departmentName: 'Cardiology',
    resourceId: 'RES-101',
    resourceName: 'ICU Bed 04 (Cardiac)',
    date: '2026-08-31',
    startTime: '12:00 AM',
    endTime: '08:00 AM',
    shiftType: 'Night',
    status: 'COMPLETED'
  },
  {
    id: 'SCH-505',
    staffId: 'STF-107',
    staffName: 'Priya Sharma, RN',
    staffRole: 'STAFF',
    departmentId: 'DEP-02',
    departmentName: 'Emergency Unit',
    resourceId: 'RES-101',
    resourceName: 'Triage Desk 01',
    date: '2026-08-31',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    shiftType: 'Morning',
    status: 'SCHEDULED'
  },
  {
    id: 'SCH-506',
    staffId: 'STF-106',
    staffName: 'Dr. Robert Chen',
    staffRole: 'DOCTOR',
    departmentId: 'DEP-04',
    departmentName: 'Neurology',
    date: '2026-09-01',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    shiftType: 'Morning',
    status: 'SCHEDULED'
  },
  {
    id: 'SCH-507',
    staffId: 'USR-DOC-01',
    staffName: 'Dr. Sarah Jenkins',
    staffRole: 'DOCTOR',
    departmentId: 'DEP-01',
    departmentName: 'Cardiology',
    date: '2026-09-01',
    startTime: '04:00 PM',
    endTime: '12:00 AM',
    shiftType: 'Afternoon',
    status: 'SCHEDULED'
  },
  {
    id: 'SCH-508',
    staffId: 'USR-STAFF-01',
    staffName: 'Anita Verma, RN',
    staffRole: 'STAFF',
    departmentId: 'DEP-02',
    departmentName: 'Emergency Unit',
    date: '2026-09-01',
    startTime: '07:00 AM',
    endTime: '03:00 PM',
    shiftType: 'Morning',
    status: 'SCHEDULED'
  },
  {
    id: 'SCH-509',
    staffId: 'STF-103',
    staffName: 'Elena Rostova, RN',
    staffRole: 'STAFF',
    departmentId: 'DEP-02',
    departmentName: 'Emergency Unit',
    date: '2026-09-02',
    startTime: '12:00 AM',
    endTime: '08:00 AM',
    shiftType: 'Night',
    status: 'SCHEDULED'
  }
];

export const sampleConflicts: ScheduleConflict[] = [
  {
    id: 'CONF-01',
    title: 'Double Booking Warning',
    description: 'Dr. Marcus Vance scheduled in ER & OT 01 simultaneously today at 04:00 PM.',
    severity: 'High',
    department: 'Emergency Medicine',
    date: '2026-08-31'
  },
  {
    id: 'CONF-02',
    title: 'Understaffed Night Shift',
    description: 'ICU Department requires at least 4 RNs for Night Shift (Currently 2 assigned).',
    severity: 'Medium',
    department: 'Intensive Care Unit (ICU)',
    date: '2026-09-01'
  },
  {
    id: 'CONF-03',
    title: 'Max Weekly Hours Exceeded',
    description: 'Elena Rostova, RN reached 48 weekly hours quota.',
    severity: 'Low',
    department: 'Emergency Medicine',
    date: '2026-09-02'
  }
];
