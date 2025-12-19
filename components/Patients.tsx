
import React from 'react';
import { Patient } from '../types';

interface PatientsProps {
  patients: Patient[];
}

const Patients: React.FC<PatientsProps> = ({ patients }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-sky-50 overflow-hidden">
      <div className="p-8 border-b border-sky-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-xl tracking-tighter">Patient Directory</h3>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Medical Records Database</p>
        </div>
        <button className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all">
          Register New Patient
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 hover:border-sky-300 hover:shadow-2xl hover:shadow-sky-200/20 transition-all group">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-white group-hover:bg-sky-500 group-hover:text-white transition-all">
                  👤
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-base">{patient.name}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">UID: {patient.id}</p>
                </div>
             </div>
             <div className="space-y-3 bg-white/50 p-4 rounded-2xl border border-white">
                <div className="flex justify-between text-[11px] font-bold">
                   <span className="text-slate-400">Mobile:</span>
                   <span className="text-slate-700">{patient.phone}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                   <span className="text-slate-400">Email:</span>
                   <span className="text-slate-700">{patient.email}</span>
                </div>
             </div>
             <div className="mt-6 pt-4 flex gap-2">
                <button className="flex-1 bg-white border border-slate-100 py-2.5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all">
                  Records
                </button>
                <button className="flex-1 bg-white border border-slate-100 py-2.5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all">
                  Billing
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patients;
