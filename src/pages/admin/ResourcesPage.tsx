import React, { useState, useMemo } from 'react';
import { initialResources } from '../../data';
import { HealthcareResource, ResourceType, ResourceStatus } from '../../types';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { Stethoscope, Plus, MapPin, Wrench, UserCheck, Edit, Trash2, Activity } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<HealthcareResource[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<HealthcareResource | null>(null);
  const [deletingResource, setDeletingResource] = useState<HealthcareResource | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'ICU' as ResourceType,
    location: 'Building C, Room 101',
    status: 'Available' as ResourceStatus,
    assignedTo: '',
    notes: '',
  });

  const typeOptions = [
    { label: 'All Resource Types', value: 'ALL' },
    { label: 'ICU', value: 'ICU' },
    { label: 'Operation Theatre', value: 'Operation Theatre' },
    { label: 'Ward', value: 'Ward' },
    { label: 'Hospital Bed', value: 'Hospital Bed' },
    { label: 'Medical Equipment', value: 'Medical Equipment' },
    { label: 'Emergency Unit', value: 'Emergency Unit' },
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Available', value: 'Available' },
    { label: 'Occupied', value: 'Occupied' },
    { label: 'Maintenance', value: 'Maintenance' },
    { label: 'Unavailable', value: 'Unavailable' },
  ];

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchesSearch =
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (res.assignedTo && res.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === 'ALL' || res.type === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || res.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [resources, searchQuery, typeFilter, statusFilter]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      type: 'ICU',
      location: 'Building C, Room 105',
      status: 'Available',
      assignedTo: '',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (res: HealthcareResource) => {
    setEditingResource(res);
    setFormData({
      name: res.name,
      type: res.type,
      location: res.location,
      status: res.status,
      assignedTo: res.assignedTo || '',
      notes: res.notes || '',
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResource) {
      setResources((prev) =>
        prev.map((r) => (r.id === editingResource.id ? { ...r, ...formData } : r))
      );
      setEditingResource(null);
    } else {
      const newRes: HealthcareResource = {
        id: `RES-${Date.now().toString().slice(-3)}`,
        ...formData,
        lastMaintenance: new Date().toISOString().split('T')[0],
      };
      setResources((prev) => [newRes, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (deletingResource) {
      setResources((prev) => prev.filter((r) => r.id !== deletingResource.id));
      setDeletingResource(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Healthcare Resource Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor ICU beds, operation theatres, medical equipment, and emergency room availability.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add New Resource
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by resource name, room location, or assigned staff/patient..."
          className="flex-1"
        />
        <div className="flex items-center gap-3">
          <FilterDropdown
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            className="w-52"
          />
          <FilterDropdown
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-44"
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-150 p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">
                  {res.type}
                </span>
                <StatusBadge status={res.status} size="sm" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">{res.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{res.id}</p>

              <div className="space-y-2 mt-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location:
                  </span>
                  <span className="font-semibold text-slate-800 truncate max-w-[120px]">{res.location}</span>
                </div>

                {res.assignedTo && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Assigned:
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[120px]">{res.assignedTo}</span>
                  </div>
                )}

                {res.lastMaintenance && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-slate-400" /> Serviced:
                    </span>
                    <span className="font-semibold text-slate-700">{res.lastMaintenance}</span>
                  </div>
                )}
              </div>

              {res.notes && (
                <p className="text-[11px] text-slate-600 mt-3 italic line-clamp-2">"{res.notes}"</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit className="w-3.5 h-3.5" />}
                onClick={() => handleOpenEdit(res)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:bg-rose-50"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => setDeletingResource(res)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isAddModalOpen || !!editingResource}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingResource(null);
        }}
        title={editingResource ? 'Edit Resource Details' : 'Add New Healthcare Resource'}
        subtitle="Manage hospital beds, surgical theatres, and medical equipment"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Resource Name / Identifier"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. ICU Bed 06 (Ventilator Ready)"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Resource Category"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceType })}
              options={[
                { label: 'ICU Bed', value: 'ICU' },
                { label: 'Operation Theatre', value: 'Operation Theatre' },
                { label: 'Ward', value: 'Ward' },
                { label: 'Hospital Bed', value: 'Hospital Bed' },
                { label: 'Medical Equipment', value: 'Medical Equipment' },
                { label: 'Emergency Unit', value: 'Emergency Unit' },
              ]}
            />

            <Select
              label="Current Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ResourceStatus })}
              options={[
                { label: 'Available', value: 'Available' },
                { label: 'Occupied', value: 'Occupied' },
                { label: 'Maintenance', value: 'Maintenance' },
                { label: 'Unavailable', value: 'Unavailable' },
              ]}
            />
          </div>

          <Input
            label="Location / Room Number"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Building C, 1st Floor Room 102"
            required
          />

          <Input
            label="Assigned To (Patient / Doctor / Staff)"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            placeholder="Optional assignment tag..."
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingResource(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingResource ? 'Update Resource' : 'Save Resource'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deletingResource}
        onClose={() => setDeletingResource(null)}
        onConfirm={handleDelete}
        title="Remove Healthcare Resource?"
        message={`Are you sure you want to remove ${deletingResource?.name}? This action cannot be undone.`}
        confirmText="Remove Resource"
      />
    </div>
  );
};
