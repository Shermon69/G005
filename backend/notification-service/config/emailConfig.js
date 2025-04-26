import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

//creating email transporter with ethereal.
//Ethereal is a testing tool for email
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter Error.', error);
    }
    else {
        console.log('Email transporter is ready to send emails.');
    }
});

export default transporter;