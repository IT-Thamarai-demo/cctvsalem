import React from 'react';
import { FiDollarSign, FiTrash2, FiEdit } from 'react-icons/fi';

export default function QuotationList({ 
  quotations, 
  onRemove, 
  onEdit,
  darkMode = false // Added darkMode prop with default value
}) {
  return (
    <div className={`card p-4 shadow rounded-lg mx-auto ${darkMode ? 'bg-dark text-white' : 'bg-white'}`} 
      style={{ maxWidth: '600px', borderColor: darkMode ? '#444' : '#dee2e6' }}>
      
      <h2 className={`h4 mb-3 d-flex align-items-center ${darkMode ? 'text-light' : 'text-primary'}`}>
        <FiDollarSign className="me-2" />
        Your Quotations
        <span className={`badge ms-auto ${darkMode ? 'bg-secondary' : 'bg-primary'}`}>
          {quotations.length} items
        </span>
      </h2>
      
      {quotations.length === 0 ? (
        <div className={`text-center py-4 ${darkMode ? 'text-light' : 'text-muted'}`}>
          <p>No quotations found. Create your first quotation!</p>
        </div>
      ) : (
        <div className="list-group">
          {quotations.map((q) => (
            <div 
              key={q._id} 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 mb-2 rounded ${darkMode ? 'bg-secondary' : 'bg-light'}`}
            >
              <div>
                <span className="fw-semibold">{q.quantity}x {q.product}</span>
                <div className={`small ${darkMode ? 'text-light' : 'text-muted'}`}>
                  ₹{q.price.toLocaleString()} + ₹{q.gst.toLocaleString()} GST
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className={`fw-bold me-3 ${darkMode ? 'text-info' : 'text-primary'}`}>
                  ₹{q.total.toLocaleString()}
                </span>
                <button 
                  className={`btn btn-sm me-2 ${darkMode ? 'btn-outline-info' : 'btn-outline-primary'}`}
                  onClick={() => onEdit(q)}
                  aria-label="Edit quotation"
                >
                  <FiEdit />
                </button>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onRemove(q._id)}
                  aria-label="Delete quotation"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {quotations.length > 0 && (
        <div className={`mt-3 pt-3 ${darkMode ? 'border-light' : 'border-top'}`}>
          <div className="d-flex justify-content-between fw-bold fs-5">
            <span>Grand Total:</span>
            <span className="text-success">
              ₹{quotations.reduce((sum, q) => sum + q.total, 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}