import "./globals.css";
import React from 'react';
import ClientProviders from "@/components/ClientProviders";
import { MobileMenu } from "@/components/navbar/mobile-menu";
import Toast from "@/components/ui/Toast";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <React.Suspense fallback={null}>
          <ClientProviders>
            <MobileMenu />
            <Toast />
            {children}
          </ClientProviders>
        </React.Suspense>
      </body>
    </html>
  );
}
