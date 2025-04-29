// src/pages/PaymentSuccess.jsx
import { Link, useLocation } from 'react-router-dom';

export default function PaymentSuccess() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700">No payment details available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 to-blue-200">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Payment Confirmed!</h1>
        <p className="text-gray-700 mb-6">Thank you for your payment. Here's your receipt:</p>

        <div className="text-left bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6 shadow-sm">
          <p><strong>Order ID:</strong> {state.orderId}</p>
          <p><strong>Address:</strong> {state.address}</p>
          <p><strong>Phone:</strong> {state.phone}</p>
          <p><strong>Email:</strong> {state.email}</p>
          <p><strong>Amount:</strong> Rs. {state.amount}</p>
          <p><strong>Date:</strong> {state.date}</p>
          <p><strong>Status:</strong> Success</p>
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            to="/track-order"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
          >
            Track Delivery
          </Link>
          <Link
            to="/"
            className="bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 px-4 rounded-lg transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
