import transporter from "../config/emailConfig.js";
import nodemailer from 'nodemailer';
import Notification from '../models/notification.js';
import axios from "axios";

export const sendEmail = async (req, res) => {
    const {to, subject, text} = req.body;

    //Basic validation
    if (!to || !subject || !text) {
        return res.status(400).json({ message : "To, subject, and text are required." });
    }

    try {
        //sending the email
        await transporter.sendMail({
            from: `"Food delivery app" <${process.env.EMAIL_USER}>`, //sender
            to,
            subject,
            text
        });

        await Notification.create({
            type: 'email',
            to,
            subject,
            message: text,
            status: 'sent'
        });

        //Generate test preview URL
       // const previewURL = nodemailer.getTestMessageUrl(info);

        res.status(200).json({message: 'Email sent successfully' });

    }
    catch (err) {
        console.error('Error sending Email: ', err.message);

        await Notification.create({
            type: 'email',
            to,
            subject,
            message: text,
            status: 'failed'
        });

        res.ststus(500).json({ message : 'Failed to send email.' });
    }
};

export const sendSMS = async (req, res) => {
    const { to, message } = req.body;

    if (!to || !message ) {
        return res.status(400).json({ message : 'To and message are required.' });
    }
    
    try {
        console.log(`Sending sms to ${to}: ${message}`);

        const response = await axios.post('https://app.notify.lk/api/v1/send', {
            user_id: process.env.NOTIFYLK_USER_ID,
            api_key: process.env.NOTIFYLK_API_KEY,
            sender_id: process.env.NOTIFYLK_SENDER_ID,
            to,
            message
        });

        //log to db
        await Notification.create({
            type: 'sms',
            to,
            message,
            status: 'sent'
        });

        res.status(200).json({ message : 'SMS sent successfully (Notify.lk)', response: response.data });
    }
    catch (err) {
        console.error('Notify.lk SMS error: ', err.message);

        await Notification.create({
            type: 'sms',
            to,
            message,
            status: 'failed'
        });
        
        res.status(500).json({ message : 'Failed to send SMS.'});
    }

};

export const notifyUser = async (req, res) => {
    const { emailTo, smsTo, sms, email } = req.body;

    if (!emailTo || !smsTo) {
        return res.status(400).json({ message : '"to" field is required.' });
    }

    const results = [];

    try {
        //Send email if email is provided
        if (email && email.subject && email.text && emailTo) {
            await transporter.sendMail({
                from: `"Food delivery app" <${process.env.EMAIL_USER}>`,
                to: emailTo,
                subject: email.subject,
                text: email.text
            });

            // const preview = nodemailer.getTestMessageUrl(info);

            await Notification.create({
                type: 'email',
                to: emailTo,
                subject: email.subject,
                message: email.text,
                status: 'sent'
            });

            results.push({ type: 'email', status: 'sent'});
        }

        //send SMS (if provided)
        if (sms && smsTo) {
            await axios.post('https://app.notify.lk/api/v1/send', {
                user_id: process.env.NOTIFYLK_USER_ID,
                api_key: process.env.NOTIFYLK_API_KEY,
                sender_id: process.env.NOTIFYLK_SENDER_ID,
                to: smsTo,
                message: sms
            });

            await Notification.create({
                type: 'sms',
                to: smsTo,
                message: sms,
                status: 'sent'
            });

            results.push({ type: 'sms', status: 'sent'});

        }
        res.status(200).json({ message : 'Notifications sent successfully', results });
    }
    catch (err) {
        console.error('Notify User error: ', err.message);
        res.status(500).json({ message : 'Failed to send notifications.', error: err.message });
    }
};