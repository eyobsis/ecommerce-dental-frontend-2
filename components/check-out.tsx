"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, ShieldCheck, CreditCard } from "lucide-react";
import {
  DEFAULT_ORDER_USER_ID,
  normalizeOrderUserId,
} from "@/lib/ecommerce-api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface IProductVariant {
  id: string;
  name: string;
  additionalPrice?: number;
  stock: number;
}

interface ICartItem {
  productId: string;
  name: string;
  basePrice: number;
  image: string;
  variant?: IProductVariant;
  quantity: number;
}

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type CheckoutProductInput =
  | ICartItem
  | {
      id: string;
      name: string;
      price: number;
      quantity?: number;
    };

interface CheckoutProps {
  open: boolean;
  onClose: () => void;
  products: CheckoutProductInput[];
  onSuccess?: () => void;
}

function normalizeItems(items: CheckoutProductInput[]): CheckoutItem[] {
  return items.map((item) => {
    if ("productId" in item) {
      // CartItem
      const variantPrice = item.variant?.additionalPrice ?? 0;
      return {
        id: item.productId,
        name: item.variant ? `${item.name} - ${item.variant.name}` : item.name,
        price: item.basePrice + variantPrice,
        quantity: item.quantity,
      };
    } else {
      // Product
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity ?? 1,
      };
    }
  });
}

export default function CheckoutModal({
  open,
  onClose,
  products,
  onSuccess,
}: CheckoutProps) {
  const { data: session } = useSession();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(() => normalizeItems(products), [products]);

  const total = useMemo(() => {
    return items.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }, [items]);

  const isValid = (phone || email) && address && screenshot;

  useEffect(() => {
    if (!screenshot) return setPreview(null);
    const url = URL.createObjectURL(screenshot);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [screenshot]);

  const handleSubmit = async () => {
    if (!isValid) return;

    setLoading(true);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
        "http://localhost:3001";

      const formData = new FormData();
      const normalizedUserId = normalizeOrderUserId(session?.user?.id);

      if (normalizedUserId !== DEFAULT_ORDER_USER_ID) {
        formData.append("userId", normalizedUserId);
      }

      formData.append("totalAmount", String(total));
      formData.append("items", JSON.stringify(items));
      formData.append("customerPhone", phone);
      formData.append("customerEmail", email);
      formData.append("deliveryAddress", address);
      formData.append("paymentProof", screenshot as File);

      const response = await fetch(`${backendUrl}/api/v1/orders/quick-checkout`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.message || "Checkout request failed");
      }

      toast.success("Order placed successfully");
      onSuccess?.();
      onClose();
    } catch {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl rounded-2xl border-slate-200 bg-white p-0 shadow-[0_30px_90px_rgba(15,23,42,0.25)]">
        <DialogHeader className="border-b bg-gradient-to-r from-slate-50 via-white to-slate-100 px-6 pb-4 pt-6">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
            <CreditCard className="h-5 w-5" />
            Secure Checkout
          </DialogTitle>
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            Your payment proof and order details are transmitted securely.
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-1 text-sm font-semibold text-slate-800">
              Delivery & Contact
            </p>
            <Input
              placeholder="Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-slate-300 bg-white"
            />
            <Input
              placeholder="Phone *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-slate-300 bg-white"
            />
            <Input
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-slate-300 bg-white"
            />
            <Input
              placeholder="Delivery Address *"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-slate-300 bg-white"
            />

            {/* Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center transition-colors hover:bg-slate-100"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
              />

              {preview ? (
                <Image
                  src={preview}
                  alt="Payment screenshot preview"
                  width={320}
                  height={140}
                  unoptimized
                  className="mx-auto h-28 rounded-lg object-contain"
                />
              ) : (
                <>
                  <Upload className="mx-auto h-6 w-6 text-slate-500" />
                  <p className="mt-1 text-xs font-medium text-slate-600">Upload payment proof</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">PNG, JPG, or JPEG</p>
                </>
              )}
            </div>
          </div>

          {/* RIGHT SIDE (SUMMARY) */}
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
            <p className="text-lg font-semibold text-slate-900">Order Summary</p>

            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 p-3"
                >
                  <div>
                    <p className="font-medium text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-500">
                      Qty: {p.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {(p.price * p.quantity).toLocaleString()} ETB
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>{total.toLocaleString()} ETB</span>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t bg-slate-50 px-6 py-4">
          <Button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
