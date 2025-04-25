'use client';

import React from 'react';
import { Clock } from 'lucide-react'; // Example icon

export function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-accent" /> {/* Use accent color for icon */}
            <span className="text-xl font-bold">Blockendance</span>
          </div>
          {/* Add navigation links here if needed */}
        </div>
      </div>
    </nav>
  );
}
