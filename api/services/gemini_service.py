import os
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set.")

genai.configure(api_key=GEMINI_API_KEY)

import json
from fastapi import HTTPException

def get_operational_insights(data_summary: str):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"""
You are an AI consultant for a medical clinic.
Based on the following summary of daily metrics: {data_summary}.
Provide two distinct insights:
1. A concise operational insight or tip focusing on billing efficiency.
2. A concise analysis of no-show patterns and a tip for reduction.

Return the response as a JSON object with two keys: "billingInsight" and "noShowInsight".
For example:
{{
  "billingInsight": "Your billing process could be streamlined by...",
  "noShowInsight": "The no-show rate is highest on Mondays, consider implementing reminder calls."
}}
"""
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return json.loads(response.text)
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        raise HTTPException(status_code=500, detail=f"AI service error: {e}")

def explain_invoice_for_patient(invoice_details: str, user_question: str):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"You are a billing assistant. Explain the following invoice in plain language based on the user's question. Invoice Details: {invoice_details}\nPatient Question: {user_question}. Strictly refuse to provide medical advice, diagnosis, or treatment recommendations. If asked a medical question, say: 'I am a billing assistant and cannot provide medical advice. Please contact your clinician.'"
    response = model.generate_content(prompt)
    return response.text
