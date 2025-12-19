
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickAction: (action: string) => void;
  userRole: 'Admin' | 'Patient';
  setUserRole: (role: 'Admin' | 'Patient') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onQuickAction, userRole, setUserRole }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);

  const adminMenu = [
    { id: 'dashboard', label: 'Command Center', icon: '🏠' },
    { id: 'appointments', label: 'Schedule', icon: '📅' },
    { id: 'patients', label: 'Directory', icon: '👥' },
    { id: 'billing', label: 'Financials', icon: '💳' },
    { id: 'documents', label: 'Vault', icon: '📑' },
  ];

  const patientMenu = [
    { id: 'portal', label: 'My Invoices', icon: '🧾' },
    { id: 'support', label: 'Billing Help', icon: '💬' },
  ];

  const currentMenu = userRole === 'Admin' ? adminMenu : patientMenu;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Navigation Header */}
      <div className="sticky top-4 z-50 px-6 max-w-7xl mx-auto w-full">
        <header className="glass-card rounded-[2.5rem] px-8 py-4 flex items-center justify-between border-white/50 bg-white/70 backdrop-blur-3xl shadow-2xl">
          <div className="flex items-center gap-10">
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover:rotate-12 transition-all duration-500">
                <span className="text-2xl font-black">✚</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none">
                  ClinicOps<span className="text-indigo-500">AI</span>
                </h1>
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">Blueprint v5.0</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-2">
              {currentMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2 ${
                    activeTab === item.id
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-100 scale-105'
                      : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-5">
             <button 
               onClick={() => setUserRole(userRole === 'Admin' ? 'Patient' : 'Admin')}
               className="text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
             >
               Switch to {userRole === 'Admin' ? 'Patient' : 'Admin'}
             </button>

             <div className="relative">
               <button 
                 onClick={() => setNotifsOpen(!notifsOpen)}
                 className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-500 transition-all shadow-sm relative"
               >
                 <span className="text-lg">🔔</span>
                 <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
               </button>
               {notifsOpen && (
                 <div className="absolute right-0 mt-4 w-72 glass-card bg-white rounded-[2rem] p-6 shadow-2xl animate-float z-50">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Operational Alerts</h4>
                    <div className="space-y-4">
                       <div className="flex gap-3 p-3 bg-rose-50 rounded-2xl border border-rose-100">
                          <span className="text-xl">⚠️</span>
                          <div>
                            <p className="text-xs font-bold text-rose-700">Overdue Invoice</p>
                            <p className="text-[9px] text-rose-500 uppercase font-black">INV-002 • Jane Smith</p>
                          </div>
                       </div>
                       <div className="flex gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-100">
                          <span className="text-xl">📄</span>
                          <div>
                            <p className="text-xs font-bold text-amber-700">Missing Signature</p>
                            <p className="text-[9px] text-amber-500 uppercase font-black">Jane Smith • Consent Form</p>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
             </div>

             <div className="relative">
               <button 
                 onClick={() => setProfileOpen(!profileOpen)}
                 className="flex items-center gap-3 p-1 rounded-2xl bg-white border border-slate-100 hover:border-indigo-300 transition-all shadow-sm"
               >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-700 flex items-center justify-center text-white font-black text-[10px] shadow-lg">
                    {userRole === 'Admin' ? 'AM' : 'JS'}
                  </div>
               </button>
               {profileOpen && (
                 <div className="absolute right-0 mt-4 w-56 glass-card bg-white rounded-[2rem] p-3 shadow-2xl animate-float z-50">
                    <div className="p-4 mb-2 bg-slate-50 rounded-2xl">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Role</p>
                       <p className="text-sm font-black text-slate-800">{userRole}</p>
                    </div>
                    <button className="w-full text-left px-5 py-3 rounded-xl hover:bg-slate-50 text-slate-700 text-[10px] font-black uppercase tracking-widest transition-all">Settings</button>
                    <button className="w-full text-left px-5 py-3 rounded-xl hover:bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest transition-all">Log Out</button>
                 </div>
               )}
             </div>
          </div>
        </header>
      </div>

      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full mt-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
