// app/products/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/store/productStore";
import ProductSliderSection from "@/components/ecommerce/product-slider";
import {
  Check,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import CallToAction from "@/components/call-to-action";
import Checkout from "@/components/check-out";
import { ecommerceApi } from "@/lib/ecommerce-api";
import type { IProduct } from "@/store/productStore";

// NOTE: This PRODUCTS array was used as mock data for the
// product detail page before the backend was wired.
// It is intentionally kept (commented out) for reference,
// but the page now relies entirely on real backend data.
//
// const PRODUCTS = [
//   {
//     id: "1",
//     name: "Dental Chair Unit",
//     price: 45000,
//     description:
//       "Ergonomic dental chair with advanced functionality for patient comfort and practitioner efficiency.",
//     features: [
//       "Adjustable headrest",
//       "LED operating light",
//       "Integrated suction system",
//       "5 year warranty",
//     ],
//     images: [
//       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.iJTvyKUNPO_5HKVsepDQkgHaHa%3Fpid%3DApi&f=1&ipt=5d7e149330231649037be186dd5c1b1eb148d219df60759a03e51c87785b0a13&ipo=images",
//       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.GgzQ2ADEsjTvnaq2o1sSfgHaFD%3Fpid%3DApi&f=1&ipt=97de4bc749b4bb505c36fcfea97d22e00cfdcf2f38c066e92b79ecbf4fbc09b1&ipo=images",
//     ],
//     category: { id: "1", name: "Dental Chairs" },
//     variants: [
//       { id: "v1", name: "Standard Model", additionalPrice: 0, stock: 8 },
//       {
//         id: "v2",
//         name: "Premium Model with Touch Controls",
//         additionalPrice: 10000,
//         stock: 4,
//       },
//     ],
//   },
//   {
//     id: "2",
//     name: "High-Speed Handpiece",
//     price: 7500,
//     description:
//       "Durable high-speed dental handpiece designed for precision cutting and reduced noise.",
//     features: [
//       "Ceramic bearings",
//       "Push-button chuck",
//       "Autoclavable",
//       "1 year warranty",
//     ],
//     images: [
//       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.RZh0Aib87oyx0YCv1Cq2JAHaHa%3Fpid%3DApi&f=1&ipt=46a7881428f8d0aa45d36c1dff60293416cb40dff4704a9a881035c37e1e419a&ipo=images",
//       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.iBwdSxN_uXuaLDrzifuPzAHaHa%3Fpid%3DApi&f=1&ipt=17f282ac90b6aa407b831e4a4968d4fe89ae365bd154f54773928f4320867b5e&ipo=images",
//     ],
//     category: { id: "handpieces", name: "Handpieces" },
//     variants: [
//       { id: "v1", name: "Standard Head", additionalPrice: 0, stock: 15 },
//       { id: "v2", name: "Mini Head", additionalPrice: 500, stock: 10 },
//     ],
//   },
//   {
//     id: "3",
//     name: "Autoclave Sterilizer",
//     price: 28000,
//     description:
//       "Compact autoclave sterilizer for efficient and reliable instrument sterilization.",
//     features: [
//       "Digital display",
//       "Fast cycle time",
//       "Automatic drying",
//       "2 year warranty",
//     ],
//     images: [
//       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.hdKzf2luG6v_6qWOo7Y6vgHaIe%3Fpid%3DApi&f=1&ipt=836d338e731343b4b088cff664556700b9fdb142aea605a700354688cd3fcaae&ipo=images",
//       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.hdKzf2luG6v_6qWOo7Y6vgHaIe%3Fpid%3DApi&f=1&ipt=836d338e731343b4b088cff664556700b9fdb142aea605a700354688cd3fcaae&ipo=images",
//       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP._tZj7gLxMUe4yeQy9aPomAHaHa%3Fpid%3DApi&f=1&ipt=5b84eb1d720579ebbc21f0ed3f6820644d279c33dd90a2b9257824eb8d598d85&ipo=images",
//     ],
//     category: { id: "1", name: "Sterilization Units" },
//     variants: [
//       { id: "v1", name: "18L Capacity", additionalPrice: 0, stock: 6 },
//       { id: "v2", name: "24L Capacity", additionalPrice: 4000, stock: 3 },
//     ],
//   },
// ];

/* ---------------- COMPONENT ---------------- */

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          ecommerceApi.getProducts(),
          ecommerceApi.getCategories(),
        ]);

        const categoryMap = new Map(
          categoriesResponse.data.map((category) => [category.id, category.name]),
        );

        const mappedProducts = await Promise.all(
          productsResponse.data.map(async (product) => {
            const variantsResponse = await ecommerceApi.getVariantsByProduct(
              product.id,
            );

            const imageUrls =
              product.images && product.images.length > 0
                ? product.images.map((img) => img.url)
                : ["/placeholder-product.jpg"];

            return {
              id: product.id,
              name: product.name,
              price: Number(product.price),
              description: product.description || "No description available",
              features:
                product.features?.map((feature) => feature.feature).filter(Boolean) ||
                [],
              images: imageUrls,
              category: {
                id: product.categoryId || "uncategorized",
                name: product.categoryId
                  ? (categoryMap.get(product.categoryId) ?? "Uncategorized")
                  : "Uncategorized",
              },
              variants: variantsResponse.data.map((variant) => ({
                id: variant.id,
                name: variant.name,
                additionalPrice: Number(variant.additionalPrice || 0),
                stock: Number(variant.stock || 0),
              })),
            };
          }),
        );

        if (mappedProducts.length > 0) {
          setProducts(mappedProducts);
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const product = useMemo(
    () => products.find((p) => p.id === id),
    [products, id],
  );

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0],
  );
  const [quantity, setQuantity] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState<
    "overview" | "features" | "shipping"
  >("overview");

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      setSelectedVariant(product.variants?.[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-2/5 rounded-xl bg-slate-200" />
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="h-[520px] rounded-3xl bg-slate-200" />
            <div className="space-y-4">
              <div className="h-7 w-3/4 rounded-lg bg-slate-200" />
              <div className="h-6 w-1/3 rounded-lg bg-slate-200" />
              <div className="h-24 rounded-2xl bg-slate-200" />
              <div className="h-12 rounded-xl bg-slate-200" />
              <div className="h-12 rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-slate-900">Product not found</h1>
        <p className="mt-3 text-slate-600">
          This product is no longer available or may have been moved.
        </p>
      </div>
    );
  }

  const finalPrice = product.price + (selectedVariant?.additionalPrice || 0);
  const selectedStock = selectedVariant?.stock ?? 0;
  const isInStock = selectedStock > 0;

  const similarProducts = products.filter(
    (p) => p.category.id === product.category.id && p.id !== product.id,
  ).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.images[0],
  }));

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/70 pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute right-0 top-36 h-72 w-72 rounded-full bg-cyan-200/25 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-14">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
          <span className="font-medium text-slate-700">Home</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Products</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{product.category.name}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="max-w-[220px] truncate font-medium text-slate-900 sm:max-w-none">
            {product.name}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.18fr_1fr] lg:gap-12">
          <div className="space-y-5 rounded-3xl border border-slate-200/80 bg-white/85 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-5">
            <div className="relative overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={selectedImage || product.images[0]}
                alt={product.name}
                width={1400}
                height={900}
                unoptimized
                className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
              />
              <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-slate-900/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                Premium Dental Catalog
              </span>
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Trusted by Clinics
              </span>
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
                {product.images.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    onClick={() => setSelectedImage(img)}
                    className={`min-w-16 overflow-hidden rounded-xl border transition sm:min-w-0 ${
                      selectedImage === img
                        ? "border-slate-900 ring-2 ring-slate-900/20"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      width={120}
                      height={120}
                      unoptimized
                      className="h-16 w-16 object-cover sm:h-20 sm:w-full"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {product.category.name}
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-[2rem]">
                    {product.name}
                  </h1>
                </div>
                <div className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  Premium Choice
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    Availability
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      isInStock ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {isInStock ? `In stock (${selectedStock})` : "Out of stock"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    Dispatch
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">24-48 Hours</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    Warranty
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">Manufacturer-backed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="self-start lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.08)] sm:p-7">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Total Price
                </p>
                <div className="mt-2 flex items-end gap-3">
                  <p className="text-[1.75rem] font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {finalPrice.toLocaleString()} ETB
                  </p>
                  {selectedVariant?.additionalPrice ? (
                    <p className="pb-1 text-xs font-medium text-slate-500">
                      includes variant uplift
                    </p>
                  ) : null}
                </div>
              </div>

              <p className="mt-4 text-[15px] leading-7 text-slate-600">
                {product.description}
              </p>

              {product.variants && product.variants.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-sm font-semibold text-slate-800">Select Variant</h3>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                          selectedVariant?.id === variant.id
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        <p className="font-medium">{variant.name}</p>
                        {variant.additionalPrice > 0 ? (
                          <p className="mt-0.5 text-xs opacity-80">
                            +{variant.additionalPrice.toLocaleString()} ETB
                          </p>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-7">
                <h3 className="text-sm font-semibold text-slate-800">Quantity</h3>
                <div className="mt-3 inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1.5">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-8 px-2 text-center text-sm font-semibold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Button
                  className="h-11 w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                  onClick={() => {
                    const productForCart: IProduct = {
                      id: product.id,
                      name: product.name,
                      category: product.category,
                      price: product.price,
                      quantity: 0,
                      description: product.description,
                      features: product.features,
                      variants: product.variants,
                      images: product.images,
                    };

                    for (let i = 0; i < quantity; i++) {
                      addToCart(productForCart, selectedVariant);
                    }
                  }}
                  disabled={!isInStock}
                >
                  Add to Cart
                </Button>

                <Button
                  className="h-11 w-full rounded-xl bg-emerald-700 text-white hover:bg-emerald-600"
                  onClick={() => setCheckoutOpen(true)}
                  disabled={!isInStock}
                >
                  Order Now
                </Button>
              </div>

              <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-slate-700" />
                  <span>Verified Quality</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Truck className="h-4 w-4 text-slate-700" />
                  <span>Fast Dispatch</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Undo2 className="h-4 w-4 text-slate-700" />
                  <span>Easy Returns</span>
                </div>
              </div>

              <div className="mt-8">
                <CallToAction />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "overview", label: "Overview" },
              { key: "features", label: "Key Features" },
              { key: "shipping", label: "Shipping & Support" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setActiveInfoTab(
                    tab.key as "overview" | "features" | "shipping",
                  )
                }
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeInfoTab === tab.key
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeInfoTab === "overview" && (
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <h3 className="text-base font-semibold text-slate-900">Clinical Overview</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {product.description}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <h3 className="text-base font-semibold text-slate-900">Why Clinics Choose This</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                    Reliable performance for day-to-day clinical workflow.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                    Premium sourcing and quality-controlled catalog standards.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                    Fast procurement with responsive post-purchase support.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeInfoTab === "features" && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(product.features.length > 0
                ? product.features
                : [
                    "Professional-grade durability",
                    "Optimized for clinical efficiency",
                    "Quality-assured manufacturing",
                  ]
              ).map((feature, index) => (
                <div
                  key={`${feature}-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  {feature}
                </div>
              ))}
            </div>
          )}

          {activeInfoTab === "shipping" && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-900">Dispatch Window</h4>
                <p className="mt-2 text-sm text-slate-600">
                  Most orders are prepared and dispatched within 24-48 hours.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-900">Order Support</h4>
                <p className="mt-2 text-sm text-slate-600">
                  Dedicated support for quotation, order updates, and delivery status.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-900">Returns Policy</h4>
                <p className="mt-2 text-sm text-slate-600">
                  Structured returns process for eligible products and order issues.
                </p>
              </div>
            </div>
          )}
        </div>

        <Checkout
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          products={[
            { id: product.id, name: product.name, price: finalPrice },
          ]}
        />

        {similarProducts.length > 0 && (
          <div className="mt-16">
            <ProductSliderSection
              title="Similar Products"
              products={similarProducts}
              viewMoreLink="/products"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
