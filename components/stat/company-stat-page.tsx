"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/stat/stat-card";
import LineChart from "@/components/stat/LineChart";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/stat/empty-state";
import { Clock, FileX, Package } from "lucide-react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  rejectedOrders: number;
  percentageData: { labels: string[]; data: number[] };
  orderData: { labels: string[]; data: number[] };
}

const CompanyStatPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient(`/stat/company/${id}`);
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <EmptyState message="No statistics available for this company." />
      </div>
    );
  }

  const hasOrders = stats.totalOrders > 0;

  return (
    <ScrollArea className="h-screen">
      <div className="grid grid-cols-1 gap-6 p-4 lg:p-6">
        {/* Performance Snapshot */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Performance Snapshot</CardTitle>
            <CardDescription>
              An overview of your order activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasOrders ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders}
                  icon={Package}
                />
                <StatCard
                  title="Pending Orders"
                  value={stats.pendingOrders}
                  icon={Clock}
                />
                <StatCard
                  title="Rejected Orders"
                  value={stats.rejectedOrders}
                  icon={FileX}
                />
              </div>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>

        {/* Order by Category */}
        {hasOrders && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Order by Category</CardTitle>
              <CardDescription>
                Percentage distribution of orders.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {stats.percentageData?.labels?.map(
                (label: string, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center rounded-lg bg-muted p-4"
                  >
                    <p className="text-2xl font-bold text-primary">
                      {stats.percentageData.data[index]}%
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {label}
                    </p>
                  </div>
                ),
              )}
            </CardContent>
          </Card>
        )}

        {/* Order Volume Over Time */}
        {hasOrders && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Order Volume Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] pl-2">
              {stats.orderData ? (
                <LineChart chartData={stats.orderData} />
              ) : (
                <EmptyState />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
};

export default CompanyStatPage;
