
import React from 'react';
import Dashboard from './Dashboard';
import { AppointmentStatus, InvoiceStatus } from '../types';

const mockAppointments = [
  { id: 1, patientName: 'John Doe', datetime: '2024-05-20T10:00:00Z', status: AppointmentStatus.Completed, doctorName: 'Dr. Smith' },
  { id: 2, patientName: 'Jane Smith', datetime: '2024-05-20T11:00:00Z', status: AppointmentStatus.Scheduled, doctorName: 'Dr. Jones' },
  { id: 3, patientName: 'Peter Pan', datetime: '2024-05-20T12:00:00Z', status: AppointmentStatus.NoShow, doctorName: 'Dr. Smith' },
];

const mockInvoices = [
  { id: 'inv1', patientName: 'John Doe', total: 150, status: InvoiceStatus.Paid, createdAt: '2024-05-20' },
  { id: 'inv2', patientName: 'Jane Smith', total: 200, status: InvoiceStatus.Pending, createdAt: '2024-05-20' },
];

const mockInsightsData = {
  billingInsight: "Test billing insight.",
  noShowInsight: "Test no-show insight.",
};

const DashboardTest: React.FC = () => {
  return (
    <Dashboard
      appointments={mockAppointments}
      invoices={mockInvoices}
      onAddAppointment={() => {}}
      mockInsights={mockInsightsData}
    />
  );
};

export default DashboardTest;
