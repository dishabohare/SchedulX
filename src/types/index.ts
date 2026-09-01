export type UserRole = 'ADMIN' | 'DOCTOR' | 'STAFF' | 'PATIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  departmentId?: string;
  departmentName?: string;
  specialization?: string;
  phone?: string;
  employeeId?: string;
  accessLevel?: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export type StaffStatus = 'AVAILABLE' | 'ON_DUTY' | 'ON_LEAVE' | 'OFF_DUTY';


export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  departmentId: string;
  departmentName: string;
  specialization: string;
  status: StaffStatus;
  avatar: string;
  shiftCount: number;
}

export type DepartmentStatus = 'ACTIVE' | 'INACTIVE';

export interface Department {
  id: string;
  name: string;
  description: string;
  location: string;
  status: DepartmentStatus;
  staffCount: number;
  headDoctorName: string;
  bedCapacity: number;
  occupiedBeds: number;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LeaveType = 'Annual' | 'Sick' | 'Maternity' | 'Emergency' | 'Unpaid';

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: UserRole;
  departmentName: string;
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewComment?: string;
}

export type ResourceType = 
  | 'ICU' 
  | 'Ward' 
  | 'Operation Theatre' 
  | 'Hospital Bed' 
  | 'Medical Equipment' 
  | 'Emergency Unit';

export type ResourceStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Unavailable';

export interface HealthcareResource {
  id: string;
  name: string;
  type: ResourceType;
  location: string;
  status: ResourceStatus;
  assignedTo?: string;
  lastMaintenance?: string;
  notes?: string;
}

export type ShiftType = 'Morning' | 'Afternoon' | 'Night' | 'On-Call';
export type ScheduleStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'SWAP_REQUESTED';

export interface ScheduleItem {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: UserRole;
  departmentId: string;
  departmentName: string;
  resourceId?: string;
  resourceName?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm AM/PM
  endTime: string;
  shiftType: ShiftType;
  status: ScheduleStatus;
}

export type NotificationType = 'Schedule' | 'Leave' | 'Emergency' | 'System';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  link?: string;
  userId?: string;
  role?: UserRole;
}

export interface ScheduleConflict {
  id: string;
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  department: string;
  date: string;
}

export interface DashboardMetrics {
  totalStaff: number;
  doctors: number;
  nurses: number;
  departments: number;
  availableResources: number;
  pendingLeaves: number;
  activeShifts: number;
}

// ==========================================
// PATIENT PORTAL TYPES
// ==========================================

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  address: string;
  avatar: string;
  treatmentStatus: string;
  activeTreatmentCount: number;
  totalVisits: number;
  completedTreatments: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  departmentId: string;
  departmentName: string;
  experience: string;
  avatar: string;
  rating: number;
  availabilityStatus: 'Available Today' | 'Available Tomorrow' | 'Next Week' | 'Unavailable';
  nextAvailableSlot: string;
  consultationFee: number;
  bio: string;
  education: string;
  availableSlots: string[];
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface PatientAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
  doctorSpecialization: string;
  departmentName: string;
  patientId?: string;
  patientName?: string;
  staffId?: string;
  date: string;
  time: string;
  appointmentType: 'General Consultation' | 'Follow-up' | 'Diagnostic Visit' | 'Routine Checkup' | 'Emergency';
  status: AppointmentStatus;
  location: string;
  notes?: string;
  fee?: number;
}

export interface MedicalRecord {
  id: string;
  date: string;
  doctorId: string;
  doctorName: string;
  departmentName: string;
  visitType: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  reportUrl?: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  prescriptionId: string;
  date: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  diagnosis: string;
  medicines: MedicineItem[];
  notes?: string;
}

export type DocumentCategory = 
  | 'Prescriptions'
  | 'Lab Reports'
  | 'Imaging Reports'
  | 'Discharge Summaries'
  | 'Medical Records'
  | 'Insurance Documents'
  | 'Claim Documents';

export interface MedicalDocument {
  id: string;
  name: string;
  type: DocumentCategory;
  date: string;
  doctorOrDepartment: string;
  status: 'Available' | 'Verified' | 'Pending' | 'Archived';
  fileSize?: string;
  previewContent?: string;
}

export interface InsurancePolicy {
  provider: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  policyNumber: string;
  coverage: number;
  validUntil: string;
  holderName: string;
  groupNumber: string;
}

export interface TreatmentCostItem {
  category: string;
  amount: number;
  description?: string;
}

export interface InsuranceClaim {
  id: string;
  claimId: string;
  treatmentCost: number;
  claimSubmitted: number;
  approvedAmount: number;
  patientPayable: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  year: string;
  date: string;
  type: string;
  breakdown: TreatmentCostItem[];
}

