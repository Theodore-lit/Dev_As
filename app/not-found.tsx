import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-neutral-dark mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
      <Button asChild>
        <Link href="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}
