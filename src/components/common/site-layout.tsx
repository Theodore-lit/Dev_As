'use client';

import { usePathname } from 'next/navigation';

interface SiteLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}

export function SiteLayout({ children, header, footer }: SiteLayoutProps) {
  const pathname = usePathname();
  const isConnexionPage = pathname?.replace(/\/+$/, '') === '/connexion';

  return (
    <>
      {!isConnexionPage && header}
      <main className="flex flex-1 flex-col">{children}</main>
      {!isConnexionPage && footer}
    </>
  );
}
