
'use client';

import React from 'react';
import Link from 'next/link';
import { LogIn, FileText, ArrowRightSquare, Wallet, User } from 'lucide-react'; // Added Wallet, User
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocalStorage } from '@/hooks/use-local-storage'; // Import useLocalStorage

export function Navbar() {
  const [userWalletAddress] = useLocalStorage<string | null>('userWalletAddress', null); // Check if wallet address exists

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


             {/* Conditional Sign In / Wallet Button */}
             <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {userWalletAddress ? (
                            // Show Wallet link if signed in
                            <Link href="/wallet" passHref>
                            <Button variant="ghost" size="sm" className="hover:bg-primary/80 hover:text-primary-foreground text-primary-foreground px-2 sm:px-3">
                                <Wallet className="h-4 w-4 sm:mr-2" /> {/* Wallet icon */}
                                <span className="hidden sm:inline">Wallet</span>
                            </Button>
                            </Link>
                        ) : (
                             // Show Sign In link if not signed in
                            <Link href="/signin" passHref>
                            <Button variant="ghost" size="sm" className="hover:bg-primary/80 hover:text-primary-foreground text-primary-foreground px-2 sm:px-3">
                                <LogIn className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Sign In</span>
                            </Button>
                            </Link>
                         )}
                    </TooltipTrigger>
                     <TooltipContent>
                        {userWalletAddress ? <p>Manage Wallet Connection</p> : <p>Sign in to your account</p>}
                  </TooltipContent>
                </Tooltip>
             </TooltipProvider>

          </div>
        </div>
      </div>
    </nav>
  );
}
