"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  User,
  Search,
  LogOut,
  Package,
  UserCircle2,
} from "lucide-react";
import { useCartStore } from "@/store/productStore";

export default function EcommerceHeader() {
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const { cartCount } = useCartStore();

  const isClient = session?.user?.accountType === "CLIENT";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const term = formData.get("search")?.toString().trim() ?? "";

    if (pathname.startsWith("/products")) {
      const params = new URLSearchParams(searchParams.toString());

      if (term) {
        params.set("search", term);
      } else {
        params.delete("search");
      }

      const nextQuery = params.toString();
      router.push(nextQuery ? `/products?${nextQuery}` : "/products");
      return;
    }

    router.push(term ? `/products?search=${encodeURIComponent(term)}` : "/products");
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-[0_6px_20px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3.5 md:py-4">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-10 w-64 rounded-md hidden md:block" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </div>
        <div className="md:hidden px-4 pb-3">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/92 shadow-[0_8px_22px_rgba(15,23,42,0.06)] backdrop-blur supports-[backdrop-filter]:bg-white/88">
      <div className="container mx-auto flex h-18 items-center justify-between gap-2 px-2.5 py-2 sm:gap-3 sm:px-4 md:h-20 md:py-2.5">
        {/* Logo */}
        <Link
          href="/"
          className="group flex h-full items-center gap-2 rounded-xl px-1.5 transition-opacity hover:opacity-95"
        >
          <Image
            src="/logow.png"
            alt="Royal Dental"
            width={90}
            height={90}
            priority
            className="h-[66%] w-auto object-contain"
          />
          <span className="hidden text-sm font-semibold tracking-tight text-slate-900 min-[360px]:inline md:text-base">
            Royal Dental
          </span>
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex">
          <Link
            href="/"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              pathname === "/"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              pathname.startsWith("/products")
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Products
          </Link>
          <Link
            href="/my-orders"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              pathname.startsWith("/my-orders")
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            My Orders
          </Link>
        </nav>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden w-full max-w-md items-center md:flex"
        >
          <Input
            name="search"
            placeholder="Search instruments, materials, equipment..."
            className="h-9 rounded-l-xl border-slate-300 bg-white shadow-sm focus-visible:ring-slate-900/20"
          />
          <Button type="submit" className="h-9 rounded-l-none rounded-r-xl bg-slate-900 hover:bg-slate-800">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* ACCOUNT SECTION (UPDATED ONLY HERE) */}
          {!session && (
            <Link href="/auth">
              <Button variant="ghost" className="h-9 rounded-lg px-2.5 text-slate-700 hover:bg-slate-100 sm:px-3">
                <User className="h-5 w-5" />
                <span className="hidden md:inline">Login</span>
              </Button>
            </Link>
          )}

          {isClient && (
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className="h-9 rounded-lg px-2.5 text-slate-700 hover:bg-slate-100 sm:px-3"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <User className="h-5 w-5" />
                <span className="hidden md:inline">Account</span>
              </Button>

              {dropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <Link
                    href="/my-orders"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    Orders
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserCircle2 className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CART (UNCHANGED) */}
          <Link href="/cart" className="relative">
            <Button variant="ghost" className="h-9 rounded-lg px-2.5 text-slate-700 hover:bg-slate-100 sm:px-3">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden md:inline">Cart</span>
            </Button>
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </Badge>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <div className="px-2.5 pb-3 sm:px-4 md:hidden">
        <form onSubmit={handleSearch} className="flex">
          <Input
            name="search"
            placeholder="Search products..."
            className="h-9 rounded-l-xl border-slate-300 bg-white text-sm shadow-sm"
          />
          <Button type="submit" className="h-9 rounded-l-none rounded-r-xl bg-slate-900 hover:bg-slate-800">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="border-t border-slate-200 bg-slate-50/80 px-2.5 py-2 sm:px-4 lg:hidden">
        <div className="container mx-auto flex items-center gap-2 overflow-x-auto">
          <Link href="/" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
            Home
          </Link>
          <Link href="/products" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
            Products
          </Link>
          <Link href="/my-orders" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
            My Orders
          </Link>
        </div>
      </div>
    </header>
  );
}
