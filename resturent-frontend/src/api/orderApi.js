import axios from "./axiosConfig";

const setAuthToken = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Customer actions
export const createOrder = (orderData, token) => {
  setAuthToken(token);
  return axios.post("/orders", orderData);
};

export const getMyOrders = (token) => {
  setAuthToken(token);
  return axios.get("/orders/my-orders");
};

// Admin actions
export const getAllOrders = (token) => {
  setAuthToken(token);
  return axios.get("/orders");
};

export const getOrderById = (id, token) => {
  setAuthToken(token);
  return axios.get(`/orders/${id}`);
};

export const updateOrderStatus = (id, status, token) => {
  setAuthToken(token);
  return axios.put(`/orders/${id}/status`, { status });
};

export const deleteOrder = (id, token) => {
  setAuthToken(token);
  return axios.delete(`/orders/${id}`);
};
// Restaurant owner actions
export const getRestaurantOrders = (restaurantId, token) => {
  setAuthToken(token);
  return axios.get(`/orders/restaurant/${restaurantId}`);
};
