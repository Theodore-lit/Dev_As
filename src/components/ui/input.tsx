import React, { useId } from 'react';
import { cn } from '@/src/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, type = 'text', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5 min-w-0">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-ink"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'flex h-11 w-full rounded-base border-1.5 border-slate-400 bg-white px-3 py-2 text-sm placeholder:text-mute focus:border-green focus:outline-none transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red focus-visible:border-red',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-mute">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
