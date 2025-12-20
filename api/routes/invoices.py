from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from api.database import SessionLocal
from api.models import models
from api.schemas import schemas
from typing import List
import csv
import io

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
async def upload_invoices_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")

    contents = await file.read()
    csv_file = io.StringIO(contents.decode('utf-8'))
    reader = csv.DictReader(csv_file)

    db = SessionLocal()
    invoice_id = None  # Initialize invoice_id
    try:
        for row in reader:
            invoice_id_str = row.get("id")
            if invoice_id_str is None:
                continue
            invoice_id = int(invoice_id_str)
            invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()

            if invoice:
                print(f"BEFORE: Invoice {invoice_id} - total={invoice.total}, status={invoice.status}")
                invoice.total = float(row.get("total", invoice.total))
                invoice.status = row.get("status", invoice.status)
                print(f"AFTER: Invoice {invoice_id} - total={invoice.total}, status={invoice.status}")

        print("About to commit...")
        db.commit()
        print("Commit successful!")

        if invoice_id: # Check if invoice_id was set
            # Verify immediately after commit
            test_invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
            print(f"VERIFY: Invoice {invoice_id} - total={test_invoice.total}, status={test_invoice.status}")

        return {"message": "Invoices updated successfully from CSV."}

    except Exception as e:
        db.rollback()
        print(f"ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    finally:
        db.close()
