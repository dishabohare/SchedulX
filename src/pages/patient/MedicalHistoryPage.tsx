import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Calendar,
  Stethoscope,
  Building2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { mockMedicalHistory } from '../../data';
import { MedicalRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const MedicalHistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const filteredHistory = mockMedicalHistory.filter(
    (item) =>
      item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.visitType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medical History & Records</h1>
          <p className="text-xs text-slate-500 mt-1">
            Chronological timeline of consultations, hospital diagnostic visits, clinical diagnoses, and treatments.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter history by diagnosis, doctor name, or treatment..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" /> Clinical Timeline History
        </h3>

        {filteredHistory.length > 0 ? (
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {filteredHistory.map((record) => (
              <div key={record.id} className="relative group">
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-50 group-hover:scale-110 transition-transform" />

                {/* Record Card */}
                <div className="bg-slate-50/70 border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-lg">
                        {record.visitType}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {record.date}
                      </span>
                    </div>
                    <StatusBadge status="COMPLETED" size="sm" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4 text-slate-500" />
                        Doctor: {record.doctorName}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        Department: {record.departmentName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        <span className="text-slate-500 font-semibold">Diagnosis: </span>
                        {record.diagnosis}
                      </p>
                      <p className="text-xs text-emerald-700 font-semibold mt-1">
                        <span className="text-slate-500 font-medium">Treatment: </span>
                        {record.treatment}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <p className="text-slate-600 line-clamp-1 italic">"{record.notes}"</p>
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="text-blue-600 font-bold hover:underline shrink-0 flex items-center gap-0.5 ml-2"
                    >
                      Full Details <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-xs">
            No medical records found matching your search.
          </div>
        )}
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={`Clinical Visit Record — ${selectedRecord.date}`}
          subtitle={`${selectedRecord.visitType} with ${selectedRecord.doctorName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Attending Doctor</span>
                <span className="font-bold text-slate-900">{selectedRecord.doctorName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Department</span>
                <span className="font-semibold text-slate-800">{selectedRecord.departmentName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Visit Date</span>
                <span className="font-semibold text-blue-600">{selectedRecord.date}</span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 mb-1">Diagnosis</h5>
              <p className="text-slate-800 bg-blue-50/60 p-3 rounded-xl border border-blue-100 font-medium">
                {selectedRecord.diagnosis}
              </p>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 mb-1">Treatment Administered / Prescribed</h5>
              <p className="text-emerald-900 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 font-medium">
                {selectedRecord.treatment}
              </p>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 mb-1">Doctor Notes & Recommendations</h5>
              <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                {selectedRecord.notes}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link to="/patient/documents" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> View Attached Reports in Documents
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
