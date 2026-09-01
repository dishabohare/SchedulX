import React, { useState } from 'react';
import { initialLeaves } from '../../data';
import { LeaveRequest, LeaveType } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { CalendarOff, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MyLeavesPage: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    if (!user) return initialLeaves;
    const userLeaves = initialLeaves.filter(
      (l) => l.staffId === user.id || l.staffName === user.name
    );
    return userLeaves.length > 0 ? userLeaves : initialLeaves.slice(0, 2);
  });
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  // Apply Form State
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-18');
  const [reason, setReason] = useState('');

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const newLeave: LeaveRequest = {
      id: `LV-${Date.now().toString().slice(-3)}`,
      staffId: user?.id || 'USR-STAFF-01',
      staffName: user?.name || 'Anita Verma, RN',
      staffRole: user?.role || 'STAFF',
      departmentName: user?.departmentName || 'Emergency Unit',
      startDate,
      endDate,
      leaveType,
      reason,
      status: 'PENDING',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    setLeaves([newLeave, ...leaves]);
    setIsApplyModalOpen(false);
    setReason('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarOff className="w-6 h-6 text-blue-600" />
            My Leave Applications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit leave requests and monitor approval status from hospital operations.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsApplyModalOpen(true)}>
          Apply for Leave
        </Button>
      </div>

      {/* Leave History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Leave History & Status</h3>
          <span className="text-xs text-slate-500 font-medium">{leaves.length} Total Requests</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Leave Type</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5">Applied Date</th>
                <th className="px-6 py-3.5">Reason</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {leaves.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{l.leaveType}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-700">
                    {l.startDate} to {l.endDate}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{l.appliedOn}</td>
                  <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">{l.reason}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={l.status} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm" onClick={() => setSelectedLeave(l)}>
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Leave"
        subtitle="Submit a formal leave request for approval"
      >
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <Select
            label="Leave Type"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
            options={[
              { label: 'Annual Leave', value: 'Annual' },
              { label: 'Sick Leave', value: 'Sick' },
              { label: 'Emergency Leave', value: 'Emergency' },
              { label: 'Maternity / Paternity', value: 'Maternity' },
              { label: 'Unpaid Leave', value: 'Unpaid' },
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Reason for Leave</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Provide context for medical or personal absence..."
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Leave Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail View Modal */}
      {selectedLeave && (
        <Modal
          isOpen={!!selectedLeave}
          onClose={() => setSelectedLeave(null)}
          title="Leave Request Details"
          subtitle={`Application Reference ${selectedLeave.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-800">Current Status</span>
              <StatusBadge status={selectedLeave.status} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <span className="text-slate-400 block font-medium">Type</span>
                <span className="font-semibold text-slate-900 mt-1 block">{selectedLeave.leaveType}</span>
              </div>
              <div className="p-3 border rounded-lg">
                <span className="text-slate-400 block font-medium">Applied On</span>
                <span className="font-semibold text-slate-900 mt-1 block">{selectedLeave.appliedOn}</span>
              </div>
            </div>

            <div className="p-3 border rounded-lg">
              <span className="text-slate-400 block font-medium mb-1">Reason Statement</span>
              <p className="text-slate-700 font-medium">{selectedLeave.reason}</p>
            </div>

            {selectedLeave.reviewComment && (
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg">
                <span className="text-blue-900 font-bold block mb-1">Reviewer Note</span>
                <p className="text-blue-800">{selectedLeave.reviewComment}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setSelectedLeave(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
