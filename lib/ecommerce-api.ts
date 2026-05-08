import type {
  ApiResponse,
  BrandOption,
  Category,
  Order,
  Product,
  ProductFilterOptions,
  ProductVariant,
} from "@/types/ecommerce";
import { endOfDay, startOfDay } from "date-fns";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:3001";

const apiV1 = `${backendUrl}/api/v1`;
export const DEFAULT_ORDER_USER_ID =
  process.env.NEXT_PUBLIC_DEMO_USER_ID || "00000000-0000-0000-0000-000000000001";

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean),
    ),
  );
};

const normalizeFilterOptions = (
  value: unknown,
): ProductFilterOptions => {
  const payload = (value ?? {}) as {
    categories?: unknown;
    brands?: unknown;
    productTypes?: unknown;
    featureKeys?: unknown;
    featureValuesByKey?: unknown;
    variantColors?: unknown;
    variantSizes?: unknown;
    variantSkus?: unknown;
  };

  const categories = Array.isArray(payload.categories)
    ? payload.categories
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const record = item as { id?: unknown; name?: unknown };
          const id = typeof record.id === "string" ? record.id.trim() : "";
          const name = typeof record.name === "string" ? record.name.trim() : "";
          return id && name ? { id, name } : null;
        })
        .filter((item): item is { id: string; name: string } => Boolean(item))
    : [];

  const brands = Array.isArray(payload.brands)
    ? payload.brands
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const record = item as { id?: unknown; name?: unknown };
          const id = typeof record.id === "string" ? record.id.trim() : "";
          const name = typeof record.name === "string" ? record.name.trim() : "";
          return id && name ? { id, name } : null;
        })
        .filter((item): item is { id: string; name: string } => Boolean(item))
    : [];

  const sourceFeatureMap =
    payload.featureValuesByKey && typeof payload.featureValuesByKey === "object"
      ? (payload.featureValuesByKey as Record<string, unknown>)
      : {};

  const featureValuesByKey = Object.fromEntries(
    Object.entries(sourceFeatureMap)
      .map(([key, list]) => [key.trim(), toStringArray(list)] as const)
      .filter(([key]) => Boolean(key)),
  );

  return {
    categories,
    brands,
    productTypes: toStringArray(payload.productTypes),
    featureKeys: toStringArray(payload.featureKeys),
    featureValuesByKey,
    variantColors: toStringArray(payload.variantColors),
    variantSizes: toStringArray(payload.variantSizes),
    variantSkus: toStringArray(payload.variantSkus),
  };
};

export const normalizeOrderUserId = (value?: string | null) =>
  value && /^[0-9a-fA-F-]{36}$/.test(value) ? value : DEFAULT_ORDER_USER_ID;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const hasBody = init.body !== undefined;
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;
  const headers: HeadersInit = {
    ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
    ...(init.headers || {}),
  };

  const response = await fetch(`${apiV1}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed: ${response.status}`);
  }

  return payload as T;
}

