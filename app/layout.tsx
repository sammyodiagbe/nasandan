import type { Metadata } from 'next';
import { DM_Sans, Source_Sans_3 } from 'next/font/google';
import { CustomerAuthProvider, AdminAuthProvider, ToastProvider, BookingProvider } from '@/lib/context';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nasandan Rentals - Quality Car Rentals',
  description: 'Your trusted partner for quality car rentals. Affordable rates, reliable vehicles, and exceptional service.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${sourceSans.variable} antialiased`}>
        <ToastProvider>
          <AdminAuthProvider>
            <CustomerAuthProvider>
              <BookingProvider>
                {children}
              </BookingProvider>
            </CustomerAuthProvider>
          </AdminAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
