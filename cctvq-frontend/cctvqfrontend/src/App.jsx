import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuotationForm from './components/QuotationForm';
import QuotationList from './components/QuotationList';
import { fetchQuotations, deleteQuotation } from './api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 

// You don't need to call autoTable(); it attaches itself

import { FiSun, FiMoon, FiDownload } from 'react-icons/fi';

import './App.css';

function App() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    // Load quotations
    const loadQuotations = async () => {
      try {
        const { data } = await fetchQuotations();
        setQuotations(data);
      } catch (error) {
        toast.error('Failed to load quotations');
      } finally {
        setLoading(false);
      }
    };
    loadQuotations();
  }, []);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Generate PDF export
const generatePDF = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('CCTV Quotation Report', 105, 20, { align: 'center' });

  // Date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

  // Clean and format helper
  const cleanNumber = (value) => {
    if (typeof value === 'string') {
      // Remove anything that is not a digit or a dot (.)
      return Number(value.replace(/[^\d.]/g, '')) || 0;
    }
    return Number(value) || 0;
  };

  const tableData = quotations.map((q) => {
    const price = cleanNumber(q.price);
    const gst = cleanNumber(q.gst);
    const total = cleanNumber(q.total);

    return [
      q.product,
      q.quantity,
      `₹${price.toLocaleString()}`,
      `₹${gst.toLocaleString()}`,
      `₹${total.toLocaleString()}`
    ];
  });

  // Generate table
autoTable(doc,({
    head: [['Product', 'Qty', 'Price', 'GST (18%)', 'Total']],
    body: tableData,
    startY: 40,
    theme: 'grid',
    headStyles: {
      fillColor: darkMode ? [44, 62, 80] : [52, 152, 219],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      halign: 'center',
      cellPadding: 5,
      fontSize: 10
    },
    columnStyles: {
      0: { halign: 'left' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' }
    }
  }));

  // Grand Total
  const grandTotal = quotations.reduce((sum, q) => sum + cleanNumber(q.total), 0);
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text(`Grand Total: ₹${grandTotal.toLocaleString()}`,
    105,
    doc.lastAutoTable.finalY + 20,
    { align: 'center' }
  );

  doc.save(`cctv-quotations-${new Date().toISOString().slice(0, 10)}.pdf`);
};



  const handleRemove = async (id) => {
    try {
      await deleteQuotation(id);
      setQuotations(quotations.filter(q => q._id !== id));
      toast.success('Quotation deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete quotation');
    }
  };

  const handleEdit = (quotation) => {
    setEditingQuotation(quotation);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddOrUpdate = (quotation, isUpdate) => {
    if (isUpdate) {
      setQuotations(quotations.map(q => q._id === quotation._id ? quotation : q));
      toast.success('Quotation updated successfully!');
    } else {
      setQuotations([...quotations, quotation]);
      toast.success('Quotation added successfully!');
    }
    setEditingQuotation(null);
  };

  return (
    <div className={`min-vh-100 ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <ToastContainer position="top-center" autoClose={3000} />
      
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-center">
            <h1 className="display-5 fw-bold text-primary mb-2">
              📷 CCTV Quotation System
            </h1>
            <p className="lead text-muted">
              Manage your CCTV equipment quotations
            </p>
          </div>
          
          <div className="d-flex gap-2">
            <button 
              onClick={toggleDarkMode} 
              className="btn btn-outline-secondary"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            
           <button 
  onClick={generatePDF}
  className="btn btn-success"
  disabled={quotations.length === 0}
>
  <FiDownload className="me-2" />
  Export PDF
</button>

          </div>
        </div>
        
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <QuotationForm 
              onAddOrUpdate={handleAddOrUpdate}
              editingQuotation={editingQuotation}
              onCancelEdit={() => setEditingQuotation(null)}
              darkMode={darkMode}
            />
          </div>
          
          <div className="col-12 col-lg-6">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <QuotationList 
                quotations={quotations} 
                onRemove={handleRemove}
                onEdit={handleEdit}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;