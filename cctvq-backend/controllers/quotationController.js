import Quotation from '../models/Quotation.js';
import mongoose from 'mongoose';

// Create new quotation
export const createQuotation = async (req, res) => {
  try {
    const quotation = new Quotation(req.body);
    await quotation.save();
    res.status(201).json(quotation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all quotations
export const getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single quotation
export const getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid quotation ID' });
    }

    const quotation = await Quotation.findById(id);
    
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    res.json(quotation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update quotation
export const updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid quotation ID' });
    }

    const updatedQuotation = await Quotation.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedQuotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    res.json(updatedQuotation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete quotation
export const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid quotation ID' });
    }

    const deletedQuotation = await Quotation.findByIdAndDelete(id);

    if (!deletedQuotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    res.json({ 
      message: 'Quotation deleted successfully',
      deletedQuotation 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};