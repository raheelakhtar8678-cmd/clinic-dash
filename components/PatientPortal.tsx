
import React, { useState } from 'react';
import { Invoice } from '../types';
import { explainInvoiceForPatient } from '@/services/api';

interface PatientPortalProps {
  invoices: Invoice[];
}

const PatientPortal: React.FC<PatientPortalProps> = ({ invoices }) => {
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatLog([...chatLog, { role: 'user', text: userMsg }]);
    setChatInput("");
    setLoading(true);

    const invoiceStr = JSON.stringify(invoices[0]); // Simulating checking the most recent invoice
    const response = await explainInvoiceForPatient(invoiceStr, userMsg);
    
    setChatLog(prev => [...prev, { role: 'bot', text: response }]);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-float">
      <div className="lg:col-span-2 space-y-8">
        <div className="glass-card p-10 rounded-[3rem] bg-white/60">
           <h3 className="text-2xl font-black text-slate-800 tracking-tighter mb-8">My Financial Records</h3>
           <div className="space-y-4">
              {invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center text-xl font-black">
                        {inv.status === 'Paid' ? '✅' : '🧾'}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{inv.description}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{inv.id} • {inv.createdAt}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-lg font-black text-slate-800">${inv.total}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>{inv.status}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="glass-card bg-slate-900 rounded-[3rem] p-8 text-white h-[600px] flex flex-col">
           <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🤖</span>
              <div>
                <h4 className="font-black text-base">Billing Chatbot</h4>
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Automated Explanation</p>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 mb-6">
              <div className="p-4 bg-white/10 rounded-2xl text-[11px] font-medium leading-relaxed">
                Hello! I can explain your billing charges or payment options. 
                <br/><br/>
                <span className="text-rose-400 font-bold">⚠️ Note: I cannot answer medical questions or provide diagnoses.</span>
              </div>
              {chatLog.map((log, i) => (
                <div key={i} className={`p-4 rounded-2xl text-[11px] font-medium leading-relaxed ${
                  log.role === 'user' ? 'bg-indigo-500 ml-8 text-right' : 'bg-white/10 mr-8'
                }`}>
                  {log.text}
                </div>
              ))}
              {loading && <div className="animate-pulse h-4 bg-white/10 w-1/2 rounded-full"></div>}
           </div>

           <form onSubmit={handleChat} className="relative">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your bill..."
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3.5 text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button className="absolute right-2 top-2 p-1.5 text-indigo-400 hover:text-white">🚀</button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;
