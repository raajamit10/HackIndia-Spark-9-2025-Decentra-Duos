
'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, LogIn, Wallet, LogOut, Loader2 } from 'lucide-react'; // Added LogOut, Loader2
import { Button } from '@/components/ui/button';
import { useWalletConnection } from '@/hooks/useWalletConnection'; // Import the hook
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Import Tooltip

export function Navbar() {
  const { connectWallet, disconnectWallet, account, isLoading, error } = useWalletConnection();

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
                     <Button variant="secondary" size="sm" onClick={disconnectWallet}>
                       <LogOut className="mr-2 h-4 w-4" />
                       <span>{formatAddress(account)}</span>
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
                    {account ? `Click to disconnect ${account}` : 'Connect your wallet'}
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
