import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth',  
});

export const registerUser = async (formData) => {
  const response = await API.post('/register', formData);
  return response.data;
};

export const loginUser = async (formData) => {
  const response = await API.post('/login', formData);
  return response.data;
};

export const getAllUsers = async (token) => {
  const response = await API.get('/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (userId, token) => {
  const response = await API.delete(`/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPendingRestaurants = async (token) => {
  const response = await API.get('/restaurants/pending', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const verifyRestaurant = async (restaurantId, token) => {
  const response = await API.patch(
    `/restaurant/${restaurantId}/verify`,
    { verified: true },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};