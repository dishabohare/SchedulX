import React from 'react';
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  FileBadge,
  PieChart as PieIcon,
  IndianRupee,
  Receipt,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { mockInsurancePolicy, currentClaim, claimHistory } from '../../data';
import { StatusBadge } from '../../components/common/StatusBadge';

export const InsurancePage: React.FC = () => {
  // Chart data for treatment breakdown
  const chartData = currentClaim.breakdown.map((item) => ({
    name: item.category,
    Amount: item.amount,
  }));

  const COLORS = ['#2563eb', '#0d9488', '#8b5cf6', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Insurance & Claims Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            View active policy coverage limits, track claim settlement progress, and review treatment cost breakdowns.
          </p>
        </div>
        <StatusBadge status={mockInsurancePolicy.status} size="md" customLabel="Policy Active" />
      </div>

      {/* SECTION 1: INSURANCE OVERVIEW */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Insurance Overview</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Insurance Provider</span>
            <p className="text-base font-bold text-slate-900 mt-1">{mockInsurancePolicy.provider}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Policy Status</span>
            <div className="mt-1">
              <StatusBadge status={mockInsurancePolicy.status} size="sm" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Policy Number</span>
            <p className="text-base font-bold text-slate-900 mt-1">{mockInsurancePolicy.policyNumber}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Coverage Limit</span>
            <p className="text-xl font-extrabold text-emerald-600 mt-1">
              ₹{mockInsurancePolicy.coverage.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: CURRENT CLAIM & SUMMARY CARDS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Current Active Claim</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Claim ID: {currentClaim.claimId}</span>
            <StatusBadge status={currentClaim.status} size="sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 font-medium block">Claim ID</span>
            <span className="font-bold text-slate-900 text-sm">{currentClaim.claimId}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 font-medium block">Treatment Cost</span>
            <span className="font-bold text-slate-900 text-sm">₹{currentClaim.treatmentCost.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 font-medium block">Claim Submitted</span>
            <span className="font-bold text-blue-600 text-sm">₹{currentClaim.claimSubmitted.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-emerald-800 font-semibold block">Approved Amount</span>
            <span className="font-extrabold text-emerald-600 text-sm">₹{currentClaim.approvedAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-amber-800 font-semibold block">Patient Payable</span>
            <span className="font-extrabold text-amber-700 text-sm">₹{currentClaim.patientPayable.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Claim Status Indicator Bar */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Coverage Approved (73.5%)
            </span>
            <span className="text-amber-700">Co-Pay Outstanding (26.5%)</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500" style={{ width: '73.5%' }} />
            <div className="h-full bg-amber-500" style={{ width: '26.5%' }} />
          </div>
        </div>
      </div>

      {/* SECTION 3: TREATMENT COST BREAKDOWN & VISUAL CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Treatment Cost Breakdown</h3>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Category</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentClaim.breakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{item.category}</td>
                      <td className="p-3 text-slate-500">{item.description}</td>
                      <td className="p-3 text-right font-semibold text-slate-900">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-extrabold text-slate-900 border-t-2 border-slate-200 text-sm">
                  <tr>
                    <td className="p-3">Total</td>
                    <td className="p-3 text-xs text-slate-400 font-normal">Sum total billed</td>
                    <td className="p-3 text-right text-blue-600">
                      ₹{currentClaim.treatmentCost.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Visual Chart Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <PieIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Expense Allocation Chart</h3>
            </div>
            <p className="text-xs text-slate-500 mb-2">Visual breakdown of inpatient treatment expenses</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="Amount" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: CLAIM HISTORY */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileBadge className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">Claim History</h3>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Claim ID</th>
                <th className="p-3">Treatment / Type</th>
                <th className="p-3">Claim Amount</th>
                <th className="p-3">Approved Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claimHistory.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{claim.claimId}</td>
                  <td className="p-3 font-medium text-slate-800">{claim.type}</td>
                  <td className="p-3 font-semibold text-slate-900">₹{claim.treatmentCost.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-bold text-emerald-600">
                    {claim.approvedAmount > 0 ? `₹${claim.approvedAmount.toLocaleString('en-IN')}` : '₹0'}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={claim.status} size="sm" />
                  </td>
                  <td className="p-3 text-slate-500 font-medium">{claim.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
