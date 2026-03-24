"use client";

import CheckoutModal from "@/components/check-out";
import { useCartStore } from "@/store/productStore";
import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

const CartPage = () => {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
  } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const total = getTotalPrice();
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
  });

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Your Cart is Empty
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Add products to your cart to continue checkout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />
      </div>

      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review your items and proceed when ready.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm sm:self-auto">
          <ShoppingBag className="h-4 w-4" />
          {cart.length} item{cart.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="space-y-4">
        {cart.map((item) => {
          const variantPrice = item.variant?.additionalPrice || 0;
          const itemTotal = (item.basePrice + variantPrice) * item.quantity;

          return (
            <div
              key={`${item.productId}-${item.variant?.id || "no-variant"}`}
              className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              {/* Left side */}
              <div className="flex items-center gap-4 sm:gap-5">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  unoptimized
                  className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200 sm:h-24 sm:w-24"
                />

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>

                  {item.variant && (
                    <p className="text-sm text-slate-500">
                      Variant: {item.variant.name}
                    </p>
                  )}

                  <p className="mt-1 text-sm text-slate-600">
                    Price: {formatter.format(item.basePrice + variantPrice)}
                  </p>
                </div>
              </div>

              {/* Right side */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50">
                  <button
                    onClick={() =>
                      decreaseQuantity(item.productId, item.variant?.id)
                    }
                    className="px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-10 px-3 text-center text-sm font-semibold text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      increaseQuantity(item.productId, item.variant?.id)
                    }
                    className="px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-right text-base font-semibold text-slate-900 sm:min-w-28">
                  {formatter.format(itemTotal)}
                </p>

                <button
                  onClick={() =>
                    removeFromCart(item.productId, item.variant?.id)
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          Clear Cart
          </button>

          <div className="w-full text-left sm:w-auto sm:text-right">
            <p className="text-sm text-slate-500">Cart Total</p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {formatter.format(total)}
            </h2>
            <CheckoutModal
              open={checkoutOpen}
              onClose={() => setCheckoutOpen(false)}
              products={cart}
              onSuccess={clearCart}
            />
            <button
              className="mt-3 w-full rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 sm:w-auto"
              onClick={() => setCheckoutOpen(true)}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
