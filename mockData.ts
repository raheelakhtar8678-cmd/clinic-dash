
import { AppointmentStatus, InvoiceStatus, Patient, Appointment, Invoice, Expense, ClinicDocument } from './types';

export const mockPatients: Patient[] = [
  { id: 'p1', name: 'John Doe', phone: '555-0101', email: 'john@example.com' },
  { id: 'p2', name: 'Jane Smith', phone: '555-0102', email: 'jane@example.com' },
  { id: 'p3', name: 'Robert Brown', phone: '555-0103', email: 'robert@example.com' },
];

export const mockAppointments: Appointment[] = [
  { id: 'a1', patientId: 'p1', patientName: 'John Doe', doctorId: 'd1', doctorName: 'Dr. House', datetime: '2024-05-20T09:00:00', status: AppointmentStatus.Completed },
  { id: 'a2', patientId: 'p2', patientName: 'Jane Smith', doctorId: 'd2', doctorName: 'Dr. Grey', datetime: '2024-05-20T10:30:00', status: AppointmentStatus.Scheduled },
  { id: 'a3', patientId: 'p3', patientName: 'Robert Brown', doctorId: 'd1', doctorName: 'Dr. House', datetime: '2024-05-20T11:00:00', status: AppointmentStatus.NoShow },
];

export const mockInvoices: Invoice[] = [
  { id: 'INV-001', appointmentId: 'a1', patientName: 'John Doe', total: 150.00, status: InvoiceStatus.Paid, createdAt: '2024-05-20', description: 'General Consultation' },
  { id: 'INV-002', appointmentId: 'a2', patientName: 'Jane Smith', total: 200.00, status: InvoiceStatus.Pending, createdAt: '2024-05-20', description: 'X-Ray Diagnostics' },
  { id: 'INV-003', appointmentId: 'a3', patientName: 'Robert Brown', total: 75.00, status: InvoiceStatus.Pending, createdAt: '2024-05-20', description: 'Follow-up Lab Work' },
];

export const mockExpenses: Expense[] = [
  { id: 'e1', category: 'Rent', amount: 5000, date: '2024-05-01' },
  { id: 'e2', category: 'Salaries', amount: 12000, date: '2024-05-15' },
  { id: 'e3', category: 'Utilities', amount: 800, date: '2024-05-10' },
];

export const mockDocuments: ClinicDocument[] = [
  { id: 'd1', patientId: 'p1', patientName: 'John Doe', type: 'Consent Form', status: 'Signed', uploadedAt: '2024-05-19' },
  { id: 'd2', patientId: 'p2', patientName: 'Jane Smith', type: 'Billing Agreement', status: 'Pending', uploadedAt: '2024-05-20' },
  { id: 'd3', patientId: 'p3', patientName: 'Robert Brown', type: 'Receipt', status: 'Signed', uploadedAt: '2024-05-20' },
];
