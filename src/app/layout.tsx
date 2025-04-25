import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Use Inter font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { Navbar } from '@/components/navbar'; // Import Navbar

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
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}> {/* Apply Inter font and flex layout */}
        <Navbar /> {/* Add Navbar */}
        <div className="flex-grow"> {/* Ensure content takes remaining space */}
          {children}
        </div>
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}
