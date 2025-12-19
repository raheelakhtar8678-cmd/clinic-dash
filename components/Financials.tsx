
import React, 'react';
import { Invoice, Expense, InvoiceStatus } from '../types';

interface FinancialsProps {
  invoices: Invoice[];
  expenses: Expense[];
}

const Financials: React.FC<FinancialsProps> = ({ invoices, expenses }) => {

  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.total, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-10 animate-float">
      {/* Dynamic Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card p-10 rounded-[3rem] bg-indigo-500 text-white shadow-2xl shadow-indigo-200">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-8">Net Profit Status</h4>
           <div className="flex items-baseline gap-2">
             <span className="text-5xl font-black tracking-tighter">${(totalRevenue - totalExpenses).toLocaleString()}</span>
           </div>
           <p className="text-xs font-bold mt-4 opacity-80">Margin: {((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(1)}%</p>
        </div>

        <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden">
           <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tighter mb-2">AI Expense Auditor</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Profit & Loss Intelligence</p>
              </div>
              <div className="mt-8 bg-white/5 p-6 rounded-[2rem] border border-white/10 min-h-[120px]">
                 <p className="text-sm font-medium leading-relaxed italic">"AI analysis is temporarily unavailable as we upgrade our systems."</p>
              </div>
           </div>
        </div>
      </div>

      {/* Ledger Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="glass-card rounded-[3rem] overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/60">
            <h3 className="font-black text-slate-800 text-lg">Revenue Ledger</h3>
            <button className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Export CSV</button>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full">
              <thead className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-6 py-4 text-left">Ref</th>
                  <th className="px-6 py-4 text-left">Patient</th>
                  <th className="px-6 py-4 text-right">Settled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-[11px] font-mono font-black text-indigo-500">{inv.id}</td>
                    <td className="px-6 py-4 text-[11px] font-bold text-slate-700">{inv.patientName}</td>
                    <td className="px-6 py-4 text-right text-xs font-black">${inv.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-[3rem] overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/60">
            <h3 className="font-black text-slate-800 text-lg">Expense Ledger</h3>
            <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Add Entry</button>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full">
              <thead className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-right">Debit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-6 py-4 text-[11px] font-bold text-slate-700">{exp.category}</td>
                    <td className="px-6 py-4 text-[11px] font-bold text-slate-400">{exp.date}</td>
                    <td className="px-6 py-4 text-right text-xs font-black text-rose-600">-${exp.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financials;
