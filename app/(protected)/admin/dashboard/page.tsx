"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Clock,
  TrendingUp,
  Trophy,
  Layers,
  BarChart2,
  Calendar,
  ArrowUpRight,
  RefreshCcw,
  Box,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboard.store";
import { DashboardFilters, FilterParams } from "@/components/admin-dashboard/DashboardFilters";

const DashboardPage = () => {
  const { stats, loading, error, fetchDashboardStats } = useDashboardStore();
  const [filterParams, setFilterParams] = useState<FilterParams>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("dashboardFilterParams");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") return parsed;
        } catch {}
      }
    }
    return { filter: "today" };
  });

  // Persist filterParams to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("dashboardFilterParams", JSON.stringify(filterParams));
    }
  }, [filterParams]);

  useEffect(() => {
    fetchDashboardStats(filterParams);
  }, [filterParams]);

  // Premium Skeleton Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 space-y-8">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-5 w-96 bg-slate-200 rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 animate-pulse" />
          <div className="h-96 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  // Premium Error State
  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl ring-1 ring-slate-900/5 p-8 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-rose-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
            Failed to load dashboard
          </h3>
          <p className="mt-2 text-sm text-slate-500 mb-8">
            {error || "We couldn't fetch the latest data. Please try again."}
          </p>
          <button
            onClick={() => fetchDashboardStats()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry Connection
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
    if (status === "pendingVerification") return "Verifying";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-white pb-20 font-sans">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {/* Dashboard Filters UI */}
        <div className="mb-8">
          <DashboardFilters onChange={setFilterParams} activeFilter={filterParams.filter} />
        </div>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <BarChart2 className="h-8 w-8 text-indigo-500" />
              Overview
            </h1>
            <p className="mt-2 text-slate-500 font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <Separator className="mb-8" />
        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            title="Total Revenue"
            value={`ETB ${totalRevenue.toLocaleString()}`}
            trend="+8.2%"
            icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
            iconBg="bg-gradient-to-br from-emerald-100/80 to-emerald-50"
          />
          <KpiCard
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            trend="+14.1%"
            icon={<ShoppingCart className="h-6 w-6 text-blue-600" />}
            iconBg="bg-gradient-to-br from-blue-100/80 to-blue-50"
          />
          <KpiCard
            title="Total Products"
            value={totalProducts.toString()}
            icon={<Layers className="h-6 w-6 text-violet-600" />}
            iconBg="bg-gradient-to-br from-violet-100/80 to-violet-50"
          />
          <KpiCard
            title="Inventory Alerts"
            value={`${lowStockVariants} low stock`}
            subtext={`${outOfStockProducts} out of stock`}
            icon={<AlertTriangle className="h-6 w-6 text-rose-600" />}
            iconBg="bg-gradient-to-br from-rose-100/80 to-rose-50"
            alert
          />
        </div>

        {/* Middle Section: Chart & Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
          {/* Chart */}
          <Card className="lg:col-span-4 rounded-3xl border-0 shadow-md ring-1 ring-indigo-100 bg-white overflow-hidden">
            <CardHeader className="px-8 pt-8 pb-4">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-indigo-500" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyRevenueTrend}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      dx={-10}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        color: "#0f172a",
                        fontWeight: 500,
                      }}
                      formatter={(value: number) => [`ETB ${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="url(#colorRev)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Order Status */}
          <Card className="lg:col-span-3 rounded-3xl border-0 shadow-md ring-1 ring-indigo-100 bg-white">
            <CardHeader className="px-8 pt-8 pb-6">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Box className="h-5 w-5 text-indigo-500" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(ordersByStatus).slice(0, 6).map(([status, count]) => {
                  const style = getStatusStyle(status);
                  return (
                    <div
                      key={status}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl p-5 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors",
                        style.bg
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn("p-2 rounded-xl", style.color)}>
                          {style.icon}
                        </div>
                        <span className="text-sm font-medium text-slate-600 truncate">
                          {formatStatusLabel(status)}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">
                        {count.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products Lists */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TopList
            title="Top by Revenue"
            icon={<Trophy className="h-5 w-5 text-yellow-500" />}
            items={topProductsByRevenue}
            render={(p: typeof topProductsByRevenue[number]) => (
              <span className="font-semibold text-emerald-600 bg-gradient-to-br from-emerald-50 to-white px-2 py-1 rounded-md text-sm">
                ETB {p.revenue.toLocaleString()}
              </span>
            )}
          />
          <TopList
            title="Top by Volume"
            icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
            items={topProductsByQuantity}
            render={(p: typeof topProductsByQuantity[number]) => (
              <span className="font-semibold text-blue-600 bg-gradient-to-br from-blue-50 to-white px-2 py-1 rounded-md text-sm">
                {p.quantitySold.toLocaleString()} units
              </span>
            )}
          />
          <TopList
            title="Most Frequent"
            icon={<Clock className="h-5 w-5 text-violet-500" />}
            items={topProductsByOrders}
            render={(p: typeof topProductsByOrders[number]) => (
              <span className="font-semibold text-violet-600 bg-gradient-to-br from-violet-50 to-white px-2 py-1 rounded-md text-sm">
                {p.orderCount ?? "?"} orders
              </span>
            )}
          />
        </div>

        {/* High-Contrast Bottom Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-700 to-indigo-600 text-white overflow-hidden shadow-xl shadow-slate-900/10 relative">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-indigo-200 font-medium mb-2 flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Estimated Inventory Value
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                ETB {totalInventoryValue.toLocaleString()}
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                Current total valuation based on standard retail pricing.
              </p>
            </div>
            <div className="flex gap-6 border-t md:border-t-0 md:border-l border-indigo-400/30 pt-6 md:pt-0 md:pl-10 w-full md:w-auto">
              <div>
                <p className="text-slate-200 text-sm mb-1">Out of Stock</p>
                <p className={`text-3xl font-bold ${outOfStockProducts > 0 ? "text-rose-300" : "text-emerald-300"}`}>
                  {outOfStockProducts}
                </p>
              </div>
              <div>
                <p className="text-slate-200 text-sm mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-amber-300">
                  {lowStockVariants}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;

// ── Reusable Premium Components ──────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: string;
  subtext?: string;
  alert?: boolean;
}
function KpiCard({ title, value, icon, iconBg, trend, subtext, alert }: KpiCardProps) {
  return (
    <Card className="rounded-3xl border-0 shadow-sm ring-1 ring-slate-900/5 bg-white relative overflow-hidden transition-all hover:shadow-md">
      {alert && <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />}
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
            {icon}
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-semibold">
              <ArrowUpRight className="w-3 h-3" />
              {trend}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
          {subtext && <p className="text-sm text-slate-500 mt-1">{subtext}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

interface TopListItemBase {
  id: string;
  name: string;
}
type TopListProps<T extends TopListItemBase> = {
  title: string;
  items: T[];
  render: (p: T) => React.ReactNode;
  icon: React.ReactNode;
};
function TopList<T extends TopListItemBase>({ title, items, render, icon }: TopListProps<T>) {
  return (
    <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 p-6 flex flex-col h-full">
      <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="flex-1 flex flex-col gap-1">
        {items.slice(0, 5).map((p, i) => (
          <div
            key={p.id}
            className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <span className="font-medium text-slate-700 truncate text-sm">
                {p.name}
              </span>
            </div>
            <div className="shrink-0 pl-4">{render(p)}</div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-slate-400 text-sm italic p-4 text-center border-2 border-dashed border-slate-100 rounded-2xl mt-2">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}

// Helper for status styling
function getStatusStyle(status: string) {
  switch (status) {
    case "pendingVerification":
      return { icon: <Clock className="h-5 w-5" />, bg: "bg-amber-100", color: "text-amber-600" };
    case "completed":
      return { icon: <DollarSign className="h-5 w-5" />, bg: "bg-emerald-100", color: "text-emerald-600" };
    case "cancelled":
      return { icon: <AlertTriangle className="h-5 w-5" />, bg: "bg-rose-100", color: "text-rose-600" };
    case "processing":
      return { icon: <TrendingUp className="h-5 w-5" />, bg: "bg-blue-100", color: "text-blue-600" };
    case "onHold":
      return { icon: <Package className="h-5 w-5" />, bg: "bg-purple-100", color: "text-purple-600" };
    case "refunded":
      return { icon: <RefreshCcw className="h-5 w-5" />, bg: "bg-slate-200", color: "text-slate-600" };
    default:
      return { icon: <Box className="h-5 w-5" />, bg: "bg-slate-100", color: "text-slate-500" };
  }
}