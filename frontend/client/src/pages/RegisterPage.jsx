import { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
    address: '',
    restaurantName: '',
    vehicleType: '',
    license: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      console.error('Registration failed', err.response?.data?.message);
      alert(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-[url('https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-rose-500/30 to-fuchsia-600/30"></div>
      <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">Hello Food</h1>
          <h2 className="text-2xl font-semibold text-white mt-3 opacity-90">Join Our Community</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Common Fields */}
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 placeholder-white/50"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-white">Email Address</label>
            <input
              type="email"
              name="email"
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 placeholder-white/50"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-white">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 placeholder-white/50"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-white">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
              required
            >
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant</option>
              <option value="delivery">Delivery</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-white">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 placeholder-white/50"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-white">Address</label>
            <input
              type="text"
              name="address"
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 placeholder-white/50"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your address"
            />
          </div>

          {/* Extra Fields for Restaurant */}
          {formData.role === 'restaurant' && (
            <div>
              <label className="block mb-1 text-sm font-medium text-white">Restaurant Name</label>
              <input
                type="text"
                name="restaurantName"
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 placeholder-white/50"
                value={formData.restaurantName}
                onChange={handleChange}
                required
                placeholder="Enter restaurant name"
              />
            </div>
          )}

          {/* Extra Fields for Delivery */}
          {formData.role === 'delivery' && (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium text-white">Vehicle Type</label>
                <input
                  type="text"
                  name="vehicleType"
                  className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 placeholder-white/50"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  placeholder="Enter vehicle type"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-white">License Number</label>
                <input
                  type="text"
                  name="license"
                  className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 placeholder-white/50"
                  value={formData.license}
                  onChange={handleChange}
                  required
                  placeholder="Enter license number"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-white text-sm mt-6 opacity-80">
          Already have an account?{' '}
          <a href="/login" className="text-amber-300 hover:text-amber-200 font-medium transition-colors">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}