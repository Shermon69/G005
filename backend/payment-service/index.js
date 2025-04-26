import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/paymentDB.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();

app.use(cors());

app.use((req, res, next) => {
    //Bypass JSON parsing ONLY for webhook route
    if(req.originalUrl === '/api/payments/webhook') {
        next();
    } else {
        express.json()(req, res, next); //parse JSON for other routes
    }
});

app.use('/api/payments',paymentRoutes);

//test route
app.get('/', (req, res) => {
    res.send('Payment Service is Running.');
});

const PORT = process.env.PORT || 5002;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Payment service is running at port ${PORT}`);
    });
});

