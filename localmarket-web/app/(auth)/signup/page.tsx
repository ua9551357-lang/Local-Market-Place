'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, MapPin, ShoppingBag, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { signupSchema, SignupFormValues } from '@/lib/validations/auth';
import { useSignup } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const signupMutation = useSignup();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'customer' },
  });

  const onSubmit = (values: SignupFormValues) => {
    signupMutation.mutate({ ...values, role: 'customer' });
  };

  return (
    <AuthLayout
      heading="Join Your Community"
      subheading="Whether you need a service or want to offer one, LocalMarket connects you."
    >
      <Card className="p-8 shadow-lg">
        <div className="text-center mb-6">
          <span className="inline-flex w-14 h-14 rounded-full bg-brand-50 items-center justify-center mb-3">
            <ShoppingBag className="w-6 h-6 text-brand-700" />
          </span>
          <h1 className="text-2xl font-bold text-neutral-900">Create your account</h1>
          <p className="text-sm text-neutral-600 mt-1">Join LocalMarket today</p>
        </div>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 mb-6 bg-neutral-100 rounded-lg p-1">
          <button
            type="button"
            className="text-sm font-medium py-2 rounded-lg bg-white text-brand-700 shadow-sm"
          >
            I need a service
          </button>
          <button
            type="button"
            onClick={() => router.push('/for-providers/apply')}
            className="text-sm font-medium py-2 rounded-lg text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            I want to provide
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Umair Khan"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-neutral-400 hover:text-neutral-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="City (optional)"
            placeholder="Rawalpindi"
            leftIcon={<MapPin className="w-4 h-4" />}
            {...register('city')}
          />

          {signupMutation.isError && (
            <div className="flex items-center gap-2 text-xs text-danger-600 bg-danger-50 border border-red-200 rounded-lg px-3 py-2.5">
              ⚠️ {(signupMutation.error as any)?.response?.data?.message || 'Something went wrong'}
            </div>
          )}

          <Button type="submit" variant="primary" size="md" className="w-full" isLoading={signupMutation.isPending}>
            {signupMutation.isPending ? 'Creating account...' : (
              <>
                Sign Up <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-700 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}