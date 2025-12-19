
import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="animate-float">
      <div className="glass-card rounded-[3.5rem] p-12 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-sky-100/30 rounded-full -z-10 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="relative group">
             <div className="w-44 h-44 rounded-[4rem] bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center text-white text-6xl font-black shadow-2xl border-[10px] border-white group-hover:rotate-3 transition-all duration-500">
                AM
             </div>
             <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-2xl border border-slate-100 cursor-pointer hover:scale-110 transition-transform">📸</div>
          </div>
          
          <div className="text-center md:text-left flex-1">
             <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
               <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Dr. Alexander Miller</h2>
               <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100 w-fit mx-auto md:mx-0">Active Session</span>
             </div>
             <p className="text-sky-500 font-black uppercase tracking-[0.3em] text-[10px]">Chief Administrative Officer | ClinicOps Master-Node</p>
             
             <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                <div className="px-5 py-3 bg-white/50 border border-white rounded-2xl flex items-center gap-3">
                   <span className="text-xl">📧</span>
                   <p className="text-xs font-bold text-slate-600">alex.miller@clinicops.ai</p>
                </div>
                <div className="px-5 py-3 bg-white/50 border border-white rounded-2xl flex items-center gap-3">
                   <span className="text-xl">📱</span>
                   <p className="text-xs font-bold text-slate-600">+1 (555) 091-8832</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-16 pt-16 border-t border-slate-100">
           <div className="glass-card bg-slate-50/50 p-8 rounded-[2.5rem] border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Access Matrix</h4>
              <div className="space-y-5">
                 {[
                   { label: 'Cloud Medical Records', val: true },
                   { label: 'Financial Ledger Write', val: true },
                   { label: 'AI Model Configuration', val: true },
                   { label: 'Pharmacy Node Link', val: false }
                 ].map((p, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-600">{p.label}</span>
                      <div className={`w-10 h-5 rounded-full p-1 transition-colors ${p.val ? 'bg-sky-500' : 'bg-slate-200'}`}>
                         <div className={`w-3 h-3 bg-white rounded-full transition-transform ${p.val ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-sky-500 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-sky-200">
                 <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-8">Personal Efficiency</h4>
                 <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tighter">98</span>
                    <span className="text-xl font-bold opacity-60">%</span>
                 </div>
                 <p className="text-[11px] font-bold mt-4 leading-relaxed opacity-80">Your decision latency is 14% faster than the regional clinic average. System optimization complete.</p>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
                 <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-8">Security Status</h4>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🔐</div>
                    <div>
                       <p className="text-xs font-black uppercase tracking-widest">Biometric Locked</p>
                       <p className="text-[10px] opacity-40">2FA Active (Encrypted)</p>
                    </div>
                 </div>
                 <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Update Credentials</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
