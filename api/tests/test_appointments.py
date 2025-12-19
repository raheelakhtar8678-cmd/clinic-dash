from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)

def test_get_appointments():
    response = client.get("/api/appointments")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