export const ecommerceApi = {
  async getProducts(params?: {
    search?: string;
    categoryId?: string[];
    brandId?: string[];
    productType?: string[];
    featureKey?: string[];
    featureValue?: string[];
    variantColor?: string[];
    variantSize?: string[];
    variantSku?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "name" | "price";
    sortOrder?: "asc" | "desc";
  }) {
    const query = new URLSearchParams();

    if (params?.search?.trim()) {
      query.set("search", params.search.trim());
    }

    if (params?.categoryId?.length) {
      query.set("categoryId", params.categoryId.join(","));
    }

    if (params?.brandId?.length) {
      query.set("brandId", params.brandId.join(","));
    }

    if (params?.productType?.length) {
      query.set("productType", params.productType.join(","));
    }

    if (params?.featureKey?.length) {
      query.set("featureKey", params.featureKey.join(","));
    }

    if (params?.featureValue?.length) {
      query.set("featureValue", params.featureValue.join(","));
    }

    if (params?.variantColor?.length) {
      query.set("variantColor", params.variantColor.join(","));
    }

    if (params?.variantSize?.length) {
      query.set("variantSize", params.variantSize.join(","));
    }

    if (params?.variantSku?.length) {
      query.set("variantSku", params.variantSku.join(","));
    }

    if (typeof params?.minPrice === "number") {
      query.set("minPrice", String(params.minPrice));
    }

    if (typeof params?.maxPrice === "number") {
      query.set("maxPrice", String(params.maxPrice));
    }

    if (params?.sortBy) {
      query.set("sortBy", params.sortBy);
    }

    if (params?.sortOrder) {
      query.set("sortOrder", params.sortOrder);
    }

    const queryString = query.toString();
    const path = queryString ? `/products?${queryString}` : "/products";

    return request<ApiResponse<Product[]>>(path);
  },

  async getProduct(id: string) {
    return request<ApiResponse<Product>>(`/products/${id}`);
  },

  async createProduct(
    data:
      | {
          name: string;
          price: string;
          description?: string;
          categoryId?: string;
          features?: Array<string | { feature: string; featureKey?: string; featureValue?: string }>;
          variants?: Array<{
            name: string;
            sku?: string;
            color?: string;
            size?: string;
            additionalPrice?: string;
            stock?: number;
          }>;
          images?: string[];
        }
      | FormData,
  ) {
    return request<ApiResponse<Product>>("/products", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  async updateProduct(
    id: string,
    data:
      | {
          name?: string;
          price?: string;
          description?: string;
          categoryId?: string;
          features?: Array<string | { feature: string; featureKey?: string; featureValue?: string }>;
          variants?: Array<{
            name: string;
            sku?: string;
            color?: string;
            size?: string;
            additionalPrice?: string;
            stock?: number;
          }>;
          images?: string[];
        }
      | FormData,
  ) {
    return request<ApiResponse<Product>>(`/products/${id}`, {
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  async deleteProduct(id: string) {
    return request<ApiResponse<null>>(`/products/${id}`, {
      method: "DELETE",
    });
  },

  async getCategories() {
    return request<ApiResponse<Category[]>>("/categories");
  },

  async getProductFilterOptions() {
    const response = await request<ApiResponse<ProductFilterOptions>>(
      "/products/filters",
    );

    return {
      ...response,
      data: normalizeFilterOptions(response.data),
    };
  },

  async getBrands() {
    return request<ApiResponse<BrandOption[]>>("/brands");
  },

  async createCategory(data: { name: string }) {
    return request<ApiResponse<Category>>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getVariantsByProduct(productId: string) {
    return request<ApiResponse<ProductVariant[]>>(`/variants/product/${productId}`);
  },

  async createVariant(data: {
    productId: string;
    name: string;
    additionalPrice?: string;
    stock?: number;
  }) {
    return request<ApiResponse<ProductVariant>>("/variants", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getDashboardStats(params?: {
    filter?: string;
    from?: Date | string;
    to?: Date | string;
  }) {
    const query = new URLSearchParams();

    if (params?.filter) query.set("filter", params.filter);

    if (params?.from && params?.to) {
      const fromStr =
        params.from instanceof Date
          ? startOfDay(params.from).toISOString()
          : params.from;
      const toStr =
        params.to instanceof Date
          ? endOfDay(params.to).toISOString()
          : params.to;
      query.set("from", fromStr);
      query.set("to", toStr);
    }

    const queryString = query.toString();
    return request(`/dashboard${queryString ? `?${queryString}` : ""}`);
  },

  async getOrders() {
    return request<ApiResponse<Order[]>>("/orders");
  },

  async getUsers() {
    return request<
      ApiResponse<
        Array<{
          id: string;
          name: string | null;
          email: string;
          userStatus: "active" | "inactive" | "pending" | "blocked";
          userType: "owner" | "admin" | "accountant" | "client" | "super_admin";
          createdAt: string;
        }>
      >
    >("/users");
  },

  async getUserOrders(userId: string) {
    return request<ApiResponse<Order[]>>(`/orders/user/${userId}`);
  },

  async updateOrderStatus(id: string, status: string) {
    return request<ApiResponse<Order>>(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  async quickCheckout(data: {
    userId?: string;
    totalAmount: string;
    items: Array<{ id: string; name: string; price: number; quantity: number }>;
  }) {
    return request<ApiResponse<Order>>("/orders/quick-checkout", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
