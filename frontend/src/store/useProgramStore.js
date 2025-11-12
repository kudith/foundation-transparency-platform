import { create } from "zustand";
import {
  getAllPrograms,
  getProgramById,
  getProgramsByCategory,
  getProgramsByStatus,
  getProgramStatistics,
  searchPrograms,
} from "../services/programService";

/**
 * Zustand store for managing programs state
 */
export const useProgramStore = create((set, get) => ({
  // State
  programs: [],
  selectedProgram: null,
  statistics: null,
  loading: false,
  error: null,
  filters: {
    category: null,
    status: null,
    searchKeyword: "",
  },

  // Actions
  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setPrograms: (programs) => set({ programs }),

  setSelectedProgram: (program) => set({ selectedProgram: program }),

  setStatistics: (statistics) => set({ statistics }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  clearFilters: () =>
    set({
      filters: { category: null, status: null, searchKeyword: "" },
    }),

  // Fetch all programs
  fetchPrograms: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllPrograms();
      set({ programs: data, loading: false });
    } catch (error) {
      set({
        error: error.message || "Gagal memuat program",
        loading: false,
      });
    }
  },

  // Fetch program by ID
  fetchProgramById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await getProgramById(id);
      set({ selectedProgram: data, loading: false });
    } catch (error) {
      set({
        error: error.message || "Gagal memuat detail program",
        loading: false,
      });
    }
  },

  // Fetch programs by category
  fetchProgramsByCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      const data = await getProgramsByCategory(category);
      set({ programs: data, loading: false });
    } catch (error) {
      set({
        error: error.message || "Gagal memuat program",
        loading: false,
      });
    }
  },

  // Fetch programs by status
  fetchProgramsByStatus: async (status) => {
    set({ loading: true, error: null });
    try {
      const data = await getProgramsByStatus(status);
      set({ programs: data, loading: false });
    } catch (error) {
      set({
        error: error.message || "Gagal memuat program",
        loading: false,
      });
    }
  },

  // Fetch statistics
  fetchStatistics: async () => {
    try {
      const data = await getProgramStatistics();
      set({ statistics: data });
    } catch (error) {
      console.error("Gagal memuat statistik:", error);
    }
  },

  // Search programs
  searchPrograms: async (keyword) => {
    set({ loading: true, error: null });
    try {
      const data = await searchPrograms(keyword);
      set({ programs: data, loading: false });
    } catch (error) {
      set({
        error: error.message || "Gagal mencari program",
        loading: false,
      });
    }
  },

  // Get filtered programs (computed)
  getFilteredPrograms: () => {
    const { programs, filters } = get();
    let filtered = [...programs];

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    if (filters.searchKeyword) {
      const keyword = filters.searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword)
      );
    }

    return filtered;
  },

  // Get featured programs (first 3)
  getFeaturedPrograms: () => {
    const { programs } = get();
    return programs.slice(0, 3);
  },
}));
