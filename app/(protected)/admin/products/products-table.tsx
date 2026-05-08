// app/products/products-table.tsx
"use client";

import { useMemo, useState } from "react";
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
import { Product } from "@/store/product.store";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  PackageSearch, 
  SlidersHorizontal 
} from "lucide-react";

interface ProductsTableProps {
  columns: {
    key: string;
    header: string;
    render?: (p: Product) => React.ReactNode;
  }[];
  data: Product[];
  loading?: boolean;
  itemsPerPage?: number;
}

export const ProductsTable = ({
  columns,
  data,
  loading = false,
  itemsPerPage = 10,
}: ProductsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [minQty, setMinQty] = useState<number | "">("");
  const [maxQty, setMaxQty] = useState<number | "">("");

  const filteredData = useMemo(() => {
    return data.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(search.toLowerCase());

      const matchesMin = minQty === "" || product.quantity >= Number(minQty);
      const matchesMax = maxQty === "" || product.quantity <= Number(maxQty);

      return matchesSearch && matchesMin && matchesMax;
    });
  }, [data, search, minQty, maxQty]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-10 w-full bg-white border-slate-200 shadow-sm rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-indigo-500"
          />
        </div>

        {/* Quantity Filter Group */}
        <div className="flex items-center w-full sm:w-auto px-3 bg-white border border-slate-200 shadow-sm rounded-lg h-10 transition-all focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500">
          <SlidersHorizontal className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
          <span className="text-xs font-medium text-slate-500 mr-2 shrink-0 uppercase tracking-wider">Qty:</span>
          <input
            type="number"
            placeholder="Min"
            value={minQty}
            onChange={(e) => {
              setMinQty(e.target.value ? Number(e.target.value) : "");
              setCurrentPage(1);
            }}
            className="w-14 text-sm outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
          />
          <span className="text-slate-300 mx-2">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxQty}
            onChange={(e) => {
              setMaxQty(e.target.value ? Number(e.target.value) : "");
              setCurrentPage(1);
            }}
            className="w-14 text-sm outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table Card Wrapper */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                {columns.map((col) => (
                  <TableHead 
                    key={col.key} 
                    className="h-11 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                // Premium Skeleton Loader
                <>
                  {[...Array(itemsPerPage)].map((_, i) => (
                    <TableRow key={`skeleton-${i}`} className="hover:bg-transparent border-b border-slate-100/50">
                      {columns.map((col, colIdx) => (
                        <TableCell key={`skeleton-${i}-${colIdx}`} className="px-6 py-4">
                          <div className={`h-4 bg-slate-100 rounded-md animate-pulse ${colIdx === 0 ? 'w-3/4' : 'w-1/2'}`} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              )}

              {!loading && paginatedData.length > 0 &&
                paginatedData.map((product) => (
                  <TableRow 
                    key={product.id}
                    className="group border-b border-slate-100/80 hover:bg-slate-50/60 transition-colors"
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key} className="px-6 py-4 text-sm text-slate-700 font-medium align-middle">
                        {col.render
                          ? col.render(product)
                          : String((product as Record<string, unknown>)[col.key] ?? "—")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading && paginatedData.length === 0 && (
                // Beautiful Empty State
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-[300px] text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <PackageSearch className="h-5 w-5 text-slate-400" />
                      </div>
                      <h3 className="text-base font-medium text-slate-900 mb-1">No products found</h3>
                      <p className="text-sm max-w-[280px] mx-auto text-slate-500">
                        {search || minQty !== "" || maxQty !== "" 
                          ? "Adjust your filters or search query to find what you're looking for." 
                          : "You don't have any products yet."}
                      </p>
                      {(search || minQty !== "" || maxQty !== "") && (
                        <Button 
                          variant="outline" 
                          className="mt-4 h-8 text-xs bg-white shadow-sm" 
                          onClick={() => {
                            setSearch("");
                            setMinQty("");
                            setMaxQty("");
                          }}
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Table Footer Pagination */}
        {!loading && filteredData.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Showing <span className="font-medium text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-900">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium text-slate-900">{filteredData.length}</span> items
            </p>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-md border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center justify-center h-8 px-3 text-xs font-medium text-slate-600">
                Page {currentPage} of {totalPages}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-md border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};