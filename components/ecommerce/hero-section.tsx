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
          src="/dent-ecom-hero.jpg"
          alt="dental chair setup"
          fill
          className="hero-bg-image-a object-cover opacity-82"
          sizes="100vw"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        <div className="absolute inset-0 backdrop-blur-[3px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:18px_18px] opacity-30" />
        {/* Gold shimmer accent */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-2 w-2/3 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-300/40 via-yellow-100/0 to-yellow-300/40 blur-2xl opacity-60" />
      </div>

      <div className="relative mx-auto flex min-h-[62vh] max-w-5xl flex-col items-center justify-center text-center sm:min-h-[70vh] md:min-h-[74vh]">
        <div className="w-full max-w-4xl p-1 sm:p-2 md:p-4">
          <span className="inline-flex items-center rounded-full border border-blue-400/60 bg-white/30 px-4 py-2 text-[1rem] font-extrabold uppercase tracking-[0.18em] bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-700 bg-clip-text text-transparent shadow-lg backdrop-blur-lg sm:px-6 sm:text-[1.1rem] sm:tracking-[0.22em] drop-shadow-[0_2px_8px_rgba(30,64,175,0.12)]">
            Royal Dental Marketplace
          </span>

          <h1 className="mx-auto mt-4 max-w-4xl text-[2.8rem] font-extrabold leading-tight text-slate-950 drop-shadow-[0_4px_14px_rgba(255,255,255,0.35)] min-[420px]:text-[3.2rem] md:mt-5 md:text-7xl lg:text-8xl tracking-tight">
            Dental Products, <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-700 bg-clip-text text-transparent">Ready to Order</span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-900/95 drop-shadow-[0_2px_10px_rgba(255,255,255,0.35)] min-[420px]:text-lg md:mt-4 md:text-xl font-medium backdrop-blur-sm bg-white/40 rounded-xl px-3 py-2">
            A sleek catalog for clinics and labs to discover, compare, and
            purchase trusted dental essentials.
          </p>

          <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <Link href="/products" className="w-full sm:w-auto">
              <Button className="cta-hero h-11 w-full rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 px-8 text-white font-semibold shadow-[0_12px_26px_-14px_rgba(15,23,42,0.9)] transition-all duration-300 sm:h-12 sm:w-auto">
                Shop Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth" className="w-full sm:w-auto">
              <Button className="cta-hero h-11 w-full rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 px-8 text-white font-semibold shadow-[0_12px_26px_-14px_rgba(15,23,42,0.9)] transition-all duration-300 sm:h-12 sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-4 hidden justify-center min-[420px]:flex sm:bottom-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/40 bg-white/70 px-4 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-slate-900/80 shadow-md backdrop-blur-md">
            <span>Scroll to catalog</span>
            <ChevronDown className="h-3 w-3 animate-bounce text-yellow-400" />
          </div>
        </div>
      </div>

      <style jsx>{`
                .cta-hero {
                  position: relative;
                  overflow: hidden;
                  border: 2px solid transparent;
                  z-index: 1;
                }
                .cta-hero::before {
                  content: "";
                  position: absolute;
                  inset: 0;
                  border-radius: 1rem;
                  padding: 2px;
                  background: linear-gradient(90deg, #38bdf8, #0ea5e9, #38bdf8, #0ea5e9);
                  background-size: 200% 200%;
                  z-index: -1;
                  opacity: 0;
                  transition: opacity 0.3s, background-position 0.7s;
                  pointer-events: none;
                }
                .cta-hero:hover::before {
                  opacity: 1;
                  background-position: 100% 0;
                  animation: borderMove 1.2s linear infinite;
                }
                .cta-hero:hover {
                  background: linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%);
                  color: #fff;
                  transform: scale(1.09);
                  box-shadow: 0 0 0 4px #bae6fd55, 0 12px 26px -14px rgba(15,23,42,0.9);
                }
                @keyframes borderMove {
                  0% {
                    background-position: 0% 0%;
                  }
                  100% {
                    background-position: 100% 0%;
                  }
                }
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
