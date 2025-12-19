from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.database import get_db
from api.models import models
from api.schemas import schemas
from typing import List

router = APIRouter()

@router.get("/api/invoices", response_model=List[schemas.Invoice])
def get_invoices(db: Session = Depends(get_db)):
    return db.query(models.Invoice).all()

@router.post("/api/invoices", response_model=schemas.Invoice, status_code=201)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    db_invoice = models.Invoice(**invoice.model_dump())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice
