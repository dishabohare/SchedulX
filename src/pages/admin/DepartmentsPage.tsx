import React, { useState, useMemo } from 'react';
import { initialDepartments } from '../../data';
import { Department } from '../../types';
import { SearchBar } from '../../components/common/SearchBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { Building2, Plus, Users, MapPin, Edit, Trash2, Bed } from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deletingDept, setDeletingDept] = useState<Department | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    headDoctorName: '',
    bedCapacity: 30,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  const filteredDepartments = useMemo(() => {
    return departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.headDoctorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [departments, searchQuery]);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      description: '',
      location: 'Building A, 1st Floor',
      headDoctorName: 'Dr. Sarah Jenkins',
      bedCapacity: 30,
      status: 'ACTIVE',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (dept: Department) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description,
      location: dept.location,
      headDoctorName: dept.headDoctorName,
      bedCapacity: dept.bedCapacity,
      status: dept.status,
    });
  };

  const handleSaveDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      // Edit
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === editingDept.id
            ? { ...d, ...formData }
            : d
        )
      );
      setEditingDept(null);
    } else {
      // Add
      const newDept: Department = {
        id: `DEP-0${departments.length + 1}`,
        ...formData,
        staffCount: 15,
        occupiedBeds: 0,
      };
      setDepartments((prev) => [newDept, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteDepartment = () => {
    if (deletingDept) {
      setDepartments((prev) => prev.filter((d) => d.id !== deletingDept.id));
      setDeletingDept(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Hospital Departments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure clinical units, bed capacity allocation, and medical department heads.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAddModal}>
          Add Department
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter departments by name, location, or department head..."
        />
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDepartments.map((dept) => {
          const occupancyRate = Math.round((dept.occupiedBeds / dept.bedCapacity) * 100);
          return (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-150 flex flex-col justify-between p-5"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{dept.name}</h3>
                      <p className="text-[11px] text-slate-400 font-medium">{dept.id}</p>
                    </div>
                  </div>
                  <StatusBadge status={dept.status} size="sm" />
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {dept.description}
                </p>

                {/* Details Pills */}
                <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location:
                    </span>
                    <span className="font-semibold text-slate-800">{dept.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> Head Physician:
                    </span>
                    <span className="font-semibold text-slate-800">{dept.headDoctorName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> Assigned Staff:
                    </span>
                    <span className="font-semibold text-blue-600">{dept.staffCount} members</span>
                  </div>
                </div>

                {/* Bed Capacity Progress */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-slate-400" /> Bed Occupancy
                    </span>
                    <span className="font-semibold text-slate-800">
                      {dept.occupiedBeds} / {dept.bedCapacity} ({occupancyRate}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        occupancyRate >= 90
                          ? 'bg-rose-500'
                          : occupancyRate >= 75
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit className="w-3.5 h-3.5" />}
                  onClick={() => handleOpenEditModal(dept)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:bg-rose-50"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => setDeletingDept(dept)}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Department Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingDept}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingDept(null);
        }}
        title={editingDept ? 'Edit Department Details' : 'Add New Hospital Department'}
        subtitle="Configure clinical location, head doctor, and bed capacity"
      >
        <form onSubmit={handleSaveDepartment} className="space-y-4">
          <Input
            label="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Oncology & Radiation"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              placeholder="Overview of medical services offered by this unit..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Location / Floor"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Building C, 2nd Floor"
              required
            />

            <Input
              label="Head Doctor Name"
              value={formData.headDoctorName}
              onChange={(e) => setFormData({ ...formData, headDoctorName: e.target.value })}
              placeholder="Dr. Full Name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Bed Capacity"
              type="number"
              value={formData.bedCapacity}
              onChange={(e) => setFormData({ ...formData, bedCapacity: parseInt(e.target.value) || 0 })}
              required
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive / Renovation', value: 'INACTIVE' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingDept(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingDept ? 'Update Department' : 'Save Department'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deletingDept}
        onClose={() => setDeletingDept(null)}
        onConfirm={handleDeleteDepartment}
        title="Delete Hospital Department?"
        message={`Are you sure you want to delete ${deletingDept?.name}? This action will reassign all active staff.`}
        confirmText="Delete Department"
      />
    </div>
  );
};
