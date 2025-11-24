import apiClient from "../config/api";

/**
 * Report Service
 * Service untuk mengelola report generation dan retrieval
 */

// Get all reports
export const getAllReports = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/reports?${params}`);
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching reports:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data report",
      data: [],
    };
  }
};

// Get report stats
export const getReportStats = async () => {
  try {
    const response = await apiClient.get("/reports/stats");
    return {
      success: true,
      data: response.data.data || {},
    };
  } catch (error) {
    console.error("Error fetching report stats:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil statistik report",
      data: {},
    };
  }
};

// Get report by ID
export const getReportById = async (id) => {
  try {
    const response = await apiClient.get(`/reports/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching report:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data report",
      data: null,
    };
  }
};

// Create new report
export const createReport = async (reportData) => {
  try {
    const response = await apiClient.post("/reports", reportData);
    return {
      success: true,
      data: response.data.data,
      message: "Report berhasil dibuat",
    };
  } catch (error) {
    console.error("Error creating report:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal membuat report",
    };
  }
};

// Create and enqueue report
export const createAndEnqueueReport = async (reportData) => {
  try {
    const response = await apiClient.post("/reports/enqueue", reportData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Report berhasil dibuat dan diproses",
    };
  } catch (error) {
    console.error("Error creating and enqueueing report:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal membuat report",
    };
  }
};

// Enqueue existing report
export const enqueueReport = async (id) => {
  try {
    const response = await apiClient.post(`/reports/${id}/enqueue`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Report berhasil diproses",
    };
  } catch (error) {
    console.error("Error enqueueing report:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal memproses report",
    };
  }
};

// Note: Update report tidak tersedia untuk user
// Status report hanya dikelola oleh worker/backend
// User hanya bisa create report baru atau delete report

// Delete report
export const deleteReport = async (id) => {
  try {
    await apiClient.delete(`/reports/${id}`);
    return {
      success: true,
      message: "Report berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting report:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal menghapus report",
    };
  }
};

// Report type configurations
export const REPORT_TYPES = {
  financial_summary: {
    label: "Ringkasan Finansial",
    description: "Laporan ringkasan pemasukan dan pengeluaran",
    icon: "DollarSign",
    requiredFilters: ["start_date", "end_date"],
    optionalFilters: [],
  },
  community_activity: {
    label: "Aktivitas Komunitas",
    description: "Laporan aktivitas dan event per komunitas",
    icon: "Users",
    requiredFilters: ["community_name", "start_date", "end_date"],
    optionalFilters: [],
  },
  participant_demographics: {
    label: "Demografi Peserta",
    description: "Laporan demografi dan statistik peserta",
    icon: "UserCheck",
    requiredFilters: ["community_name"],
    optionalFilters: [],
  },
  program_impact: {
    label: "Dampak Program",
    description: "Laporan dampak dan hasil program",
    icon: "TrendingUp",
    requiredFilters: ["community_name", "start_date", "end_date"],
    optionalFilters: [],
  },
};

// Status configurations
export const REPORT_STATUS = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    icon: "Clock",
  },
  processing: {
    label: "Diproses",
    color: "bg-blue-500/10 text-blue-700 border-blue-200",
    icon: "Loader",
  },
  completed: {
    label: "Selesai",
    color: "bg-green-500/10 text-green-700 border-green-200",
    icon: "CheckCircle",
  },
  failed: {
    label: "Gagal",
    color: "bg-red-500/10 text-red-700 border-red-200",
    icon: "XCircle",
  },
};

