import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  Clock,
  CalendarPlus,
  Info,
  Award,
  BookOpen,
} from 'lucide-react';
import { mockDoctors } from '../../data';
import { Doctor } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const FindDoctorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedSpecialization, setSelectedSpecialization] = useState('ALL');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Extract unique departments and specializations
  const departments = ['ALL', ...Array.from(new Set(mockDoctors.map((d) => d.departmentName)))];
  const specializations = ['ALL', ...Array.from(new Set(mockDoctors.map((d) => d.specialization)))];

  // Filter logic
  const filteredDoctors = mockDoctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.departmentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDepartment === 'ALL' || doc.departmentName === selectedDepartment;
    const matchesSpec = selectedSpecialization === 'ALL' || doc.specialization === selectedSpecialization;

    return matchesSearch && matchesDept && matchesSpec;
  });

  const handleBookDoctor = (doctorId: string) => {
    navigate(`/patient/book-appointment?doctorId=${doctorId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Find & Consult Specialists</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse hospital doctors, check real-time schedule availability, and book appointments instantly.
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 md:space-y-0 md:flex md:items-center md:gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search doctor by name, symptom or specialty..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Filter Department */}
        <div className="w-full md:w-56">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {departments.filter((d) => d !== 'ALL').map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Specialization */}
        <div className="w-full md:w-56">
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
          >
            <option value="ALL">All Specializations</option>
            {specializations.filter((s) => s !== 'ALL').map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5">
                {/* Doctor Header & Avatar */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-base font-bold text-slate-900 truncate">{doc.name}</h3>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-blue-600 truncate mt-0.5">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-500 truncate">{doc.departmentName} &bull; {doc.experience}</p>
                  </div>
                </div>

                {/* Availability & Fee Section */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Availability</span>
                    <StatusBadge status={doc.availabilityStatus === 'Available Today' ? 'AVAILABLE' : 'PENDING'} customLabel={doc.availabilityStatus} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-slate-700 font-medium">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Next Slot
                    </span>
                    <span className="font-semibold text-slate-900">{doc.nextAvailableSlot}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Consultation Fee</span>
                    <span className="font-bold text-emerald-600 text-sm">₹{doc.consultationFee}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  leftIcon={<Info className="w-3.5 h-3.5" />}
                  onClick={() => setSelectedDoctor(doc)}
                >
                  View Profile
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  leftIcon={<CalendarPlus className="w-3.5 h-3.5" />}
                  onClick={() => handleBookDoctor(doc.id)}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center">
          <p className="text-sm font-semibold text-slate-700">No doctors match your current search parameters.</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the department or specialization filters.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearchTerm('');
              setSelectedDepartment('ALL');
              setSelectedSpecialization('ALL');
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Doctor Profile Modal */}
      {selectedDoctor && (
        <Modal
          isOpen={!!selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          title={selectedDoctor.name}
          subtitle={`${selectedDoctor.specialization} • ${selectedDoctor.departmentName}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <img
                src={selectedDoctor.avatar}
                alt={selectedDoctor.name}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-slate-900">{selectedDoctor.name}</h4>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{selectedDoctor.rating} Rating</span>
                  </div>
                </div>
                <p className="text-xs font-semibold text-blue-600">{selectedDoctor.specialization}</p>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400" /> {selectedDoctor.experience}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {selectedDoctor.education}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Biography & Clinical Focus</h5>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedDoctor.bio}</p>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Today's Available Time Slots</h5>
              <div className="flex flex-wrap gap-2">
                {selectedDoctor.availableSlots.map((slot) => (
                  <span key={slot} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg">
                    {slot}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Consultation Fee</span>
                <span className="text-lg font-bold text-emerald-600">₹{selectedDoctor.consultationFee}</span>
              </div>
              <Button
                variant="primary"
                size="md"
                leftIcon={<CalendarPlus className="w-4 h-4" />}
                onClick={() => {
                  const id = selectedDoctor.id;
                  setSelectedDoctor(null);
                  handleBookDoctor(id);
                }}
              >
                Proceed to Book
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
