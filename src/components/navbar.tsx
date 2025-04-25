'use client';

import React from 'react';
import Link from 'next/link'; // Import Link
import { Clock, LogIn } from 'lucide-react'; // Import LogIn icon
import { Button } from '@/components/ui/button'; // Import Button

export function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-accent" /> {/* Use accent color for icon */}
              <span className="text-xl font-bold">Blockendance</span>
          </Link>
          {/* Add Sign In button */}
          <Link href="/signin" passHref>
            <Button variant="secondary" size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
