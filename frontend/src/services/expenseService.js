import apiClient from "../config/api";

/**
 * Expense Service
 * Service untuk mengelola pengeluaran (expenses)
 */

// Get all expenses
export const getAllExpenses = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/expenses?${params}`);
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data pengeluaran",
      data: [],
    };
  }
};

// Get expense stats
export const getExpenseStats = async () => {
  try {
    const response = await apiClient.get("/expenses/stats");
    return {
      success: true,
      data: response.data.data || { byCategory: [], overall: { total: 0, count: 0 } },
    };
  } catch (error) {
    console.error("Error fetching expense stats:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Gagal mengambil statistik pengeluaran",
      data: { byCategory: [], overall: { total: 0, count: 0 } },
    };
  }
};

// Get expense by ID
export const getExpenseById = async (id) => {
  try {
    const response = await apiClient.get(`/expenses/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching expense:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data pengeluaran",
      data: null,
    };
  }
};

// Create new expense
export const createExpense = async (expenseData) => {
  try {
    const response = await apiClient.post("/expenses", expenseData);
    return {
      success: true,
      data: response.data.data,
      message: "Pengeluaran berhasil ditambahkan",
    };
  } catch (error) {
    console.error("Error creating expense:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal menambahkan pengeluaran",
    };
  }
};

// Update expense
export const updateExpense = async (id, expenseData) => {
  try {
    const response = await apiClient.put(`/expenses/${id}`, expenseData);
    return {
      success: true,
      data: response.data.data,
      message: "Pengeluaran berhasil diperbarui",
    };
  } catch (error) {
    console.error("Error updating expense:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal memperbarui pengeluaran",
    };
  }
};

// Delete expense
export const deleteExpense = async (id) => {
  try {
    await apiClient.delete(`/expenses/${id}`);
    return {
      success: true,
      message: "Pengeluaran berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting expense:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal menghapus pengeluaran",
    };
  }
};

// Expense categories
export const EXPENSE_CATEGORIES = [
  "Operasional",
  "Konsumsi",
  "Transportasi",
  "Perlengkapan",
  "Dokumentasi",
  "Hadiah & Merchandise",
  "Marketing & Promosi",
  "Honorarium",
  "Sewa Tempat",
  "Utilitas",
  "Lainnya",
];

// Format currency to IDR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    "Operasional": "bg-blue-500/10 text-blue-700 border-blue-200",
    "Konsumsi": "bg-orange-500/10 text-orange-700 border-orange-200",
    "Transportasi": "bg-purple-500/10 text-purple-700 border-purple-200",
    "Perlengkapan": "bg-green-500/10 text-green-700 border-green-200",
    "Dokumentasi": "bg-pink-500/10 text-pink-700 border-pink-200",
    "Hadiah & Merchandise": "bg-red-500/10 text-red-700 border-red-200",
    "Marketing & Promosi": "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    "Honorarium": "bg-indigo-500/10 text-indigo-700 border-indigo-200",
    "Sewa Tempat": "bg-teal-500/10 text-teal-700 border-teal-200",
    "Utilitas": "bg-cyan-500/10 text-cyan-700 border-cyan-200",
    "Lainnya": "bg-gray-500/10 text-gray-700 border-gray-200",
  };
  return colors[category] || "bg-gray-500/10 text-gray-700 border-gray-200";
};

