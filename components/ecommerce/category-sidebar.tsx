"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { ecommerceApi } from "@/lib/ecommerce-api";
import { Search, SlidersHorizontal } from "lucide-react";

type CategoryOption = {
  id: string;
  name: string;
};

interface Props {
  selected: string[];
  onChange: (value: string[]) => void;
}

const CategorySidebar = ({ selected, onChange }: Props) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categorySearch, setCategorySearch] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await ecommerceApi.getCategories();
        const normalized = response.data
          .map((category) => ({
            id: category.id,
            name: category.name.trim(),
          }))
          .filter((category) => category.name.length > 0)
          .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(normalized);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const visibleCategories = useMemo(() => {
    const term = categorySearch.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(term),
    );
  }, [categories, categorySearch]);

  const toggleCategory = (categoryId: string) => {
    if (selected.includes(categoryId)) {
      onChange(selected.filter((id) => id !== categoryId));
    } else {
      onChange([...selected, categoryId]);
    }
  };

  return (
    <aside className="w-full md:w-72 rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <SlidersHorizontal className="h-4 w-4" />
          Categories
        </h3>
        {selected.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onChange([])}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search category..."
          value={categorySearch}
          onChange={(event) => setCategorySearch(event.target.value)}
          className="pl-9"
        />
      </div>

      <Separator className="mb-3" />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {visibleCategories.length === 0 ? (
            <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-muted-foreground">
              No category matched your search.
            </p>
          ) : (
            visibleCategories.map((category) => (
              <label
                key={category.id}
                htmlFor={category.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50"
              >
                <Checkbox
                  id={category.id}
                  checked={selected.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <span className="text-sm font-medium">{category.name}</span>
              </label>
            ))
          )}
        </div>
      )}
    </aside>
  );
};

export default CategorySidebar;
