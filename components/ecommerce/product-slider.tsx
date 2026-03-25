"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/productStore";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  brand?: string | null;
  categoryName?: string | null;
  isFeatured?: boolean;
}

interface Props {
  title: string;
  products: Product[];
  viewMoreLink: string;
}

const ProductSliderSection = ({ title, products, viewMoreLink }: Props) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      description: "",
      features: [],
      category: {
        id: "default",
        name: product.categoryName || "General",
      },
      images: [product.image],
    });
  };

  return (
    <section className="mb-12 rounded-[26px] border border-slate-200/75 bg-gradient-to-b from-white to-slate-50/70 p-3.5 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:mb-16 sm:rounded-[30px] sm:p-7">
      <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-[1.7rem]">
            {title}
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:mt-1.5 sm:text-sm">
            Curated picks from our verified dental catalog.
          </p>
        </div>
        <Link href={viewMoreLink} className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full rounded-full border-slate-300 bg-white px-5 text-slate-700 hover:bg-slate-100 sm:w-auto"
          >
            View More
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4 rounded-2xl">
              <Skeleton className="mb-4 h-40 w-full rounded-md sm:h-48" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/2 mb-4" />
              <Skeleton className="h-9 w-full rounded-md" />
            </Card>
          ))}
        </div>
      ) : (
        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent className="-ml-3 sm:-ml-4">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-3 basis-[90%] min-[420px]:basis-[72%] min-[520px]:basis-[56%] sm:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Card className="group h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-[0_24px_44px_rgba(15,23,42,0.12)]">
                  <CardContent className="p-3 sm:p-3.5">
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={320}
                        unoptimized
                        sizes="(max-width: 419px) 90vw, (max-width: 519px) 72vw, (max-width: 767px) 56vw, (max-width: 1023px) 50vw, 25vw"
                        className="h-36 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-40"
                      />

                      <span className="absolute left-2 top-2 max-w-[72%] truncate rounded-full border border-white/60 bg-slate-900/88 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white shadow">
                        {product.categoryName || "Dental Supply"}
                      </span>

                      <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/92 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        Trusted
                      </span>
                    </div>

                    <h3 className="mt-3.5 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-900 sm:line-clamp-1 sm:min-h-0 sm:text-base">
                      {product.name}
                    </h3>
                    <p className="mt-1.5 text-base font-bold tracking-tight text-slate-900">
                      {product.price.toLocaleString()} ETB
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
                      {(product.brand || "Verified Supplier") + " • VAT included"}
                    </p>

                    <div className="mt-3 grid grid-cols-1 gap-2 min-[520px]:grid-cols-2 sm:mt-3.5">
                      <Link href={`/products/${product.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-10 w-full rounded-xl border-slate-300 text-xs font-medium text-slate-700 sm:text-sm"
                        >
                          View Details
                          <ArrowUpRight className="ml-1 hidden h-3.5 w-3.5 min-[380px]:inline" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="h-10 rounded-xl bg-slate-900 text-xs font-medium text-white hover:bg-slate-800 sm:text-sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 hidden border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 sm:flex" />
          <CarouselNext className="right-0 hidden border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 sm:flex" />
        </Carousel>
      )}
    </section>
  );
};

export default ProductSliderSection;
