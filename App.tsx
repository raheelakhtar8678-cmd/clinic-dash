
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments';
import Patients from './components/Patients';
import Billing from './components/Billing';
import Documents from './components/Documents';
import PatientPortal from './components/PatientPortal';
import { Appointment, Invoice } from './types';
import { mockAppointments, mockInvoices } from './mockData';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<'Admin' | 'Patient'>('Admin');
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);

  const addAppointment = () => {
    const newAppointment: Appointment = {
      id: `APT${appointments.length + 1}`,
      patient: 'New Patient',
      date: new Date().toISOString(),
      time: '12:00 PM',
      provider: 'Dr. Smith',
      status: 'Scheduled',
      reason: 'New Consultation',
    };
    setAppointments([...appointments, newAppointment]);
  };

  const renderContent = () => {
    if (userRole === 'Patient') {
      return <PatientPortal invoices={invoices.filter(inv => inv.patient === 'Jane Smith')} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard appointments={appointments} invoices={invoices} onAddAppointment={addAppointment} />;
      case 'appointments':
        return <Appointments appointments={appointments} onAddAppointment={addAppointment} />;
      case 'patients':
        return <Patients />;
      case 'billing':
        return <Billing invoices={invoices} />;
      case 'documents':
        return <Documents />;
      default:
        return <Dashboard appointments={appointments} invoices={invoices} onAddAppointment={addAppointment} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onQuickAction={(action) => console.log(action)}
      userRole={userRole}
      setUserRole={setUserRole}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
