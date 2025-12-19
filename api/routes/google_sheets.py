from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from api.database import get_db
from api.models import models
from api.services.google_sheets_service import get_sheet_data
import re
from pydantic import BaseModel

class SheetURL(BaseModel):
    url: str

router = APIRouter()

def parse_google_sheet_url(url: str):
    # Regex to extract spreadsheet ID and range from URL
    match = re.search(r"/spreadsheets/d/([a-zA-Z0-9-_]+)(?:/edit#gid=(\d+))?", url)
    if not match:
        return None, None

    spreadsheet_id = match.group(1)
    # This is a simplification; a more robust solution would map gid to sheet name
    # For now, we assume the first sheet is the target. A1 notation is used.
    range_name = "Sheet1!A:C"
    return spreadsheet_id, range_name

@router.post("/api/google/sync")
async def sync_google_sheet(sheet_url: SheetURL, db: Session = Depends(get_db)):
    spreadsheet_id, range_name = parse_google_sheet_url(sheet_url.url)
    if not spreadsheet_id:
        raise HTTPException(status_code=400, detail="Invalid Google Sheet URL.")

    try:
        sheet_data = get_sheet_data(spreadsheet_id, range_name)
        if not sheet_data or len(sheet_data) < 2:
            raise HTTPException(status_code=404, detail="No data found in sheet or header row is missing.")

        header = sheet_data[0]
        id_col = header.index("id")
        total_col = header.index("total")
        status_col = header.index("status")

        for row in sheet_data[1:]:
            invoice_id = int(row[id_col])
            invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
            if invoice:
                invoice.total = float(row[total_col])
                invoice.status = row[status_col]

        db.commit()
        return {"message": "Invoices updated successfully from Google Sheet."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
