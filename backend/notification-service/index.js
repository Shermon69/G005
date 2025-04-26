import express from 'express';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notificationRoutes.js';
import connectDB from './config/notiDB.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/notifications', notificationRoutes);


const PORT = process.env.PORT || 5003;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Notification server is running on ${PORT}`);
    });
});
