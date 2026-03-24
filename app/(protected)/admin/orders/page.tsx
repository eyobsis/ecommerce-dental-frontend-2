"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ErrorBanner } from "@/components/ui/error-banner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Package,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  User,
  CalendarClock,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Fuse from "fuse.js";
import { ecommerceApi } from "@/lib/ecommerce-api";
import type { Order as ApiOrder } from "@/types/ecommerce";

interface OrderItem {
  productId: string;
  productName: string;
  productCost: number;
  quantity: number;
}

interface Order {
  id: string;
  name: string;
  email: string;
  cost: number;
  paymentImage: string;
  detail: OrderItem[];
  status:
    | "pending_verification"
    | "pending"
    | "paid"
    | "shipped"
    | "completed"
    | "cancelled";
  createdAt: string;
}

const statusStyles: Record<
  Order["status"],
  { label: string; color: string; bg: string }
> = {
  pending_verification: {
    label: "Pending Verification",
    color: "text-orange-800",
    bg: "bg-orange-100 border-orange-300",
  },
  pending: {
    label: "Pending",
    color: "text-yellow-800",
    bg: "bg-yellow-100 border-yellow-300",
  },
  paid: {
    label: "Paid",
    color: "text-blue-800",
    bg: "bg-blue-100 border-blue-300",
  },
  shipped: {
    label: "Shipped",
    color: "text-purple-800",
    bg: "bg-purple-100 border-purple-300",
  },
  completed: {
    label: "Completed",
    color: "text-green-800",
    bg: "bg-green-100 border-green-300",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-800",
    bg: "bg-red-100 border-red-300",
  },
};

const ITEMS_PER_PAGE = 10;

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:3001";

const toAbsoluteUrl = (value?: string | null) => {
  if (!value) return "/payment.jpg";
  const normalized = value.replace(/\\/g, "/").trim();
  if (!normalized) return "/payment.jpg";
  if (/^https?:\/\//i.test(normalized)) {
    return encodeURI(normalized);
  }
  return encodeURI(`${backendUrl}/${normalized.replace(/^\/+/, "")}`);
};

const isImageFile = (url?: string | null) => {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return /\.(png|jpe?g|webp|gif|bmp|svg)$/.test(clean);
};

