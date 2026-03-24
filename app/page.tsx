"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/ecommerce/hero-section";
import ProductSliderSection from "@/components/ecommerce/product-slider";
import { ecommerceApi } from "@/lib/ecommerce-api";

type SliderProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  brand?: string | null;
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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await ecommerceApi.getProducts();
        const mapped: SliderProduct[] = response.data.map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image:
            product.images && product.images.length > 0
              ? product.images[0].url
              : "/placeholder-product.jpg",
          brand: product.brandName ?? null,
        }));

        setSliderProducts(mapped);
      } catch {
        setSliderProducts([]);
      }
    };

    loadProducts();
  }, []);

  const bestSelling = [...sliderProducts]
    .sort((a, b) => b.price - a.price)
    .slice(0, 8);

  const newProducts = [...sliderProducts]
    .slice()
    .reverse()
    .slice(0, 8);

  const brandBuckets = new Map<string, SliderProduct>();
  for (const p of sliderProducts) {
    const key = p.brand || "Other";
    if (!brandBuckets.has(key)) {
      brandBuckets.set(key, p);
    }
  }
  const shopByBrand = Array.from(brandBuckets.values()).slice(0, 8);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50/60 pb-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-10 h-64 w-64 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-indigo-200/25 blur-3xl" />
      </div>
      <HeroSection />

      {sliderProducts.length > 0 && (
        <div className="relative mx-auto mt-8 max-w-[1440px] space-y-8 px-4 sm:mt-10 sm:px-6 lg:mt-12 lg:px-10">
          <section className="rounded-[28px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_18px_54px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Curated Collection
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Premium essentials for modern dental practice
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-[15px]">
              Explore verified equipment and supplies selected for reliability,
              performance, and professional workflow efficiency.
            </p>
          </section>

          <ProductSliderSection
            title="Best Selling"
            products={bestSelling}
            viewMoreLink="/products?sort=best-selling"
          />
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
