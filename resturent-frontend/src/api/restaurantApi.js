import axios from "./axiosConfig";

const setAuthToken = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const registerRestaurant = (restaurantData) => {
  return axios.post("/restaurants/register", restaurantData);
};

export const loginRestaurant = (credentials) => {
  return axios.post("/restaurants/login", credentials);
};

export const getRestaurantProfile = (token) => {
  setAuthToken(token);
  return axios.get("/restaurants/profile");
};
export const getRestaurantById = (id) => {
  return axios.get("/restaurants/" + id);
};

export const updateRestaurantProfile = (data, token) => {
  setAuthToken(token);
  return axios.put("/restaurants/profile", data);
};

export const deleteRestaurantProfile = (token) => {
  setAuthToken(token);
  return axios.delete("/restaurants/profile");
};

export const getAllRestaurants = (token, activeStatus) => {
  setAuthToken(token);
  const params = activeStatus !== undefined ? { activeStatus } : {};
  return axios.get("/restaurants", { params });
};

export const changeRestaurantPassword = (newPassword, token) => {
  setAuthToken(token);
  return axios.put("/restaurants/change-password", { newPassword });
};
