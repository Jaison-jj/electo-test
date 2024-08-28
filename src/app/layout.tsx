import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Poppins, Syncopate } from 'next/font/google';
import * as React from 'react';

import '@/styles/globals.css';

import { Toaster } from '@/components/ui/sonner';

import { siteConfig } from '@/constant/config';

const ProgressBarProvider = dynamic(
  () => import('@/components/providers/ProgressBarProvider'),
);
const ReactQueryProvider = dynamic(
  () => import('@/components/providers/ReactQueryProvider'),
);
const RecoilContextProvider = dynamic(
  () => import('@/components/providers/RecoilContextProvider'),
);
const NextThemeProvider = dynamic(
  () => import('@/components/providers/ThemeProvider'),
);

// !STARTERCONF Change these default meta
// !STARTERCONF Look at @/constant/config to change them
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  // !STARTERCONF this is the default favicon, you can generate your own from https://realfavicongenerator.net/
  // ! copy to /favicon folder
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
    creator: '@jaison_john',
  },
  authors: [
    {
      name: 'Jaison John',
      url: 'https://google.com',
    },
  ],
};

const PoppinsFont = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins',
});

const SyncopateFont = Syncopate({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-syncopate',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${PoppinsFont.variable} ${SyncopateFont.variable}`}
      suppressHydrationWarning
    >
      <body>
        <NextThemeProvider>
          <ReactQueryProvider>
            <RecoilContextProvider>
              <Toaster />
              <ProgressBarProvider>{children}</ProgressBarProvider>
            </RecoilContextProvider>
          </ReactQueryProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
