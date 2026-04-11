"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import {
  Activity,
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

// Shadcn UI
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboard.store";
import {
  DashboardFilters,
  FilterParams,
} from "@/components/admin-dashboard/DashboardFilters";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function DashboardPage() {
  const { stats, loading, error, fetchDashboardStats } = useDashboardStore();

  const [filterParams, setFilterParams] = useState<FilterParams>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("dashboardFilterParams");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            const normalized: FilterParams = {};
            if (parsed.filter) {
              normalized.filter = parsed.filter;
            }
            if (parsed.from && parsed.to) {
              const from = new Date(parsed.from);
              const to = new Date(parsed.to);
              if (
                !Number.isNaN(from.getTime()) &&
                !Number.isNaN(to.getTime())
              ) {
                normalized.from = from;
                normalized.to = to;
              }
            }
            if (normalized.from && normalized.to) {
              return normalized;
            }
            if (normalized.filter) {
              return normalized;
            }
          }
        } catch {}
      }
    }
    return { filter: "today" };
  });

  // Persist filterParams to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "dashboardFilterParams",
        JSON.stringify(filterParams),
      );
    }
  }, [filterParams]);

  useEffect(() => {
    fetchDashboardStats(filterParams);
  }, [filterParams, fetchDashboardStats]);

  // --- Shadcn Skeleton Loader ---
  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-5 w-[350px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <Skeleton className="h-[320px] lg:col-span-4 rounded-xl" />
          <Skeleton className="h-[320px] lg:col-span-3 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-[320px] rounded-xl" />
        </div>
      </div>
    );
  }

  // --- Shadcn Error State ---
  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">
          Failed to load dashboard
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {error || "We couldn't fetch the latest data. Please try again."}
        </p>
        <Button
          onClick={() => fetchDashboardStats()}
          variant="default"
          className="mt-4"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry Connection
        </Button>
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

  const statusChartData = Object.entries(ordersByStatus)
    .map(([status, count]) => ({
      status,
      label: formatStatusLabel(status),
      value: Number(count) || 0,
    }))
    .filter((item) => item.value > 0);

  const revenueTrendWithAverage = monthlyRevenueTrend.map((item, idx, arr) => {
    const runningTotal = arr
      .slice(0, idx + 1)
      .reduce((sum, current) => sum + current.revenue, 0);
    return {
      ...item,
      avg: Math.round(runningTotal / (idx + 1)),
    };
  });

  const topRevenueChartData = topProductsByRevenue.slice(0, 6).map((item) => ({
    name: item.name.length > 12 ? `${item.name.slice(0, 12)}...` : item.name,
    revenue: item.revenue,
    quantity: item.quantitySold,
  }));

  const chartColors = [
    "#3b82f6",
    "#f97316",
    "#10b981",
    "#f43f5e",
    "#8b5cf6",
    "#eab308",
    "#14b8a6",
    "#ec4899",
  ];

  return (
    <div className="p-6 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        Welcome back, Admin!
      </h1>

      {/* HEADER & FILTERS */}
      <Card className="border-0 bg-gradient-to-r from-slate-50 to-white shadow-sm ring-1 ring-slate-200/60">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-muted-foreground">
                <Activity className="h-3.5 w-3.5 text-primary" />
                Live commerce intelligence
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  <BarChart2 className="h-8 w-8 text-primary" />
                  Dashboard Overview
                </h2>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <DashboardFilters
              onChange={setFilterParams}
              activeFilter={filterParams.filter}
              activeFrom={filterParams.from}
              activeTo={filterParams.to}
            />
          </div>
        </CardContent>
      </Card>

      {/* KPI CARDS (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={`ETB ${totalRevenue.toLocaleString()}`}
          // trend="+8.2% from last month"
          icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
        />
        <KpiCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          // trend="+14.1% from last month"
          icon={<ShoppingCart className="h-4 w-4 text-blue-600" />}
        />
        <KpiCard
          title="Total Products"
          value={totalProducts.toString()}
          subtext="Active in catalog"
          icon={<Layers className="h-4 w-4 text-violet-600" />}
        />
        <KpiCard
          title="Inventory Alerts"
          value={`${lowStockVariants} low`}
          subtext={`${outOfStockProducts} completely out of stock`}
          icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
          alert={outOfStockProducts > 0}
        />
      </div>

      {/* REVENUE TREND */}
      <div className="grid grid-cols-1 gap-4">
        
        {/* Main Chart */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Monthly revenue plus running average based on your real orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[320px] w-full"
              config={{
                revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
                avg: { label: "Avg Revenue", color: "hsl(var(--chart-3))" },
              }}
            >
              <AreaChart
                data={revenueTrendWithAverage}
                margin={{ top: 10, right: 12, left: -12, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.45}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.08}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <div className="flex w-full items-center justify-between gap-3">
                          <span className="text-muted-foreground">{name}</span>
                          <span className="font-medium">
                            ETB {Number(value).toLocaleString()}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="url(#revenueGradient)"
                  stroke="var(--color-revenue)"
                  strokeWidth={2.5}
                />
                <Area
                  dataKey="avg"
                  type="monotone"
                  fill="none"
                  stroke="var(--color-avg)"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ORDER STATUS + DISTRIBUTION (ONE ROW) */}
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">

        {/* Order Status Grid */}
        <Card className="xl:col-span-4 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Order Status Pipeline</CardTitle>
            <CardDescription>
              Distribution of active and completed orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(ordersByStatus)
                .slice(0, 6)
                .map(([status, count]) => {
                  const style = getStatusStyle(status);
                  return (
                    <div
                      key={status}
                      className={cn(
                        "p-4 rounded-xl border bg-card transition-colors hover:bg-muted/50",
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={cn(
                            "p-1.5 rounded-md",
                            style.bg,
                            style.color,
                          )}
                        >
                          {style.icon}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground truncate">
                          {formatStatusLabel(status)}
                        </span>
                      </div>
                      <div className="text-2xl font-bold tracking-tight">
                        {count.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
        <Card className="xl:col-span-3 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>
              Donut chart of order lifecycle stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px] w-full"
              config={{
                value: { label: "Orders", color: "hsl(var(--chart-1))" },
              }}
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      formatter={(value, name) => (
                        <div className="flex w-full items-center justify-between gap-3">
                          <span className="text-muted-foreground">{name}</span>
                          <span className="font-medium">
                            {Number(value).toLocaleString()} orders
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Pie
                  data={statusChartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={72}
                  outerRadius={108}
                  paddingAngle={3}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell
                      key={entry.status}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="label" />}
                  verticalAlign="bottom"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Top Product Performance</CardTitle>
            <CardDescription>
              Revenue and sold quantity for top performing products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px] w-full"
              config={{
                revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
                quantity: { label: "Units", color: "hsl(var(--chart-4))" },
              }}
            >
              <BarChart
                data={topRevenueChartData}
                margin={{ top: 10, right: 10, left: -12, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                />
                <Bar
                  dataKey="quantity"
                  fill="var(--color-quantity)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* TOP LISTS (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TopList
          title="Top by Revenue"
          icon={<Trophy className="h-4 w-4 text-yellow-500" />}
          items={topProductsByRevenue}
          render={(p) => (
            <span className="font-semibold text-emerald-600">
              ETB {p.revenue.toLocaleString()}
            </span>
          )}
        />
        <TopList
          title="Top by Volume"
          icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
          items={topProductsByQuantity}
          render={(p) => (
            <span className="font-semibold text-blue-600">
              {p.quantitySold.toLocaleString()} units
            </span>
          )}
        />
        <TopList
          title="Most Frequent"
          icon={<Clock className="h-4 w-4 text-violet-500" />}
          items={topProductsByOrders}
          render={(p) => (
            <span className="font-semibold text-violet-600">
              {p.orderCount ?? "?"} orders
            </span>
          )}
        />
      </div>

      {/* HIGHLIGHT BANNER */}
      <Card className="bg-primary text-primary-foreground overflow-hidden relative shadow-lg border-0">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div>
            <p className="text-primary-foreground/80 font-medium mb-2 flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Estimated Inventory Value
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-sm">
              ETB {totalInventoryValue.toLocaleString()}
            </h2>
            <p className="text-primary-foreground/70 mt-2 text-sm">
              Current total valuation based on standard retail pricing.
            </p>
          </div>
          <div className="flex gap-8 border-t md:border-t-0 md:border-l border-primary-foreground/20 pt-6 md:pt-0 md:pl-10 w-full md:w-auto">
            <div>
              <p className="text-primary-foreground/80 text-sm mb-1">
                Out of Stock
              </p>
              <p
                className={cn(
                  "text-3xl font-bold",
                  outOfStockProducts > 0 ? "text-red-300" : "text-emerald-300",
                )}
              >
                {outOfStockProducts}
              </p>
            </div>
            <div>
              <p className="text-primary-foreground/80 text-sm mb-1">
                Low Stock
              </p>
              <p className="text-3xl font-bold text-amber-300">
                {lowStockVariants}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Reusable Shadcn Styled Components ────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  subtext?: string;
  alert?: boolean;
}

function KpiCard({ title, value, icon, trend, subtext, alert }: KpiCardProps) {
  return (
    <Card
      className={cn(
        "shadow-sm transition-all hover:shadow-md",
        alert && "border-destructive/50 ring-1 ring-destructive/20",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {(trend || subtext) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend && (
              <span className="text-emerald-500 font-medium flex items-center inline-flex">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {trend}
              </span>
            )}
            {!trend && subtext}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface TopListItemBase {
  id: string;
  name: string;
}

function TopList<T extends TopListItemBase>({
  title,
  items,
  render,
  icon,
}: {
  title: string;
  items: T[];
  render: (p: T) => React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Card className="shadow-sm flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-4 pb-4">
        <div className="flex flex-col space-y-1">
          {items.slice(0, 5).map((p, i) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-muted-foreground text-xs font-bold w-4 text-center">
                  {i + 1}
                </span>
                <span className="font-medium text-sm truncate">{p.name}</span>
              </div>
              <div className="shrink-0 text-sm ml-4">{render(p)}</div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-muted-foreground text-sm italic py-6 text-center border border-dashed rounded-lg mt-2">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper for status styling mapping to shadcn aesthetic
function getStatusStyle(status: string) {
  switch (status) {
    case "pendingVerification":
      return {
        icon: <Clock className="h-4 w-4" />,
        bg: "bg-amber-100 dark:bg-amber-900/30",
        color: "text-amber-600 dark:text-amber-400",
      };
    case "completed":
      return {
        icon: <DollarSign className="h-4 w-4" />,
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        color: "text-emerald-600 dark:text-emerald-400",
      };
    case "cancelled":
      return {
        icon: <AlertTriangle className="h-4 w-4" />,
        bg: "bg-destructive/10",
        color: "text-destructive",
      };
    case "processing":
      return {
        icon: <TrendingUp className="h-4 w-4" />,
        bg: "bg-blue-100 dark:bg-blue-900/30",
        color: "text-blue-600 dark:text-blue-400",
      };
    case "onHold":
      return {
        icon: <Package className="h-4 w-4" />,
        bg: "bg-purple-100 dark:bg-purple-900/30",
        color: "text-purple-600 dark:text-purple-400",
      };
    default:
      return {
        icon: <Box className="h-4 w-4" />,
        bg: "bg-muted",
        color: "text-muted-foreground",
      };
  }
}
