"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Sparkles,
  Chrome,
  Facebook,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo1.png";
import { signIn } from "@/lib/auth-client";

// ✅ Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type SocialProviderKey = "google" | "facebook" | "twitter";

interface CreateAccountProps {
  onSubmit: (data: RegisterFormValues) => void;
  onSocialSignUp?: (provider: SocialProviderKey) => void | Promise<void>;
}

const socialProviders: Array<{
  name: string;
  icon: typeof Chrome;
  key: SocialProviderKey;
}> = [
  { name: "Google", icon: Chrome, key: "google" },
  { name: "Facebook", icon: Facebook, key: "facebook" },
  { name: "Twitter", icon: Twitter, key: "twitter" },
];

export default function CreateAccount({
  onSubmit,
  onSocialSignUp,
}: CreateAccountProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [socialError, setSocialError] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<SocialProviderKey | null>(null);
  const [enabledProviders, setEnabledProviders] = useState<SocialProviderKey[]>([
    "google",
    "facebook",
    "twitter",
  ]);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await fetch("/api/auth/providers", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { providers?: SocialProviderKey[] };
        if (Array.isArray(data.providers)) {
          setEnabledProviders(data.providers);
        }
      } catch {
        // Keep optimistic defaults if provider list cannot be loaded.
      }
    };

    void loadProviders();
  }, []);

  const visibleSocialProviders = useMemo(
    () => socialProviders.filter((provider) => enabledProviders.includes(provider.key)),
    [enabledProviders],
  );

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const loading = form.formState.isSubmitting;

  const handleSocialSignUp = async (provider: SocialProviderKey) => {
    setSocialError(null);
    setSocialLoading(provider);

    try {
      if (onSocialSignUp) {
        await onSocialSignUp(provider);
        return;
      }

      const { error } = await signIn.social(
        {
          provider,
          callbackURL: "/",
          newUserCallbackURL: "/",
          errorCallbackURL: "/auth/new",
        },
        {
          onError: (ctx) => {
            setSocialError(ctx.error.message || `Unable to continue with ${provider}.`);
          },
        },
      );

      if (error) {
        setSocialError(error.message || `Unable to continue with ${provider}.`);
      }
    } catch {
      setSocialError(`Unable to continue with ${provider}.`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-xl text-slate-100 transition-transform duration-500 hover:-translate-y-0.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-slate-200 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Royal Access
            </span>

            <Image
              src={Logo}
              alt="Company Logo"
              width={130}
              height={130}
              priority
              className="mt-8 mb-8"
            />
            <h1 className="text-5xl font-semibold leading-tight tracking-tight">
              Create Your
              <span className="block bg-gradient-to-r from-indigo-200 via-white to-sky-200 bg-clip-text text-transparent">
                Royal Commerce Account
              </span>
            </h1>
            <p className="mt-5 text-lg text-slate-300 leading-relaxed">
              Join to manage orders, save product preferences, and unlock a
              seamless dental shopping experience.
            </p>

            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 backdrop-blur">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <p className="text-sm text-slate-200">
                Secure onboarding with protected account data.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-1 items-center justify-center p-4 sm:p-8 lg:p-10">
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-6 text-slate-900 shadow-[0_25px_80px_rgba(15,23,42,0.4)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_30px_90px_rgba(15,23,42,0.45)] sm:p-8 lg:p-10">
            <div className="mb-5 flex items-center justify-center gap-2 lg:hidden">
              <Image src={Logo} alt="Company Logo" width={26} height={26} />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Royal Access
              </span>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Create Account
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Get started in seconds
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          disabled={loading}
                          className="h-11 rounded-xl border-slate-300 focus-visible:ring-slate-900/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          disabled={loading}
                          className="h-11 rounded-xl border-slate-300 focus-visible:ring-slate-900/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            disabled={loading}
                            className="h-11 rounded-xl border-slate-300 pr-10 focus-visible:ring-slate-900/20"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl bg-slate-900 text-base text-white hover:bg-slate-800"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </Form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t" />
              <span className="mx-3 text-xs text-gray-400 uppercase">
                Or continue with
              </span>
              <div className="flex-grow border-t" />
            </div>

            {socialError ? (
              <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {socialError}
              </p>
            ) : null}

            {/* Social Buttons */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visibleSocialProviders.map(({ name, icon: Icon, key }) => (
                <Button
                  key={name}
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl border-slate-300 text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900"
                  onClick={() => handleSocialSignUp(key)}
                  disabled={loading || !!socialLoading}
                >
                  {socialLoading === key ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="mr-2 h-4 w-4" />
                  )}
                  {name}
                </Button>
              ))}
            </div>

            {/* Login Link */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/auth"
                className="font-medium text-indigo-700 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
