import express from 'express';
import { 
  createQuotation, 
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation 
} from '../controllers/quotationController.js';

const router = express.Router();

router.post('/quotations', createQuotation);
router.get('/quotations', getQuotations);
router.get('/quotations/:id', getQuotationById);
router.put('/quotations/:id', updateQuotation);
router.delete('/quotations/:id', deleteQuotation);

export default router;