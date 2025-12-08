import apiClient from "../config/api";

/**
 * Admin Service
 * Service untuk mengelola data admin users
 */

// Get all admins
export const getAllAdmins = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/admins?${params}`);
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching admins:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data admin",
      data: [],
    };
  }
};

// Get admin by ID
export const getAdminById = async (id) => {
  try {
    const response = await apiClient.get(`/admins/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching admin:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data admin",
      data: null,
    };
  }
};

// Create admin
export const createAdmin = async (adminData) => {
  try {
    const response = await apiClient.post("/admins", adminData);
    return {
      success: true,
      data: response.data.data,
      message: "Admin berhasil dibuat",
    };
  } catch (error) {
    console.error("Error creating admin:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal membuat admin",
    };
  }
};

// Update admin
export const updateAdmin = async (id, adminData) => {
  try {
    const response = await apiClient.put(`/admins/${id}`, adminData);
    return {
      success: true,
      data: response.data.data,
      message: "Admin berhasil diperbarui",
    };
  } catch (error) {
    console.error("Error updating admin:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal memperbarui admin",
    };
  }
};

// Delete admin
export const deleteAdmin = async (id) => {
  try {
    const response = await apiClient.delete(`/admins/${id}`);
    return {
      success: true,
      message: response.data.message || "Admin berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting admin:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal menghapus admin",
    };
  }
};



