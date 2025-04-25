
'use client';

import React from 'react';
import Link from 'next/link';
import { LogIn, Wallet, LogOut, Loader2, Coins, CheckCircle, FileText, ArrowRightSquare } from 'lucide-react'; // Updated icons
import { Button } from '@/components/ui/button';
import { useWalletConnection } from '@/hooks/useWalletConnection'; // Import the hook
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Import Tooltip
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export function Navbar() {
  const { connectWallet, disconnectWallet, account, balance, isLoading, error } = useWalletConnection(); // Get balance

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2">
              {/* Use a different icon, like ArrowRightSquare */}
              <ArrowRightSquare className="h-6 w-6 text-white" />
              <span className="text-xl font-bold">BlockAttend</span>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
             {/* Log Button (Placeholder - link to future /log page) */}
              <Link href="/log" passHref>
                 <Button variant="ghost" size="sm" className="hover:bg-primary/80 hover:text-primary-foreground text-primary-foreground">
                   <FileText className="mr-2 h-4 w-4" />
                   Log
                 </Button>
              </Link>

             {/* Sign In button */}
            <Link href="/signin" passHref>
              <Button variant="ghost" size="sm" className="hover:bg-primary/80 hover:text-primary-foreground text-primary-foreground">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>

             {/* Wallet Button/Status */}
             <TooltipProvider delayDuration={100}>
               <Tooltip>
                 <TooltipTrigger asChild>
                   {account ? (
                     <Button variant="secondary" size="sm" onClick={disconnectWallet} className="flex items-center gap-1 px-2 py-1 h-8 text-xs bg-white text-primary hover:bg-gray-100">
                       {/* Simple Balance Display */}
                       <Coins className="h-3 w-3 text-primary" />
                       {balance !== null ? (
                         <span className="font-medium">{balance} ETH</span>
                       ) : isLoading ? (
                           <Skeleton className="h-3 w-10 bg-gray-300" />
                       ) : (
                           <span className="text-muted-foreground">N/A</span>
                       )}
                       {/* Disconnect Icon */}
                       <LogOut className="h-4 w-4 text-primary ml-1"/>
                     </Button>
                   ) : (
                     <Button
                       variant="secondary"
                       size="sm"
                       onClick={connectWallet}
                       disabled={isLoading}
                       className="bg-white text-primary hover:bg-gray-100 h-8 px-3"
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
                 <TooltipContent className="bg-popover text-popover-foreground border shadow-md rounded">
                   {account ? (
                     <div className="text-sm space-y-1 p-2">
                       <div className="flex items-center gap-1 font-medium text-green-600">
                         <CheckCircle className="h-4 w-4" />
                         <span>Status: Connected</span>
                       </div>
                       <p>Account: {account}</p> {/* Show full address in tooltip */}
                       <div className="flex items-center gap-1">
                         <Coins className="h-4 w-4 text-primary" />
                         <span>Balance:</span>
                         {balance !== null ? (
                           <span className="font-medium">{balance} ETH</span>
                         ) : isLoading ? (
                           <Skeleton className="h-4 w-16" />
                         ) : (
                           <span>N/A</span>
                         )}
                       </div>
                       <p className="text-xs text-muted-foreground mt-2">Click button to disconnect</p>
                     </div>
                   ) : (
                     <p className="p-2">{isLoading ? 'Attempting connection...' : 'Connect your Ethereum wallet'}</p>
                   )}
                   {error && <p className="text-destructive text-xs mt-1 p-2">{error}</p>}
                 </TooltipContent>
               </Tooltip>
             </TooltipProvider>
          </div>
        </div>
      </div>
    </nav>
  );
}
