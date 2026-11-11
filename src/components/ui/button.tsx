import React from 'react';
import { cn } from '@/src/lib/utils';

type ButtonElement = React.ElementRef<'button'>;
type ButtonOwnProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'action';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  asChild?: boolean;
};
type ButtonProps = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

const Button = React.forwardRef<ButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      asChild,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold gap-2 rounded-base border border-transparent transition-all duration-150 cursor-pointer text-nowrap focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-green disabled:opacity-45 disabled:cursor-not-allowed';

    const variants = {
      // btn-p: Primary (green, white text) - main CTA
      primary: 'bg-green text-white hover:bg-green-dark active:opacity-80',
      // btn-o: Outline (white bg, green border & text) - secondary
      outline: 'bg-white text-green-dark border-green hover:bg-green-pale',
      // btn-a: Action (orange) - special highlights
      action: 'bg-orange text-white hover:bg-orange-dark active:opacity-80',
      // btn-r: Danger/Red (white bg, red border & text)
      danger: 'bg-white text-red border-red-200 hover:bg-red-pale',
      // btn-g: Ghost (soft background)
      ghost: 'bg-soft text-ink hover:bg-line',
      // Legacy alias for secondary
      secondary: 'bg-soft text-ink hover:bg-line',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs', // 34px height, 0.84rem font
      md: 'h-11 px-5 text-sm', // 42px height, 0.92rem font
      lg: 'h-12 px-6 text-base', // 48px height
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin flex-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
