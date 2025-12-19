
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
  phone: string;
  email: string;
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
  appointmentId: string;
  patientName: string;
  total: number;
  status: InvoiceStatus;
  createdAt: string;
  description?: string;
}

export interface Expense {
  id: string;
  category: 'Salaries' | 'Rent' | 'Utilities' | 'Equipment';
  amount: number;
  date: string;
}

export interface ClinicDocument {
  id: string;
  patientId: string;
  patientName: string;
  type: 'Consent Form' | 'Billing Agreement' | 'Receipt';
  status: 'Signed' | 'Pending' | 'Missing';
  uploadedAt: string;
}

export interface DashboardStats {
  todayAppointments: number;
  todayRevenue: number;
  unpaidInvoices: number;
  noShowRate: number;
}
