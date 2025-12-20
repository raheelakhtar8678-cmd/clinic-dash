
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { getOperationalInsights, syncGoogleSheet } from '../services/api';
import { Appointment, Invoice, AppointmentStatus, InvoiceStatus } from '../types';

interface DashboardProps {
  appointments: Appointment[];
  invoices: Invoice[];
  onAddAppointment: () => void;
  mockInsights?: { billingInsight: string; noShowInsight: string };
}

const Dashboard: React.FC<DashboardProps> = ({ appointments, invoices, onAddAppointment, mockInsights }) => {
  const [insights, setInsights] = useState<{ billingInsight: string; noShowInsight: string }>({
    billingInsight: "Analyzing clinical data...",
    noShowInsight: "Analyzing attendance patterns...",
  });
  const [loading, setLoading] = useState(!mockInsights);
  const [sheetUrl, setSheetUrl] = useState('');

  const handleSync = async () => {
    if (!sheetUrl) {
      alert('Please enter a Google Sheet URL.');
      return;
    }
    try {
      const result = await syncGoogleSheet(sheetUrl);
      console.log('Sync result:', result);
      alert('Data synced successfully!');
    } catch (error) {
      alert('Failed to sync data. Please check the URL and try again.');
    }
  };

  const revenueData = [
    { name: 'Mon', revenue: 2400, patients: 12 },
    { name: 'Tue', revenue: 1398, patients: 8 },
    { name: 'Wed', revenue: 9800, patients: 45 },
    { name: 'Thu', revenue: 3908, patients: 20 },
    { name: 'Fri', revenue: 4800, patients: 28 },
    { name: 'Sat', revenue: 3800, patients: 15 },
    { name: 'Sun', revenue: 4300, patients: 18 },
  ];

  const statusData = [
    { name: 'Completed', value: appointments.filter(a => a.status === AppointmentStatus.Completed).length, color: '#10b981' },
    { name: 'Scheduled', value: appointments.filter(a => a.status === AppointmentStatus.Scheduled).length, color: '#0ea5e9' },
    { name: 'No-Show', value: appointments.filter(a => a.status === AppointmentStatus.NoShow).length, color: '#f43f5e' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (mockInsights) {
        setInsights(mockInsights);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const totalRev = invoices.reduce((acc, curr) => acc + curr.total, 0);
        const nsCount = appointments.filter(a => a.status === AppointmentStatus.NoShow).length;

        const opResult = await getOperationalInsights(
          `$${totalRev} revenue, ${appointments.length} appointments, ${nsCount} no-shows`
        );

        setInsights(opResult);
      } catch (error) {
        console.error("Failed to fetch insights:", error);
        setInsights({
          billingInsight: "Could not load insights.",
          noShowInsight: "Could not load insights."
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appointments, invoices, mockInsights]);

  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [newPatients24h, setNewPatients24h] = useState(0);
  const [appointments24h, setAppointments24h] = useState(0);
  const [revenueToday, setRevenueToday] = useState(0);
  const [revenueLast7Days, setRevenueLast7Days] = useState(0);
  const [revenueThisMonth, setRevenueThisMonth] = useState(0);

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    const pending = invoices.filter(inv => inv.status === InvoiceStatus.Pending).length;
    setPendingInvoices(pending);

    const newAppointments = appointments.filter(apt => new Date(apt.datetime) > yesterday);
    setAppointments24h(newAppointments.length);

    // This is a simplified way to determine "new" patients.
    const newPatientIds = new Set(newAppointments.map(a => a.patientId));
    setNewPatients24h(newPatientIds.size);

    const todayStr = today.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const revToday = invoices
      .filter(inv => inv.createdAt === todayStr)
      .reduce((sum, inv) => sum + inv.total, 0);
    setRevenueToday(revToday);

    const rev7Days = invoices
      .filter(inv => new Date(inv.createdAt) >= sevenDaysAgo)
      .reduce((sum, inv) => sum + inv.total, 0);
    setRevenueLast7Days(rev7Days);

    const revMonth = invoices
      .filter(inv => new Date(inv.createdAt) >= startOfMonth)
      .reduce((sum, inv) => sum + inv.total, 0);
    setRevenueThisMonth(revMonth);

  }, [invoices, appointments]);

  const stats = [
    { label: "Pending Invoices", value: pendingInvoices, sub: "Awaiting payment", icon: "🧾", trend: "+2" },
    { label: "Gross Billing", value: `$${invoices.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}`, sub: "All time", icon: "💰", trend: "+12%" },
    { label: "New Patients (24h)", value: newPatients24h, sub: "Last 24 hours", icon: "🧑‍🤝‍🧑", trend: "+3" },
    { label: "Appointments (24h)", value: appointments24h, sub: "Last 24 hours", icon: "🏥", trend: "+5" },
  ];

  return (
    <div className="space-y-10 pb-12 animate-float">
      {/* Google Sheets Sync */}
      <div className="glass-card p-8 rounded-[2.5rem]">
        <h3 className="text-xl font-black text-slate-800 tracking-tighter">Sync with Google Sheets</h3>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
          Update dashboard data from your Google Sheet.
        </p>
        <div className="mt-4 flex gap-4">
          <input
            type="text"
            placeholder="Paste Google Sheet URL here"
            className="flex-grow p-4 rounded-xl border border-slate-200"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
          />
          <button
            onClick={handleSync}
            className="bg-indigo-500 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-600 transition-all"
          >
            Sync Data
          </button>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="glass-card p-8 rounded-[2.5rem]">
        <h3 className="text-xl font-black text-slate-800 tracking-tighter">Revenue Breakdown</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm font-bold text-slate-500">Today</p>
            <p className="text-2xl font-black text-indigo-600">${revenueToday.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-500">Last 7 Days</p>
            <p className="text-2xl font-black text-indigo-600">${revenueLast7Days.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-500">This Month</p>
            <p className="text-2xl font-black text-indigo-600">${revenueThisMonth.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Dynamic Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-[0.03] group-hover:scale-125 transition-transform duration-700">{stat.icon}</div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-100/50 flex items-center justify-center text-2xl">{stat.icon}</div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{stat.trend}</span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800 mt-2">{stat.value}</h3>
              <p className="text-[11px] text-slate-400 mt-2 font-bold">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Performance Graph */}
        <div className="lg:col-span-2 glass-card p-10 rounded-[3rem]">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Clinical Performance</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Revenue Stream Analysis</p>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
               <button className="px-5 py-2 bg-white text-sky-600 text-[10px] font-black uppercase rounded-xl shadow-sm">Revenue</button>
               <button className="px-5 py-2 text-slate-400 text-[10px] font-black uppercase rounded-xl">Volume</button>
            </div>
          </div>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }}
                  itemStyle={{ color: '#0ea5e9', fontWeight: 900 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={5} fill="url(#skyGrad)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="space-y-8">
          <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
            <div className="relative z-10 flex flex-col h-full">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/10">✨</div>
                  <div>
                    <h4 className="text-white font-black text-lg">AI Command</h4>
                    <p className="text-sky-400 text-[10px] font-black uppercase tracking-widest">Live Optimization</p>
                  </div>
               </div>
               
               <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 mb-8 min-h-[180px]">
                  {loading ? (
                    <div className="space-y-3 animate-pulse">
                       <div className="h-2 bg-white/20 rounded-full w-full"></div>
                       <div className="h-2 bg-white/20 rounded-full w-4/5"></div>
                       <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                    </div>
                  ) : (
                    <p className="text-[13px] leading-relaxed text-sky-50 font-medium whitespace-pre-line italic">
                      "{insights.billingInsight}"
                    </p>
                  )}
               </div>

               <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                 Generate Daily Audit
               </button>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem]">
             <h4 className="text-slate-800 font-black text-[10px] uppercase tracking-[0.2em] mb-6">Staff Utilization</h4>
             <div className="space-y-6">
                {[
                  { name: 'Dr. House', util: 92, color: 'bg-sky-500' },
                  { name: 'Dr. Grey', util: 65, color: 'bg-indigo-500' },
                  { name: 'Nurse Joy', util: 88, color: 'bg-emerald-500' }
                ].map((s, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">{s.name}</span>
                        <span className="text-slate-800">{s.util}%</span>
                     </div>
                     <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div className={`${s.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${s.util}%` }}></div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Advanced AI No-Show Trends Hub */}
      <div className="glass-card p-10 rounded-[3.5rem] relative overflow-hidden">
         <div className="absolute right-0 top-0 w-80 h-80 bg-rose-50/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
         <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm">📉</div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter">No-Show Intelligence</h3>
                    <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Attendance Optimization Engine</p>
                  </div>
               </div>
               <div className="bg-slate-50/80 rounded-[2.5rem] p-8 border border-slate-100 min-h-[160px] shadow-inner">
                  {loading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-3 bg-slate-200 rounded-full w-full"></div>
                      <div className="h-3 bg-slate-200 rounded-full w-4/5"></div>
                    </div>
                  ) : (
                    <div className="text-[13.5px] leading-relaxed text-slate-700 font-bold whitespace-pre-line italic">
                      "{insights.noShowInsight}"
                    </div>
                  )}
               </div>
            </div>
            <div className="w-full lg:w-96 bg-white p-8 rounded-[3rem] shadow-xl border border-rose-50 flex flex-col items-center">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">No-Show Risk Factor</h4>
               <div className="w-48 h-48">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                       {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                     </Pie>
                     <Tooltip />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="mt-6 flex flex-wrap justify-center gap-4">
                  {statusData.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.name}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
