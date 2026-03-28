"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/categoryStore";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddCategoryDialog } from "@/components/category/add-category-dialog";

import { Search } from "lucide-react";

// ─────────────────────────────────────────────
// ✅ TYPES

type Category = {
  id: string;
  name: string;
  productsCount: number;
};

// ─────────────────────────────────────────────
// 💎 COLUMNS

const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Category",
    cell: ({ row }) => {
      const name = row.original.name;

      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
            {name.charAt(0)}
          </div>

          <span className="font-medium text-gray-900">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "productsCount",
    header: "Products",
    cell: ({ row }) => (
      <span className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600 font-medium">
        {row.original.productsCount}
      </span>
    ),
  },
];

// ─────────────────────────────────────────────

const CategoriesPage = () => {
  const { categories, fetchCategories } = useCategoryStore();

  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const table = useReactTable({
    data: categories as Category[],
    columns,
    state: {
      globalFilter: filter,
    },
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Categories
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your product categories
            </p>
          </div>

          <div className="flex gap-3">
            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

              <Input
                placeholder="Search categories..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9 w-64 bg-white border-gray-200 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <AddCategoryDialog />
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              {/* HEADER */}
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left font-medium"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {/* BODY */}
              <tbody>
                {table.getRowModel().rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`
                      border-b border-gray-100
                      ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      hover:bg-indigo-50/40
                      transition-colors
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-10 text-gray-500"
                    >
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">

            <span className="text-sm text-gray-500">
              Page {table.getState().pagination.pageIndex + 1}
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white border-gray-200 hover:bg-gray-100"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-white border-gray-200 hover:bg-gray-100"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;