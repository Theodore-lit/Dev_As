import type { Metadata } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/src/components/common/header';
import { Footer } from '@/src/components/common/footer';
import { SiteLayout } from '@/src/components/common/site-layout';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl
    ? new URL(siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`)
    : undefined,
  title: 'Question pour un DevAs',
  description: 'Une compétition intellectuelle de culture générale pour les jeunes talents',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Question pour un DevAs',
    title: 'Question pour un DevAs',
    description: 'Une compétition intellectuelle de culture générale pour les jeunes talents',
    images: [
      {
        url: '/logo.png',
        width: 612,
        height: 408,
        alt: 'Logo Question pour un DevAs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Question pour un DevAs',
    description: 'Une compétition intellectuelle de culture générale pour les jeunes talents',
    images: ['/logo.png'],
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SiteLayout
          header={<Header role="public" />}
          footer={<Footer />}
        >
          {children}
        </SiteLayout>
      </body>
    </html>
  );
}
