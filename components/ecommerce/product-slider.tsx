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
import { Eye, ShoppingCart, Sparkles } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  brand?: string | null;
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
        name: "General",
      },
      images: [product.image],
    });
  };

  return (
    <section className="mb-16 rounded-[30px] border border-slate-200/75 bg-gradient-to-b from-white to-slate-50/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:p-7">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.7rem]">
            {title}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Curated picks from our verified dental catalog.
          </p>
        </div>
        <Link href={viewMoreLink}>
          <Button
            variant="outline"
            className="w-full rounded-full border-slate-300 bg-white px-5 text-slate-700 hover:bg-slate-100 sm:w-auto"
          >
            View More
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4 rounded-2xl">
              <Skeleton className="h-48 w-full rounded-md mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/2 mb-4" />
              <Skeleton className="h-9 w-full rounded-md" />
            </Card>
          ))}
        </div>
      ) : (
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-[86%] min-[480px]:basis-[62%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Card className="group h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-[0_24px_44px_rgba(15,23,42,0.12)]">
                  <CardContent className="p-3.5">
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={320}
                        className="h-44 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-48"
                      />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 shadow-sm">
                        <Sparkles className="h-3 w-3 text-amber-500" />
                        Featured
                      </span>
                    </div>

                    <h3 className="mt-3.5 line-clamp-1 text-sm font-semibold text-slate-900 sm:text-[15px]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                      {product.price.toLocaleString()} ETB
                    </p>
                    <p className="line-clamp-1 text-xs text-slate-500">
                      {(product.brand || "Verified Supplier") + " • VAT included"}
                    </p>

                    <div className="mt-3.5 flex flex-col gap-2 sm:flex-row">
                      <Link href={`/products/${product.id}`} className="flex-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 w-full rounded-full border-slate-300 text-xs"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Details
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="h-9 flex-1 rounded-full bg-slate-900 text-xs text-white hover:bg-slate-800"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="mr-1 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 hidden border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 sm:flex" />
          <CarouselNext className="right-1 hidden border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 sm:flex" />
        </Carousel>
      )}
    </section>
  );
};

export default ProductSliderSection;
