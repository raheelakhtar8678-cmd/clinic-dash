import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getOperationalInsights = async (dataSummary: string): Promise<{ billingInsight: string; noShowInsight: string }> => {
  try {
    const response = await apiClient.post('/gemini/operational-insights', { data_summary: dataSummary });
    // The backend now returns a direct JSON object within the 'insights' field.
    const insightsData = response.data.insights;
    return {
      billingInsight: insightsData.billingInsight || "AI is analyzing billing data...",
      noShowInsight: insightsData.noShowInsight || "AI is analyzing attendance patterns..."
    };
  } catch (error) {
    console.error("Error fetching operational insights:", error);
    // It's good practice to check if the error is from Axios and has a response
    if (axios.isAxiosError(error) && error.response) {
      console.error("Backend response:", error.response.data);
    }
    throw error;
  }
};

export const syncGoogleSheet = async (url: string) => {
  try {
    const response = await apiClient.post('/google/sync', { url });
    return response.data;
  } catch (error) {
    console.error('Error syncing Google Sheet:', error);
    throw error;
  }
};

export const explainInvoiceForPatient = async (invoiceDetails: string, userQuestion: string) => {
  try {
    const response = await apiClient.post('/gemini/explain-invoice', {
      invoice_details: invoiceDetails,
      user_question: userQuestion
    });
    return response.data.explanation;
  } catch (error) {
    console.error('Error fetching invoice explanation:', error);
    throw error;
  }
};
