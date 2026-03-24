"use client";

import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useDashboardStore } from "@/store/dashboard.store";

const DashboardPage = () => {
  const { stats, loading, error, fetchDashboardStats } = useDashboardStore();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600 animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Something went wrong
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {error || "No data available"}
          </p>
          <button
            onClick={() => fetchDashboardStats()}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    totalRevenue,
    totalOrders,
    ordersByStatus,
    totalProducts,
    totalInventoryValue,
    outOfStockProducts,
    lowStockVariants,
    topProductsByRevenue,
    topProductsByQuantity,
    topProductsByOrders,
    monthlyRevenueTrend,
  } = stats;

  const formatStatusLabel = (status: string) => {
    if (status === "pendingVerification") return "Pending Verification";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Business Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Overview of sales, inventory, and performance •{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KpiCard
            title="Total Revenue"
            value={`ETB ${totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-7 w-7 text-green-600" />}
            trend="+8.2%"
            bg="bg-green-50 border-green-200"
          />
          <KpiCard
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            icon={<ShoppingCart className="h-7 w-7 text-blue-600" />}
            trend="+14%"
            bg="bg-blue-50 border-blue-200"
          />
          <KpiCard
            title="Total Products"
            value={totalProducts.toString()}
            icon={<Package className="h-7 w-7 text-purple-600" />}
            bg="bg-purple-50 border-purple-200"
          />
          <KpiCard
            title="Low Stock Alerts"
            value={`${lowStockVariants} variants • ${outOfStockProducts} out of stock`}
            icon={<AlertTriangle className="h-7 w-7 text-red-600" />}
            urgent={lowStockVariants > 0 || outOfStockProducts > 0}
            bg={
              lowStockVariants > 0
                ? "bg-red-50 border-red-200"
                : "bg-gray-50 border-gray-200"
            }
          />
        </div>

        {/* Two-column layout for charts & lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Monthly Revenue Trend
              </h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyRevenueTrend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [
                      `ETB ${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Order Status Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(ordersByStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="text-center p-5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <p className="text-3xl font-bold text-gray-800">{count}</p>
                  <p className="text-sm text-gray-600 capitalize mt-1">
                    {formatStatusLabel(status)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Top Performing Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TopList
              title="By Revenue"
              items={topProductsByRevenue}
              render={(p) => (
                <span className="font-medium">
                  ETB {p.revenue.toLocaleString()}
                </span>
              )}
            />
            <TopList
              title="By Units Sold"
              items={topProductsByQuantity}
              render={(p) => (
                <span className="font-medium">
                  {p.quantitySold.toLocaleString()} units
                </span>
              )}
            />
            <TopList
              title="Most Frequent"
              items={topProductsByOrders}
              render={(p) => (
                <span className="font-medium">
                  {p.orderCount ?? "?"} orders
                </span>
              )}
            />
          </div>
        </div>

        {/* Inventory Value Summary */}
        <div className="mt-10 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-indigo-900">
                Total Inventory Value
              </h2>
              <p className="text-4xl font-extrabold text-indigo-700 mt-2">
                ETB {totalInventoryValue.toLocaleString()}
              </p>
              <p className="text-sm text-indigo-700 mt-1 opacity-80">
                Current estimated value at retail prices
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Out of stock products</p>
              <p
                className={`text-2xl font-bold ${outOfStockProducts > 0 ? "text-red-600" : "text-green-600"}`}
              >
                {outOfStockProducts}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Reusable Components ──────────────────────────────────────────────

type KpiCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  urgent?: boolean;
  bg?: string;
};

function KpiCard({
  title,
  value,
  icon,
  trend,
  urgent = false,
  bg = "bg-white",
}: KpiCardProps) {
  return (
    <div
      className={`${bg} rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow ${urgent ? "border-l-4 border-red-500" : "border-gray-200"}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>
          )}
        </div>
        <div className="p-3 bg-white rounded-lg shadow-sm">{icon}</div>
      </div>
    </div>
  );
}

type TopListProps<T> = {
  title: string;
  items: T[];
  render: (item: T) => React.ReactNode;
};

function TopList<T extends { id: string; name: string }>({
  title,
  items,
  render,
}: TopListProps<T>) {
  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
        {title}
      </h3>
      <ul className="space-y-3">
        {items.slice(0, 5).map((p, i) => (
          <li
            key={p.id}
            className="flex justify-between items-center text-sm py-1 hover:bg-gray-50 px-2 rounded transition-colors"
          >
            <span className="font-medium truncate max-w-[180px]">
              {i + 1}. {p.name}
            </span>
            {render(p)}
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-gray-500 text-sm italic">No data yet</li>
        )}
      </ul>
    </div>
  );
}

export default DashboardPage;
