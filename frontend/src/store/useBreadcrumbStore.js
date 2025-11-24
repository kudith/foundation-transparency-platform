import { create } from "zustand";

/**
 * Breadcrumb Store
 * Used to set custom breadcrumb title for dynamic routes
 */
export const useBreadcrumbStore = create((set) => ({
  customTitle: null,
  dynamicBreadcrumbLabels: {},
  
  setCustomTitle: (title) => set({ customTitle: title }),
  
  clearCustomTitle: () => set({ customTitle: null }),
  
  setDynamicBreadcrumbLabel: (path, label) =>
    set((state) => ({
      dynamicBreadcrumbLabels: {
        ...state.dynamicBreadcrumbLabels,
        [path]: label,
      },
    })),
    
  clearDynamicBreadcrumbLabels: () => set({ dynamicBreadcrumbLabels: {} }),
}));

