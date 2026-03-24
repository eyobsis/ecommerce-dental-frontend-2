"use client"
// app/login/login-forms/reset-email-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';

const resetEmailSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address.' }),
});

type ResetEmailFormValues = z.infer<typeof resetEmailSchema>;

interface ResetEmailFormProps {
  onSubmit: (data: ResetEmailFormValues) => void;
  onBackToLogin: () => void;
  loading: boolean;
}

export default function ResetEmailForm({ onSubmit, onBackToLogin, loading }: ResetEmailFormProps) {
  const form = useForm<ResetEmailFormValues>({
    resolver: zodResolver(resetEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBackToLogin} disabled={loading} className="mr-2 text-gray-600 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="flex-grow text-center text-3xl font-bold text-gray-900">Reset Password</h3>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <p className="text-sm text-gray-600 text-center mb-4">
            Enter your email to receive a password reset code.
          </p>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Send Code
          </Button>
        </form>
      </Form>
    </div>
  );
}
