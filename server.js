import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();

// Render runs behind a proxy; needed for secure cookies to work properly
app.set('trust proxy', 1);

// CLIENT_URL can be one URL or several separated by commas
const allowedOrigins = [
    'http://localhost:3000',
    ...(process.env.CLIENT_URL || '').split(',').map((o) => o.trim()).filter(Boolean),
];

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (curl, Postman, health checks)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });