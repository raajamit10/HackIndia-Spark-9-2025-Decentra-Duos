import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Use Inter font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ['latin'] }); // Initialize Inter font

export const metadata: Metadata = {
  title: 'Blockendance - Decentralized Attendance', // Update title
  description: 'A simple decentralized attendance application using local storage.', // Update description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}> {/* Apply Inter font */}
        {children}
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}
