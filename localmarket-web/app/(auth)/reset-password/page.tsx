'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Lock, KeyRound, ArrowRight, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { AuthLayout } from '@/components/auth/AuthLayout';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/reset-password', { email, code, newPassword });
      return data;
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    mutation.mutate();
  };

  if (success) {
    return (
      <AuthLayout>
        <Card className="p-6 shadow-lg text-center">
          <h1 className="text-xl font-bold text-neutral-900">Password Reset Successful!</h1>
          <p className="text-sm text-neutral-600 mt-2">Redirecting to login...</p>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="p-5 sm:p-6 shadow-lg">
        <div className="text-center mb-4">
          <span className="inline-flex w-10 h-10 rounded-full bg-brand-50 items-center justify-center mb-2">
            <ShoppingBag className="w-5 h-5 text-brand-700" />
          </span>
          <h1 className="text-xl font-bold text-neutral-900">Reset Password</h1>
          <p className="text-xs text-neutral-600 mt-0.5">Email me bheja gaya 6-digit code daalo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Reset Code"
            type="text"
            placeholder="123456"
            leftIcon={<KeyRound className="w-4 h-4" />}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
          />

          <Input
            label="New Password"
            type="password"
            leftIcon={<Lock className="w-4 h-4" />}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            leftIcon={<Lock className="w-4 h-4" />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {(error || mutation.isError) && (
            <div className="text-xs text-danger-600 bg-danger-50 border border-red-200 rounded-lg px-3 py-2">
              {error || 'Invalid or expired code'}
            </div>
          )}

          <Button type="submit" variant="primary" size="md" className="w-full" isLoading={mutation.isPending}>
            {mutation.isPending ? 'Resetting...' : (
              <>Reset Password <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}