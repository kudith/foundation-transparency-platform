import { create } from "zustand";
import * as authService from "../services/authService";

/**
 * Zustand store for managing authentication state
 */
export const useAuthStore = create((set, get) => ({
  // State
  user: authService.getStoredUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Login action
  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.login(credentials);

      // Hanya simpan user data, token di cookie
      authService.saveAuthData(response.data.user);

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat login";

      set({
        error: errorMessage,
        isLoading: false,
      });

      return { success: false, error: errorMessage };
    }
  },

  // Logout action
  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await authService.logout();
      authService.clearAuthData();

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Logout gagal";

      // Tetap clear data meskipun request gagal
      authService.clearAuthData();

      set({
        user: null,
        isAuthenticated: false,
        error: errorMessage,
        isLoading: false,
      });

      return { success: false, error: errorMessage };
    }
  },

  // Refresh token action
  refreshToken: async () => {
    try {
      const response = await authService.refreshToken();

      // Update user data
      authService.saveAuthData(response.data.user);

      set({
        user: response.data.user,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      console.error("Refresh token failed:", error.message);

      authService.clearAuthData();

      set({
        user: null,
        isAuthenticated: false,
      });

      return { success: false, error: error.message };
    }
  },

  // Get current user from API
  fetchCurrentUser: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.getCurrentUser();

      // Update user data di localStorage
      authService.saveAuthData(response.data);

      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gagal memuat user";

      set({
        error: errorMessage,
        isLoading: false,
      });

      return { success: false, error: errorMessage };
    }
  },

  // Initialize auth from localStorage
  initializeAuth: () => {
    const user = authService.getStoredUser();
    const isAuthenticated = authService.isAuthenticated();

    set({
      user,
      isAuthenticated,
    });
  },

  // Check if user is authenticated
  checkAuth: () => {
    return get().isAuthenticated;
  },

  // Get user data
  getUser: () => {
    return get().user;
  },
}));
