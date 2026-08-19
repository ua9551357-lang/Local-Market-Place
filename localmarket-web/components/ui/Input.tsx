import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, leftIcon, rightElement, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-900 mb-1 block">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full border rounded-lg py-2 text-sm text-neutral-900 placeholder:text-neutral-400',
              'bg-white transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightElement ? 'pr-10' : 'pr-3.5',
              error
                ? 'border-danger-600 focus:ring-danger-600/20 focus:border-danger-600'
                : 'border-neutral-200 hover:border-neutral-300',
              className,
            )}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</span>
          )}
        </div>
        {error && <p className="text-xs text-danger-600 mt-1.5">{error}</p>}
        {hint && !error && <p className="text-xs text-neutral-400 mt-1.5">{hint}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';