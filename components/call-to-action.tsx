"use client";

import { Phone, Mail } from "lucide-react";

const CallToAction = () => {
  return (
    <div className="max-w-md mx-auto py-6 px-5 sm:px-0 text-center">
      <p className="text-sm text-gray-500 mb-4 tracking-wide uppercase">
        contact us.
      </p>

      <div className="flex flex-col items-center justify-center gap-6">
        <a
          href="tel:+251900000000"
          className="group flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100/70 group-hover:bg-gray-200/80 transition-colors">
            <Phone
              size={18}
              className="text-gray-600 group-hover:text-gray-800"
            />
          </div>
          <span className="font-medium text-base">+251 900 000 000</span>
        </a>

        <a
          href="mailto:royaldlabet@gmail.com"
          className="group flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100/70 group-hover:bg-gray-200/80 transition-colors">
            <Mail
              size={18}
              className="text-gray-600 group-hover:text-gray-800"
            />
          </div>
          <span className="font-medium text-base">royaldlabet@gmail.com</span>
        </a>
      </div>

      <p className="mt-5 text-xs text-gray-400">Mon–Sat • 9 AM – 6 PM</p>
    </div>
  );
};

export default CallToAction;
