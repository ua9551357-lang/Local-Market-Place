import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  const variants = {
    brand: 'bg-brand-100 text-brand-700',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600',
    info: 'bg-info-50 text-info-600',
    neutral: 'bg-neutral-100 text-neutral-600',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}