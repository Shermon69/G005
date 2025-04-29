import { useState, useContext } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      login(data.user, data.token);
      alert('Login successful!');
      if (data.user.role === 'admin') {
        navigate('/adminDash');
      } else {
        navigate('/checkout');
      }
    } catch (err) {
      console.error('Login failed', err.response?.data?.message);
      alert(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-[url('https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-rose-500/30 to-fuchsia-600/30"></div>
      <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">Hello Food</h1>
          <h2 className="text-2xl font-semibold text-white mt-3 opacity-90">Welcome Back</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 placeholder-white/50"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-white">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 placeholder-white/50"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-white text-sm mt-6 opacity-80">
          Don't have an account?{' '}
          <a href="/register" className="text-amber-300 hover:text-amber-200 font-medium transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}