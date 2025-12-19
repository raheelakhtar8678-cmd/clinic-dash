
import React from 'react';
import { ClinicDocument } from '../types';

interface DocumentsProps {
  documents: ClinicDocument[];
}

const Documents: React.FC<DocumentsProps> = ({ documents }) => {
  return (
    <div className="space-y-8 animate-float">
      <div className="glass-card p-10 rounded-[3rem] flex justify-between items-center bg-white/60">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Clinical Vault</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Compliance & Records Management</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="glass-card p-8 rounded-[2.5rem] bg-white group hover:border-indigo-200 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {doc.type === 'Receipt' ? '🧾' : '📑'}
              </div>
              <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white shadow-sm ${
                doc.status === 'Signed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {doc.status}
              </span>
            </div>
            <h4 className="text-lg font-black text-slate-800 leading-tight">{doc.type}</h4>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Patient: {doc.patientName}</p>
            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">{doc.uploadedAt}</span>
              <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">Download</button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
         <div className="relative z-10">
            <h4 className="text-xl font-black tracking-tight mb-2">AI Document Scanning</h4>
            <p className="text-sm opacity-60 max-w-md font-medium">Gemini automatically extracts patient IDs and signature statuses. Last audit: 4 minutes ago.</p>
         </div>
      </div>
    </div>
  );
};

export default Documents;
