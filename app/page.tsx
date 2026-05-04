"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/ecommerce/hero-section";
import ProductSliderSection from "@/components/ecommerce/product-slider";
import { ecommerceApi } from "@/lib/ecommerce-api";
import { resolveProductImageUrl } from "@/lib/product-image";

type SliderProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  brand?: string | null;
  categoryName?: string | null;
  createdAt?: string | null;
  isFeatured?: boolean;
};

const isFeaturedProductType = (value?: string | null) => {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "featured" || normalized.includes("featured");
};

// const mockProducts = [
//   {
//     id: "1",
//     name: "Dental Ultrasonic Scaler",
//     price: 8500,
//     image: "/ultrasonic_scan.jpg",
//     category: "Instruments",
//   },
//   {
//     id: "2",
//     name: "LED Curing Light",
//     price: 3200,
//     image: "led_curing_light.jpg",
//     category: "Materials",
//   },
//   {
//     id: "3",
//     name: "Dental Chair Unit",
//     price: 45000,
//     image: "/dental_chair.jpg",
//     category: "Dental Units",
//   },
//   {
//     id: "4",
//     name: "Autoclave Sterilizer",
//     price: 18000,
//     image: "/autoclave.jpg",
//     category: "Sterilization",
//   },
// ];

const HomePage = () => {
  const [sliderProducts, setSliderProducts] = useState<SliderProduct[]>([]);
  const [soldQuantityByProductId, setSoldQuantityByProductId] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [productsResult, ordersResult] = await Promise.allSettled([
          ecommerceApi.getProducts(),
          ecommerceApi.getOrders(),
        ]);

        if (productsResult.status !== "fulfilled") {
          setSliderProducts([]);
          setSoldQuantityByProductId({});
          return;
        }

        const mapped: SliderProduct[] = productsResult.value.data.map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: resolveProductImageUrl(product.images?.[0]?.url),
          brand: product.brandName ?? null,
          categoryName: product.categoryName ?? null,
          createdAt: product.createdAt ?? null,
          isFeatured: isFeaturedProductType(product.productType),
        }));

        setSliderProducts(mapped);

        if (ordersResult.status === "fulfilled") {
          const soldMap = ordersResult.value.data.reduce<Record<string, number>>(
            (acc, order) => {
              for (const item of order.items ?? []) {
                if (!item.productId) continue;
                acc[item.productId] = (acc[item.productId] ?? 0) + item.quantity;
              }
              return acc;
            },
            {},
          );

          setSoldQuantityByProductId(soldMap);
        } else {
          setSoldQuantityByProductId({});
        }
      } catch {
        setSliderProducts([]);
        setSoldQuantityByProductId({});
      }
    };

    loadProducts();
  }, []);

  const bestSelling = [...sliderProducts]
    .filter((product) => (soldQuantityByProductId[product.id] ?? 0) > 0)
    .sort(
      (a, b) =>
        (soldQuantityByProductId[b.id] ?? 0) -
        (soldQuantityByProductId[a.id] ?? 0),
    )
    .slice(0, 8);

  const featuredProducts = sliderProducts
    .filter((product) => product.isFeatured)
    .slice(0, 8);

  const newProducts = [...sliderProducts]
    .sort((a, b) => {
      const aTs = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTs - aTs;
    })
    .slice(0, 8);

  const recommendedProducts = (() => {
    const seen = new Set<string>();
    const picks: SliderProduct[] = [];
    const addProducts = (list: SliderProduct[]) => {
      for (const item of list) {
        if (seen.has(item.id)) continue;
        picks.push(item);
        seen.add(item.id);
        if (picks.length >= 6) return;
      }
    };

    addProducts(bestSelling);
    addProducts(featuredProducts);
    addProducts(newProducts);

    return picks;
  })();

  const brandBuckets = new Map<string, SliderProduct>();
  for (const p of sliderProducts) {
    const key = p.brand || "Other";
    if (!brandBuckets.has(key)) {
      brandBuckets.set(key, p);
    }
  }
  const shopByBrand = Array.from(brandBuckets.values()).slice(0, 8);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50/60 pb-12 sm:pb-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-10 h-64 w-64 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-indigo-200/25 blur-3xl" />
      </div>
      <HeroSection />

      {sliderProducts.length > 0 && (
        <div className="relative mx-auto mt-6 max-w-[1440px] space-y-6 px-3 sm:mt-10 sm:space-y-8 sm:px-6 lg:mt-12 lg:px-10">
          <section className="rounded-[24px] border border-slate-200/80 bg-white/85 p-4 shadow-[0_18px_54px_rgba(15,23,42,0.07)] backdrop-blur sm:rounded-[28px] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Curated Collection
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Essentials for modern dental practice
            </h2>
            <p className="mt-2.5 max-w-3xl text-[13px] leading-6 text-slate-600 sm:mt-3 sm:text-[15px]">
              Explore verified equipment and supplies selected for reliability,
              performance, and professional workflow efficiency.
            </p>
          </section>

          {recommendedProducts.length > 0 && (
            <section className="rounded-[26px] border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.2)] sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.05fr_1.95fr] lg:items-center">
                <div className="space-y-4">
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                    Recommended Picks
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    Dental essentials tailored for daily workflows
                  </h2>
                  <p className="text-sm leading-6 text-white/75 sm:text-[15px]">
                    A hand-selected mix of best sellers, featured innovations,
                    and newly added equipment so teams can shop with confidence.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-white/70">
                    {["Sterilization", "Diagnostics", "Consumables", "Chairside"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/20 px-3 py-1"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                  <Link
                    href="/products"
                    className="inline-flex w-fit items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/20"
                  >
                    Browse all products
                  </Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
                    >
                      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-white/10">
                        <Image
                          src={product.image || "/placeholder-product.jpg"}
                          alt={product.name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain object-center transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                          {product.categoryName || "Dental Supplies"}
                        </p>
                        <h3 className="line-clamp-2 text-sm font-semibold text-white">
                          {product.name}
                        </h3>
                        <p className="text-sm font-semibold text-amber-200">
                          {product.price.toLocaleString()} ETB
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {bestSelling.length > 0 && (
            <ProductSliderSection
              title="Best Selling"
              products={bestSelling}
              viewMoreLink="/products?sort=best-selling"
            />
          )}
          {featuredProducts.length > 0 && (
            <ProductSliderSection
              title="Featured Products"
              products={featuredProducts}
              viewMoreLink="/products?productType=featured"
            />
          )}
          <ProductSliderSection
            title="New Products"
            products={newProducts}
            viewMoreLink="/products?sort=new"
          />
          <ProductSliderSection
            title="Shop By Brand"
            products={shopByBrand}
            viewMoreLink="/products"
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
