import apiClient from "../config/api";

export const login = async (credentials) => {
  const { data } = await apiClient.post("/auth/login", credentials);
  return data;
};

export const logout = async () => {
  const { data } = await apiClient.post("/auth/logout");
  return data;
};

export const refreshToken = async () => {
  const { data } = await apiClient.post("/auth/refresh");
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};

// Hanya simpan user data, token di httpOnly cookie
export const saveAuthData = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem("user");
  // Cookie akan di-clear oleh backend saat logout
};

export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Check authentication berdasarkan user data
export const isAuthenticated = () => {
  return !!getStoredUser();
};
