import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

//Test Route
app.get('/', (req , res ) => {
    res.send('Auth Service is Running HUTTO.');
});

//Connect MongoDB and starting the server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Auth Service is running on http://localhost:${PORT}`);
    });
});