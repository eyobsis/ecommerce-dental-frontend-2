"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";
import type { ProductFilterOptions } from "@/types/ecommerce";

export type ProductFiltersState = {
  categoryId: string[];
  brandId: string[];
  productType: string[];
  featureKey: string[];
  featureValue: string[];
  variantColor: string[];
  variantSize: string[];
  variantSku: string[];
};

interface Props {
  loading: boolean;
  options: ProductFilterOptions | null;
  filters: ProductFiltersState;
  onFiltersChange: (value: ProductFiltersState) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  skuInput: string;
  onSkuInputChange: (value: string) => void;
  localSearch: string;
  onLocalSearchChange: (value: string) => void;
}

const includesTerm = (value: string, term: string) =>
  value.toLowerCase().includes(term.toLowerCase());

export default function ProductFiltersSidebar({
  loading,
  options,
  filters,
  onFiltersChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  skuInput,
  onSkuInputChange,
  localSearch,
  onLocalSearchChange,
}: Props) {
  const term = localSearch.trim().toLowerCase();

  const featureValues = useMemo(() => {
    if (!options) return [] as string[];
    const featureValuesByKey = options.featureValuesByKey ?? {};

    if (!filters.featureKey.length) {
      return Array.from(new Set(Object.values(featureValuesByKey).flat())).sort(
        (a, b) => a.localeCompare(b),
      );
    }

    const values = filters.featureKey.flatMap(
      (key) => featureValuesByKey[key] || [],
    );

    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
  }, [options, filters.featureKey]);

  const visible = useMemo(() => {
    if (!options) {
      return {
        categories: [] as ProductFilterOptions["categories"],
        brands: [] as ProductFilterOptions["brands"],
        productTypes: [] as string[],
        featureKeys: [] as string[],
        featureValues: [] as string[],
        variantColors: [] as string[],
        variantSizes: [] as string[],
      };
    }

    if (!term) {
      return {
        categories: options.categories ?? [],
        brands: options.brands ?? [],
        productTypes: options.productTypes ?? [],
        featureKeys: options.featureKeys ?? [],
        featureValues,
        variantColors: options.variantColors ?? [],
        variantSizes: options.variantSizes ?? [],
      };
    }

    return {
      categories: (options.categories ?? []).filter((item) => includesTerm(item.name, term)),
      brands: (options.brands ?? []).filter((item) => includesTerm(item.name, term)),
      productTypes: (options.productTypes ?? []).filter((item) => includesTerm(item, term)),
      featureKeys: (options.featureKeys ?? []).filter((item) => includesTerm(item, term)),
      featureValues: featureValues.filter((item) => includesTerm(item, term)),
      variantColors: (options.variantColors ?? []).filter((item) => includesTerm(item, term)),
      variantSizes: (options.variantSizes ?? []).filter((item) => includesTerm(item, term)),
    };
  }, [options, featureValues, term]);

  const selectedCount =
    filters.categoryId.length +
    filters.brandId.length +
    filters.productType.length +
    filters.featureKey.length +
    filters.featureValue.length +
    filters.variantColor.length +
    filters.variantSize.length +
    filters.variantSku.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0);

  const toggle = (key: keyof ProductFiltersState, value: string) => {
    const existing = filters[key];
    const next = existing.includes(value)
      ? existing.filter((item) => item !== value)
      : [...existing, value];

    onFiltersChange({
      ...filters,
      [key]: next,
    });
  };

  const clearAll = () => {
    onFiltersChange({
      categoryId: [],
      brandId: [],
      productType: [],
      featureKey: [],
      featureValue: [],
      variantColor: [],
      variantSize: [],
      variantSku: [],
    });
    onSkuInputChange("");
    onMinPriceChange("");
    onMaxPriceChange("");
    onLocalSearchChange("");
  };

  return (
    <aside className="w-full rounded-2xl border bg-white p-5 shadow-sm md:w-80">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </h3>
        {selectedCount > 0 && (
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={clearAll}>
            Clear ({selectedCount})
          </Button>
        )}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search filter options..."
          value={localSearch}
          onChange={(event) => onLocalSearchChange(event.target.value)}
          className="pl-9"
        />
      </div>

      <Separator className="mb-3" />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))}
        </div>
      ) : !options ? (
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Filter options are temporarily unavailable. Product search and sorting still work.
        </div>
      ) : (
        <div className="max-h-[68vh] space-y-4 overflow-y-auto pr-1">
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Category</h4>
            <div className="space-y-1">
              {visible.categories.map((category) => (
                <label key={category.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  <Checkbox
                    checked={filters.categoryId.includes(category.id)}
                    onCheckedChange={() => toggle("categoryId", category.id)}
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Brand</h4>
            <div className="space-y-1">
              {visible.brands.map((brand) => (
                <label key={brand.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  <Checkbox
                    checked={filters.brandId.includes(brand.id)}
                    onCheckedChange={() => toggle("brandId", brand.id)}
                  />
                  <span className="text-sm">{brand.name}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Product Type</h4>
            <div className="space-y-1">
              {visible.productTypes.map((item) => (
                <label key={item} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  <Checkbox
                    checked={filters.productType.includes(item)}
                    onCheckedChange={() => toggle("productType", item)}
                  />
                  <span className="text-sm capitalize">{item}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Feature Key</h4>
            <div className="space-y-1">
              {visible.featureKeys.map((item) => (
                <label key={item} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  <Checkbox
                    checked={filters.featureKey.includes(item)}
                    onCheckedChange={() => toggle("featureKey", item)}
                  />
                  <span className="text-sm capitalize">{item}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Feature Value</h4>
            <div className="space-y-1">
              {visible.featureValues.map((item) => (
                <label key={item} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  <Checkbox
                    checked={filters.featureValue.includes(item)}
                    onCheckedChange={() => toggle("featureValue", item)}
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Variant Color</h4>
            <div className="space-y-1">
              {visible.variantColors.map((item) => (
                <label key={item} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  <Checkbox
                    checked={filters.variantColor.includes(item)}
                    onCheckedChange={() => toggle("variantColor", item)}
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Variant Size</h4>
            <div className="space-y-1">
              {visible.variantSizes.map((item) => (
                <label key={item} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  <Checkbox
                    checked={filters.variantSize.includes(item)}
                    onCheckedChange={() => toggle("variantSize", item)}
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Price Range (ETB)</h4>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={minPrice}
                onChange={(event) => onMinPriceChange(event.target.value)}
                inputMode="decimal"
                placeholder="Min"
                className="h-9"
              />
              <Input
                value={maxPrice}
                onChange={(event) => onMaxPriceChange(event.target.value)}
                inputMode="decimal"
                placeholder="Max"
                className="h-9"
              />
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Variant SKU</h4>
            <Input
              value={skuInput}
              onChange={(event) => onSkuInputChange(event.target.value)}
              placeholder="SKU1, SKU2"
              className="h-9"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Use comma-separated SKU values.</p>
          </section>
        </div>
      )}
    </aside>
  );
}
