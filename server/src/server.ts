import dotenv from 'dotenv';

import path from 'path';
dotenv.config({
    path: path.resolve(__dirname, '../../.env')
})


import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import connectDB from './config/database';
import limiter from './middleware/rateLimitter';
import errorHandler from './middleware/errorHandler';

import test from './routes/testRoute';
import authRoutes from './routes/authRoutes';
import adminRouter from './routes/admin/usersRoutes'
import { checkIfBanned } from './middleware/checkIfBanned';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(helmet());
app.use(cors());
// app.use(morgan('combined'));
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(test);


app.use('/auth', authRoutes);
app.use('/admin',adminRouter)



app.use(errorHandler)


app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});




const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(` Server running on port -> ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();