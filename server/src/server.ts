import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
    path: path.resolve(__dirname, '../../.env')
})

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';

import connectDB from './config/database';
import limiter from './middleware/rateLimitter';
import errorHandler from './middleware/errorHandler';
import { initSocket } from './socket';

// Routes
import test from './routes/testRoute';
import authRoutes from './routes/authRoutes';
import adminRouter from './routes/admin/usersAdminRoutes'
import profileRouter from './routes/user/profileRoutes'

const app = express();
const server = createServer(app);
const io = initSocket(server);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
// app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(test);
app.use('/auth', authRoutes);
app.use('/admin', adminRouter);
app.use('/user', profileRouter);

// Error handling
app.use(errorHandler);

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`Server running on port -> ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();