
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments';
import Financials from './components/Financials';
import Patients from './components/Patients';
import Profile from './components/Profile';
import Documents from './components/Documents';
import PatientPortal from './components/PatientPortal';
import Modal from './components/Modal';
import { mockPatients, mockExpenses, mockDocuments } from './mockData';
import { Patient, Appointment, AppointmentStatus, Invoice, InvoiceStatus, Expense, ClinicDocument } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<'Admin' | 'Patient'>('Admin');
  
  const [patients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses] = useState<Expense[]>(mockExpenses);
  const [documents] = useState<ClinicDocument[]>(mockDocuments);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('/api/invoices');
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, []);

  const handleQuickAction = (action: string) => {
    if (action === 'add-appointment') {
      setIsModalOpen(true);
    }
  };

  const handleAddAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newApptData = {
      patient_id: 0, // Default value, will be updated
      patientName: formData.get('patientName') as string,
      doctor_id: 1, // Default value
      doctorName: 'Dr. Miller',
      datetime: new Date().toISOString(),
      status: AppointmentStatus.Scheduled
    };

    try {
      const response = await axios.post('/api/appointments', newApptData);
      setAppointments([response.data, ...appointments]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  const renderContent = () => {
    // Basic routing logic
    if (userRole === 'Patient') {
      if (activeTab === 'support' || activeTab === 'portal') return <PatientPortal invoices={invoices} />;
      return <PatientPortal invoices={invoices} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard appointments={appointments} invoices={invoices} onAddAppointment={() => setIsModalOpen(true)} />;
      case 'appointments':
        return <Appointments appointments={appointments} setAppointments={setAppointments} onAdd={() => setIsModalOpen(true)} />;
      case 'patients':
        return <Patients patients={patients} />;
      case 'billing':
        return <Financials invoices={invoices} expenses={expenses} />;
      case 'documents':
        return <Documents documents={documents} />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard appointments={appointments} invoices={invoices} onAddAppointment={() => setIsModalOpen(true)} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onQuickAction={handleQuickAction}
      userRole={userRole}
      setUserRole={(role) => {
        setUserRole(role);
        setActiveTab(role === 'Admin' ? 'dashboard' : 'portal');
      }}
    >
      <div className="animate-in fade-in duration-700">
        {renderContent()}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Quick Appointment Booking"
      >
        <form onSubmit={handleAddAppointment} className="space-y-8">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Patient Full Name</label>
              <input 
                name="patientName"
                required 
                type="text" 
                placeholder="Sarah Jenkins"
                className="w-full px-6 py-4 bg-indigo-50/50 border border-indigo-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-800 text-sm"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            Confirm Reservation
          </button>
        </form>
      </Modal>

      <footer className="mt-24 pt-16 border-t border-slate-100 mb-20 relative overflow-hidden print:hidden">
        <div className="bg-white border border-slate-50 rounded-[3.5rem] p-10 text-sm text-slate-500 shadow-sm flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-4xl border border-indigo-100">
            🛡️
          </div>
          <div className="flex-1">
            <p className="font-black text-slate-800 mb-2 tracking-tighter text-xl underline decoration-indigo-300 decoration-8 underline-offset-8">Blueprint Compliance Policy</p>
            <p className="leading-relaxed text-slate-400 font-bold text-xs mt-4">
              This system provides administrative automation only. 
              <strong> It does not provide medical advice.</strong> Medical diagnosis and clinical treatment recommendations 
              are strictly out of scope. AI functions are limited to financial and administrative logistics.
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default App;
