"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";

import { requestPasswordReset } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [requestCompleted, setRequestCompleted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [requestError, setRequestError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async ({ email }: ForgotPasswordValues) => {
    setRequestError(null);

    try {
      const redirectTo = `${window.location.origin}/auth/reset-password`;
      const { error } = await requestPasswordReset({
        email,
        redirectTo,
      });

      if (error) {
        console.error("[auth] requestPasswordReset returned an error", error);
      }

      // Always show a generic success message to avoid account enumeration.
      setSubmittedEmail(email);
      setRequestCompleted(true);
    } catch {
      setRequestError("We could not start the password reset process. Please try again.");
    }
  };

  if (requestCompleted) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 sm:p-8 text-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md border-white/20 bg-white/95 text-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MailCheck className="h-5 w-5 text-emerald-600" />
              Check your email
            </CardTitle>
            <CardDescription>
              If an account exists for {submittedEmail}, a reset link has been sent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth">Back to sign in</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                form.reset();
                setRequestCompleted(false);
                setSubmittedEmail("");
              }}
            >
              Send another reset link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8 text-slate-100 flex items-center justify-center">
      <Card className="w-full max-w-md border-white/20 bg-white/95 text-slate-900">
        <CardHeader>
          <CardTitle className="text-xl">Forgot password</CardTitle>
          <CardDescription>
            Enter your account email and we will send a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {requestError ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {requestError}
                </p>
              ) : null}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send reset link
              </Button>
            </form>
          </Form>

          <Button asChild variant="ghost" className="w-full justify-center">
            <Link href="/auth">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
