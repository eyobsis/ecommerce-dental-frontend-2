// src/stores/dashboardStore.ts
import { create } from "zustand";
import { ecommerceApi } from "@/lib/ecommerce-api";
import { ApiError } from "@/lib/api-error";
import type { ApiResponse } from "@/types/ecommerce";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

export interface TopProduct {
  id: string;
  name: string;
  revenue: number;
  quantitySold: number;
  orderCount?: number;
}

export interface MonthlyTrend {
  month: string; // e.g. "2025-11"
  revenue: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  ordersByStatus: {
    pendingVerification: number;
    pending: number;
    paid: number;
    shipped: number;
    completed: number;
    // ... other statuses if you add more
  };
  totalProducts: number;
  totalInventoryValue: number;
  outOfStockProducts: number;
  lowStockVariants: number;
  topProductsByRevenue: TopProduct[];
  topProductsByQuantity: TopProduct[];
  topProductsByOrders: TopProduct[];
  monthlyRevenueTrend: MonthlyTrend[];
}

type DashboardApiResponse = ApiResponse<DashboardStats>;

interface DashboardStore {
  // Data
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchDashboardStats: () => Promise<void>;

  // Optional: reset / clear
  reset: () => void;
}

// ────────────────────────────────────────────────
// Store
// ────────────────────────────────────────────────

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  loading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ loading: true, error: null });

    try {
      const response = (await ecommerceApi.getDashboardStats()) as DashboardApiResponse;

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch dashboard statistics",
        );
      }

      set({
        stats: response.data,
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
      let message = "Failed to load dashboard data";

      if (err instanceof ApiError) {
        message = `${err.message} (status ${err.status})`;
      } else if (err instanceof Error) {
        message = err.message;
      }

      set({
        loading: false,
        error: message,
      });

      console.error("[dashboardStore] fetchDashboardStats failed:", err);
    }
  },

  reset: () => {
    set({
      stats: null,
      loading: false,
      error: null,
    });
  },
}));
