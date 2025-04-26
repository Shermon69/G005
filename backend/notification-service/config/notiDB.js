import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongoDB connected to notification service.');
    }
    catch (err) {
        console.error('MongoDB connection Error: ', err.message);
        process.exit(1);
    }
};

export default connectDB;