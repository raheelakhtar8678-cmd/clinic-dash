from fastapi import APIRouter
from pydantic import BaseModel
from api.services import gemini_service

router = APIRouter()

class GeminiRequest(BaseModel):
    data_summary: str

class ExplainInvoiceRequest(BaseModel):
    invoice_details: str
    user_question: str

@router.post("/api/gemini/operational-insights")
def get_insights(request: GeminiRequest):
    print(f"Received request for operational insights with summary: {request.data_summary}")
    insights = gemini_service.get_operational_insights(request.data_summary)
    print(f"Returning insights: {insights}")
    return {"insights": insights}

@router.post("/api/gemini/explain-invoice")
def explain_invoice(request: ExplainInvoiceRequest):
    return {"explanation": gemini_service.explain_invoice_for_patient(request.invoice_details, request.user_question)}
