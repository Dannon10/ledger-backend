import express from 'express';
import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    markInvoicePaid,
    deleteInvoice,
} from '../controllers/invoiceController.js';
import { protect } from '../middleware/middleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createInvoice)
    .get(protect, getInvoices);

router.route('/:id')
    .get(protect, getInvoiceById)
    .put(protect, updateInvoice)
    .delete(protect, deleteInvoice);

router.patch('/:id/mark-paid', protect, markInvoicePaid);

export default router;