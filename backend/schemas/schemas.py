from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from backend.models.models import AppointmentStatus

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
