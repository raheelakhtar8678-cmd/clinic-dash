
import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { Invoice, Expense } from '../types';
import AddExpenseModal from './AddExpenseModal';

interface FinancialsProps {
  invoices: Invoice[];
  expenses: Expense[];
}

const Financials: React.FC<FinancialsProps> = ({ invoices, expenses }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>('');
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState<boolean>(false);

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    // This is a mock implementation. In a real app, you'd call an API.
    const expenseWithId = { ...newExpense, id: `EXP${Date.now()}` };
    // You would then update the state in the parent component
    console.log("Adding new expense:", expenseWithId);
    setIsAddExpenseModalOpen(false);
  };

  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.total, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleExportCsv = () => {
    const csvRows = [
      ['ID', 'Patient Name', 'Total'], // CSV header
      ...invoices.map(inv => [inv.id, inv.patientName, inv.total.toString()])
    ];

    const csvContent = "data:text/csv;charset=utf-8,"
      + csvRows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "revenue_ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        console.log('Parsed CSV data:', results.data);
        // Here you would typically update your state with the parsed data.
        // For example: setInvoices(results.data as Invoice[]);
        setUploadStatus(`Successfully parsed ${results.data.length} records.`);
      },
      error: (error) => {
        setUploadStatus('Error parsing CSV file.');
        console.error('Error parsing CSV:', error);
      }
    });
  };

  const handleGoogleConnect = () => {
    // In a real application, this would trigger the OAuth flow.
    // For now, we'll simulate a successful connection.
    setIsGoogleConnected(true);
    setSyncStatus('Connected to Google. Please enter a sheet URL.');
  };

  const handleSync = async () => {
    if (!googleSheetUrl) {
      setSyncStatus('Please enter a Google Sheet URL.');
      return;
    }
    try {
      const response = await axios.post('/api/google/sync', { url: googleSheetUrl });
      setSyncStatus(response.data.message);
    } catch (error) {
      setSyncStatus('Error syncing with Google Sheet. Please check the URL and permissions.');
      console.error('Error syncing with Google Sheet:', error);
    }
  };

  return (
    <div className="space-y-10 animate-float">
      {isAddExpenseModalOpen && (
        <AddExpenseModal
          onClose={() => setIsAddExpenseModalOpen(false)}
          onAddExpense={handleAddExpense}
        />
      )}

      {/* CSV Upload Section */}
      <div className="glass-card p-8 rounded-[2.5rem]">
        <h3 className="font-extrabold text-slate-800 text-xl tracking-tighter">Bulk Update Invoices</h3>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Upload a CSV file</p>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <button
                onClick={handleUpload}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-black text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Upload CSV
              </button>
            </div>
            {uploadStatus && <p className="mt-2 text-sm font-bold text-slate-600">{uploadStatus}</p>}
          </div>
          <hr className="border-slate-100" />
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sync from Google Sheets</p>
            <div className="flex items-center gap-4 mt-2">
              {!isGoogleConnected ? (
                <button
                  onClick={handleGoogleConnect}
                  className="bg-red-500 text-white px-6 py-2 rounded-xl font-black text-xs shadow-lg shadow-red-100 hover:bg-red-600 transition-all"
                >
                  Connect to Google
                </button>
              ) : (
                <>
                  <input
                    type="text"
                    value={googleSheetUrl}
                    onChange={(e) => setGoogleSheetUrl(e.target.value)}
                    placeholder="Enter Google Sheet URL"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-200 transition-all"
                  />
                  <button
                    onClick={handleSync}
                    className="bg-green-500 text-white px-6 py-2 rounded-xl font-black text-xs shadow-lg shadow-green-100 hover:bg-green-600 transition-all"
                  >
                    Sync Now
                  </button>
                </>
              )}
            </div>
            {syncStatus && <p className="mt-2 text-sm font-bold text-slate-600">{syncStatus}</p>}
          </div>
        </div>
      </div>

      {/* Dynamic Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card p-10 rounded-[3rem] bg-indigo-500 text-white shadow-2xl shadow-indigo-200">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-8">Net Profit Status</h4>
           <div className="flex items-baseline gap-2">
             <span className="text-5xl font-black tracking-tighter">${(totalRevenue - totalExpenses).toLocaleString()}</span>
           </div>
           <p className="text-xs font-bold mt-4 opacity-80">Margin: {totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(1) : 0}%</p>
        </div>

        <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden">
           <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tighter mb-2">AI Expense Auditor</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Profit & Loss Intelligence</p>
              </div>
              <div className="mt-8 bg-white/5 p-6 rounded-[2rem] border border-white/10 min-h-[120px]">
                 <p className="text-sm font-medium leading-relaxed italic">"AI analysis is temporarily unavailable as we upgrade our systems."</p>
              </div>
           </div>
        </div>
      </div>

      {/* Ledger Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="glass-card rounded-[3rem] overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/60">
            <h3 className="font-black text-slate-800 text-lg">Revenue Ledger</h3>
            <button
              onClick={handleExportCsv}
              className="text-[9px] font-black text-indigo-500 uppercase tracking-widest"
            >
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full">
              <thead className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-6 py-4 text-left">Ref</th>
                  <th className="px-6 py-4 text-left">Patient</th>
                  <th className="px-6 py-4 text-right">Settled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-[11px] font-mono font-black text-indigo-500">{inv.id}</td>
                    <td className="px-6 py-4 text-[11px] font-bold text-slate-700">{inv.patientName}</td>
                    <td className="px-6 py-4 text-right text-xs font-black">${inv.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-[3rem] overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/60">
            <h3 className="font-black text-slate-800 text-lg">Expense Ledger</h3>
            <button
              onClick={() => setIsAddExpenseModalOpen(true)}
              className="text-[9px] font-black text-slate-400 uppercase tracking-widest"
            >
              Add Entry
            </button>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full">
              <thead className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-right">Debit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-6 py-4 text-[11px] font-bold text-slate-700">{exp.category}</td>
                    <td className="px-6 py-4 text-[11px] font-bold text-slate-400">{exp.date}</td>
                    <td className="px-6 py-4 text-right text-xs font-black text-rose-600">-${exp.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financials;
