from fastapi.testclient import TestClient
from api.main import app
import os

client = TestClient(app)

def test_upload_invoices_csv():
    # Create an appointment to associate the invoice with
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

    # Create a dummy CSV file with the correct invoice ID
    csv_content = f"id,total,status\n{invoice_id},300.50,Paid\n"
    with open("test_invoices.csv", "w") as f:
        f.write(csv_content)

    with open("test_invoices.csv", "rb") as f:
        response = client.post("/api/invoices/upload", files={"file": ("test_invoices.csv", f, "text/csv")})

    assert response.status_code == 200
    assert response.json() == {"message": "Invoices updated successfully from CSV."}

    # Verify the invoice was updated
    response = client.get(f"/api/invoices/{invoice_id}")
    updated_invoice = response.json()
    assert updated_invoice is not None
    assert updated_invoice["total"] == 300.50
    assert updated_invoice["status"] == "Paid"

    # Clean up the dummy file and the created records
    os.remove("test_invoices.csv")
    client.delete(f"/api/invoices/{invoice_id}")
    # I'll need to add a delete endpoint for appointments to clean it up too.
    # For now, this is sufficient to make the test pass.
