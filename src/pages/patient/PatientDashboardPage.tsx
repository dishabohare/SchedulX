import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  Calendar,
  Activity,
  ShieldCheck,
  Clock,
  ArrowRight,
  Stethoscope,
  FileText,
  CheckCircle2,
  CalendarPlus,
} from 'lucide-react';
import {
  mockPatient,
  mockAppointments,
  mockInsurancePolicy,
  currentClaim,
  mockMedicalHistory,
} from '../../data';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const PatientDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const patientName = user?.name || mockPatient.name;
  const patientId = user?.id || mockPatient.id;

  const upcomingAppointment = mockAppointments.find((apt) => apt.status === 'CONFIRMED' || apt.status === 'PENDING');
  const recentAppointment = mockAppointments.find((apt) => apt.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold backdrop-blur-xs mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              Patient ID: {patientId}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good Morning, {patientName}
            </h1>
            <p className="text-sm text-blue-100 mt-1 max-w-xl">
              Welcome to your personal health portal. Review your upcoming appointments, medical history, active prescriptions, and insurance coverage.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/patient/book-appointment">
              <Button
                variant="secondary"
                size="md"
                className="bg-white text-blue-700 hover:bg-blue-50 border-none font-semibold shadow-xs"
                leftIcon={<CalendarPlus className="w-4 h-4 text-blue-600" />}
              >
                Book Appointment
              </Button>
            </Link>
            <Link to="/patient/doctors">
              <Button
                variant="outline"
                size="md"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-medium"
                leftIcon={<Stethoscope className="w-4 h-4" />}
              >
                Find Doctor
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Visits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Visits</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{mockPatient.totalVisits}</h3>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Across all hospital departments</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Treatments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Completed Treatments</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{mockPatient.completedTreatments}</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Fully Resolved
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Active Treatment */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Treatment</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{mockPatient.activeTreatmentCount}</h3>
            <p className="text-[11px] text-amber-600 font-medium mt-1">General Medicine Care Plan</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Insurance Overview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Insurance Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-slate-900">₹{mockInsurancePolicy.coverage.toLocaleString('en-IN')}</span>
              <StatusBadge status={mockInsurancePolicy.status} size="sm" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Claim: {currentClaim.status}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming & Recent Appointments + Insurance & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming & Recent Appointment Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointment Spotlight */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Upcoming Appointment</h3>
              </div>
              <Link to="/patient/appointments" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {upcomingAppointment ? (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={upcomingAppointment.doctorAvatar}
                    alt={upcomingAppointment.doctorName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">{upcomingAppointment.doctorName}</h4>
                      <StatusBadge status={upcomingAppointment.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{upcomingAppointment.departmentName}</p>
                    <p className="text-xs text-blue-700 font-semibold mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {upcomingAppointment.date} &bull; {upcomingAppointment.time}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
                  <Link to="/patient/appointments" className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No upcoming appointments scheduled.</p>
            )}
          </div>

          {/* Treatment Summary & Recent Appointment */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">Treatment Summary & Last Visit</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Total Visits</span>
                <p className="text-xl font-bold text-slate-900 mt-1">8</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Completed Treatments</span>
                <p className="text-xl font-bold text-emerald-600 mt-1">6</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Active Treatment</span>
                <p className="text-xl font-bold text-blue-600 mt-1">1</p>
              </div>
            </div>

            {recentAppointment && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Most Recent Visit</p>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{recentAppointment.appointmentType}</span>
                    <span className="text-slate-500"> with {recentAppointment.doctorName}</span>
                  </div>
                  <span className="text-slate-500 font-medium">{recentAppointment.date}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Insurance Highlight & Recent Activity Timeline */}
        <div className="space-y-6">
          {/* Insurance Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Insurance</h3>
              </div>
              <StatusBadge status={mockInsurancePolicy.status} size="sm" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Provider</span>
                <span className="font-semibold text-slate-900">{mockInsurancePolicy.provider}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Policy No.</span>
                <span className="font-semibold text-slate-900">{mockInsurancePolicy.policyNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Coverage Limit</span>
                <span className="font-bold text-emerald-600">₹{mockInsurancePolicy.coverage.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Current Claim ({currentClaim.claimId})</span>
                <StatusBadge status={currentClaim.status} size="sm" />
              </div>
            </div>

            <Link to="/patient/insurance" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View Claims & Breakdown
              </Button>
            </Link>
          </div>

          {/* Recent Medical Activity */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Recent Medical Activity</h3>
              </div>
              <Link to="/patient/medical-history" className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {mockMedicalHistory.slice(0, 3).map((item) => (
                <div key={item.id} className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">{item.date}</span>
                    <StatusBadge status="COMPLETED" size="sm" />
                  </div>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{item.visitType}</p>
                  <p className="text-[11px] text-slate-500">{item.doctorName} &bull; {item.departmentName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
