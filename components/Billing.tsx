
import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '../types';
import { runFinancialAudit } from '../services/geminiService';
import { exportToCSV, printToPDF } from '../services/exportService';

interface BillingProps {
  invoices: Invoice[];
}

const Billing: React.FC<BillingProps> = ({ invoices }) => {
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [auditing, setAuditing] = useState(false);

  const startAudit = async () => {
    setAuditing(true);
    const report = await runFinancialAudit(invoices);
    setAuditReport(report);
    setAuditing(false);
  };

  const handleExport = () => {
    const exportData = invoices.map(inv => ({
      InvoiceID: inv.id,
      Patient: inv.patientName,
      Amount: inv.total,
      Status: inv.status,
      Date: inv.createdAt
    }));
    exportToCSV(exportData, 'Clinic_Ledger_Export');
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.Paid: return 'bg-emerald-100 text-emerald-700';
      case InvoiceStatus.Pending: return 'bg-amber-100 text-amber-700';
      case InvoiceStatus.Partial: return 'bg-sky-100 text-sky-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* AI Auditor Section */}
      <div className="bg-white rounded-[3rem] border border-sky-100 p-10 shadow-sm flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-80 h-80 bg-sky-50/50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="flex-1">
           <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">📊</span>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Financial Intelligence Hub</h3>
                <p className="text-[10px] text-sky-500 font-black uppercase tracking-[0.2em] mt-1">Audit Mode: Phase 4 Advanced</p>
              </div>
           </div>
           <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed max-w-xl">
             ClinicOps AI analyzes your current revenue cycle to identify billing leaks, insurance claim patterns, and optimization opportunities.
           </p>
           {auditReport ? (
             <div className="bg-slate-50/80 backdrop-blur-sm rounded-3xl p-8 border border-sky-100 text-sm text-slate-700 font-medium whitespace-pre-line shadow-inner max-h-80 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-4">
                   <span className="px-3 py-1 bg-sky-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">AI Report</span>
                   <button onClick={() => setAuditReport(null)} className="text-slate-400 hover:text-red-500 transition-colors">✕</button>
                </div>
                {auditReport}
             </div>
           ) : (
             <button 
               onClick={startAudit}
               disabled={auditing}
               className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4"
             >
               {auditing ? (
                 <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> Processing Analysis...</>
               ) : (
                 <>🚀 Initialize AI Financial Audit</>
               )}
             </button>
           )}
        </div>
        <div className="hidden xl:flex w-64 h-64 bg-white rounded-[3.5rem] border-2 border-dashed border-sky-100 items-center justify-center text-6xl shadow-inner relative">
          <div className="absolute inset-0 flex items-center justify-center animate-pulse opacity-10">
            <span className="text-9xl">💹</span>
          </div>
          🧾
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-sky-100 overflow-hidden">
        <div className="p-10 border-b border-sky-50 flex flex-col md:flex-row justify-between items-center gap-6">
           <div>
              <h3 className="font-black text-slate-800 text-2xl tracking-tighter">Transaction Ledger</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">End-of-Day Reconciliation</p>
           </div>
           <div className="flex flex-wrap gap-4">
             <button 
               onClick={printToPDF}
               className="bg-white border border-sky-100 text-slate-600 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-sky-50 transition-all flex items-center gap-2"
             >
               <span>🖨️</span> PDF Report
             </button>
             <button 
               onClick={handleExport}
               className="bg-sky-500 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all flex items-center gap-2"
             >
               <span>📥</span> Export XLSX
             </button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="px-10 py-6">Ledger Ref</th>
                <th className="px-10 py-6">Patient Name</th>
                <th className="px-10 py-6 text-right">Settlement</th>
                <th className="px-10 py-6 text-center">Current Status</th>
                <th className="px-10 py-6 text-center">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50/50">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-sky-50/30 transition-all group duration-300">
                  <td className="px-10 py-7">
                    <span className="font-mono font-black text-sky-500 text-xs tracking-tighter bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100">INV-{invoice.id.split('-').pop()}</span>
                  </td>
                  <td className="px-10 py-7 font-black text-slate-800 text-sm tracking-tight">{invoice.patientName}</td>
                  <td className="px-10 py-7 text-right">
                    <span className="text-slate-900 font-black text-lg tracking-tighter">${invoice.total.toFixed(2)}</span>
                  </td>
                  <td className="px-10 py-7 text-center">
                    <span className={`px-5 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase border border-white shadow-sm ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-10 py-7 text-center">
                     <div className="inline-flex items-center justify-center w-10 h-10 bg-white text-sky-500 rounded-2xl hover:scale-110 transition-transform cursor-help shadow-sm border border-sky-100 group-hover:border-sky-300">
                       ✨
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;
