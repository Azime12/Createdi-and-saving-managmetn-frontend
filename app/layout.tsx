// src/app/layout.tsx
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import ClientLayout from './clientLayout';

export const metadata: Metadata = {
  title: {
    template: '%s | Credit and saving',
    default: 'Credit and saving',
  },
  description: 'The official credit management system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}