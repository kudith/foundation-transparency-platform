import apiClient from "../config/api";

/**
 * Milestone Service
 * Service untuk mengelola data milestones
 */

// Get all milestones
export const getAllMilestones = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/milestones?${params}`);
    return {
      success: true,
      data: response.data.data || [],
      count: response.data.count || 0,
    };
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data milestones",
      data: [],
    };
  }
};

// Get milestone by ID
export const getMilestoneById = async (id) => {
  try {
    const response = await apiClient.get(`/milestones/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching milestone:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data milestone",
      data: null,
    };
  }
};

// Get milestones by user ID
export const getMilestonesByUserId = async (userID) => {
  try {
    const response = await apiClient.get(`/milestones/user/${userID}`);
    return {
      success: true,
      data: response.data.data || [],
      count: response.data.count || 0,
    };
  } catch (error) {
    console.error("Error fetching user milestones:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data milestones user",
      data: [],
    };
  }
};

// Get milestone stats
export const getMilestoneStats = async () => {
  try {
    const response = await apiClient.get("/milestones/stats");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching milestone stats:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil statistik milestones",
      data: null,
    };
  }
};

// Create milestone
export const createMilestone = async (milestoneData) => {
  try {
    const response = await apiClient.post("/milestones", milestoneData);
    return {
      success: true,
      data: response.data.data,
      message: "Milestone berhasil dibuat",
    };
  } catch (error) {
    console.error("Error creating milestone:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal membuat milestone",
    };
  }
};

// Update milestone
export const updateMilestone = async (id, milestoneData) => {
  try {
    const response = await apiClient.put(`/milestones/${id}`, milestoneData);
    return {
      success: true,
      data: response.data.data,
      message: "Milestone berhasil diperbarui",
    };
  } catch (error) {
    console.error("Error updating milestone:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal memperbarui milestone",
    };
  }
};

// Delete milestone
export const deleteMilestone = async (id) => {
  try {
    const response = await apiClient.delete(`/milestones/${id}`);
    return {
      success: true,
      message: response.data.message || "Milestone berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting milestone:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal menghapus milestone",
    };
  }
};



