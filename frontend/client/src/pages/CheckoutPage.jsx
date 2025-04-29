import { useState, useEffect, useContext } from 'react';
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51RH3aaQJF4iMmmgwQa0kEnKlXZ1HJm23AVD7oDxdLMQJVVPxb5zpVeTYyRYC2uiS8ps4xHnmwl3KWMarx0tltiCe00AqaupmGz');

function CheckoutForm() {
  const { user } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();

  // ✅ Mock order data (pretend it came from order-management)
  const mockOrder = {
    amount: 3500,
    email: user?.email || '',
    phone: '+94713398405',
    address: 'No. 12, Galle Road, Colombo',
    orderId: 'ORDER12345'
  };

  const [clientSecret, setClientSecret] = useState('');
  const navigate = useNavigate();


  //  Auto-create payment intent when component loads
  useEffect(() => {
    const initiatePayment = async () => {
      try {
        const response = await axios.post('http://localhost:5002/api/payments/create-payment', {
          amount: mockOrder.amount,
          userId: user.id,
          email: mockOrder.email,
          phone: mockOrder.phone,
          orderId: mockOrder.orderId,
          address: mockOrder.address
        });

        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error('Error initiating payment:', err.response?.data?.message);
        alert('Failed to create payment. Please try again.');
      }
    };

    initiatePayment();
  }, [user]);

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      console.error('Error confirming payment', error.message);
      alert(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      alert('Payment Successful!');
      navigate('/payment-success', {
        state: {
          orderId: mockOrder.orderId,
          address: mockOrder.address,
          phone: mockOrder.phone,
          amount: mockOrder.amount,
          email: mockOrder.email,
          date: new Date().toLocaleString()
        }
      });
      console.log('PaymentIntent:', paymentIntent);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-pink-100 to-rose-200 relative">
      <div className="w-full max-w-4xl rounded-3xl border border-yellow-400/40 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row bg-white/40">

        {/* Left: Order Summary */}
        <div className="flex-1 bg-white/60 p-10 flex flex-col justify-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
          <p className="text-gray-700"><strong>Order ID:</strong> {mockOrder.orderId}</p>
          <p className="text-gray-700"><strong>Email:</strong> {mockOrder.email}</p>
          <p className="text-gray-700"><strong>Phone:</strong> {mockOrder.phone}</p>
          <p className="text-gray-700"><strong>Address:</strong> {mockOrder.address}</p>
          <p className="text-4xl font-bold text-gray-900 mt-4">₨ {mockOrder.amount}</p>
        </div>

        {/* Right: Card Payment */}
        <div className="flex-1 bg-white p-10">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Enter Card Details</h1>
          <form onSubmit={handleConfirmPayment} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-yellow-600 mb-1">Card Details</label>
              <CardElement
                className="p-3 bg-white border border-gray-300 text-gray-900 rounded-xl"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#111827',
                      '::placeholder': { color: '#9ca3af' },
                    },
                    invalid: { color: '#e11d48' },
                  },
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-md hover:from-pink-600 hover:to-rose-600 transition"
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
