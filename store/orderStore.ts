/* eslint-disable @typescript-eslint/no-explicit-any */
// store/order/useOrderStore.ts
import { create } from "zustand";
import { IOrder } from "@/types/order-response-dto";
import { getRequest } from "@/app/utils/service";
import { apiClient } from "@/lib/api-client";
import { showError, showSuccess } from "@/app/utils/message";

// Helper to compute status from flags
function resolveStatus(order: IOrder): string {
  if (order.isDelivered) return "Completed";
  if ((order as any).isOutForDelivery) return "Out For Delivery";
  if (order.isDesigned) return "Designed";
  if (order.isAccepted) return "In progress";
  return "Pending";
}

interface OrderStore {
  orders: IOrder[];
  filteredOrders: IOrder[];
  selectedOrder: IOrder | null;
  searchTerm: string;
  statusFilter: string;
  isChat: boolean;

  // Actions
  setOrders: (orders: IOrder[]) => void;
  fetchOrders: () => Promise<void>;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  selectOrder: (order: IOrder | null) => void;
  toggleChat: (value?: boolean) => void;
  updateOrderStatus: (orderId: string, updates: any) => void;
  filterOrders: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  filteredOrders: [],
  selectedOrder: null,
  searchTerm: "",
  statusFilter: "All",
  isChat: false,

  setOrders: (orders) => {
    set({ orders });
    get().filterOrders();
  },

  fetchOrders: async () => {},

  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().filterOrders();
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status });
    get().filterOrders();
  },

  selectOrder: (order) => {
    const current = get().selectedOrder;
    const newOrder = current?.id === order?.id ? null : order;
    set({ selectedOrder: newOrder, isChat: false });
  },

  toggleChat: (value) => set((state) => ({ isChat: value ?? !state.isChat })),
  updateOrderStatus: async (
    orderId: string,
    updates: { decision: string; reason?: string }, // reason optional, only for Remake
  ) => {
    try {
      const response = await apiClient<{ message: string; order: IOrder }>(
        `/update/admin/order/update/${orderId}`,
        {
          method: "POST",
          body: {
            decision: updates.decision,
            ...(updates.reason && { reason: updates.reason }), // only include if provided
          },
        },
      );

      showSuccess(response.message);

      // Update the order in both orders and filteredOrders lists
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? response.order : o,
        ),
        filteredOrders: state.filteredOrders.map((o) =>
          o.id === orderId ? response.order : o,
        ),
      }));
    } catch (err: any) {
      showError(err.message || "Failed to update order status");
    }
  },

  filterOrders: () => {
    const { orders, searchTerm, statusFilter } = get();
    let filtered = orders;

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => resolveStatus(o) === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.patientName?.toLowerCase().includes(term) ||
          o.clinicName?.toLowerCase().includes(term),
      );
    }

    set({ filteredOrders: filtered });
  },
}));
