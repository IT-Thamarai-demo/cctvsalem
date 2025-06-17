import React, { useState, useEffect } from 'react';
import { createQuotation, updateQuotation } from '../api';
import { FiCamera, FiMonitor, FiHardDrive, FiSave, FiPlusCircle, FiFileText, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const products = [
  { id: 1, name: 'Camera', price: 2500, icon: <FiCamera /> },
  { id: 2, name: 'Monitor', price: 4500, icon: <FiMonitor /> },
  { id: 3, name: 'DVR', price: 3200, icon: <FiHardDrive /> },
];

export default function QuotationForm({ 
  onAddOrUpdate, 
  editingQuotation, 
  onCancelEdit,
  darkMode = false // Default to false if not provided
}) {
  const [product, setProduct] = useState(products[0]);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingQuotation) {
      const currentProduct = products.find(p => p.name === editingQuotation.product);
      setProduct(currentProduct || products[0]);
      setQuantity(editingQuotation.quantity);
    }
  }, [editingQuotation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const price = product.price * quantity;
      const gst = price * 0.18;
      const total = price + gst;
      
      const quotationData = {
        product: product.name,
        quantity,
        price,
        gst,
        total
      };

      let response;
      if (editingQuotation) {
        response = await updateQuotation(editingQuotation._id, quotationData);
        onAddOrUpdate(response.data, true);
      } else {
        response = await createQuotation(quotationData);
        onAddOrUpdate(response.data, false);
      }

      if (!editingQuotation) {
        setQuantity(1);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      className={`card p-4 shadow rounded-lg mx-auto ${darkMode ? 'bg-dark text-white' : 'bg-white'}`}
      style={{ 
        maxWidth: '600px', 
        borderColor: darkMode ? '#444' : '#dee2e6' 
      }}
      onSubmit={handleSubmit}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={`h4 d-flex align-items-center mb-0 ${darkMode ? 'text-light' : 'text-primary'}`}>
          <FiFileText className="me-2" />
          {editingQuotation ? 'Edit Quotation' : 'Create New Quotation'}
        </h2>
        {editingQuotation && (
          <button 
            type="button" 
            className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
            onClick={onCancelEdit}
          >
            <FiX className="me-1" /> Cancel
          </button>
        )}
      </div>
      
      <div className="row g-3">
        <div className="col-md-6">
          <label className={`form-label fw-semibold small ${darkMode ? 'text-light' : 'text-muted'}`}>
            Select Product
          </label>
          <select 
            className={`form-select form-select-lg ${darkMode ? 'bg-secondary text-white' : 'bg-light'}`}
            onChange={(e) => setProduct(products.find(p => p.name === e.target.value))}
            value={product.name}
            disabled={isSubmitting}
          >
            {products.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} - ₹{p.price}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className={`form-label fw-semibold small ${darkMode ? 'text-light' : 'text-muted'}`}>
            Quantity
          </label>
          <input 
            className={`form-control form-control-lg ${darkMode ? 'bg-secondary text-white' : 'bg-light'}`}
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Math.max(1, +e.target.value))} 
            min="1" 
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className={`mt-4 p-3 rounded ${darkMode ? 'bg-secondary' : 'bg-light'}`}>
        <div className="d-flex justify-content-between mb-2">
          <span className={darkMode ? 'text-light' : 'text-muted'}>Unit Price:</span>
          <span className="fw-semibold">
            {React.cloneElement(product.icon, { className: 'me-2' })}
            ₹{product.price.toLocaleString()}
          </span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className={darkMode ? 'text-light' : 'text-muted'}>Subtotal:</span>
          <span>₹{(product.price * quantity).toLocaleString()}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className={darkMode ? 'text-light' : 'text-muted'}>GST (18%):</span>
          <span className="text-danger">+ ₹{(product.price * quantity * 0.18).toLocaleString()}</span>
        </div>
        <hr className={`my-2 ${darkMode ? 'border-light' : ''}`} />
        <div className="d-flex justify-content-between fw-bold fs-5 text-primary">
          <span>Total Amount:</span>
          <span>₹{(product.price * quantity * 1.18).toLocaleString()}</span>
        </div>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary btn-lg mt-4 w-100 fw-bold d-flex align-items-center justify-content-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            {editingQuotation ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          <>
            {editingQuotation ? (
              <FiSave className="me-2" />
            ) : (
              <FiPlusCircle className="me-2" />
            )}
            {editingQuotation ? 'Update Quotation' : 'Add Quotation'}
          </>
        )}
      </button>
    </form>
  );
}