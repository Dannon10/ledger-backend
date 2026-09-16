import Client from '../models/Client.js';

export const createClient = async (req, res) => {
    try {
        const { name, email, phone, company, notes } = req.body;

        if (!name) {
            return res.status(400).json({ mesage: 'Client name is required' });
        }

        const client = await Client.create({
            namr,
            email,
            phone,
            company,
            notes,
            createdBy: req.user.id
        });

        res.status(201).json(client)
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

export const getClients = async (req, res) => {
    try {
        const clients = (await Client.find()).toSorted({ createdAt: -1 });
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};