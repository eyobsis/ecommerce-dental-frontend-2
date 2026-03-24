"use client"
// app/login/login-forms/validate-code-form.tsx
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

const validateCodeSchema = z.object({
  reset_code: z.string().length(6, { message: 'Verification code must be 6 characters.' }),
});

type ValidateCodeFormValues = z.infer<typeof validateCodeSchema>;

interface ValidateCodeFormProps {
  onSubmit: (data: ValidateCodeFormValues) => void;
  onBackToReset: () => void;
  email: string;
  loading: boolean;
}

export default function ValidateCodeForm({ onSubmit, onBackToReset, email, loading }: ValidateCodeFormProps) {
  const form = useForm<ValidateCodeFormValues>({
    resolver: zodResolver(validateCodeSchema),
    defaultValues: {
      reset_code: '',
    },
  });

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBackToReset} disabled={loading} className="mr-2 text-gray-600 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="flex-grow text-center text-3xl font-bold text-gray-900">Verify Code</h3>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <p className="text-sm text-gray-600 text-center mb-4">
            A 6-digit code has been sent to <span className="font-semibold text-gray-800">{email}</span>.
          </p>
          <FormField
            control={form.control}
            name="reset_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    autoComplete="one-time-code"
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
            Verify Code
          </Button>
        </form>
      </Form>
    </div>
  );
}
