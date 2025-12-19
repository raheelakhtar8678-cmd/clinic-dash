import os
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set.")

genai.configure(api_key=GEMINI_API_KEY)

def get_operational_insights(data_summary: str):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"You are an AI consultant for a medical clinic. Based on the following summary of daily metrics: {data_summary}, provide 3 concise operational insights or tips. Focus on billing efficiency and reducing no-shows. Do not provide medical advice."
    response = model.generate_content(prompt)
    return response.text

def explain_invoice_for_patient(invoice_details: str, user_question: str):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"You are a billing assistant. Explain the following invoice in plain language based on the user's question. Invoice Details: {invoice_details}\nPatient Question: {user_question}. Strictly refuse to provide medical advice, diagnosis, or treatment recommendations. If asked a medical question, say: 'I am a billing assistant and cannot provide medical advice. Please contact your clinician.'"
    response = model.generate_content(prompt)
    return response.text
