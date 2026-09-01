import React, { useState, useMemo } from 'react';
import { initialSchedules } from '../../data';
import { ScheduleItem, ShiftType, UserRole } from '../../types';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Stethoscope,
  Building2,
  Activity,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSchedulePage: React.FC = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<ScheduleItem[]>(initialSchedules);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedShift, setSelectedShift] = useState<string>('ALL');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    staffName: user?.name || 'Dr. Marcus Vance',
    staffRole: (user?.role as UserRole) || ('DOCTOR' as UserRole),
    departmentName: user?.departmentName || 'Emergency Medicine',
    resourceName: 'Operation Theatre 01',
    date: '2026-08-31',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    shiftType: 'Morning' as ShiftType,
  });

  const deptOptions = [
    { label: 'All Departments', value: 'ALL' },
    { label: 'Cardiology', value: 'Cardiology' },
    { label: 'Emergency Medicine', value: 'Emergency Medicine' },
    { label: 'Pediatrics', value: 'Pediatrics' },
    { label: 'Neurology', value: 'Neurology' },
    { label: 'Intensive Care Unit (ICU)', value: 'Intensive Care Unit (ICU)' },
  ];

  const shiftOptions = [
    { label: 'All Shifts', value: 'ALL' },
    { label: 'Morning (08 AM - 04 PM)', value: 'Morning' },
    { label: 'Afternoon (04 PM - 12 AM)', value: 'Afternoon' },
    { label: 'Night (12 AM - 08 AM)', value: 'Night' },
    { label: 'On-Call', value: 'On-Call' },
  ];

  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      // 1. Role-based schedule scoping
      if (user?.role === 'DOCTOR') {
        const isMyDoctorShift =
          s.staffId === user.id ||
          (user.employeeId && s.staffId === user.employeeId) ||
          s.staffName.toLowerCase() === user.name.toLowerCase();
        if (!isMyDoctorShift) return false;
      } else if (user?.role === 'STAFF') {
        const isMyDeptShift =
          (user.departmentName && s.departmentName.toLowerCase().includes(user.departmentName.toLowerCase())) ||
          (user.departmentName && user.departmentName.toLowerCase().includes(s.departmentName.toLowerCase())) ||
          (user.departmentId && s.departmentId === user.departmentId);
        if (!isMyDeptShift) return false;
      }

      // 2. Dropdown Filter Scoping
      const matchesDept = selectedDept === 'ALL' || s.departmentName === selectedDept;
      const matchesShift = selectedShift === 'ALL' || s.shiftType === selectedShift;
      return matchesDept && matchesShift;
    });
  }, [schedules, selectedDept, selectedShift, user]);

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: ScheduleItem = {
      id: `SCH-${Date.now().toString().slice(-3)}`,
      staffId: user?.id || 'STF-109',
      ...formData,
      departmentId: 'DEP-02',
      status: 'SCHEDULED',
    };
    setSchedules([newSchedule, ...schedules]);
    setIsAddModalOpen(false);
  };

  const daysOfWeek = ['Mon 31 Aug', 'Tue 01 Sep', 'Wed 02 Sep', 'Thu 03 Sep', 'Fri 04 Sep', 'Sat 05 Sep', 'Sun 06 Sep'];

  const scheduleTitle = user?.role === 'DOCTOR'
    ? 'My Clinical Schedule'
    : user?.role === 'STAFF'
    ? 'My Department Schedule'
    : 'Master Healthcare Shift Schedule';

  const scheduleSubtitle = user?.role === 'DOCTOR'
    ? 'On-duty shift matrix and clinical consultation availability across hospital units.'
    : user?.role === 'STAFF'
    ? 'Department duty assignments, shift coverage, and nursing staff rosters.'
    : 'Visual shift matrix across hospital departments, surgical operating rooms, and nursing rosters.';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            {scheduleTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{scheduleSubtitle}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>
            Assign New Shift
          </Button>
        )}
      </div>

      {/* Control Bar: View Switcher, Date Controls, Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Day / Week / Month View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['day', 'week', 'month'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                viewMode === mode
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>

        {/* Date Navigator */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="p-2">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-bold text-slate-800">
            Aug 31, 2026 – Sep 06, 2026
          </span>
          <Button variant="outline" size="sm" className="p-2">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Department & Shift Filters */}
        <div className="flex items-center gap-3">
          <FilterDropdown
            options={deptOptions}
            value={selectedDept}
            onChange={setSelectedDept}
            className="w-48"
          />
          <FilterDropdown
            options={shiftOptions}
            value={selectedShift}
            onChange={setSelectedShift}
            className="w-44"
          />
        </div>
      </div>

      {/* Calendar Matrix Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {viewMode === 'week' ? (
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header Days Row */}
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center font-semibold text-xs text-slate-700 py-3">
                {daysOfWeek.map((day, idx) => (
                  <div key={idx} className={`${idx === 0 ? 'text-blue-600 font-bold' : ''}`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Shifts Columns */}
              <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[450px]">
                {daysOfWeek.map((day, dIdx) => {
                  const dateStr = dIdx === 0 ? '2026-08-31' : dIdx === 1 ? '2026-09-01' : '2026-09-02';
                  const dayShifts = filteredSchedules.filter((s) => s.date === dateStr);

                  return (
                    <div key={dIdx} className="p-2 space-y-2.5 bg-slate-50/20">
                      {dayShifts.map((sch) => {
                        const isSelfShift =
                          sch.staffId === user?.id ||
                          (user?.employeeId && sch.staffId === user.employeeId) ||
                          (user?.name && sch.staffName.toLowerCase() === user.name.toLowerCase());

                        return (
                          <div
                            key={sch.id}
                            onClick={() => setSelectedSchedule(sch)}
                            className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer shadow-xs hover:shadow-md ${
                              isSelfShift
                                ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-500/30'
                                : sch.staffRole === 'DOCTOR'
                                ? 'bg-blue-50/80 border-blue-200 hover:border-blue-300'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                {sch.shiftType}
                              </span>
                              <div className="flex items-center gap-1">
                                {isSelfShift && user?.role === 'STAFF' && (
                                  <span className="text-[9px] font-extrabold bg-teal-600 text-white px-1.5 py-0.5 rounded uppercase">
                                    My Shift
                                  </span>
                                )}
                                <StatusBadge status={sch.status} size="sm" showDot={false} />
                              </div>
                            </div>
                            <p className="text-xs font-bold text-slate-900 truncate">{sch.staffName}</p>
                            <p className="text-[11px] text-slate-600 mt-0.5 truncate">{sch.departmentName}</p>
                            {sch.resourceName && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded mt-2 truncate w-full">
                                <Activity className="w-3 h-3" /> {sch.resourceName}
                              </span>
                            )}
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
                              <Clock className="w-3 h-3" /> {sch.startTime} - {sch.endTime}
                            </div>
                          </div>
                        );
                      })}
                      {dayShifts.length === 0 && (
                        <div className="h-24 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-[11px] text-slate-400">
                          No shifts
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Day & Month Fallback Matrix View */
          <div className="p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              Detailed Shift Roster View ({viewMode.toUpperCase()} MODE)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSchedules.map((sch) => (
                <div
                  key={sch.id}
                  onClick={() => setSelectedSchedule(sch)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500">{sch.date} &bull; {sch.shiftType}</span>
                    <StatusBadge status={sch.status} size="sm" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{sch.staffName}</h4>
                  <p className="text-xs text-slate-500">{sch.staffRole} &bull; {sch.departmentName}</p>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                    <span>{sch.startTime} - {sch.endTime}</span>
                    <span className="text-blue-600 font-semibold">{sch.resourceName || 'General Ward'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Assign Shift Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Assign Healthcare Shift"
        subtitle="Schedule doctors, nurses, and medical resources"
      >
        <form onSubmit={handleAddShift} className="space-y-4">
          <Input
            label="Staff Name & Title"
            value={formData.staffName}
            onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Role"
              value={formData.staffRole}
              onChange={(e) => setFormData({ ...formData, staffRole: e.target.value as UserRole })}
              options={[
                { label: 'Doctor', value: 'DOCTOR' },
                { label: 'Staff / Nurse', value: 'STAFF' },
              ]}
            />
            <Select
              label="Shift Category"
              value={formData.shiftType}
              onChange={(e) => setFormData({ ...formData, shiftType: e.target.value as ShiftType })}
              options={[
                { label: 'Morning Shift', value: 'Morning' },
                { label: 'Afternoon Shift', value: 'Afternoon' },
                { label: 'Night Shift', value: 'Night' },
                { label: 'On-Call Duty', value: 'On-Call' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Shift Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Input
              label="Assigned Resource / OT"
              value={formData.resourceName}
              onChange={(e) => setFormData({ ...formData, resourceName: e.target.value })}
              placeholder="e.g. Operation Theatre 02"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              placeholder="08:00 AM"
              required
            />
            <Input
              label="End Time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              placeholder="04:00 PM"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Shift Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Shift Detail Modal */}
      {selectedSchedule && (
        <Modal
          isOpen={!!selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          title="Shift Assignment Detail"
          subtitle={`Roster ID ${selectedSchedule.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-sm">{selectedSchedule.staffName}</p>
                <p className="text-slate-500">{selectedSchedule.staffRole} &bull; {selectedSchedule.departmentName}</p>
              </div>
              <StatusBadge status={selectedSchedule.status} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <span className="text-slate-400 font-medium block">Shift Type</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{selectedSchedule.shiftType}</span>
              </div>
              <div className="p-3 border rounded-lg">
                <span className="text-slate-400 font-medium block">Time Window</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{selectedSchedule.startTime} - {selectedSchedule.endTime}</span>
              </div>
            </div>

            {selectedSchedule.resourceName && (
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg">
                <span className="text-blue-900 font-bold block mb-0.5">Assigned Facility / OT</span>
                <p className="text-blue-800">{selectedSchedule.resourceName}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setSelectedSchedule(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
