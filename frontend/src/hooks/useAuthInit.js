import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Hook untuk initialize auth state saat aplikasi dimuat
 * Gunakan di root component (App.jsx atau main.jsx)
 */
export const useAuthInit = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
};
