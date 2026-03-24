// app/not-found.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 px-6 text-center">
      {/* Fun lab flask illustration */}
      <motion.svg
        width="180"
        height="220"
        viewBox="0 0 180 220"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-12"
      >
        {/* Flask outline */}
        <path
          d="M60 20 H120 V60 L160 180 Q150 200 90 200 Q30 200 20 180 L60 60 Z"
          fill="white"
          stroke="#0ea5e9"
          strokeWidth="5"
        />
        {/* Liquid inside */}
        <path
          d="M60 120 Q90 140 120 120 V180 H60 Z"
          fill="#a5f3fc"
          opacity="0.8"
        />
        {/* Bubbles */}
        <circle cx="80" cy="100" r="6" fill="#0ea5e9" />
        <circle cx="100" cy="80" r="4" fill="#0ea5e9" />
        <circle cx="110" cy="140" r="5" fill="#0ea5e9" />
      </motion.svg>

      {/* Text */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-7xl md:text-8xl font-black text-gray-800 tracking-tight"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-2xl md:text-3xl font-light text-gray-600"
      >
        Oops! This experiment didn’t work.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-3 max-w-md text-lg text-gray-500 font-light"
      >
        Looks like the page you’re looking for got lost in the lab.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-12"
      >
        <Link
          href="http://admin.localhost:3000"
          className="group inline-flex items-center gap-3 px-10 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-teal-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Return Home
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </Link>
      </motion.div>

      {/* Footer note */}
      <p className="absolute bottom-10 text-sm text-gray-400 font-light">
        Laboratory • Science with Heart
      </p>
    </main>
  );
}
