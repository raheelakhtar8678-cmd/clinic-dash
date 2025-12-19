export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  NoShow = 'No-show',
  Cancelled = 'Cancelled'
}

export enum InvoiceStatus {
  Paid = 'Paid',
  Partial = 'Partial',
  Pending = 'Pending'
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  datetime: string;
  status: AppointmentStatus;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  total: number;
  status: InvoiceStatus;
  items: { description: string; amount: number }[];
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface ClinicDocument {
  id: string;
  patientId: string;
  patientName: string;
  documentType: string;
  uploadDate: string;
  url: string;
}
