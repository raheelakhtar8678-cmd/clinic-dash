from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from api.database import get_db
from api.models import models
from api.schemas import schemas
from typing import List
import csv
import io

router = APIRouter()

@router.get("/api/invoices", response_model=List[schemas.Invoice])
def get_invoices(db: Session = Depends(get_db)):
    return db.query(models.Invoice).all()

@router.get("/api/invoices/{invoice_id}", response_model=schemas.Invoice)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.post("/api/invoices", response_model=schemas.Invoice, status_code=201)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    db_invoice = models.Invoice(**invoice.model_dump())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.delete("/api/invoices/{invoice_id}", status_code=204)
def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if invoice:
        db.delete(invoice)
        db.commit()

@router.post("/api/invoices/upload")
async def upload_invoices_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")

    contents = await file.read()
    csv_file = io.StringIO(contents.decode('utf-8'))
    reader = csv.DictReader(csv_file)

    for row in reader:
        invoice_id = int(row.get("id"))
        invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
        if invoice:
            invoice.total = float(row.get("total", invoice.total))
            invoice.status = row.get("status", invoice.status)

    db.commit()
    return {"message": "Invoices updated successfully from CSV."}
