import React, { useState, useMemo } from 'react';
import { initialLeaves } from '../../data';
import { LeaveRequest, LeaveStatus } from '../../types';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FileCheck, Check, X, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLeavesPage: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  const filteredLeaves = useMemo(() => {
    if (activeTab === 'ALL') return leaves;
    return leaves.filter((l) => l.status === activeTab);
  }, [leaves, activeTab]);

  const handleApprove = (id: string) => {
    setLeaves((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: 'APPROVED', reviewedBy: user?.name || 'Dr. Amanda Hayes', reviewComment: 'Approved based on unit coverage.' }
          : l
      )
    );
    if (selectedLeave?.id === id) {
      setSelectedLeave(null);
    }
  };

  const handleReject = (id: string) => {
    setLeaves((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: 'REJECTED', reviewedBy: user?.name || 'Dr. Amanda Hayes', reviewComment: 'Rejected due to shift conflict.' }
          : l
      )
    );
    if (selectedLeave?.id === id) {
      setSelectedLeave(null);
    }
  };

  const columns: Column<LeaveRequest>[] = [
    {
      header: 'Staff Member',
      accessor: (l) => (
        <div>
          <p className="font-semibold text-slate-900">{l.staffName}</p>
          <p className="text-xs text-slate-500">{l.staffRole} &bull; {l.departmentName}</p>
        </div>
      ),
    },
    {
      header: 'Leave Type',
      accessor: (l) => (
        <span className="font-semibold text-slate-800 text-xs px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
          {l.leaveType}
        </span>
      ),
    },
    {
      header: 'Dates',
      accessor: (l) => (
        <span className="text-xs font-medium text-slate-700">
          {l.startDate} to {l.endDate}
        </span>
      ),
    },
    {
      header: 'Reason',
      accessor: (l) => (
        <span className="text-xs text-slate-600 max-w-xs truncate block">{l.reason}</span>
      ),
    },
    {
      header: 'Status',
      accessor: (l) => <StatusBadge status={l.status} size="sm" />,
    },
    {
      header: 'Quick Actions',
      accessor: (l) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {l.status === 'PENDING' ? (
            <>
              <Button
                variant="success"
                size="sm"
                leftIcon={<Check className="w-3.5 h-3.5" />}
                onClick={() => handleApprove(l.id)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<X className="w-3.5 h-3.5" />}
                onClick={() => handleReject(l.id)}
              >
                Reject
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Eye className="w-3.5 h-3.5" />}
              onClick={() => setSelectedLeave(l)}
            >
              View Details
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-blue-600" />
            Staff Leave Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review and approve medical, annual, and emergency leave requests submitted by healthcare personnel.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-1">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'ALL' ? 'All Requests' : tab}
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-slate-500 pr-2">
          {filteredLeaves.length} Requests
        </span>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredLeaves}
        keyExtractor={(l) => l.id}
        emptyTitle="No leave applications found"
        emptyMessage="There are currently no leave applications under this filter status."
        onRowClick={(l) => setSelectedLeave(l)}
      />

      {/* Leave Details & Review Modal */}
      {selectedLeave && (
        <Modal
          isOpen={!!selectedLeave}
          onClose={() => setSelectedLeave(null)}
          title="Review Leave Application"
          subtitle={`Reference ${selectedLeave.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-sm">{selectedLeave.staffName}</p>
                <p className="text-slate-500">{selectedLeave.staffRole} &bull; {selectedLeave.departmentName}</p>
              </div>
              <StatusBadge status={selectedLeave.status} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <span className="text-slate-400 block font-medium">Leave Category</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{selectedLeave.leaveType}</span>
              </div>
              <div className="p-3 border rounded-lg">
                <span className="text-slate-400 block font-medium">Duration</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{selectedLeave.startDate} to {selectedLeave.endDate}</span>
              </div>
            </div>

            <div className="p-3 border rounded-lg">
              <span className="text-slate-400 block font-medium mb-1">Reason Description</span>
              <p className="text-slate-700 font-medium">{selectedLeave.reason}</p>
            </div>

            {selectedLeave.reviewedBy && (
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg">
                <span className="text-blue-900 font-bold block mb-1">Reviewed By: {selectedLeave.reviewedBy}</span>
                <p className="text-blue-800">{selectedLeave.reviewComment}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3">
              {selectedLeave.status === 'PENDING' && (
                <>
                  <Button variant="danger" onClick={() => handleReject(selectedLeave.id)}>
                    Reject Request
                  </Button>
                  <Button variant="success" onClick={() => handleApprove(selectedLeave.id)}>
                    Approve Request
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => setSelectedLeave(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
