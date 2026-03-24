"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductFiltersSidebar, {
  ProductFiltersState,
} from "@/components/ecommerce/product-filters-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBanner } from "@/components/ui/error-banner";
import { useCartStore } from "@/store/productStore";
import { ecommerceApi } from "@/lib/ecommerce-api";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProductFilterOptions } from "@/types/ecommerce";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SORT_OPTIONS = [
  { value: "name_asc", label: "Name (A → Z)" },
  { value: "name_desc", label: "Name (Z → A)" },
  { value: "price_asc", label: "Price (Low → High)" },
  { value: "price_desc", label: "Price (High → Low)" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const isSortValue = (value: string | null): value is SortValue => {
  if (!value) return false;
  return SORT_OPTIONS.some((option) => option.value === value);
};

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  categoryId: string | null;
  categoryName: string;
}

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:3001";

const toAbsoluteUrl = (value?: string | null) => {
  if (!value) return "/placeholder-product.jpg";
  if (/^https?:\/\//i.test(value)) return value;
  return `${backendUrl}/${value.replace(/^\/+/, "")}`;
};

const parseListQuery = (value: string | null) => {
  if (!value) return [] as string[];
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
};

const parsePriceQuery = (value: string | null) => {
  if (!value) return "";
  const numeric = Number(value);
  if (Number.isNaN(numeric) || numeric < 0) return "";
  return String(numeric);
};

const sanitizePriceInput = (value: string) =>
  value
    .replace(/[^0-9.]/g, "")
    .replace(/\.(?=.*\.)/g, "");

const toValidPriceNumber = (value: string) => {
  if (!value) return undefined;
  const numeric = Number(value);
  if (Number.isNaN(numeric) || numeric < 0) return undefined;
  return numeric;
};

const serializeFilters = (filters: ProductFiltersState) =>
  JSON.stringify({
    ...filters,
    categoryId: [...filters.categoryId].sort(),
    brandId: [...filters.brandId].sort(),
    productType: [...filters.productType].sort(),
    featureKey: [...filters.featureKey].sort(),
    featureValue: [...filters.featureValue].sort(),
    variantColor: [...filters.variantColor].sort(),
    variantSize: [...filters.variantSize].sort(),
    variantSku: [...filters.variantSku].sort(),
  });

const parseFiltersFromQuery = (searchParams: ReadonlyURLSearchParams) => ({
  categoryId: parseListQuery(
    searchParams.get("categoryId") ?? searchParams.get("category"),
  ),
  brandId: parseListQuery(searchParams.get("brandId")),
  productType: parseListQuery(searchParams.get("productType")),
  featureKey: parseListQuery(searchParams.get("featureKey")),
  featureValue: parseListQuery(searchParams.get("featureValue")),
  variantColor: parseListQuery(searchParams.get("variantColor")),
  variantSize: parseListQuery(searchParams.get("variantSize")),
  variantSku: parseListQuery(searchParams.get("variantSku")),
});

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search")?.trim() ?? "";
  const initialFilters = parseFiltersFromQuery(searchParams);
  const initialMinPrice = parsePriceQuery(searchParams.get("minPrice"));
  const initialMaxPrice = parsePriceQuery(searchParams.get("maxPrice"));
  const initialSort = isSortValue(searchParams.get("sort"))
    ? (searchParams.get("sort") as SortValue)
    : "name_asc";

  const [filters, setFilters] = useState<ProductFiltersState>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [sortValue, setSortValue] = useState<SortValue>(initialSort);
  const [minPriceInput, setMinPriceInput] = useState(initialMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(initialMaxPrice);
  const [filterOptions, setFilterOptions] = useState<ProductFilterOptions | null>(
    null,
  );
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [skuInput, setSkuInput] = useState(initialFilters.variantSku.join(", "));
  const [localFilterSearch, setLocalFilterSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // products per page
  const { addToCart } = useCartStore();

  const handleSkuChange = (value: string) => {
    setSkuInput(value);
    setFilters((previous) => ({
      ...previous,
      variantSku: parseListQuery(value),
    }));
  };

  const handleMinPriceChange = (value: string) => {
    setMinPriceInput(sanitizePriceInput(value));
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPriceInput(sanitizePriceInput(value));
  };

  const handleMobileFiltersChange = (nextFilters: ProductFiltersState) => {
    setFilters(nextFilters);
    setMobileFiltersOpen(false);
  };

  const removeFilterValue = (key: keyof ProductFiltersState, value: string) => {
    setFilters((previous) => ({
      ...previous,
      [key]: previous[key].filter((item) => item !== value),
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categoryId: [],
      brandId: [],
      productType: [],
      featureKey: [],
      featureValue: [],
      variantColor: [],
      variantSize: [],
      variantSku: [],
    });
    setSkuInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      description: "",
      features: [],
      category: {
        id: product.categoryId || "default",
        name: product.categoryName || "General",
      },
      images: [product.image || "/placeholder-product.jpg"],
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const querySearch = searchParams.get("search")?.trim() ?? "";
    const queryFilters = parseFiltersFromQuery(searchParams);
    const queryMinPrice = parsePriceQuery(searchParams.get("minPrice"));
    const queryMaxPrice = parsePriceQuery(searchParams.get("maxPrice"));
    const querySort = isSortValue(searchParams.get("sort"))
      ? (searchParams.get("sort") as SortValue)
      : "name_asc";

    setSearchTerm((previous) =>
      previous === querySearch ? previous : querySearch,
    );
    setDebouncedSearch((previous) =>
      previous === querySearch ? previous : querySearch,
    );
    setSortValue((previous) => (previous === querySort ? previous : querySort));
    setMinPriceInput((previous) =>
      previous === queryMinPrice ? previous : queryMinPrice,
    );
    setMaxPriceInput((previous) =>
      previous === queryMaxPrice ? previous : queryMaxPrice,
    );
    setFilters((previous) =>
      serializeFilters(previous) === serializeFilters(queryFilters)
        ? previous
        : queryFilters,
    );
    setSkuInput((previous) => {
      const next = queryFilters.variantSku.join(", ");
      return previous === next ? previous : next;
    });
  }, [searchParams]);

  useEffect(() => {
    const sortParam = sortValue === "name_asc" ? "" : sortValue;
    const query = new URLSearchParams();
    const minPriceValue = toValidPriceNumber(minPriceInput);
    const maxPriceValue = toValidPriceNumber(maxPriceInput);

    if (debouncedSearch) {
      query.set("search", debouncedSearch);
    }
    if (filters.categoryId.length) {
      query.set("categoryId", filters.categoryId.join(","));
    }
    if (filters.brandId.length) {
      query.set("brandId", filters.brandId.join(","));
    }
    if (filters.productType.length) {
      query.set("productType", filters.productType.join(","));
    }
    if (filters.featureKey.length) {
      query.set("featureKey", filters.featureKey.join(","));
    }
    if (filters.featureValue.length) {
      query.set("featureValue", filters.featureValue.join(","));
    }
    if (filters.variantColor.length) {
      query.set("variantColor", filters.variantColor.join(","));
    }
    if (filters.variantSize.length) {
      query.set("variantSize", filters.variantSize.join(","));
    }
    if (filters.variantSku.length) {
      query.set("variantSku", filters.variantSku.join(","));
    }
    if (typeof minPriceValue === "number") {
      query.set("minPrice", String(minPriceValue));
    }
    if (typeof maxPriceValue === "number") {
      query.set("maxPrice", String(maxPriceValue));
    }
    if (sortParam) {
      query.set("sort", sortParam);
    }

    const queryString = query.toString();
    router.replace(queryString ? `/products?${queryString}` : "/products", {
      scroll: false,
    });
  }, [debouncedSearch, filters, sortValue, minPriceInput, maxPriceInput, router]);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setFilterOptionsLoading(true);
        const response = await ecommerceApi.getProductFilterOptions();
        setFilterOptions(response.data);
      } catch {
        setFilterOptions(null);
      } finally {
        setFilterOptionsLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const minPriceValue = toValidPriceNumber(minPriceInput);
        const maxPriceValue = toValidPriceNumber(maxPriceInput);
        const [sortBy, sortOrder] = sortValue.split("_") as [
          "name" | "price",
          "asc" | "desc",
        ];

        const productsResponse = await ecommerceApi.getProducts({
          search: debouncedSearch || undefined,
          categoryId: filters.categoryId.length ? filters.categoryId : undefined,
          brandId: filters.brandId.length ? filters.brandId : undefined,
          productType: filters.productType.length ? filters.productType : undefined,
          featureKey: filters.featureKey.length ? filters.featureKey : undefined,
          featureValue: filters.featureValue.length ? filters.featureValue : undefined,
          variantColor: filters.variantColor.length ? filters.variantColor : undefined,
          variantSize: filters.variantSize.length ? filters.variantSize : undefined,
          variantSku: filters.variantSku.length ? filters.variantSku : undefined,
          minPrice: minPriceValue,
          maxPrice: maxPriceValue,
          sortBy,
          sortOrder,
        });

        const mappedProducts: Product[] = productsResponse.data.map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image:
            product.images && product.images.length > 0
              ? toAbsoluteUrl(product.images[0].url)
              : "/placeholder-product.jpg",
          categoryId: product.categoryId ?? null,
          categoryName: product.categoryName || "Uncategorized",
        }));

        setProducts(mappedProducts);
      } catch {
        setProducts([]);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [debouncedSearch, filters, sortValue, minPriceInput, maxPriceInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, debouncedSearch, sortValue, minPriceInput, maxPriceInput]);

  const filteredProducts = useMemo(() => products, [products]);

  const categoryNameById = useMemo(
    () =>
      new Map(
        (filterOptions?.categories ?? []).map((category) => [
          category.id,
          category.name,
        ]),
      ),
    [filterOptions],
  );

  const brandNameById = useMemo(
    () =>
      new Map(
        (filterOptions?.brands ?? []).map((brand) => [brand.id, brand.name]),
      ),
    [filterOptions],
  );

  const activeFilterCount =
    filters.categoryId.length +
    filters.brandId.length +
    filters.productType.length +
    filters.featureKey.length +
    filters.featureValue.length +
    filters.variantColor.length +
    filters.variantSize.length +
    filters.variantSku.length +
    (minPriceInput ? 1 : 0) +
    (maxPriceInput ? 1 : 0);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="hidden md:block">
          <ProductFiltersSidebar
            loading={filterOptionsLoading}
            options={filterOptions}
            filters={filters}
            onFiltersChange={setFilters}
            minPrice={minPriceInput}
            maxPrice={maxPriceInput}
            onMinPriceChange={handleMinPriceChange}
            onMaxPriceChange={handleMaxPriceChange}
            skuInput={skuInput}
            onSkuInputChange={handleSkuChange}
            localSearch={localFilterSearch}
            onLocalSearchChange={setLocalFilterSearch}
          />
        </div>

        {/* Products */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold">Products</h2>

            <div className="flex w-full flex-col gap-3 sm:max-w-3xl sm:flex-row">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search products by name..."
                  className="pl-9 pr-9"
                />
                {searchTerm && (
                  <button
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <select
                value={sortValue}
                onChange={(event) => setSortValue(event.target.value as SortValue)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[92%] p-0 sm:max-w-md">
                  <SheetHeader className="border-b pb-3">
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Refine products by category, brand, features, variants, and price.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="p-4">
                    <ProductFiltersSidebar
                      loading={filterOptionsLoading}
                      options={filterOptions}
                      filters={filters}
                      onFiltersChange={handleMobileFiltersChange}
                      minPrice={minPriceInput}
                      maxPrice={maxPriceInput}
                      onMinPriceChange={handleMinPriceChange}
                      onMaxPriceChange={handleMaxPriceChange}
                      skuInput={skuInput}
                      onSkuInputChange={handleSkuChange}
                      localSearch={localFilterSearch}
                      onLocalSearchChange={setLocalFilterSearch}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <p className="mb-4 text-sm text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} found
          </p>

          {activeFilterCount > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-2">
              {filters.categoryId.map((value) => (
                <Button
                  key={`category-${value}`}
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-full px-2 text-xs"
                  onClick={() => removeFilterValue("categoryId", value)}
                >
                  Category: {categoryNameById.get(value) ?? value}
                  <X className="ml-1 h-3 w-3" />
                </Button>
              ))}

              {filters.brandId.map((value) => (
                <Button
                  key={`brand-${value}`}
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-full px-2 text-xs"
                  onClick={() => removeFilterValue("brandId", value)}
                >
                  Brand: {brandNameById.get(value) ?? value}
                  <X className="ml-1 h-3 w-3" />
                </Button>
              ))}

              {filters.productType.map((value) => (
                <Button
                  key={`type-${value}`}
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-full px-2 text-xs"
                  onClick={() => removeFilterValue("productType", value)}
                >
                  Type: {value}
                  <X className="ml-1 h-3 w-3" />
                </Button>
              ))}

              {filters.featureKey.map((value) => (
                <Button
                  key={`fkey-${value}`}
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-full px-2 text-xs"
                  onClick={() => removeFilterValue("featureKey", value)}
                >
                  Feature: {value}
                  <X className="ml-1 h-3 w-3" />
                </Button>
              ))}

              {filters.featureValue.map((value) => (
                <Button
                  key={`fvalue-${value}`}
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-full px-2 text-xs"
                  onClick={() => removeFilterValue("featureValue", value)}
                >
                  Value: {value}
                  <X className="ml-1 h-3 w-3" />
                </Button>
              ))}

              {filters.variantColor.map((value) => (
                <Button
                  key={`color-${value}`}
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-full px-2 text-xs"
                  onClick={() => removeFilterValue("variantColor", value)}
                >
                  Color: {value}
                  <X className="ml-1 h-3 w-3" />
                </Button>
              ))}

              {filters.variantSize.map((value) => (
                <Button
                  key={`size-${value}`}
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-full px-2 text-xs"
                  onClick={() => removeFilterValue("variantSize", value)}
                >
                  Size: {value}
                  <X className="ml-1 h-3 w-3" />
                </Button>
              ))}

              {filters.variantSku.map((value) => (
                <Button
                  key={`sku-${value}`}
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-full px-2 text-xs"
                  onClick={() => removeFilterValue("variantSku", value)}
                >
                  SKU: {value}
                  <X className="ml-1 h-3 w-3" />
                </Button>
              ))}

              {minPriceInput && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-full px-2 text-xs"
                  onClick={() => setMinPriceInput("")}
                >
                  Min: {minPriceInput}
                  <X className="ml-1 h-3 w-3" />
                </Button>
              )}

              {maxPriceInput && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-full px-2 text-xs"
                  onClick={() => setMaxPriceInput("")}
                >
                  Max: {maxPriceInput}
                  <X className="ml-1 h-3 w-3" />
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={clearAllFilters}
              >
                Clear all
              </Button>
            </div>
          )}

          {error && (
            <ErrorBanner message={error} className="mb-4" />
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: pageSize }).map((_, i) => (
                <Skeleton key={i} className="h-60 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {paginatedProducts.length === 0 ? (
                <div className="rounded-lg border p-8 text-center text-muted-foreground">
                  No products found for the selected filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {paginatedProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group relative overflow-hidden rounded-xl border p-3 transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden rounded-lg">
                        <Image
                          src={product.image || "/placeholder-product.jpg"}
                          alt={product.name}
                          width={480}
                          height={192}
                          className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        {/* Category Badge */}
                        <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                          {product.categoryName}
                        </span>

                        {/* Wishlist Icon */}
                        <button
                          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                          aria-label="Add to wishlist"
                        >
                          ❤️
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="mt-3">
                        <h3 className="line-clamp-1 text-sm font-semibold sm:text-base">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm font-bold text-primary">
                          {product.price.toLocaleString()} ETB
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex gap-2">
                        <Link href={`/products/${product.id}`} className="flex-1">
                          <Button size="sm" className="w-full text-xs sm:text-sm">View Details</Button>
                        </Link>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
