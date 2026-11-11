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
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-6xl text-red-500">⚠️</div>
      <h3 className="text-lg font-semibold text-neutral-dark mb-2">
        {title}
      </h3>
      {message && <p className="text-gray-600 max-w-md mb-4">{message}</p>}
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Réessayer
        </Button>
      )}
    </div>
  );
}
