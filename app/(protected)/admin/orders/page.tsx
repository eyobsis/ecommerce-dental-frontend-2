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
  Inbox,
  Image as ImageIcon,
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

// Premium Status Styles (Soft backgrounds, matching text, subtle rings)
const statusStyles: Record<
  Order["status"],
  { label: string; text: string; bg: string; ring: string }
> = {
  pending_verification: {
    label: "Verifying",
    text: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-500/20",
  },
  pending: {
    label: "Pending",
    text: "text-slate-700",
    bg: "bg-slate-100",
    ring: "ring-slate-500/20",
  },
  paid: {
    label: "Paid",
    text: "text-blue-700",
    bg: "bg-blue-50",
    ring: "ring-blue-500/20",
  },
  shipped: {
    label: "Shipped",
    text: "text-violet-700",
    bg: "bg-violet-50",
    ring: "ring-violet-500/20",
  },
  completed: {
    label: "Completed",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-500/20",
  },
  cancelled: {
    label: "Cancelled",
    text: "text-rose-700",
    bg: "bg-rose-50",
    ring: "ring-rose-500/20",
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const statuses = [
    "pending_verification",
    "pending",
    "paid",
    "shipped",
    "completed",
    "cancelled",
  ];

  const fuse = useMemo(() => {
    return new Fuse(orders, {
      keys: ["name", "id", "email"],
      threshold: 0.3,
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
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const term = search.trim();

    // First filter by search term
    let results: Order[];
    if (!term) {
      results = orders;
    } else {
      const fuseResults = fuse.search(term);
      results = fuseResults.map((r) => r.item);
    }

    // Then filter by status
    if (statusFilter) {
      results = results.filter((order) => order.status === statusFilter);
    }

    return results;
  }, [fuse, search, orders, statusFilter]);

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
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusInfo = (status: Order["status"]) =>
    statusStyles[status] || statusStyles.pending;

  const handleStatusChange = async (id: string, newStatus: Order["status"]) => {
    if (!id) return;

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

    try {
      await ecommerceApi.updateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
      );
      toast.success(`Order #${id} updated to ${statusStyles[newStatus].label}`);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Orders
            </h1>
            <p className="mt-2 text-slate-500 font-medium">
              Manage and track customer purchases
            </p>
          </div>

          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by ID, name, or email..."
              className="pl-10 h-11 bg-white border-slate-200 shadow-sm rounded-xl focus-visible:ring-indigo-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            className="h-11 px-3 bg-white border-slate-200 shadow-sm rounded-xl focus-visible:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {error && <ErrorBanner message={error} className="mb-8 rounded-xl" />}

        {/* Main Table Card */}
        <Card className="rounded-3xl border-0 shadow-sm ring-1 ring-slate-900/5 bg-white overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              // Premium Skeleton
              <div className="p-6 space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 animate-pulse"
                  >
                    <div className="h-4 w-24 bg-slate-100 rounded" />
                    <div className="h-10 flex-1 bg-slate-50 rounded-lg" />
                    <div className="h-8 w-24 bg-slate-100 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[980px]">
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-b border-slate-100 hover:bg-transparent">
                      <TableHead className="w-28 font-semibold text-slate-600 pl-6">
                        Order ID
                      </TableHead>
                      <TableHead className="font-semibold text-slate-600">
                        Customer
                      </TableHead>
                      <TableHead className="w-40 font-semibold text-slate-600">
                        Date
                      </TableHead>
                      <TableHead className="w-32 text-right font-semibold text-slate-600">
                        Total
                      </TableHead>
                      <TableHead className="w-40 font-semibold text-slate-600">
                        Status
                      </TableHead>
                      <TableHead className="w-44 font-semibold text-slate-600">
                        Action
                      </TableHead>
                      <TableHead className="w-20 text-center font-semibold text-slate-600 pr-6">
                        View
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paginatedOrders.length === 0 ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={7} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <Inbox className="h-12 w-12 text-slate-300 mb-4" />
                            <p className="text-lg font-medium text-slate-900">
                              No orders found
                            </p>
                            <p className="text-sm mt-1">
                              {search
                                ? "Try adjusting your search terms."
                                : "You don't have any orders yet."}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedOrders.map((order) => {
                        const st = statusInfo(order.status);

                        return (
                          <TableRow
                            key={order.id}
                            className="hover:bg-slate-50/80 border-b border-slate-50 transition-colors group"
                          >
                            <TableCell className="font-medium text-slate-900 pl-6">
                              #{order.id.slice(0, 8)}
                            </TableCell>

                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900 truncate max-w-[200px]">
                                  {order.name}
                                </span>
                                <span className="text-sm text-slate-500 truncate max-w-[200px]">
                                  {order.email}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="text-slate-600 text-sm">
                              {formatDate(order.createdAt).split(",")[0]}
                            </TableCell>

                            <TableCell className="text-right font-semibold text-slate-900">
                              {order.cost.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                              ETB
                            </TableCell>

                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${st.bg} ${st.text} ${st.ring}`}
                              >
                                {st.label}
                              </span>
                            </TableCell>

                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={(v) => {
                                  handleStatusChange(
                                    order.id,
                                    v as Order["status"],
                                  );
                                }}
                              >
                                <SelectTrigger className="w-[140px] h-9 bg-white border-slate-200 hover:bg-slate-50 transition-colors rounded-lg text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-lg ring-1 ring-slate-900/5">
                                  <SelectItem value="pending_verification">
                                    Verifying
                                  </SelectItem>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="paid">Paid</SelectItem>
                                  <SelectItem value="shipped">
                                    Shipped
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                  <SelectItem value="cancelled">
                                    Cancelled
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>

                            <TableCell className="text-center pr-6">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
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
              </div>
            )}
          </CardContent>

          {/* Pagination */}
          {!isLoading && filteredOrders.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-900">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-slate-900">
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredOrders.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-900">
                  {filteredOrders.length}
                </span>{" "}
                results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-slate-600 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100"
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
            className="w-full max-w-2xl sm:w-[540px] p-0 border-l-0 shadow-2xl"
          >
            {selectedOrder && (
              <div className="h-full flex flex-col bg-slate-50/50">
                {/* Sheet Header */}
                <SheetHeader className="bg-white border-b border-slate-100 px-6 py-6 pb-5">
                  <div className="flex items-center justify-between mb-2">
                    <SheetTitle className="text-2xl font-bold tracking-tight text-slate-900">
                      Order #{selectedOrder.id.slice(0, 8)}
                    </SheetTitle>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${statusInfo(selectedOrder.status).bg} ${statusInfo(selectedOrder.status).text} ${statusInfo(selectedOrder.status).ring}`}
                    >
                      {statusInfo(selectedOrder.status).label}
                    </span>
                  </div>
                  <SheetDescription className="flex items-center gap-2 text-slate-500 font-medium">
                    <CalendarClock className="h-4 w-4" />
                    {formatDate(selectedOrder.createdAt)}
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                  {/* Customer Info */}
                  <Card className="border-0 shadow-sm ring-1 ring-slate-900/5 rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white pb-3 pt-5 px-5">
                      <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        Customer Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="bg-white px-5 pb-5">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="font-semibold text-slate-900 text-base">
                          {selectedOrder.name}
                        </div>
                        <div className="text-slate-500 text-sm mt-1">
                          {selectedOrder.email}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Items */}
                  <Card className="border-0 shadow-sm ring-1 ring-slate-900/5 rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white pb-3 pt-5 px-5 border-b border-slate-50">
                      <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Package className="h-4 w-4 text-slate-400" />
                        Order Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="bg-white px-5 py-4 space-y-3">
                      {selectedOrder.detail.map((item, idx) => (
                        <div
                          key={`${item.productId}-${idx}`}
                          className="flex justify-between items-start py-2 group"
                        >
                          <div className="pr-4">
                            <p className="font-medium text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                              {item.productName}
                            </p>
                            <p className="text-slate-500 text-sm mt-0.5">
                              {item.quantity} ×{" "}
                              {item.productCost.toLocaleString()} ETB
                            </p>
                          </div>
                          <p className="font-semibold text-slate-900 text-sm shrink-0">
                            {(
                              item.productCost * item.quantity
                            ).toLocaleString()}{" "}
                            ETB
                          </p>
                        </div>
                      ))}

                      <Separator className="my-2" />

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-500 font-medium text-sm">
                          Total Amount
                        </span>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">
                          {selectedOrder.cost.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}{" "}
                          ETB
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Proof */}
                  <Card className="border-0 shadow-sm ring-1 ring-slate-900/5 rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white pb-3 pt-5 px-5 border-b border-slate-50">
                      <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        Payment Proof
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="bg-white p-5">
                      {isImageFile(selectedOrder.paymentImage) &&
                      !proofLoadErrorByOrder[selectedOrder.id] ? (
                        <div className="space-y-3">
                          <div
                            className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 cursor-zoom-in transition-all hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2"
                            onClick={() =>
                              setPreviewImage(selectedOrder.paymentImage)
                            }
                          >
                            <Image
                              src={selectedOrder.paymentImage}
                              alt="Payment proof"
                              width={600}
                              height={400}
                              className="max-h-60 w-full object-cover"
                              onError={() =>
                                setProofLoadErrorByOrder((prev) => ({
                                  ...prev,
                                  [selectedOrder.id]: true,
                                }))
                              }
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                              <ImageIcon className="text-white h-8 w-8 drop-shadow-md" />
                            </div>
                          </div>
                          <p className="text-xs text-center text-slate-500 font-medium">
                            Click image to enlarge
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 flex flex-col items-center justify-center text-center">
                          <div className="h-10 w-10 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-3">
                            <FileText className="h-5 w-5 text-slate-400" />
                          </div>
                          <h4 className="text-sm font-semibold text-slate-900">
                            Attachment Available
                          </h4>
                          <p className="mt-1 text-xs text-slate-500 mb-4 max-w-[200px]">
                            The payment proof is a document or could not be
                            previewed inline.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg bg-white shadow-sm"
                            asChild
                          >
                            <a
                              href={selectedOrder.paymentImage}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open File
                              <ExternalLink className="ml-2 h-3.5 w-3.5 text-slate-400" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Image Preview Overlay */}
        {previewImage && (
          <div
            className="fixed inset-0 bg-slate-900/95 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl">
              <Image
                src={previewImage}
                alt="Payment proof full view"
                width={1200}
                height={900}
                className="w-full h-full object-contain max-h-[85vh]"
              />
              <button
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewImage(null);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
