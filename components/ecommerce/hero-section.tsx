"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative mb-8 min-h-[78dvh] overflow-hidden bg-slate-100 px-3 py-6 text-slate-900 shadow-[0_20px_60px_-24px_rgba(14,116,144,0.35)] sm:mb-12 sm:min-h-[86dvh] sm:px-6 sm:py-8 md:min-h-[92dvh] md:px-10 md:py-14">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/dental_chair.jpg"
          alt="dental chair setup"
          fill
          className="hero-bg-image-a object-cover opacity-82"
          sizes="100vw"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/18" />
        <div className="absolute inset-0 backdrop-blur-[1.2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:18px_18px] opacity-30" />
      </div>

      <div className="relative mx-auto flex min-h-[62vh] max-w-5xl flex-col items-center justify-center text-center sm:min-h-[70vh] md:min-h-[74vh]">
        <div className="w-full max-w-4xl p-1 sm:p-2 md:p-4">
          <span className="inline-flex items-center rounded-full border border-white/55 bg-transparent px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white sm:px-4 sm:text-[11px] sm:tracking-[0.18em]">
            Royal Dental Marketplace
          </span>

          <h1 className="mx-auto mt-4 max-w-4xl text-[1.8rem] font-extrabold leading-tight text-slate-950 drop-shadow-[0_4px_14px_rgba(255,255,255,0.35)] min-[420px]:text-[2rem] md:mt-5 md:text-5xl lg:text-6xl">
            Dental Products, Ready to Order
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-900/95 drop-shadow-[0_2px_10px_rgba(255,255,255,0.35)] min-[420px]:text-base md:mt-4 md:text-lg">
            A sleek catalog for clinics and labs to discover, compare, and
            purchase trusted dental essentials.
          </p>

          <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <Link href="/products" className="w-full sm:w-auto">
              <Button className="h-10 w-full rounded-xl bg-slate-950 px-6 text-white shadow-[0_12px_26px_-14px_rgba(15,23,42,0.9)] transition-all duration-300 hover:scale-[1.02] hover:bg-black sm:h-11 sm:w-auto">
                Shop Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth" className="w-full sm:w-auto">
              <Button className="h-10 w-full rounded-xl bg-slate-950 px-6 text-white shadow-[0_12px_26px_-14px_rgba(15,23,42,0.9)] transition-all duration-300 hover:scale-[1.02] hover:bg-black sm:h-11 sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-4 hidden justify-center min-[420px]:flex sm:bottom-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/20 bg-white/55 px-4 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-slate-900/80 backdrop-blur-sm">
            <span>Scroll to catalog</span>
            <ChevronDown className="h-3 w-3 animate-bounce" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes heroZoomLoop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.12);
          }
          100% {
            transform: scale(1);
          }
        }

        .hero-bg-image-a {
          animation: heroZoomLoop 22s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
