
import { AppointmentStatus, InvoiceStatus, Patient, Appointment, Invoice, Expense, ClinicDocument } from './types';

const today = new Date();
const yesterday = new Date(Date.now() - 86400000);
const twoDaysAgo = new Date(Date.now() - 2 * 86400000);
const tomorrow = new Date(Date.now() + 86400000);

const formatDateTime = (date: Date) => date.toISOString().slice(0, 16);
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const mockPatients: Patient[] = [
  { id: 'p1', name: 'John Doe', phone: '555-0101', email: 'john@example.com' },
  { id: 'p2', name: 'Jane Smith', phone: '555-0102', email: 'jane@example.com' },
  { id: 'p3', name: 'Robert Brown', phone: '555-0103', email: 'robert@example.com' },
  { id: 'p4', name: 'Emily White', phone: '555-0104', email: 'emily@example.com' },
];

export const mockAppointments: Appointment[] = [
  { id: 'a1', patientId: 'p1', patientName: 'John Doe', doctorId: 'd1', doctorName: 'Dr. House', datetime: formatDateTime(yesterday), status: AppointmentStatus.Completed },
  { id: 'a2', patientId: 'p2', patientName: 'Jane Smith', doctorId: 'd2', doctorName: 'Dr. Grey', datetime: formatDateTime(today), status: AppointmentStatus.Scheduled },
  { id: 'a3', patientId: 'p3', patientName: 'Robert Brown', doctorId: 'd1', doctorName: 'Dr. House', datetime: formatDateTime(twoDaysAgo), status: AppointmentStatus.NoShow },
  { id: 'a4', patientId: 'p4', patientName: 'Emily White', doctorId: 'd2', doctorName: 'Dr. Grey', datetime: formatDateTime(tomorrow), status: AppointmentStatus.Scheduled },
];

export const mockInvoices: Invoice[] = [
  { id: 'INV-001', appointmentId: 'a1', patientName: 'John Doe', total: 150.00, status: InvoiceStatus.Paid, createdAt: formatDate(yesterday), description: 'General Consultation' },
  { id: 'INV-002', appointmentId: 'a2', patientName: 'Jane Smith', total: 200.00, status: InvoiceStatus.Pending, createdAt: formatDate(today), description: 'X-Ray Diagnostics' },
  { id: 'INV-003', appointmentId: 'a3', patientName: 'Robert Brown', total: 75.00, status: InvoiceStatus.Pending, createdAt: formatDate(twoDaysAgo), description: 'Follow-up Lab Work' },
];

export const mockExpenses: Expense[] = [
  { id: 'e1', category: 'Rent', amount: 5000, date: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)) },
  { id: 'e2', category: 'Salaries', amount: 12000, date: formatDate(new Date(today.getFullYear(), today.getMonth(), 15))},
  { id: 'e3', category: 'Utilities', amount: 800, date: formatDate(new Date(today.getFullYear(), today.getMonth(), 10)) },
];

export const mockDocuments: ClinicDocument[] = [
  { id: 'd1', patientId: 'p1', patientName: 'John Doe', type: 'Consent Form', status: 'Signed', uploadedAt: formatDate(yesterday) },
  { id: 'd2', patientId: 'p2', patientName: 'Jane Smith', type: 'Billing Agreement', status: 'Pending', uploadedAt: formatDate(today) },
  { id: 'd3', patientId: 'p3', patientName: 'Robert Brown', type: 'Receipt', status: 'Signed', uploadedAt: formatDate(twoDaysAgo) },
];
