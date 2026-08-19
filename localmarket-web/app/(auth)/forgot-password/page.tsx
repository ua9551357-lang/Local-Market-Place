'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Mail, ArrowRight, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/forgot-password', { email });
      return data;
    },
    onSuccess: () => {
      setSent(true);
      setTimeout(() => router.push(`/reset-password?email=${encodeURIComponent(email)}`), 1500);
    },
  });

  return (
    <AuthLayout>
      <Card className="p-5 sm:p-6 shadow-lg">
        <div className="text-center mb-4">
          <span className="inline-flex w-10 h-10 rounded-full bg-brand-50 items-center justify-center mb-2">
            <ShoppingBag className="w-5 h-5 text-brand-700" />
          </span>
          <h1 className="text-xl font-bold text-neutral-900">Forgot Password?</h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Apna registered email daalo, hum aapko 6-digit code bhejenge
          </p>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <p className="text-sm text-neutral-700">
              Code bhej diya gaya hai <strong>{email}</strong> par. Redirecting...
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            className="space-y-3"
          >
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {mutation.isError && (
              <div className="text-xs text-danger-600 bg-danger-50 border border-red-200 rounded-lg px-3 py-2">
                Kuch ghalat hua, dobara try karo
              </div>
            )}

            <Button type="submit" variant="primary" size="md" className="w-full" isLoading={mutation.isPending}>
              {mutation.isPending ? 'Sending...' : (
                <>Send Reset Code <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>
        )}
      </Card>
    </AuthLayout>
  );
}