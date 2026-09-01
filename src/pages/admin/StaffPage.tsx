import React, { useState, useMemo } from 'react';
import { initialStaff } from '../../data';
import { StaffMember, UserRole } from '../../types';
import { DataTable, Column } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Users, Mail, Phone, Stethoscope, Building2, Calendar, Plus, Eye } from 'lucide-react';

export const StaffPage: React.FC = () => {
  const [staffList] = useState<StaffMember[]>(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Department options for filter
  const deptOptions = [
    { label: 'All Departments', value: 'ALL' },
    { label: 'Cardiology', value: 'Cardiology' },
    { label: 'Emergency Medicine', value: 'Emergency Medicine' },
    { label: 'Pediatrics', value: 'Pediatrics' },
    { label: 'Neurology', value: 'Neurology' },
    { label: 'Intensive Care Unit (ICU)', value: 'Intensive Care Unit (ICU)' },
    { label: 'Administration & Operations', value: 'Administration & Operations' },
  ];

  // Role options for filter
  const roleOptions = [
    { label: 'All Roles', value: 'ALL' },
    { label: 'Doctors', value: 'DOCTOR' },
    { label: 'Staff / Nurses', value: 'STAFF' },
    { label: 'Administrators', value: 'ADMIN' },
  ];

  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'ALL' || staff.role === roleFilter;
      const matchesDept = deptFilter === 'ALL' || staff.departmentName === deptFilter;

      return matchesSearch && matchesRole && matchesDept;
    });
  }, [staffList, searchQuery, roleFilter, deptFilter]);

  const columns: Column<StaffMember>[] = [
    {
      header: 'Staff Member',
      accessor: (staff) => (
        <div className="flex items-center gap-3">
          <img
            src={staff.avatar}
            alt={staff.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
          />
          <div>
            <p className="font-semibold text-slate-900 leading-snug">{staff.name}</p>
            <p className="text-xs text-slate-500">{staff.id} &bull; {staff.specialization}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: (staff) => (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
          staff.role === 'DOCTOR'
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : staff.role === 'STAFF'
            ? 'bg-teal-50 text-teal-700 border-teal-200'
            : 'bg-purple-50 text-purple-700 border-purple-200'
        }`}>
          {staff.role}
        </span>
      ),
    },
    {
      header: 'Department',
      accessor: (staff) => (
        <span className="text-slate-700 font-medium text-xs">{staff.departmentName}</span>
      ),
    },
    {
      header: 'Duty Status',
      accessor: (staff) => <StatusBadge status={staff.status} size="sm" />,
    },
    {
      header: 'Shifts (Month)',
      accessor: (staff) => (
        <span className="font-semibold text-slate-800 text-xs">{staff.shiftCount} shifts</span>
      ),
    },
    {
      header: 'Actions',
      accessor: (staff) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStaff(staff);
          }}
          leftIcon={<Eye className="w-3.5 h-3.5 text-slate-500" />}
        >
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Healthcare Staff Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage hospital doctors, nursing staff, administrative roles, and schedule rosters.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Add New Staff Member
        </Button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by staff name, ID, or specialization..."
          className="flex-1"
        />
        <div className="flex items-center gap-3">
          <FilterDropdown
            options={roleOptions}
            value={roleFilter}
            onChange={setRoleFilter}
            className="w-40"
          />
          <FilterDropdown
            options={deptOptions}
            value={deptFilter}
            onChange={setDeptFilter}
            className="w-56"
          />
        </div>
      </div>

      {/* Staff Data Table */}
      <DataTable
        columns={columns}
        data={filteredStaff}
        keyExtractor={(staff) => staff.id}
        emptyTitle="No staff members found"
        emptyMessage="Try adjusting your search filters or add a new staff member to the directory."
        onRowClick={(staff) => setSelectedStaff(staff)}
      />

      {/* Staff Detail View Modal */}
      {selectedStaff && (
        <Modal
          isOpen={!!selectedStaff}
          onClose={() => setSelectedStaff(null)}
          title="Staff Profile & Duty Overview"
          subtitle={`Detailed information for ${selectedStaff.id}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <img
                src={selectedStaff.avatar}
                alt={selectedStaff.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{selectedStaff.name}</h3>
                  <StatusBadge status={selectedStaff.status} />
                </div>
                <p className="text-xs font-semibold text-blue-600 mt-0.5">{selectedStaff.specialization}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> {selectedStaff.departmentName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5" /> {selectedStaff.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200/80 bg-white">
                <span className="text-slate-400 font-medium block">Email Address</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedStaff.email}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200/80 bg-white">
                <span className="text-slate-400 font-medium block">Phone / Extension</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedStaff.phone}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200/80 bg-white">
                <span className="text-slate-400 font-medium block">Assigned Monthly Shifts</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {selectedStaff.shiftCount} shifts completed
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200/80 bg-white">
                <span className="text-slate-400 font-medium block">Primary Department</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> {selectedStaff.departmentName}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedStaff(null)}>Close</Button>
              <Button variant="primary">Edit Staff Profile</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
