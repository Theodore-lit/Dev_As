'use client';

import { usePathname } from 'next/navigation';

interface SiteLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}

export function SiteLayout({ children, header, footer }: SiteLayoutProps) {
  const pathname = usePathname();
  const normalizedPath = pathname?.replace(/\/+$/, '') || '/';
  const isDashboardPage =
    normalizedPath === '/admin' ||
    normalizedPath.startsWith('/admin/') ||
    normalizedPath === '/participant' ||
    normalizedPath.startsWith('/participant/');
  const hasPublicChrome = normalizedPath !== '/connexion' && !isDashboardPage;

  return (
    <>
      {hasPublicChrome && header}
      <main className="flex flex-1 flex-col">{children}</main>
      {hasPublicChrome && footer}
    </>
  );
}
