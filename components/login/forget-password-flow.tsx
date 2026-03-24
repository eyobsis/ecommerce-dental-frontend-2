// app/login/forgot-password-flow.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react'; // Assuming lucide-react for icons

interface ForgotPasswordFlowProps {
  onBackToLogin: () => void;
}

// Define Zod schemas for each step
const forgotPasswordEmailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

const validateCodeSchema = z.object({
  code: z.string().min(6, { message: 'Verification code must be 6 characters.' }).max(6),
});

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type ForgotPasswordEmailValues = z.infer<typeof forgotPasswordEmailSchema>;
type ValidateCodeValues = z.infer<typeof validateCodeSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordFlow({ onBackToLogin }: ForgotPasswordFlowProps) {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: Reset Password
  const [userEmail, setUserEmail] = useState('');

  // Form for Email input
  const emailForm = useForm<ForgotPasswordEmailValues>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  const onEmailSubmit = (values: ForgotPasswordEmailValues) => {
    setUserEmail(values.email);
    // Simulate sending code
    setTimeout(() => {
      setStep(2);
    }, 1000);
  };

  // Form for Code validation
  const codeForm = useForm<ValidateCodeValues>({
    resolver: zodResolver(validateCodeSchema),
    defaultValues: {
      code: '',
    },
  });

  const onCodeSubmit = (values: ValidateCodeValues) => {
    // Simulate code validation
    setTimeout(() => {
      setStep(3);
    }, 1000);
  };

  // Form for Password Reset
  const resetPasswordForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onResetPasswordSubmit = (values: ResetPasswordValues) => {
    // Handle password reset API call
    alert('Password has been reset successfully!');
    onBackToLogin(); // Go back to login after successful reset
  };

  return (
    <div>
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBackToLogin} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-xl font-semibold">
          {step === 1 && 'Forgot Password'}
          {step === 2 && 'Verify Code'}
          {step === 3 && 'Reset Password'}
        </h3>
      </div>

      {step === 1 && (
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Send Reset Code
            </Button>
          </form>
        </Form>
      )}

      {step === 2 && (
        <Form {...codeForm}>
          <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
            <p className="text-sm text-gray-600">A 6-digit verification code has been sent to {userEmail}.</p>
            <FormField
              control={codeForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Verify Code
            </Button>
            <Button variant="link" className="w-full" onClick={() => setStep(1)}>
              Resend Code / Change Email
            </Button>
          </form>
        </Form>
      )}

      {step === 3 && (
        <Form {...resetPasswordForm}>
          <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
            <FormField
              control={resetPasswordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={resetPasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
