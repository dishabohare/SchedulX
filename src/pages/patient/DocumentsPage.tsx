import React, { useState } from 'react';
import {
  FolderOpen,
  FileText,
  FileSpreadsheet,
  Download,
  Eye,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { mockDocuments } from '../../data';
import { MedicalDocument, DocumentCategory } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const DocumentsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [previewDoc, setPreviewDoc] = useState<MedicalDocument | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories: (DocumentCategory | 'ALL')[] = [
    'ALL',
    'Prescriptions',
    'Lab Reports',
    'Imaging Reports',
    'Discharge Summaries',
    'Medical Records',
    'Insurance Documents',
    'Claim Documents',
  ];

  const filteredDocs = mockDocuments.filter((doc) => {
    if (selectedCategory === 'ALL') return true;
    return doc.type === selectedCategory;
  });

  const handleDownloadDemo = (docName: string) => {
    setToastMessage(`Downloading ${docName}... (Demonstration interaction)`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getDocIcon = (type: DocumentCategory) => {
    switch (type) {
      case 'Prescriptions':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'Lab Reports':
        return <FileSpreadsheet className="w-5 h-5 text-teal-600" />;
      case 'Imaging Reports':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'Discharge Summaries':
        return <FileText className="w-5 h-5 text-amber-600" />;
      case 'Insurance Documents':
      case 'Claim Documents':
        return <FileText className="w-5 h-5 text-indigo-600" />;
      default:
        return <FolderOpen className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medical Document Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized repository for your hospital prescriptions, lab reports, imaging scans, discharge summaries, and insurance claims.
          </p>
        </div>
      </div>

      {/* Toast Notification for Download Demo */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Documents' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Document Items Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-100 shrink-0">
                    {getDocIcon(doc.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{doc.name}</h3>
                      <StatusBadge status={doc.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {doc.doctorOrDepartment} &bull; {doc.date}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">{doc.type}</span>
                      {doc.fileSize && <span>Size: {doc.fileSize}</span>}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setPreviewDoc(doc)}
                  >
                    View / Preview
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Download className="w-3.5 h-3.5 text-blue-600" />}
                    onClick={() => handleDownloadDemo(doc.name)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold">
              No documents found under category "{selectedCategory}".
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={`Document Preview — ${previewDoc.name}`}
          subtitle={`${previewDoc.type} • Dated ${previewDoc.date}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Document ID</span>
                <span className="font-bold text-slate-900">{previewDoc.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Department / Issuer</span>
                <span className="font-semibold text-slate-800">{previewDoc.doctorOrDepartment}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Verification Status</span>
                <StatusBadge status={previewDoc.status} size="sm" />
              </div>
            </div>

            {/* Document Content Sample Preview */}
            <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-inner font-mono text-[11px] leading-relaxed text-slate-800 space-y-3">
              <div className="border-b border-slate-200 pb-2 flex justify-between font-sans">
                <span className="font-bold text-slate-900">ScheduleX Hospital Portal System</span>
                <span className="text-slate-500">{previewDoc.date}</span>
              </div>
              <p className="text-slate-700">{previewDoc.previewContent}</p>
              <div className="pt-2 text-[10px] text-slate-400 italic font-sans border-t border-slate-100">
                This document is a digitally encrypted medical record certified by ScheduleX Health Information System.
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center gap-2 text-amber-800 text-[11px]">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Demonstration document view. Actual PDF binaries remain securely stored in backend archives.</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setPreviewDoc(null)}>
                Close Preview
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => {
                  handleDownloadDemo(previewDoc.name);
                  setPreviewDoc(null);
                }}
              >
                Download Document
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
