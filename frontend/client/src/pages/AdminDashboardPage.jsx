import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser, getPendingRestaurants, verifyRestaurant } from '../services/authService';

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert('You must be an admin to access this page.');
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
    }
  };

  // Fetch pending restaurants
  const fetchPendingRestaurants = async () => {
    try {
      const data = await getPendingRestaurants(token);
      setRestaurants(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending restaurants.');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId, token);
      setUsers(users.filter(user => user._id !== userId));
      setMessage('User deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  // Verify restaurant
  const handleVerifyRestaurant = async (restaurantId) => {
    try {
      await verifyRestaurant(restaurantId, token);
      setRestaurants(restaurants.filter(restaurant => restaurant._id !== restaurantId));
      setMessage('Restaurant verified successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify restaurant.');
    }
  };

  // Fetch data on mount
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
      fetchPendingRestaurants();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-sans font-bold text-gray-800 mb-12 text-center">
          Admin Dashboard
        </h1>

        {/* Messages */}
        {message && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-8 text-center border border-green-200">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 text-center border border-red-200">
            {error}
          </div>
        )}

        {/* Users Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h2>
          {users.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-800">
                    <th className="border border-gray-200 p-4 text-left rounded-tl-lg">Name</th>
                    <th className="border border-gray-200 p-4 text-left">Email</th>
                    <th className="border border-gray-200 p-4 text-left">Role</th>
                    <th className="border border-gray-200 p-4 text-left rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                      <td className="border border-gray-200 p-4 text-gray-700">{user.name}</td>
                      <td className="border border-gray-200 p-4 text-gray-700">{user.email}</td>
                      <td className="border border-gray-200 p-4 text-gray-700">{user.role}</td>
                      <td className="border border-gray-200 p-4">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 active:scale-95"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Restaurants Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Restaurants</h2>
          {restaurants.length === 0 ? (
            <p className="text-gray-500">No pending restaurants.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-800">
                    <th className="border border-gray-200 p-4 text-left rounded-tl-lg">Restaurant Name</th>
                    <th className="border border-gray-200 p-4 text-left">Owner Email</th>
                    <th className="border border-gray-200 p-4 text-left rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map(restaurant => (
                    <tr key={restaurant._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                      <td className="border border-gray-200 p-4 text-gray-700">{restaurant.restaurantName}</td>
                      <td className="border border-gray-200 p-4 text-gray-700">{restaurant.email}</td>
                      <td className="border border-gray-200 p-4">
                        <button
                          onClick={() => handleVerifyRestaurant(restaurant._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 active:scale-95"
                        >
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}