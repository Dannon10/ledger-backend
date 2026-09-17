import Client from '../models/Client.js';

export const createClient = async (req, res) => {
    try {
        const { name, email, phone, company, notes } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Client name is required' });
        }

        const client = await Client.create({
            name,
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
        const clients = await Client.find().sort({ createdAt: -1 });
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if(!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }   
};

export const updateClient = async (req, res) => {
    try {
        const { name, email, phone, company, notes } = req.body;

        const client = await Client.findByIdAndUpdate(
            req.params.id,
            {name, email, phone, company, notes },
            { new: true, runValidators: true}
        );
        if(!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }

};

export const deleteClient = async (req, res) => {   
    try{ 
        const client = await Client.findByIdAndDelete(req.params.id);

        if(!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
