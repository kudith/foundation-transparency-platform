import apiClient from "../config/api";

/**
 * Donation Service
 * Service untuk mengelola donations (Cash & InKind)
 */

// Get all donations
export const getAllDonations = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/donations?${params}`);
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching donations:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data donasi",
      data: [],
    };
  }
};

// Get donation stats
export const getDonationStats = async () => {
  try {
    const response = await apiClient.get("/donations/stats");
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching donation stats:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Gagal mengambil statistik donasi",
      data: [],
    };
  }
};

// Get donation by ID
export const getDonationById = async (id) => {
  try {
    const response = await apiClient.get(`/donations/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching donation:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data donasi",
      data: null,
    };
  }
};

// Create new donation
export const createDonation = async (donationData) => {
  try {
    const response = await apiClient.post("/donations", donationData);
    return {
      success: true,
      data: response.data.data,
      message: "Donasi berhasil ditambahkan",
    };
  } catch (error) {
    console.error("Error creating donation:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal menambahkan donasi",
    };
  }
};

// Update donation
export const updateDonation = async (id, donationData) => {
  try {
    const response = await apiClient.put(`/donations/${id}`, donationData);
    return {
      success: true,
      data: response.data.data,
      message: "Donasi berhasil diperbarui",
    };
  } catch (error) {
    console.error("Error updating donation:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal memperbarui donasi",
    };
  }
};

// Delete donation
export const deleteDonation = async (id) => {
  try {
    await apiClient.delete(`/donations/${id}`);
    return {
      success: true,
      message: "Donasi berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting donation:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal menghapus donasi",
    };
  }
};

// Donation type configurations
export const DONATION_TYPES = {
  Cash: {
    label: "Uang Tunai",
    description: "Donasi dalam bentuk uang tunai",
    color: "text-green-600",
  },
  InKind: {
    label: "Barang/Jasa",
    description: "Donasi dalam bentuk barang atau jasa",
    color: "text-blue-600",
  },
};

// InKind categories
export const INKIND_CATEGORIES = [
  "Makanan & Minuman",
  "Pakaian & Tekstil",
  "Alat Tulis & Buku",
  "Elektronik",
  "Peralatan",
  "Jasa/Layanan",
  "Lainnya",
];

// Programs
export const PROGRAMS = ["Cordis Lingua", "Nostracode", "Umum"];

// Format currency to IDR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

