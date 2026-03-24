"use client";

import { useEffect } from "react";
import StatCard from "@/components/stat/stat-card";
import LineChart from "@/components/stat/LineChart";
import PaymentInfoTable from "@/components/PaymentInfoTable";
import UploadReceiptForm from "@/components/stat/payment-receipt-form";
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

// Dummy user and stats data
const dummyUser = {
  _id: "12345",
  totalOutstandingBill: 12500.75,
};

const dummyStats = {
  totalOrders: 42,
  pendingOrders: 7,
  rejectedOrders: 3,
  percentageData: {
    labels: ["Electronics", "Clothing", "Groceries", "Books"],
    data: [40, 25, 20, 15],
  },
  orderData: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    data: [10, 15, 8, 20, 18, 25],
  },
};

const BillPage = () => {
  const user = dummyUser;
  const stats = dummyStats;
  const loading = true; // pretend data is loaded
  const refreshTrigger = 0;
  const setRefreshTrigger = () => {};
  if (!loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const hasOrders = stats.totalOrders > 0;
  const billAmount = user?.totalOutstandingBill ?? 0;
  const formattedBill = billAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <ScrollArea className="h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
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

          {hasOrders && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Order by Category</CardTitle>
                  <CardDescription>
                    Percentage distribution of orders.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {stats.percentageData.labels.map(
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

              <Card>
                <CardHeader>
                  <CardTitle>Order Volume Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] pl-2">
                  <LineChart chartData={stats.orderData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
              </Card>
            </>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-300">
                Outstanding Bill
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                {formattedBill} ETB
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Pay</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentInfoTable />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload New Payment</CardTitle>
              <CardDescription>
                Submit a receipt for verification.
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default BillPage;
