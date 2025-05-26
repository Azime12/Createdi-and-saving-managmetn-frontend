// app/layout.tsx
import '@/app/ui/global.css'; // Import global styles
import { inter } from '@/app/ui/fonts'; // Import the font (Inter in this case)

import { Metadata } from 'next'; // Import Metadata for setting up page-specific metadata
import ClientLayout from './clientLayout'; // Import ClientLayout

// Metadata setup
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard', // Template for dynamic titles
    default: 'Acme Dashboard', // Default title
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  // metadataBase: new URL('https://next-learn-dashboard.vercel.sh'), // Uncomment and set if you need a base URL
};

// RootLayout component for wrapping the whole app layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // Children components to be rendered inside RootLayout
}) {
  return (
    <html lang="en">
      <head>
        {/* Head tag for setting metadata and other head elements */}
      </head>
      <body className={`${inter.className} antialiased`}>
        <ClientLayout>{children}</ClientLayout> {/* Wrap children with ClientLayout */}
      </body>
    </html>
  );
}
