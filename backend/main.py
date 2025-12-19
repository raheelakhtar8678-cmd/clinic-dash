from fastapi import FastAPI
from backend.routes import appointments

app = FastAPI()

app.include_router(appointments.router)

@app.get("/")
def read_root():
    return {"Hello": "ClinicOps AI"}
