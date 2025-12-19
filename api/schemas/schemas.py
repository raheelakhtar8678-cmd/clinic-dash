from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from api.models.models import AppointmentStatus, InvoiceStatus

class PatientBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: str

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int

    class Config:
        orm_mode = True

class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    datetime: datetime
    status: AppointmentStatus
    patientName: str
    doctorName: str

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int

    class Config:
        orm_mode = True

class InvoiceBase(BaseModel):
    appointment_id: int
    patient_id: int
    total: float
    status: InvoiceStatus

class InvoiceCreate(InvoiceBase):
    pass

class Invoice(InvoiceBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class PaymentBase(BaseModel):
    invoice_id: int
    amount: float
    method: str

class PaymentCreate(PaymentBase):
    pass

class Payment(PaymentBase):
    id: int
    date: datetime

    class Config:
        orm_mode = True
