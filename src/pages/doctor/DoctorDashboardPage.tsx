import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockAppointments, mockDoctors } from '../../data';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';

export const DoctorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);

  // Doctor stats & records
  const todayAppointments = mockAppointments.map((apt) => ({
    ...apt,
    patientName: apt.patientName || 'Rahul Sharma',
  })).filter(
    (apt) => apt.status === 'CONFIRMED' || apt.status === 'PENDING'
  );
  const completedToday = mockAppointments.filter((apt) => apt.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-2">
            <Stethoscope className="w-3.5 h-3.5" /> Doctor Clinical Portal
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.name || 'Dr. Sarah Jenkins'}</h1>
          <p className="text-xs text-blue-100 mt-1">
            {user?.specialization || 'Senior Cardiologist'} &bull; {user?.departmentName || 'Cardiology Department'}
          </p>
        </div>

        {/* Availability Toggle */}
        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/20 flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-semibold block">On-Duty Availability</span>
            <span className="text-[11px] text-blue-100">
              {isAvailable ? 'Receiving Patient Consultations' : 'Unavailable / On Break'}
            </span>
          </div>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
              isAvailable ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isAvailable ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Today's Patients</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{todayAppointments.length + completedToday.length}</h3>
            <p className="text-[11px] text-blue-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Scheduled Consultations
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Consultations Done</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{completedToday.length}</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Completed today</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Upcoming Shift</p>
            <h3 className="text-base font-bold text-slate-900 mt-1">Morning Shift</h3>
            <p className="text-[11px] text-slate-500 mt-1">08:00 AM - 04:00 PM</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending Reports</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">3</h3>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Requires digital sign-off</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Appointments & Shift Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Today's Consultation Schedule</h3>
            </div>
            <Link to="/doctor/appointments" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl border border-blue-100 shrink-0">
                    {apt.time}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Patient: {apt.patientName}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {apt.appointmentType} &bull; {apt.location || 'Room 204'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={apt.status} size="sm" />
                  <Link to="/doctor/appointments">
                    <Button variant="outline" size="sm" className="text-xs">
                      Start Consultation
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Availability & Quick Action Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Doctor Availability Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Department</span>
                <span className="font-bold text-slate-900">{user?.departmentName || 'Cardiology'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">On-Duty Doctor</span>
                <span className="font-semibold text-slate-800">{user?.name || 'Dr. Sarah Jenkins'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Max Daily Patients</span>
                <span className="font-bold text-blue-600">15 Patients</span>
              </div>
            </div>

            <Link to="/availability">
              <Button variant="primary" size="sm" className="w-full mt-2">
                Update Schedule & Slots
              </Button>
            </Link>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Clinical Reminder
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Grand Rounds meeting scheduled today at 03:00 PM in Conference Room B.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
