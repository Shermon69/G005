import axios from "./axiosConfig";

const setAuthToken = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// CRUD for restaurant items
export const createItem = (itemData, token) => {
  setAuthToken(token);
  return axios.post("/restaurant-items", itemData);
};

export const getAllItems = (token) => {
  setAuthToken(token);
  return axios.get("/restaurant-items");
};

export const getItemById = (id, token) => {
  setAuthToken(token);
  return axios.get(`/restaurant-items/${id}`);
};

export const updateItem = (id, itemData, token) => {
  setAuthToken(token);
  return axios.put(`/restaurant-items/${id}`, itemData);
};

export const deleteItem = (id, token) => {
  setAuthToken(token);
  return axios.delete(`/restaurant-items/${id}`);
};
