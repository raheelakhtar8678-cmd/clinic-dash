
import React, { useState } from 'react';
import { Appointment, AppointmentStatus } from '../types';

interface AppointmentsProps {
  appointments: Appointment[];
  onAdd: () => void;
}

const Appointments: React.FC<AppointmentsProps> = ({ appointments, onAdd }) => {
  const [search, setSearch] = useState("");

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Scheduled: return 'bg-sky-100 text-sky-700';
      case AppointmentStatus.Completed: return 'bg-emerald-100 text-emerald-700';
      case AppointmentStatus.NoShow: return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filtered = appointments.filter(a => 
    a.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-sky-50 overflow-hidden">
      <div className="p-8 border-b border-sky-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-xl tracking-tighter">Clinical Schedule</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Real-time occupancy</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
             <input 
               type="text" 
               placeholder="Search schedule..." 
               className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-sky-200 transition-all w-full md:w-64"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
          <button 
            onClick={onAdd}
            className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all"
          >
            New Booking
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="px-8 py-5">Patient Details</th>
              <th className="px-8 py-5">Assigned Practitioner</th>
              <th className="px-8 py-5 text-center">Time</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Records</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50/50">
            {filtered.map((appt) => (
              <tr key={appt.id} className="hover:bg-sky-50/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center font-black text-xs shadow-sm">
                      {appt.patientName.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-800 text-sm">{appt.patientName}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-slate-500 font-bold text-xs uppercase tracking-tight">{appt.doctorName}</td>
                <td className="px-8 py-6 text-center">
                   <span className="text-slate-800 font-black text-sm">
                     {new Date(appt.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border border-white shadow-sm ${getStatusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-sky-500 hover:text-sky-700 font-black text-[10px] uppercase tracking-widest">View History</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
