from fastapi.testclient import TestClient
from api.main import app
from api.services import google_sheets_service
from unittest.mock import patch

client = TestClient(app)

@patch('api.services.google_sheets_service.get_sheet_data')
def test_sync_google_sheet(mock_get_sheet_data):
    # First, create an appointment to associate the invoice with
    appointment_data = {
        "patient_id": 1,
        "patientName": "Test Patient",
        "doctor_id": 1,
        "doctorName": "Test Doctor",
        "datetime": "2024-08-01T10:00:00",
        "status": "Completed"
    }
    appointment_response = client.post("/api/appointments", json=appointment_data)
    appointment = appointment_response.json()
    appointment_id = appointment["id"]

    # Now, create the invoice to be updated
    invoice_data = {
        "appointment_id": appointment_id,
        "patient_id": 1,
        "total": 250.00,
        "status": "Pending",
        "patientName": "Test Patient"
    }
    invoice_response = client.post("/api/invoices", json=invoice_data)
    invoice = invoice_response.json()
    invoice_id = invoice["id"]

    # Mock the response from the Google Sheets service
    mock_get_sheet_data.return_value = [
        ["id", "total", "status"],
        [str(invoice_id), "450.00", "Paid"],
    ]

    # The URL is a dummy one since the service is mocked
    google_sheet_url = "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0"

    response = client.post("/api/google/sync", json={"url": google_sheet_url})

    assert response.status_code == 200
    assert response.json() == {"message": "Invoices updated successfully from Google Sheet."}

    # Verify the invoice was updated
    response = client.get(f"/api/invoices/{invoice_id}")
    updated_invoice = response.json()
    assert updated_invoice is not None
    assert updated_invoice["total"] == 450.00
    assert updated_invoice["status"] == "Paid"

    # Clean up
    client.delete(f"/api/invoices/{invoice_id}")
