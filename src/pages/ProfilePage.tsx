import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { User as UserIcon, Mail, Phone, Building2, ShieldCheck, Award, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-5">
        <img
          src={
            user.avatar ||
            'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80'
          }
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-md shrink-0"
        />
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
          <p className="text-xs font-semibold text-blue-600 mt-0.5">
            {user.specialization || user.role} &bull; {user.departmentName || 'ScheduleX Healthcare'}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 mt-3">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> {user.departmentName || 'General Care'}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> ID: {user.employeeId || user.id}
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-slate-400" /> {user.accessLevel || `${user.role} Access`}
            </span>
          </div>
        </div>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Profile information updated successfully!
        </div>
      )}

      {/* Account Details Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Personal & Clinical Information</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" defaultValue={user.name} leftIcon={<UserIcon className="w-4 h-4" />} />
            <Input label="Email Address" defaultValue={user.email} leftIcon={<Mail className="w-4 h-4" />} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone Number" defaultValue={user.phone || '+1 (555) 019-2831'} leftIcon={<Phone className="w-4 h-4" />} />
            <Input label="Primary Department" defaultValue={user.departmentName || 'Healthcare'} leftIcon={<Building2 className="w-4 h-4" />} />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
