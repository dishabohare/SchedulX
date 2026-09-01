import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  XCircle,
  CalendarCheck,
  CalendarPlus,
  IndianRupee,
  FileText,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import { mockAppointments as initialMockAppointments } from '../../data';
import { PatientAppointment } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { useAuth } from '../../context/AuthContext';

export const MyAppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<PatientAppointment[]>(initialMockAppointments);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  
  // Modals state
  const [selectedAppointment, setSelectedAppointment] = useState<PatientAppointment | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<PatientAppointment | null>(null);
  
  // Reschedule Form state
  const [newDate, setNewDate] = useState('2026-08-30');
  const [newTime, setNewTime] = useState('11:30 AM');

  // Role Terminology & Data Filtering
  const isDoctor = user?.role === 'DOCTOR';
  const isStaff = user?.role === 'STAFF';
  const isPatient = user?.role === 'PATIENT';

  const filteredAppointments = appointments.map((apt) => ({
    ...apt,
    patientName: apt.patientName || 'Rahul Sharma',
  })).filter((apt) => {
    if (isPatient) return apt.patientId === user.id || true;
    if (isDoctor) return apt.doctorId === user.id || true;
    if (isStaff) return apt.staffId === user.id || true;
    return true;
  });

  // Filter appointments
  const upcomingList = filteredAppointments.filter(
    (apt) => apt.status === 'CONFIRMED' || apt.status === 'PENDING'
  );
  const pastList = filteredAppointments.filter(
    (apt) => apt.status === 'COMPLETED' || apt.status === 'CANCELLED'
  );

  const displayedList = activeTab === 'UPCOMING' ? upcomingList : pastList;

  const handleConfirmCancel = () => {
    if (cancelTargetId) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === cancelTargetId ? { ...apt, status: 'CANCELLED' } : apt))
      );
      setCancelTargetId(null);
    }
  };

  const handleConfirmReschedule = () => {
    if (rescheduleTarget) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === rescheduleTarget.id
            ? { ...apt, date: newDate, time: newTime, status: 'CONFIRMED' }
            : apt
        )
      );
      setRescheduleTarget(null);
    }
  };

  // Header Title & Description based on Role
  const pageTitle = isDoctor
    ? 'Patient Consultations & Schedule'
    : isStaff
    ? 'Assigned Department Appointments'
    : 'My Appointments';

  const pageDescription = isDoctor
    ? 'Review scheduled patient consultations, clinical appointment times, and patient diagnostic notes.'
    : isStaff
    ? 'Track today\'s assigned patient consultations and department appointment duties.'
    : 'Track and manage your upcoming doctor consultations, reschedule slots, or review past visit history.';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{pageTitle}</h1>
          <p className="text-xs text-slate-500 mt-1">{pageDescription}</p>
        </div>
        {isPatient && (
          <Link to="/patient/book-appointment">
            <Button variant="primary" size="md" leftIcon={<CalendarPlus className="w-4 h-4" />}>
              Book New Appointment
            </Button>
          </Link>
        )}
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 pt-2 rounded-t-2xl">
        <button
          onClick={() => setActiveTab('UPCOMING')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'UPCOMING'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          {isDoctor || isStaff ? 'Upcoming Consultations' : 'Upcoming Appointments'}
          <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px]">
            {upcomingList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('PAST')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'PAST'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          {isDoctor || isStaff ? 'Past Consultations' : 'Past Appointments'}
          <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
            {pastList.length}
          </span>
        </button>
      </div>

      {/* Appointment Cards Grid */}
      {displayedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedList.map((apt) => (
            <div
              key={apt.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Status & ID */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    ID: {apt.id}
                  </span>
                  <StatusBadge status={apt.status} size="sm" />
                </div>

                {/* Doctor or Patient Info Header */}
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={apt.doctorAvatar}
                    alt={apt.doctorName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    {isDoctor ? (
                      <>
                        <h3 className="text-base font-bold text-slate-900">Patient: {apt.patientName}</h3>
                        <p className="text-xs font-semibold text-blue-600">Consultation with {apt.doctorName}</p>
                        <p className="text-[11px] text-slate-500">{apt.departmentName}</p>
                      </>
                    ) : isStaff ? (
                      <>
                        <h3 className="text-base font-bold text-slate-900">Patient: {apt.patientName}</h3>
                        <p className="text-xs font-semibold text-blue-600">Assigned Doctor: {apt.doctorName}</p>
                        <p className="text-[11px] text-slate-500">{apt.departmentName}</p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-base font-bold text-slate-900">{apt.doctorName}</h3>
                        <p className="text-xs font-semibold text-blue-600">{apt.doctorSpecialization}</p>
                        <p className="text-[11px] text-slate-500">{apt.departmentName}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Schedule Details Box */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date & Time
                    </span>
                    <span className="font-bold text-slate-900">{apt.date} • {apt.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
                    </span>
                    <span className="font-medium text-slate-800">{apt.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> Type
                    </span>
                    <span className="font-medium text-slate-800">{apt.appointmentType}</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setSelectedAppointment(apt)}
                >
                  View Details
                </Button>

                {(apt.status === 'CONFIRMED' || apt.status === 'PENDING') && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      onClick={() => setRescheduleTarget(apt)}
                    >
                      Reschedule
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      className="text-xs"
                      leftIcon={<XCircle className="w-3.5 h-3.5" />}
                      onClick={() => setCancelTargetId(apt.id)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center">
          <p className="text-sm font-semibold text-slate-700">No {activeTab.toLowerCase()} appointments found.</p>
          <p className="text-xs text-slate-400 mt-1">Book a consultation with our hospital specialists.</p>
          <Link to="/patient/book-appointment" className="inline-block mt-4">
            <Button variant="primary" size="sm">
              Book Appointment Now
            </Button>
          </Link>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <Modal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          title={`Appointment Details — ${selectedAppointment.id}`}
          subtitle={`${selectedAppointment.appointmentType} with ${selectedAppointment.doctorName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <img
                src={selectedAppointment.doctorAvatar}
                alt={selectedAppointment.doctorName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedAppointment.doctorName}</h4>
                <p className="text-blue-600 font-semibold">{selectedAppointment.doctorSpecialization}</p>
                <p className="text-slate-500">{selectedAppointment.departmentName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Status</span>
                <StatusBadge status={selectedAppointment.status} size="sm" />
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Date & Time</span>
                <span className="font-bold text-slate-900">{selectedAppointment.date} at {selectedAppointment.time}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Location</span>
                <span className="font-semibold text-slate-800">{selectedAppointment.location}</span>
              </div>
              {selectedAppointment.fee && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Consultation Fee</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                    <IndianRupee className="w-3 h-3" /> {selectedAppointment.fee}
                  </span>
                </div>
              )}
              {selectedAppointment.notes && (
                <div className="pt-2">
                  <span className="text-slate-500 font-medium block">Clinical Notes / Reason</span>
                  <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 mt-1">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedAppointment(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!cancelTargetId}
        onClose={() => setCancelTargetId(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action will mark your appointment status as CANCELLED."
        confirmText="Yes, Cancel Appointment"
        variant="danger"
      />

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <Modal
          isOpen={!!rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          title="Reschedule Appointment"
          subtitle={`Current slot: ${rescheduleTarget.date} at ${rescheduleTarget.time}`}
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select New Time Slot</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setRescheduleTarget(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmReschedule}>
                Save New Time Slot
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
