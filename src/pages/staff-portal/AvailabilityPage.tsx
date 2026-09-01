import React, { useState } from 'react';
import { initialAvailability } from '../../data';
import { AvailabilitySlot } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Select } from '../../components/common/Select';
import { Input } from '../../components/common/Input';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Clock, Plus, CheckCircle, XCircle, Save, RotateCcw } from 'lucide-react';

export const AvailabilityPage: React.FC = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(initialAvailability);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<AvailabilitySlot['dayOfWeek']>('Monday');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  const handleToggleStatus = (id: string) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === id
          ? {
              ...slot,
              isAvailable: !slot.isAvailable,
              startTime: !slot.isAvailable ? '09:00 AM' : '—',
              endTime: !slot.isAvailable ? '05:00 PM' : '—',
            }
          : slot
      )
    );
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setSlots((prev) =>
      prev.map((slot) =>
        slot.dayOfWeek === selectedDay
          ? { ...slot, startTime, endTime, isAvailable: true }
          : slot
      )
    );
    setIsModalOpen(false);
  };

  const handleSaveAll = () => {
    setIsSaveSuccess(true);
    setTimeout(() => setIsSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            My Weekly Shift Availability
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Set your recurring available hours for automated shift scheduling by hospital administrators.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setSlots(initialAvailability)} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
          <Button variant="primary" size="sm" onClick={handleSaveAll} leftIcon={<Save className="w-3.5 h-3.5" />}>
            Save Availability
          </Button>
        </div>
      </div>

      {isSaveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Your weekly shift availability preferences have been saved and sent to hospital schedulers!
        </div>
      )}

      {/* Availability Roster Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Weekly Preferred Schedule Slots</h3>
          <Button variant="outline" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsModalOpen(true)}>
            Add Custom Slot
          </Button>
        </div>

        <div className="divide-y divide-slate-100">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
            >
              {/* Day & Time */}
              <div className="flex items-center gap-4 sm:w-72">
                <span className="w-24 text-sm font-semibold text-slate-900">{slot.dayOfWeek}</span>
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/60">
                  {slot.isAvailable ? `${slot.startTime} - ${slot.endTime}` : '—'}
                </span>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex items-center gap-4">
                <StatusBadge
                  status={slot.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                  customLabel={slot.isAvailable ? 'Available' : 'Unavailable'}
                />

                <Button
                  variant={slot.isAvailable ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => handleToggleStatus(slot.id)}
                  leftIcon={slot.isAvailable ? <XCircle className="w-3.5 h-3.5 text-rose-500" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                >
                  {slot.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50/60 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>ScheduleX Staff Self-Service</span>
          <span>Last updated: Today at 09:30 AM</span>
        </div>
      </div>

      {/* Add / Edit Time Slot Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Configure Day Availability"
        subtitle="Set working hours for a specific day"
      >
        <form onSubmit={handleSaveSlot} className="space-y-4">
          <Select
            label="Day of Week"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value as AvailabilitySlot['dayOfWeek'])}
            options={[
              { label: 'Monday', value: 'Monday' },
              { label: 'Tuesday', value: 'Tuesday' },
              { label: 'Wednesday', value: 'Wednesday' },
              { label: 'Thursday', value: 'Thursday' },
              { label: 'Friday', value: 'Friday' },
              { label: 'Saturday', value: 'Saturday' },
              { label: 'Sunday', value: 'Sunday' },
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Shift Start Time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="e.g. 09:00 AM"
              required
            />
            <Input
              label="Shift End Time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="e.g. 05:00 PM"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Set Availability
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
