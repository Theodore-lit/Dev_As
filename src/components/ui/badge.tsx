import React from 'react';
import { cn } from '@/src/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'en_attente'
    | 'qualifie'
    | 'elimine'
    | 'finaliste'
    | 'champion'
    | 'ok'
    | 'no'
    | 'wait'
    | 'gold'
    | 'live';
  live?: boolean;
}

const variantStyles = {
  default: 'bg-soft text-ink',
  // Status badges (per design charter)
  ok: 'bg-green-pale text-green-dark', // qualifie, success
  no: 'bg-red-pale text-red', // elimine, error
  wait: 'bg-orange-pale text-orange-dark', // en_attente, warning
  gold: 'bg-gold-pale text-gold', // champion, highlight
  // Semantic aliases
  en_attente: 'bg-orange-pale text-orange-dark',
  qualifie: 'bg-green-pale text-green-dark',
  elimine: 'bg-red-pale text-red',
  finaliste: 'bg-orange-pale text-orange-dark',
  champion: 'bg-gold-pale text-gold',
  info: 'bg-soft text-mute',
  warning: 'bg-orange-pale text-orange-dark',
  error: 'bg-red-pale text-red',
  success: 'bg-green-pale text-green-dark',
  live: 'bg-green-pale text-green-dark',
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', live = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-semibold whitespace-nowrap',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {live && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse flex-none"
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  ),
);

Badge.displayName = 'Badge';

export { Badge };
