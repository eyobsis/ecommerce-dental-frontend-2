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

  fetchDashboardStats: async (params?: {
    filter?: string;
    from?: Date;
    to?: Date;
  }): Promise<void> => {
    set({ loading: true, error: null });

    try {
      const res = await ecommerceApi.getDashboardStats(params) as DashboardApiResponse;

      if (!res || typeof res !== 'object') {
        throw new Error('No response from server');
      }

      if (!('success' in res)) {
        throw new Error('Malformed response from server');
      }

      if (!res.success) {
        throw new Error(res.message || 'Failed to fetch dashboard statistics');
      }

      set({
        stats: res.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      let message = 'Failed to load dashboard data';
      if (err instanceof ApiError) {
        message = `${err.message} (status ${err.status})`;
      } else if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'string') {
        message = err;
      }
      set({ error: message, loading: false });
      // eslint-disable-next-line no-console
      console.error('[dashboardStore] fetchDashboardStats failed:', err);
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
