import React, { useState } from 'react';
import {
  Pill,
  Search,
  Calendar,
  Stethoscope,
  FileText,
  Eye,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { mockPrescriptions } from '../../data';
import { Prescription } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const PrescriptionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const filteredPrescriptions = mockPrescriptions.filter(
    (rx) =>
      rx.prescriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Prescriptions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your active and past medication prescriptions issued by ScheduleX physicians.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search prescription by RX ID, doctor name or diagnosis..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Prescription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrescriptions.map((rx) => (
          <div
            key={rx.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5">
              {/* RX Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{rx.prescriptionId}</h3>
                    <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {rx.date}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {rx.medicines.length} Medicines
                </span>
              </div>

              {/* Doctor & Diagnosis */}
              <div className="space-y-1.5 text-xs mb-4">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-600" /> {rx.doctorName}
                </p>
                <p className="text-slate-500 font-medium">Diagnosis: <span className="text-slate-800 font-semibold">{rx.diagnosis}</span></p>
              </div>

              {/* Prescribed Medicines Summary */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prescribed Medicines</p>
                {rx.medicines.map((med) => (
                  <div key={med.id} className="text-xs border-b border-slate-200/60 pb-1.5 last:border-none last:pb-0">
                    <p className="font-bold text-slate-900">{med.name}</p>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                      {med.dosage} &bull; {med.frequency} ({med.duration})
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* View Prescription Button */}
            <div className="p-4 bg-slate-50/60 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                leftIcon={<Eye className="w-4 h-4" />}
                onClick={() => setSelectedPrescription(rx)}
              >
                View Prescription Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* View Prescription Modal */}
      {selectedPrescription && (
        <Modal
          isOpen={!!selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          title={`Digital Prescription — ${selectedPrescription.prescriptionId}`}
          subtitle={`Issued on ${selectedPrescription.date} by ${selectedPrescription.doctorName}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs">
            {/* Header branding on modal prescription */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  Rx
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">ScheduleX Healthcare Clinic</h4>
                  <p className="text-[11px] text-slate-400">Electronic Medical Prescription</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{selectedPrescription.prescriptionId}</p>
                <p className="text-slate-400">{selectedPrescription.date}</p>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Prescribing Doctor</span>
                <h5 className="text-sm font-bold text-slate-900 mt-0.5">{selectedPrescription.doctorName}</h5>
                <p className="text-blue-600 font-semibold">{selectedPrescription.doctorSpecialization}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Diagnosis</span>
                <p className="font-bold text-slate-800 text-xs mt-0.5">{selectedPrescription.diagnosis}</p>
              </div>
            </div>

            {/* Medicines Detailed Table */}
            <div>
              <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">Medication Schedule</h5>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Medicine Name</th>
                      <th className="p-3">Dosage</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedPrescription.medicines.map((med) => (
                      <tr key={med.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{med.name}</td>
                        <td className="p-3 font-semibold text-blue-700">{med.dosage}</td>
                        <td className="p-3 text-slate-700">{med.frequency}</td>
                        <td className="p-3 text-slate-700">{med.duration}</td>
                        <td className="p-3 text-slate-500 italic">{med.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Special Instructions & Signature */}
            {selectedPrescription.notes && (
              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl">
                <span className="font-bold text-amber-900 block">Doctor Advice:</span>
                <p className="text-amber-800 mt-0.5">{selectedPrescription.notes}</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Digital Prescription
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => alert(`Printing Prescription ${selectedPrescription.prescriptionId} (Demo UI action)`)}
              >
                Print / Download Prescription
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
