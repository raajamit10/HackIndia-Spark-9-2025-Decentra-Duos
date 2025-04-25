
'use client';

import React from 'react';
import Link from 'next/link';
import { LogIn, FileText, ArrowRightSquare } from 'lucide-react'; // Removed Wallet, LogOut, Loader2, Coins, CheckCircle
import { Button } from '@/components/ui/button';
// Removed useWalletConnection import
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// Removed Skeleton import

export function Navbar() {
  // Removed useWalletConnection hook call

  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
              <ArrowRightSquare className="h-6 w-6 text-white group-hover:text-primary-foreground/80 transition-colors" />
              <span className="text-xl font-bold group-hover:text-primary-foreground/90 transition-colors">BlockAttend</span>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
             {/* Log Button */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                      <Link href="/log" passHref>
                         <Button variant="ghost" size="sm" className="hover:bg-primary/80 hover:text-primary-foreground text-primary-foreground px-2 sm:px-3">
                           <FileText className="h-4 w-4 sm:mr-2" />
                           <span className="hidden sm:inline">Log</span>
                         </Button>
                      </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                      <p>View Attendance Log</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>


             {/* Sign In button */}
             <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/signin" passHref>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/80 hover:text-primary-foreground text-primary-foreground px-2 sm:px-3">
                            <LogIn className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Sign In</span>
                        </Button>
                        </Link>
                    </TooltipTrigger>
                     <TooltipContent>
                      <p>Sign in to your account</p>
                  </TooltipContent>
                </Tooltip>
             </TooltipProvider>

             {/* Removed Wallet Button/Status Section */}

          </div>
        </div>
      </div>
    </nav>
  );
}
