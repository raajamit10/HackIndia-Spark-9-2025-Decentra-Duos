
'use client';

import React from 'react';
import Link from 'next/link';
import { LogIn, Wallet, LogOut, Loader2, Coins, CheckCircle, FileText, ArrowRightSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

export function Navbar() {
  const { connectWallet, disconnectWallet, account, balance, isLoading, error } = useWalletConnection();

  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50"> {/* Added sticky positioning */}
      <div className="container mx-auto px-4 py-2 sm:py-3"> {/* Adjusted padding */}
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2 group"> {/* Added group for potential hover effects */}
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


             {/* Wallet Button/Status */}
             <TooltipProvider delayDuration={100}>
               <Tooltip>
                 <TooltipTrigger asChild>
                   {account ? (
                     <Button variant="secondary" size="sm" onClick={disconnectWallet} className="flex items-center gap-1 px-2 py-1 h-8 text-xs bg-white text-primary hover:bg-gray-100 shadow-sm">
                       <Coins className="h-3 w-3 text-accent" /> {/* Changed icon color */}
                       {balance !== null ? (
                         <span className="font-medium">{balance} ETH</span>
                       ) : isLoading ? (
                           <Skeleton className="h-3 w-10 bg-gray-300 rounded" />
                       ) : (
                           <span className="text-muted-foreground">N/A</span>
                       )}
                       <LogOut className="h-4 w-4 text-destructive ml-1"/> {/* Changed icon color */}
                     </Button>
                   ) : (
                     <Button
                       variant="secondary"
                       size="sm"
                       onClick={connectWallet}
                       disabled={isLoading}
                       className="bg-white text-primary hover:bg-gray-100 h-8 px-3 shadow-sm"
                     >
                       {isLoading ? (
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       ) : (
                         <Wallet className="mr-2 h-4 w-4" />
                       )}
                       {isLoading ? 'Connecting...' : 'Connect Wallet'}
                     </Button>
                   )}
                 </TooltipTrigger>
                 <TooltipContent className="bg-popover text-popover-foreground border shadow-md rounded text-sm p-3">
                   {account ? (
                     <div className="space-y-2">
                       <div className="flex items-center gap-1.5 font-medium text-green-600">
                         <CheckCircle className="h-4 w-4" />
                         <span>Status: Connected</span>
                       </div>
                       <p className="text-xs text-muted-foreground break-all">Account: <span className="font-mono text-foreground">{account}</span></p> {/* Improved formatting */}
                       <div className="flex items-center gap-1.5">
                         <Coins className="h-4 w-4 text-accent" /> {/* Consistent icon color */}
                         <span>Balance:</span>
                         {balance !== null ? (
                           <span className="font-medium text-foreground">{balance} ETH</span>
                         ) : isLoading ? (
                           <Skeleton className="h-4 w-16 rounded" />
                         ) : (
                           <span className="text-muted-foreground">Not available</span>
                         )}
                       </div>
                       <p className="text-xs text-muted-foreground pt-1 border-t border-border mt-2">Click button to disconnect</p>
                     </div>
                   ) : (
                     <p>{isLoading ? 'Attempting wallet connection...' : 'Connect your Ethereum wallet'}</p>
                   )}
                   {error && <p className="text-destructive text-xs mt-2 border-t border-border pt-2">{error}</p>}
                 </TooltipContent>
               </Tooltip>
             </TooltipProvider>
          </div>
        </div>
      </div>
    </nav>
  );
}
