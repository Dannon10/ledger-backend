import express from 'express';
import mongoose from 'mongoose';
import dotenv  from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import clientRoutes from './routes/clientRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected sucessfully'))
.catch((err) =>  console.error('MongoDB connection error:', err));

app.get('/ping', (req, res) => {
    res.json({message: 'pong'});
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});