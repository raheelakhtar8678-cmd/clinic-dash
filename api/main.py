from fastapi import FastAPI
from api.routes import appointments, invoices, google_sheets
from api.database import engine
from api.models import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(appointments.router)
app.include_router(invoices.router)
app.include_router(google_sheets.router)

@app.get("/api")
def read_root():
    return {"Hello": "ClinicOps AI"}
