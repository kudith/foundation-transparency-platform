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



