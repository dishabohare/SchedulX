import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  CalendarOff,
  Bell,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { initialSchedules, initialLeaves, sampleConflicts } from '../../data';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';

export const StaffDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const myShifts = initialSchedules.filter(
    (s) =>
      s.staffId === user?.id ||
      (user?.departmentName && s.departmentName.toLowerCase().includes(user.departmentName.toLowerCase()))
  );
  const myLeaves = initialLeaves.filter(
    (l) => l.staffId === user?.id || (user?.name && l.staffName === user.name)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-2">
            <UserCheck className="w-3.5 h-3.5" /> Staff Nursing & Operations Portal
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Hello, {user?.name || 'Anita Verma, RN'}</h1>
          <p className="text-xs text-emerald-100 mt-1">
            {user?.departmentName || 'Emergency & Inpatient Unit'} &bull; Active Staff Member
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/availability">
            <Button variant="secondary" size="sm" className="bg-white text-teal-800 hover:bg-emerald-50">
              Manage Availability
            </Button>
          </Link>
          <Link to="/my-leaves">
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20">
              Apply Leave
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Today's Shift</p>
            <h3 className="text-base font-bold text-slate-900 mt-1">Morning Shift</h3>
            <p className="text-[11px] text-teal-600 font-bold mt-1">07:00 AM - 03:00 PM</p>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Weekly Shifts</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">5 Shifts</h3>
            <p className="text-[11px] text-slate-500 mt-1">40 Hours assigned</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Leave Balance</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">14 Days</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Annual leave remaining</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CalendarOff className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Shift Swap Alerts</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">1 Request</h3>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Pending review</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: My Shifts & Leave Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's & Upcoming Shifts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">My Assigned Work Schedule</h3>
            </div>
            <Link to="/staff/schedule" className="text-xs text-teal-600 font-semibold hover:underline flex items-center gap-1">
              Full Schedule <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {myShifts.map((sch) => (
              <div key={sch.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{sch.departmentName} &bull; {sch.shiftType}</h4>
                  <p className="text-slate-500 mt-0.5">
                    {sch.date} &bull; {sch.startTime} - {sch.endTime}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={sch.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Leave Status & Conflicts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">My Recent Leave Requests</h3>
              <Link to="/my-leaves" className="text-xs text-teal-600 font-semibold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {myLeaves.map((leave) => (
                <div key={leave.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{leave.leaveType}</span>
                    <p className="text-[11px] text-slate-500">{leave.startDate} to {leave.endDate}</p>
                  </div>
                  <StatusBadge status={leave.status} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Conflict Warning Card */}
          <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> Staffing Conflict Alert
            </div>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              {sampleConflicts[0]?.description || 'Overlapping shift assignment detected in ICU ward.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
