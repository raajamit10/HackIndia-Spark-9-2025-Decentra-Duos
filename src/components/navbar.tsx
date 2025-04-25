
'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, LogIn, Wallet, LogOut, Loader2, Coins, CheckCircle } from 'lucide-react'; // Added CheckCircle
import { Button } from '@/components/ui/button';
import { useWalletConnection } from '@/hooks/useWalletConnection'; // Import the hook
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Import Tooltip
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export function Navbar() {
  const { connectWallet, disconnectWallet, account, balance, isLoading, error } = useWalletConnection(); // Get balance

  const formatAddress = (address: string | null): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold">Blockendance</span>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
             {/* Wallet Button/Status */}
             <TooltipProvider delayDuration={100}>
               <Tooltip>
                 <TooltipTrigger asChild>
                   {account ? (
                     <Button variant="secondary" size="sm" onClick={disconnectWallet} className="flex items-center gap-2">
                       <Wallet className="h-4 w-4 text-green-500" /> {/* Indicate connected state */}
                       <span>{formatAddress(account)}</span>
                       <span className="text-xs text-muted-foreground">(</span>
                       <Coins className="h-3 w-3 text-accent" />
                       {balance !== null ? (
                         <span className="text-xs font-medium">{balance} ETH</span>
                       ) : isLoading ? (
                           <Skeleton className="h-3 w-10" />
                       ) : (
                           <span className="text-xs text-muted-foreground">N/A</span>
                       )}
                       <span className="text-xs text-muted-foreground">)</span>
                     </Button>
                   ) : (
                     <Button
                       variant="secondary"
                       size="sm"
                       onClick={connectWallet}
                       disabled={isLoading}
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
                 <TooltipContent>
                   {account ? (
                     <div className="text-sm space-y-1">
                       <div className="flex items-center gap-1 font-medium text-green-600">
                         <CheckCircle className="h-4 w-4" />
                         <span>Status: Connected</span>
                       </div>
                       <p>Account: {account}</p>
                       <div className="flex items-center gap-1">
                         <Coins className="h-4 w-4 text-accent" />
                         <span>Balance:</span>
                         {balance !== null ? (
                           <span className="font-medium">{balance} ETH</span>
                         ) : isLoading ? (
                           <Skeleton className="h-4 w-16" />
                         ) : (
                           <span>N/A</span>
                         )}
                       </div>
                       <p className="text-xs text-muted-foreground mt-2">Click to disconnect</p>
                     </div>
                   ) : (
                     <p>{isLoading ? 'Attempting connection...' : 'Connect your wallet'}</p>
                   )}
                   {error && <p className="text-destructive text-xs mt-1">{error}</p>}
                 </TooltipContent>
               </Tooltip>
             </TooltipProvider>

            {/* Sign In button (remains unchanged for now) */}
            <Link href="/signin" passHref>
              <Button variant="secondary" size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
