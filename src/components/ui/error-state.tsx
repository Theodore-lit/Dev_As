import React from 'react';
import { Button } from './button';

interface ErrorStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title,
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-line bg-soft/50 px-6 py-12 text-center">
      <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-orange-pale text-orange-dark">
        <svg
          className="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-ink">
        {title}
      </h3>
      {message && <p className="mb-4 max-w-md text-sm text-mute">{message}</p>}
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Réessayer
        </Button>
      )}
    </div>
  );
}
