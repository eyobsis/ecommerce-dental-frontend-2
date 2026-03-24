"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo } from "react";
import { View } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";

import { baseUrl, baseDesignedUrl } from "@/app/services/wrapper";
import { showError } from "@/app/utils/message";
import { Payment } from "@/lib/type";
import axios from "axios";
import { useCompanyStore } from "@/store/useCompanyStore";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ClientPaymentHistoryTable = ({
  refreshTrigger,
}: {
  refreshTrigger: number;
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 5;

  // filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [amountFilter, setAmountFilter] = useState<number | null>(null);

  const { company, fetchCompany } = useCompanyStore();

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  useEffect(() => {
    if (!company?.id) return;
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/payment/company/${company.id}`,
        );
        const sortedPayments = Array.isArray(response.data.payments)
          ? response.data.payments.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
          : [];
        setPayments(sortedPayments);
      } catch (error) {
        showError("Failed to fetch payment history.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [company?.id, refreshTrigger]);

  // Apply filters
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "Approved"
            ? p.is_admin_approved
            : !p.is_admin_approved;

      const matchesAmount =
        amountFilter === null ? true : Number(p.amount) >= amountFilter;

      return matchesStatus && matchesAmount;
    });
  }, [payments, statusFilter, amountFilter]);

  const totalPages = Math.ceil(filteredPayments.length / ROWS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  return (
    <>
      {/* Filter Controls */}
      <div className="flex gap-4 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Min Amount"
          value={amountFilter ?? ""}
          onChange={(e) =>
            setAmountFilter(e.target.value ? parseFloat(e.target.value) : null)
          }
          className="w-[180px]"
        />
      </div>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedPayments.length > 0 ? (
              paginatedPayments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell className="font-medium">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{payment.bankName}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.is_admin_approved ? "default" : "secondary"
                      }
                    >
                      {payment.is_admin_approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setSelectedImage(`${baseDesignedUrl}/${payment.path}`)
                      }
                    >
                      <View className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No payment history.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}

      <Dialog
        open={!!selectedImage}
        onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Receipt</DialogTitle>
          </DialogHeader>
          <img
            src={selectedImage || undefined}
            alt="Receipt"
            className="w-full h-auto rounded-md"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientPaymentHistoryTable;
