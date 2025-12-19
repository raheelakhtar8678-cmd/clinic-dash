from fastapi import APIRouter, HTTPException
from backend.schemas.schemas import Appointment, AppointmentCreate, AppointmentStatus
from typing import List
from datetime import datetime

router = APIRouter()

# In-memory database
appointments_db: List[Appointment] = [
    Appointment(id=1, patient_id=1, patientName="John Doe", doctor_id=1, doctorName="Dr. Smith", datetime=datetime(2024, 7, 29, 10, 0, 0), status=AppointmentStatus.SCHEDULED),
    Appointment(id=2, patient_id=2, patientName="Jane Doe", doctor_id=1, doctorName="Dr. Smith", datetime=datetime(2024, 7, 29, 11, 0, 0), status=AppointmentStatus.COMPLETED),
]

@router.get("/appointments", response_model=List[Appointment])
def get_appointments():
    return appointments_db

@router.post("/appointments", response_model=Appointment, status_code=201)
def create_appointment(appointment: AppointmentCreate):
    new_id = max(app.id for app in appointments_db) + 1 if appointments_db else 1
    new_appointment = Appointment(
        id=new_id,
        **appointment.model_dump()
    )
    appointments_db.append(new_appointment)
    return new_appointment

@router.put("/appointments/{appointment_id}", response_model=Appointment)
def update_appointment(appointment_id: int, appointment_update: AppointmentCreate):
    for i, app in enumerate(appointments_db):
        if app.id == appointment_id:
            updated_app = Appointment(id=appointment_id, **appointment_update.model_dump())
            appointments_db[i] = updated_app
            return updated_app
    raise HTTPException(status_code=404, detail="Appointment not found")
