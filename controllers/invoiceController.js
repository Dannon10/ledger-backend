import Invoice from '../models/Invoice.js';

const calculateTotal = (lineItems) => {
    return lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
};

const generateInvoiceNumber = async () => {
    const count = await Invoice.countDocuments();
    return `INV-${String(count + 1).padStart(4, '0')}`;
};

export const createInvoice = async (req, res) => {
    try {
        const { project, client, lineItems, dueDate, status } = req.body;

        if (!project || !client || !lineItems || !dueDate) {
            return res.status(400).json({
                message: 'Project, client, lineItems, and dueDate are required',
            });
        }

        const invoiceNumber = await generateInvoiceNumber();
        const total = calculateTotal(lineItems);

        const invoice = await Invoice.create({
            invoiceNumber,
            project,
            client,
            lineItems,
            total,
            dueDate,
            status,
            createdBy: req.user.id,
        });

        res.status(201).json(invoice);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getInvoices = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.project) filter.project = req.query.project;

        const invoices = await Invoice.find(filter)
            .populate('client', 'name company')
            .populate('project', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json(invoices);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('client', 'name company')
            .populate('project', 'title');

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json(invoice);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const updateInvoice = async (req, res) => {
    try {
        const { project, client, lineItems, dueDate, status } = req.body;

        const updates = { project, client, dueDate, status };

        if (lineItems) {
            updates.lineItems = lineItems;
            updates.total = calculateTotal(lineItems);
        }

        const invoice = await Invoice.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        })
            .populate('client', 'name company')
            .populate('project', 'title');

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json(invoice);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const markInvoicePaid = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { status: 'paid', paidAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json(invoice);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};