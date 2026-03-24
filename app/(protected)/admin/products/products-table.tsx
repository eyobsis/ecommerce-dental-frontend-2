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
import { Product } from "@/store/product.store";

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
  itemsPerPage = 5,
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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded"
        />

        <input
          type="number"
          placeholder="Min Qty"
          value={minQty}
          onChange={(e) => {
            setMinQty(e.target.value ? Number(e.target.value) : "");
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-24"
        />

        <input
          type="number"
          placeholder="Max Qty"
          value={maxQty}
          onChange={(e) => {
            setMaxQty(e.target.value ? Number(e.target.value) : "");
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-24"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={columns.length}>Loading products...</TableCell>
            </TableRow>
          )}

          {!loading &&
            paginatedData.length > 0 &&
            paginatedData.map((product) => (
              <TableRow key={product.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render
                      ? col.render(product)
                      : (product as Record<string, unknown>)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!loading && paginatedData.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length}>No products found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
