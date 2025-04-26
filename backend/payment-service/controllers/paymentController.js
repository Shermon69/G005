import Stripe  from 'stripe';
import dotenv from 'dotenv';
import Transaction from '../models/transaction.js';

dotenv.config();

//initializing stripe using the secret key
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

//initialize a stripe payment intent and storing it
export const createPayment = async (req, res) => {
    try {
        const { amount, userId, email, phone } = req.body;

        //validate input
        if (!amount || !userId || !email || !phone) {
            return res.status(400).json({ message : 'Amount, userId, email and phone are required' });
        }

        //stripe uses amount in cents
        const amountInCents = amount * 100;

        //creating stripe payment intent
        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: amountInCents,
            currency: 'LKR',
            metadata: { userId }
        });

        //storing transaction in DB with status : pending
        const transaction = new Transaction ({
            userId,
            amount,
            email,
            phone,
            currency: 'LKR',
            status: 'pending',
            stripePaymentId: paymentIntent.id
        });

        await transaction.save();

        //return client secret to frontend to complete the payment
        res.status(200).json({ message : 'payment initiated successfully', 
            clientSecret: paymentIntent.client_secret
         });

    }
    catch (err) {
        console.error('Error creating payment.', err.message);
        res.status(500).json({ message : 'Server error. Failed to create the payment' });
    }
};

//updating the payment status manually
export const updateTransactionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['success' , 'failed'].includes(status) ) {
            return res.status(400).json({ message : 'Invalid status value' });
        }

        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ message : 'Transaction not found'});
        }

        transaction.status = status;
        await transaction.save();

        res.status(200).json({ message : `Transaction marked as ${status}` });

    }
    catch (err) {
        console.error('Error in updating the transaction status: ', err.message);
        res.status(500).json({ message : 'Server Error'});
    }
};

//admin only get all transactions
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.status(200).json(transactions);
    }
    catch (err) {
        console.error('Error fetching all transactions.', err.message);
        res.status(500).json({ message : 'Server Error' });
    }
};

export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

    }
    catch (err) {
        console.error('webhook signature verification failed.', err.message);
        return res.status(400).send(`webhook error: ${err.message}`);
    }

    //handling successful payment events
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const intentId = paymentIntent.id;

        try {
            const transaction = await Transaction.findOne({
                stripePaymentId: intentId
            });

            if(transaction) {
                transaction.status = 'success';

                try {
                    await axios.post('http://localhost:5003/api/notifications/notify-user', {
                        emailTo: transaction.email,
                        email: {
                            subject: 'Payment confirmed',
                            text: `Hi! Your payment of RS ${transaction.amount/100} was received. Thank you!` 
                        }
                    });
                    
                    console.log('Notifications sent to user.')
                }
                catch (NotifyError) {
                    console.error('Failed to send notification:', NotifyError.message);
                }

                await transaction.save();
                console.log(`Transaction ${transaction._id} marked as success`);
            } 
            else {
                console.warn(`Transaction not found for intent ${intentId}`);
            }
        }
        catch (err) {
            console.error('Error updating transaction.', err.message);
        }
    }

    res.status(200).json({ received: true });
};

export const getMyTransactions = async (req, res) => {
    try {
        const userId = req.user.id;

        const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json(transactions);
    }
    catch (err) {
        console.error('Error fetching user transactions: ', err.message);
        res.status(500).json({ message : 'Server error' });
    }
};
