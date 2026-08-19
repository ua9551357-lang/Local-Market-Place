import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const variants = {
      primary:
        'bg-brand-700 text-white hover:bg-brand-600 shadow-sm active:scale-[0.98]',
      secondary:
        'bg-brand-50 text-brand-700 hover:bg-brand-100',
      outline:
        'border border-neutral-200 text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300',
      ghost:
        'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
      danger:
        'bg-danger-600 text-white hover:bg-red-700 shadow-sm',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
      md: 'text-sm px-4 py-2.5 rounded-lg gap-2',
      lg: 'text-base px-6 py-3 rounded-lg gap-2',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';