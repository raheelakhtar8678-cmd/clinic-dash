
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getOperationalInsights = async (dataSummary: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an AI consultant for a medical clinic. Based on the following summary of daily metrics: ${dataSummary}, provide 3 concise operational insights or tips. Focus on billing efficiency and reducing no-shows. Do not provide medical advice.`,
      config: {
        systemInstruction: "You are a billing and administrative assistant. You must not provide medical advice. If a medical question is asked, refuse and redirect.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Unable to load AI insights at this moment.";
  }
};

export const explainInvoiceForPatient = async (invoiceDetails: string, userQuestion: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Invoice Details: ${invoiceDetails}\nPatient Question: ${userQuestion}`,
      config: {
        systemInstruction: "You are a billing assistant. Explain medical invoices in plain language. Strictly refuse to provide medical advice, diagnosis, or treatment recommendations. If asked a medical question, say: 'I am a billing assistant and cannot provide medical advice. Please contact your clinician.'",
        temperature: 0.3,
      }
    });
    return response.text;
  } catch (error) {
    return "I'm having trouble retrieving that information right now. Please try again later.";
  }
};

export const analyzeExpensesAndProfit = async (revenue: number, expenses: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Revenue: $${revenue}. Expenses: ${JSON.stringify(expenses)}. Calculate daily burn rate and profit margin. Provide 2 strategies to reduce overhead.`,
      config: {
        systemInstruction: "You are a healthcare financial analyst. Focus on burn rate, profit per day, and cost per appointment.",
      }
    });
    return response.text;
  } catch (error) {
    return "Financial analysis currently unavailable.";
  }
};

export const getNoShowInsights = async (noShowData: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following clinic no-show data: ${noShowData}. Identify 2 specific trends (e.g., time of day, department) and suggest 3 actionable reduction strategies (e.g., automated SMS, booking deposits). Keep the response structured with headings.`,
      config: {
        systemInstruction: "You are a healthcare operations analyst specializing in patient attendance optimization.",
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    console.error("No-Show Insight Error:", error);
    return "Analysis failed. Monitoring trends internally.";
  }
};

export const runFinancialAudit = async (invoiceData: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this list of recent clinic invoices: ${JSON.stringify(invoiceData)}. Provide a brief audit report (max 150 words) identifying any payment trends, potential revenue leakages, and 2 actionable steps to optimize the revenue cycle.`,
      config: {
        systemInstruction: "You are a senior healthcare financial auditor. Focus purely on revenue cycle management and administrative efficiency.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Audit Error:", error);
    return "Audit failed. Please ensure all financial records are up to date.";
  }
};
