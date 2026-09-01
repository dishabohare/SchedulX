import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  HeartPulse,
  Building2,
  Activity,
  FileClock,
  AlertTriangle,
  Calendar,
  ChevronRight,
  TrendingUp,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  mockDashboardMetrics,
  workloadData,
  departmentStaffingData,
  sampleConflicts,
  initialSchedules,
  initialLeaves,
} from '../../data';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';

export const AdminDashboardPage: React.FC = () => {
  const statCards = [
    {
      title: 'Total Hospital Staff',
      value: mockDashboardMetrics.totalStaff,
      change: '+4 this month',
      icon: Users,
      color: 'bg-blue-500',
      lightBg: 'bg-blue-50 text-blue-600',
      link: '/admin/staff',
    },
    {
      title: 'Active Doctors',
      value: mockDashboardMetrics.doctors,
      change: '12 on-duty today',
      icon: Stethoscope,
      color: 'bg-indigo-500',
      lightBg: 'bg-indigo-50 text-indigo-600',
      link: '/admin/staff',
    },
    {
      title: 'Active Nurses',
      value: mockDashboardMetrics.nurses,
      change: '24 on-duty today',
      icon: HeartPulse,
      color: 'bg-teal-500',
      lightBg: 'bg-teal-50 text-teal-600',
      link: '/admin/staff',
    },
    {
      title: 'Departments',
      value: mockDashboardMetrics.departments,
      change: 'All units active',
      icon: Building2,
      color: 'bg-purple-500',
      lightBg: 'bg-purple-50 text-purple-600',
      link: '/admin/departments',
    },
    {
      title: 'Available Resources',
      value: `${mockDashboardMetrics.availableResources} / 40`,
      change: 'ICU & OTs ready',
      icon: Activity,
      color: 'bg-emerald-500',
      lightBg: 'bg-emerald-50 text-emerald-600',
      link: '/admin/resources',
    },
    {
      title: 'Pending Leaves',
      value: mockDashboardMetrics.pendingLeaves,
      change: 'Requires review',
      icon: FileClock,
      color: 'bg-amber-500',
      lightBg: 'bg-amber-50 text-amber-600',
      link: '/admin/leaves',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Healthcare Workforce Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time schedule monitoring, department staffing allocation, and resource availability.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/schedule">
            <Button variant="primary" size="md" leftIcon={<Calendar className="w-4 h-4" />}>
              Open Master Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-150 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {card.title}
                </span>
                <div className={`p-2 rounded-lg ${card.lightBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">
                  {card.value}
                </span>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  {card.change}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Schedule Conflicts Alert Section */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <h3 className="text-base font-bold">Active Schedule Conflicts & Overlap Warnings</h3>
          </div>
          <span className="text-xs font-semibold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
            {sampleConflicts.length} Conflicts Detected
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sampleConflicts.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-xl border border-rose-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-800">{c.department}</span>
                <StatusBadge status={c.severity} size="sm" />
              </div>
              <p className="text-xs font-bold text-slate-900">{c.title}</p>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{c.description}</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{c.date}</span>
                <Link to="/admin/schedule" className="text-blue-600 font-semibold hover:underline flex items-center gap-0.5">
                  Resolve <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workload Overview Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Workload Distribution</h3>
              <p className="text-xs text-slate-500">Staffing count by shift category across the week</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-slate-600">Doctors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-500" />
                <span className="text-slate-600">Nurses</span>
              </div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDoctors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNurses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="Doctors" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorDoctors)" />
                <Area type="monotone" dataKey="Nurses" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorNurses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Staffing Target Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">Department Staffing Levels</h3>
            <p className="text-xs text-slate-500">Current assigned staff vs optimal capacity</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentStaffingData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="Staff" fill="#2563eb" radius={[6, 6, 0, 0]}>
                  {departmentStaffingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Staff < entry.Optimal ? '#f59e0b' : '#2563eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Summary Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Today's Active Shifts</h3>
            </div>
            <Link to="/admin/schedule" className="text-xs text-blue-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {initialSchedules.slice(0, 4).map((sch) => (
              <div key={sch.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">{sch.staffName}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {sch.departmentName} &bull; {sch.startTime} - {sch.endTime}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {sch.shiftType}
                  </span>
                  <StatusBadge status={sch.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Leave Requests Quick Approval */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileClock className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Pending Leave Requests</h3>
            </div>
            <Link to="/admin/leaves" className="text-xs text-blue-600 font-semibold hover:underline">
              Manage Leaves
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {initialLeaves.filter(l => l.status === 'PENDING').map((leave) => (
              <div key={leave.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">{leave.staffName}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {leave.departmentName} &bull; {leave.startDate} to {leave.endDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                    {leave.leaveType}
                  </span>
                  <Link to="/admin/leaves">
                    <Button variant="outline" size="sm">Review</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
