'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { Mail, Lock, Eye, EyeOff, ShoppingBag, ArrowRight } from 'lucide-react';
import { loginSchema, LoginFormValues } from '@/lib/validations/auth';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { TrustBadges } from '@/components/auth/TrustBadges';
import { SocialButtons } from '@/components/auth/SocialButton';

export default function LoginPage() {
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    if (!recaptchaToken) {
      setRecaptchaError('Please verify that you are not a robot');
      return;
    }
    setRecaptchaError('');

    loginMutation.mutate(
      { ...values, recaptchaToken },
      {
        onError: () => {
          // Login fail hone pe recaptcha reset karo — ek token ek hi baar valid hota hai
          recaptchaRef.current?.reset();
          setRecaptchaToken(null);
        },
      },
    );
  };

  return (
    <AuthLayout>
      <Card className="p-5 sm:p-6 shadow-lg">
        <div className="text-center mb-4">
          <span className="inline-flex w-10 h-10 rounded-full bg-brand-50 items-center justify-center mb-2">
            <ShoppingBag className="w-5 h-5 text-brand-700" />
          </span>
          <h1 className="text-xl font-bold text-neutral-900">Welcome back!</h1>
          <p className="text-xs text-neutral-600 mt-0.5">Log in to your LocalMarket account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input
            label="Email address"
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

          <div className="flex items-center justify-between">
            <Link href="/forgot-password" className="text-xs text-brand-700 font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="flex flex-col items-center gap-1 pt-1">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={(token) => {
                setRecaptchaToken(token);
                setRecaptchaError('');
              }}
              onExpired={() => setRecaptchaToken(null)}
            />
            {recaptchaError && <p className="text-xs text-danger-500">{recaptchaError}</p>}
          </div>

          {loginMutation.isError && (
            <div className="flex items-center gap-2 text-xs text-danger-600 bg-danger-50 border border-red-200 rounded-lg px-3 py-2">
              ⚠️ Invalid email or password
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            isLoading={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logging in...' : (
              <>
                Log In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <SocialButtons />

        <p className="text-center text-xs text-neutral-600 mt-3">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-brand-700 font-medium hover:underline">
            Sign up
          </Link>
        </p>

        <div className="hidden sm:block">
          <TrustBadges />
        </div>
      </Card>
    </AuthLayout>
  );
}