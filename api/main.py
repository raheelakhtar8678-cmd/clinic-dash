from fastapi import FastAPI
from api.routes import appointments, invoices
from api.database import engine
from api.models import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(appointments.router)
app.include_router(invoices.router)

@app.get("/api")
def read_root():
    return {"Hello": "ClinicOps AI"}
