
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Use Inter font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { Navbar } from '@/components/navbar'; // Import Navbar
import { SplashScreen } from '@/components/splash-screen'; // Import SplashScreen

const inter = Inter({ subsets: ['latin'] }); // Initialize Inter font

export const metadata: Metadata = {
  title: 'BlockAttend - Decentralized Attendance', // Update title
  description: 'A simple decentralized attendance application using blockchain concepts.', // Update description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased flex flex-col min-h-screen bg-background`}> {/* Apply Inter font, flex layout and background */}
          <SplashScreen> {/* Wrap content with SplashScreen */}
            <Navbar /> {/* Add Navbar */}
            <div className="flex-grow"> {/* Ensure content takes remaining space */}
              {children}
            </div>
            <Toaster /> {/* Add Toaster component */}
          </SplashScreen>
      </body>
    </html>
  );
}
