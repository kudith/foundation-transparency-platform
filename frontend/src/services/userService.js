import apiClient from "../config/api";

/**
 * User Service
 * Service untuk mengelola data users
 */

// Get all users
export const getAllUsers = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/users?${params}`);
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data users",
      data: [],
    };
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data user",
      data: null,
    };
  }
};

// Create user
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post("/users", userData);
    return {
      success: true,
      data: response.data.data,
      message: "User berhasil dibuat",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal membuat user",
    };
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/users/${id}`, userData);
    return {
      success: true,
      data: response.data.data,
      message: "User berhasil diperbarui",
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal memperbarui user",
    };
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/users/${id}`);
    return {
      success: true,
      message: response.data.message || "User berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal menghapus user",
    };
  }
};




