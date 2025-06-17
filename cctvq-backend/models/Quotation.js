import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  product: {
    type: String,
    required: [true, 'Product name is required'],
    enum: ['Camera', 'Monitor', 'DVR'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  gst: {
    type: Number,
    required: [true, 'GST amount is required']
  },
  total: {
    type: Number,
    required: [true, 'Total amount is required']
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

// Calculate total before saving
quotationSchema.pre('save', function(next) {
  if (this.isModified('price') || this.isModified('quantity')) {
    this.gst = this.price * this.quantity * 0.18;
    this.total = (this.price * this.quantity) + this.gst;
  }
  next();
});

export default mongoose.model('Quotation', quotationSchema);