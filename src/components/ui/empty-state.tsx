import React from 'react';
import { Button } from './button';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-soft/50 px-6 py-12 text-center">
      {icon && (
        <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-green-pale text-green-dark">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-ink">
        {title}
      </h3>
      {description && (
        <p className="mb-4 max-w-md text-sm text-mute">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
}
