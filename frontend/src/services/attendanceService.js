import apiClient from "../config/api";

/**
 * Attendance Service
 * Service untuk mengelola data attendance/kehadiran
 */

// Get all attendances
export const getAllAttendances = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/attendances?${params}`);
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data attendance",
      data: [],
    };
  }
};

// Get attendance by ID
export const getAttendanceById = async (id) => {
  try {
    const response = await apiClient.get(`/attendances/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data attendance",
      data: null,
    };
  }
};

// Get attendances by event ID
export const getAttendancesByEventId = async (eventId) => {
  try {
    const response = await apiClient.get(`/attendances/event/${eventId}`);
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching attendances by event:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data attendance",
      data: [],
    };
  }
};

// Create new attendance
export const createAttendance = async (attendanceData) => {
  try {
    const response = await apiClient.post("/attendances", attendanceData);
    return {
      success: true,
      data: response.data.data,
      message: "Attendance berhasil dibuat",
    };
  } catch (error) {
    console.error("Error creating attendance:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal membuat attendance",
    };
  }
};

// Update attendance
export const updateAttendance = async (id, attendanceData) => {
  try {
    const response = await apiClient.put(`/attendances/${id}`, attendanceData);
    return {
      success: true,
      data: response.data.data,
      message: "Attendance berhasil diupdate",
    };
  } catch (error) {
    console.error("Error updating attendance:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengupdate attendance",
    };
  }
};

// Delete attendance
export const deleteAttendance = async (id) => {
  try {
    await apiClient.delete(`/attendances/${id}`);
    return {
      success: true,
      message: "Attendance berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting attendance:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal menghapus attendance",
    };
  }
};



