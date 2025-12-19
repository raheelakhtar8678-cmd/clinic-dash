from fastapi.testclient import TestClient
from api.main import app
from api.database import get_db
from api.models import models
from api.schemas import schemas
from datetime import datetime

client = TestClient(app)

def test_get_invoices():
    response = client.get("/api/invoices")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_invoice():
    # First, create an appointment to associate the invoice with
    appointment_data = {
        "patient_id": 1,
        "patientName": "Test Patient",
        "doctor_id": 1,
        "doctorName": "Test Doctor",
        "datetime": "2024-08-01T10:00:00",
        "status": "Completed"
    }
    client.post("/api/appointments", json=appointment_data)

    invoice_data = {
        "appointment_id": 1,
        "patient_id": 1,
        "total": 250.00,
        "status": "Pending",
        "patientName": "Test Patient"
    }
    response = client.post("/api/invoices", json=invoice_data)
    assert response.status_code == 201
    data = response.json()
    assert data["total"] == 250.00
    assert data["status"] == "Pending"
