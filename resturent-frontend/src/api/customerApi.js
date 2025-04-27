import axios from "./axiosConfig";

const setAuthToken = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Public
export const registerCustomer = (customerData) => {
  return axios.post("/customers/register", customerData);
};

export const loginCustomer = (credentials) => {
  return axios.post("/customers/login", credentials);
};

// Authenticated
export const getCustomerProfile = (token) => {
  setAuthToken(token);
  return axios.get("/customers/profile");
};

export const updateCustomerProfile = (data, token) => {
  setAuthToken(token);
  return axios.put("/customers/profile", data);
};

export const deleteCustomerProfile = (token) => {
  setAuthToken(token);
  return axios.delete("/customers/profile");
};

export const changeCustomerPassword = (newPassword, token) => {
  setAuthToken(token);
  return axios.put("/customers/change-password", { newPassword });
};

// Admin-level (optional)
export const getAllCustomers = (token) => {
  setAuthToken(token);
  return axios.get("/customers/all");
};