const mapStatus = (raw: string): Order["status"] => {
  if (
    raw === "pending_verification" ||
    raw === "pending" ||
    raw === "paid" ||
    raw === "shipped" ||
    raw === "completed" ||
    raw === "cancelled"
  ) {
    return raw;
  }
  return "pending";
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fuse = useMemo(() => {
    return new Fuse(orders, {
      keys: ["name", "id", "email"],
      threshold: 0.3, // lower = stricter match, higher = fuzzier
    });
  }, [orders]);

  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [proofLoadErrorByOrder, setProofLoadErrorByOrder] = useState<
    Record<string, boolean>
  >({});
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setError(null);
        const response = await ecommerceApi.getOrders();
        const mapped: Order[] = response.data.map((order: ApiOrder) => {
          const fullPaymentImage = toAbsoluteUrl(
            order.paymentImage || order.paymentScreenshotUrl,
          );

          return {
            id: order.id,
            name:
              order.customerPhone ||
              order.customerEmail ||
              order.userId ||
              "Guest",
            email: order.customerEmail || order.customerPhone || "",
            cost: Number(order.totalAmount),
            paymentImage: fullPaymentImage,
            detail: (order.items || []).map((item) => ({
              productId: item.productId || "",
              productName: item.name,
              productCost: Number(item.basePrice),
              quantity: item.quantity,
            })),
            status: mapStatus(order.status),
            createdAt: order.createdAt,
          };
        });
        setOrders(mapped);
      } catch {
        setOrders([]);
        setError("Failed to load orders. Please refresh and try again.");
        toast.error("Failed to load orders");
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const term = search.trim();
    if (!term) return orders; // no search, return all
    const results = fuse.search(term);
    return results.map((r) => r.item);
  }, [fuse, search, orders]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusInfo = (status: Order["status"]) =>
    statusStyles[status] || statusStyles.pending;

  const handleStatusChange = async (id: string, newStatus: Order["status"]) => {
    if (!id) return;

    // Confirm cancellation
    if (newStatus === "cancelled") {
      const order = orders.find((o) => o.id === id);
      if (order && order.status !== "cancelled") {
        if (
          !confirm(
            "Are you sure you want to cancel this order? This action cannot be undone.",
          )
        ) {
          return;
        }
      }
    }

    // Update orders state
    try {
      await ecommerceApi.updateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
      );
      toast(`Order #${id} is now "${statusStyles[newStatus].label}".`);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email or order ID..."
            className="pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset to page 1 on search
            }}
          />
        </div>
      </div>

      {error && <ErrorBanner message={error} className="mb-6" />}

      {/* Table Card */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-24">Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="w-32">Date</TableHead>
                <TableHead className="w-28 text-right">Total</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-32">Action</TableHead>
                <TableHead className="w-20 text-center">Detail</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-48 text-center text-muted-foreground"
                  >
                    {filteredOrders.length === 0
                      ? "No orders found."
                      : "No orders on this page."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => {
                  const st = statusInfo(order.status);

                  return (
                    <TableRow
                      key={order.id}
                      className="hover:bg-muted/60 transition-colors"
                    >
                      <TableCell className="font-medium">#{order.id}</TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {order.email}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>{formatDate(order.createdAt)}</TableCell>

                      <TableCell className="text-right font-medium">
                        {order.cost.toFixed(2)} ETB
                      </TableCell>

                      {/* Current Status Badge */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${st.bg} ${st.color} border font-medium px-3 py-1`}
                        >
                          {st.label}
                        </Badge>
                      </TableCell>

                      {/* Inline Status Update */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(v) => {
                              const newStatus = v as Order["status"];
                              handleStatusChange(order.id, newStatus);
                            }}
                          >
                            <SelectTrigger className="w-44 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending_verification">
                                Pending Verification
                              </SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>

                      {/* Detail Drawer Trigger */}
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of{" "}
              {filteredOrders.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Sheet */}
      <Sheet
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null);
            setPreviewImage(null);
          }
        }}
      >
        <SheetContent
          side="right"
          className="w-full max-w-2xl sm:w-[620px] p-0"
        >
          {selectedOrder && (
            <div className="h-full flex flex-col">
              <SheetHeader className="border-b bg-gradient-to-r from-slate-50 via-white to-slate-100 px-6 pb-5 pt-6">
                <SheetTitle className="text-xl font-semibold tracking-tight">
                  Order #{selectedOrder.id}
                </SheetTitle>
                <SheetDescription className="flex items-center gap-2 text-slate-600">
                  <CalendarClock className="h-4 w-4" />
                  Placed on {formatDate(selectedOrder.createdAt)}
                </SheetDescription>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${statusInfo(selectedOrder.status).bg} ${statusInfo(selectedOrder.status).color} border px-3 py-1 font-medium`}
                  >
                    {statusInfo(selectedOrder.status).label}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 font-medium">
                    Total: {selectedOrder.cost.toFixed(2)} ETB
                  </Badge>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Customer */}
                <Card className="border-slate-200/80 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium">{selectedOrder.name}</div>
                      <div className="text-muted-foreground">
                        {selectedOrder.email}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Items */}
                <Card className="border-slate-200/80 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Order Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedOrder.detail.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/70 px-3 py-2"
                      >
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × {item.productCost.toFixed(2)} ETB
                          </div>
                        </div>
                        <div className="font-medium">
                          {(item.productCost * item.quantity).toFixed(2)} ETB
                        </div>
                      </div>
                    ))}

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total</span>
                      <span>{selectedOrder.cost.toFixed(2)} ETB</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Proof */}
                <Card className="border-slate-200/80 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Payment Proof
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isImageFile(selectedOrder.paymentImage) &&
                    !proofLoadErrorByOrder[selectedOrder.id] ? (
                      <>
                        <div
                          className="overflow-hidden rounded-xl border border-slate-200 bg-white cursor-pointer transition-opacity hover:opacity-90"
                          onClick={() =>
                            setPreviewImage(selectedOrder.paymentImage)
                          }
                        >
                          <Image
                            src={selectedOrder.paymentImage}
                            alt="Payment proof"
                            width={640}
                            height={460}
                            className="max-h-72 w-full object-cover"
                            onError={() =>
                              setProofLoadErrorByOrder((prev) => ({
                                ...prev,
                                [selectedOrder.id]: true,
                              }))
                            }
                          />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Click image to enlarge
                        </p>
                      </>
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <FileText className="h-4 w-4" />
                          Proof file available
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          This proof is a document or failed to render as image.
                        </p>
                        <a
                          href={selectedOrder.paymentImage}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                        >
                          Open proof file
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-slate-200/80 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Order Meta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">Order ID:</span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs">
                        #{selectedOrder.id}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-800">Items Count:</span>{" "}
                      {selectedOrder.detail.reduce((sum, item) => sum + item.quantity, 0)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Image preview overlay */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] overflow-auto">
            <Image
              src={previewImage}
              alt="Payment proof full view"
              width={1200}
              height={900}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
