import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-slate-200/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-slate-300">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      <div className="container mx-auto px-6 py-14">
        <div className="mb-12 grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link
              href="/"
              className="inline-block text-2xl font-bold tracking-tight text-white"
            >
              ROYAL<span className="text-cyan-300">IMPORT</span>
            </Link>
            <p className="mt-4 max-w-md leading-relaxed text-slate-300/90">
              Royal Dental Equipment & Supply Distribution delivers trusted
              product listing, procurement, and inventory-ready commerce for
              clinics, hospitals, and laboratories.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="#"
                className="rounded-full border border-slate-700 bg-slate-800/60 p-2.5 text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="#"
                className="rounded-full border border-slate-700 bg-slate-800/60 p-2.5 text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                className="rounded-full border border-slate-700 bg-slate-800/60 p-2.5 text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="#"
                className="rounded-full border border-slate-700 bg-slate-800/60 p-2.5 text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-100">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-cyan-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="transition hover:text-cyan-200"
                >
                  Shop Products
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="transition hover:text-cyan-200"
                >
                  Cart & Checkout
                </Link>
              </li>
              <li>
                <Link
                  href="/my-orders"
                  className="transition hover:text-cyan-200"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-100">
              Product Categories
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="/products" className="transition hover:text-cyan-200">
                  Dental Chairs
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-cyan-200">
                  Handpieces
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-cyan-200">
                  Sterilization Units
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-cyan-200">
                  Imaging Systems
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-cyan-200">
                  Consumables & Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-100">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-cyan-300" />
                <a
                  href="https://maps.app.goo.gl/7CokvvAMNtzJ4Xid9"
                  target="_blank"
                  rel="noreferrer"
                  className="leading-relaxed text-slate-200 transition hover:text-cyan-200"
                >
                  Cameron Street, Bole Medhaniyalem, Seket Building, Addis
                  Ababa, Ethiopia.
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <Phone size={18} className="shrink-0 text-cyan-300" />
                <span>+251 984 112 233</span>
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <Mail size={18} className="shrink-0 text-cyan-300" />
                <span>royallab.et@gmail.com</span>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                Business Hours
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Monday - Saturday · 9:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-700/70 pt-7 text-sm md:flex-row md:items-center">
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} Royal Import. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-400">
            <Link href="/privacy" className="transition hover:text-cyan-200">
              Privacy Policy
            </Link>
            <Link href="#" className="transition hover:text-cyan-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
