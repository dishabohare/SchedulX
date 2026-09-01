import React from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Heart,
  AlertCircle,
  MapPin,
  Edit,
} from 'lucide-react';
import { mockPatient, mockInsurancePolicy } from '../../data';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const PatientProfilePage: React.FC = () => {
  const { user } = useAuth();
  const patientData = {
    name: user?.name || mockPatient.name,
    email: user?.email || mockPatient.email,
    id: user?.id || mockPatient.id,
    avatar: user?.avatar || mockPatient.avatar,
    phone: user?.phone || mockPatient.phone,
    dob: user?.dob || mockPatient.dob,
    gender: user?.gender || mockPatient.gender,
    bloodGroup: user?.bloodGroup || mockPatient.bloodGroup,
    address: user?.address || mockPatient.address,
    emergencyContact: user?.emergencyContact || mockPatient.emergencyContact,
    treatmentStatus: mockPatient.treatmentStatus,
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <img
          src={patientData.avatar}
          alt={patientData.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-600 shadow-md shrink-0"
        />
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{patientData.name}</h1>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit className="w-3.5 h-3.5" />}
              onClick={() => alert('Profile editing is a frontend demonstration action.')}
            >
              Edit Profile
            </Button>
          </div>
          <p className="text-xs font-semibold text-blue-600">Patient ID: {patientData.id}</p>
          <p className="text-xs text-slate-500 font-medium">
            Registered Patient &bull; {patientData.treatmentStatus}
          </p>
        </div>
      </div>

      {/* Grid: Personal Details & Emergency Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
              </span>
              <span className="font-semibold text-slate-900">{patientData.email}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
              </span>
              <span className="font-semibold text-slate-900">{patientData.phone}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date of Birth
              </span>
              <span className="font-semibold text-slate-900">{patientData.dob}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Gender</span>
              <span className="font-semibold text-slate-900">{patientData.gender}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Blood Group
              </span>
              <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {patientData.bloodGroup}
              </span>
            </div>

            <div className="pt-1">
              <span className="text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Residential Address
              </span>
              <p className="text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 font-medium">
                {patientData.address}
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contact & Medical Alerts */}
        <div className="space-y-6">
          {/* Emergency Contact Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900">Emergency Contact</h3>
            </div>

            <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 space-y-2 text-xs">
              <div className="flex justify-between border-b border-rose-200/60 pb-1.5">
                <span className="text-slate-600 font-medium">Contact Name</span>
                <span className="font-bold text-slate-900">{patientData.emergencyContact.name}</span>
              </div>
              <div className="flex justify-between border-b border-rose-200/60 pb-1.5">
                <span className="text-slate-600 font-medium">Relationship</span>
                <span className="font-semibold text-rose-700">{patientData.emergencyContact.relationship}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-600 font-medium">Phone Number</span>
                <span className="font-bold text-slate-900">{patientData.emergencyContact.phone}</span>
              </div>
            </div>
          </div>

          {/* Insurance Profile Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Linked Insurance Policy</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Provider</span>
                <span className="font-semibold text-slate-900">{mockInsurancePolicy.provider}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Policy No.</span>
                <span className="font-bold text-slate-900">{mockInsurancePolicy.policyNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Coverage Limit</span>
                <span className="font-bold text-emerald-600">₹{mockInsurancePolicy.coverage.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
