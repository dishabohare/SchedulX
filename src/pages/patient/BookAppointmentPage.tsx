import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Building2,
  Stethoscope,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CalendarPlus,
  AlertCircle,
  MapPin,
  IndianRupee,
} from 'lucide-react';
import { mockDoctors, initialDepartments } from '../../data';
import { Doctor } from '../../types';
import { Button } from '../../components/common/Button';

export const BookAppointmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialDoctorId = searchParams.get('doctorId');

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-28');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [visitReason, setVisitReason] = useState<string>('');
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>('');

  // Handle URL query doctorId if passed from Find Doctor page
  useEffect(() => {
    if (initialDoctorId) {
      const doc = mockDoctors.find((d) => d.id === initialDoctorId);
      if (doc) {
        setSelectedDoctor(doc);
        setSelectedDeptId(doc.departmentId);
        setStep(3); // Jump straight to Date Selection
      }
    }
  }, [initialDoctorId]);

  // List of active departments
  const activeDepartments = initialDepartments;

  // Doctors belonging to chosen department
  const departmentDoctors = selectedDeptId
    ? mockDoctors.filter((d) => d.departmentId === selectedDeptId || d.departmentName.toLowerCase().includes(
        activeDepartments.find((dep) => dep.id === selectedDeptId)?.name.toLowerCase() || ''
      ))
    : mockDoctors;

  // Mock Available dates
  const availableDates = [
    { date: '2026-08-28', label: 'Today (28 Aug)' },
    { date: '2026-08-29', label: 'Tomorrow (29 Aug)' },
    { date: '2026-08-30', label: 'Sun (30 Aug)' },
    { date: '2026-08-31', label: 'Mon (31 Aug)' },
    { date: '2026-09-01', label: 'Tue (01 Sep)' },
  ];

  const handleConfirmBooking = () => {
    const generatedId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingId(generatedId);
    setIsBooked(true);
    setStep(6);
  };

  const stepsList = [
    { number: 1, title: 'Department' },
    { number: 2, title: 'Doctor' },
    { number: 3, title: 'Date' },
    { number: 4, title: 'Time Slot' },
    { number: 5, title: 'Review & Confirm' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Book an Appointment</h1>
          <p className="text-xs text-slate-500 mt-1">
            Schedule a consultation with our experienced specialists in a few simple steps.
          </p>
        </div>
        {isBooked && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Booking Confirmed
          </span>
        )}
      </div>

      {/* Stepper Progress Bar */}
      {!isBooked && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between relative">
            {/* Horizontal Track Line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
            
            {stepsList.map((st) => {
              const isCurrent = step === st.number;
              const isPassed = step > st.number;

              return (
                <div key={st.number} className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : st.number}
                  </div>
                  <span
                    className={`text-[11px] font-semibold hidden md:inline ${
                      isCurrent ? 'text-blue-600' : isPassed ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {st.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step Content Container */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* STEP 1: Select Department */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold">Step 1: Select Department</h3>
            </div>
            <p className="text-xs text-slate-500">Choose the medical department relevant to your condition.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activeDepartments.map((dept) => {
                const isSelected = selectedDeptId === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setSelectedDeptId(dept.id);
                      setSelectedDoctor(null); // Reset doctor if department changes
                    }}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100 text-blue-900'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold">{dept.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{dept.description}</p>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 mt-3 block">
                      Head: {dept.headDoctorName}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                size="md"
                disabled={!selectedDeptId}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setStep(2)}
              >
                Continue to Select Doctor
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Doctor */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold">Step 2: Select Doctor</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departmentDoctors.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                      <p className="text-xs font-semibold text-blue-600">{doc.specialization}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{doc.experience} &bull; Rating {doc.rating} ★</p>
                      <p className="text-xs font-bold text-emerald-600 mt-1">₹{doc.consultationFee} Consultation</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!selectedDoctor}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setStep(3)}
              >
                Continue to Date Selection
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Select Date */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold">Step 3: Select Date</h3>
            </div>

            <p className="text-xs text-slate-500">
              Selected Doctor: <strong className="text-slate-800">{selectedDoctor?.name}</strong> ({selectedDoctor?.specialization})
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {availableDates.map((d) => {
                const isSelected = selectedDate === d.date;
                return (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm font-bold'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-medium'
                    }`}
                  >
                    <CalendarIcon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                    <span className="text-xs block">{d.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!selectedDate}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setStep(4)}
              >
                Continue to Select Time Slot
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Select Time */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold">Step 4: Select Available Time Slot</h3>
            </div>

            <p className="text-xs text-slate-500">
              Available slots for <strong className="text-slate-800">{selectedDoctor?.name}</strong> on{' '}
              <strong className="text-slate-800">{selectedDate}</strong>:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(selectedDoctor?.availableSlots || ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM']).map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 px-4 rounded-xl border text-center text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!selectedTime}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setStep(5)}
              >
                Review Appointment
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Confirm */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <CalendarPlus className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold">Step 5: Review Appointment Details</h3>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDoctor?.avatar}
                  alt={selectedDoctor?.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedDoctor?.name}</h4>
                  <p className="text-xs font-semibold text-blue-600">{selectedDoctor?.specialization}</p>
                  <p className="text-xs text-slate-500">{selectedDoctor?.departmentName}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-slate-200/70">
                <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                  <span className="text-slate-400 font-medium block">Date & Time</span>
                  <span className="font-bold text-slate-900">{selectedDate} &bull; {selectedTime}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                  <span className="text-slate-400 font-medium block">Location</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Building A, Room 204
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                  <span className="text-slate-400 font-medium block">Consultation Fee</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                    <IndianRupee className="w-3.5 h-3.5" /> {selectedDoctor?.consultationFee}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Visit / Symptoms (Optional)
                </label>
                <textarea
                  rows={3}
                  value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                  placeholder="Describe your health symptoms, medical history notes or purpose of consultation..."
                  className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200/60 flex items-start gap-2.5 text-xs text-blue-800">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>
                This is a frontend demonstration booking interface. Clicking "Confirm Booking" will create a mock appointment entry instantly.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(4)}>
                Back
              </Button>
              <Button
                variant="success"
                size="md"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        )}

        {/* STEP 6: Confirmation State */}
        {step === 6 && isBooked && (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">Appointment Booked Successfully!</h2>
              <p className="text-xs text-slate-500 mt-1">
                Your appointment request has been confirmed. Confirmation ID: <strong className="text-slate-900">{bookingId}</strong>
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 max-w-md mx-auto text-left text-xs space-y-3">
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Doctor</span>
                <span className="font-bold text-slate-900">{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Department</span>
                <span className="font-semibold text-slate-800">{selectedDoctor?.departmentName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Date & Time</span>
                <span className="font-bold text-blue-600">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Consultation Fee</span>
                <span className="font-bold text-emerald-600">₹{selectedDoctor?.consultationFee}</span>
              </div>
              {visitReason && (
                <div className="pt-1">
                  <span className="text-slate-500 font-medium block">Notes:</span>
                  <p className="text-slate-700 italic mt-0.5">{visitReason}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <Link to="/patient/appointments">
                <Button variant="primary" size="md">
                  View My Appointments
                </Button>
              </Link>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsBooked(false);
                  setStep(1);
                  setSelectedDoctor(null);
                  setSelectedTime('');
                  setVisitReason('');
                }}
              >
                Book Another Appointment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
