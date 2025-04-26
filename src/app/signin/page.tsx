
'use client';

import React, { useState, useEffect } from 'react'; // Import useEffect
import Link from 'next/link'; // Import Link
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Removed Input and Label imports as they are no longer needed for email/password
import { LogIn, ArrowLeft, Wallet, Loader2, AlertCircle, CheckCircle } from 'lucide-react'; // Import ArrowLeft
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label'; // Import Label for wallet status

export default function SignInPage() {
  const { connectWallet, account, isLoading: isWalletLoading, error: walletError } = useWalletConnection();
  const [, setStoredWalletAddress] = useLocalStorage<string | null>('userWalletAddress', null);
  // Removed isSigningIn state
  const { toast } = useToast();
  const router = useRouter();
  // Local error state specifically for wallet issues now
  const [error, setError] = useState<string | null>(null);

  // Effect to handle successful wallet connection
  useEffect(() => {
     // Clear local error state when wallet error changes
     setError(walletError);

    if (account && !isWalletLoading) {
      // Wallet is connected and loading is finished
      setStoredWalletAddress(account); // Store the connected wallet address
      toast({
        title: 'Sign In Successful',
        description: 'Wallet connected. Redirecting...',
        variant: 'default',
      });
      router.push('/'); // Redirect to the main page
    }
  }, [account, isWalletLoading, walletError, setStoredWalletAddress, router, toast]); // Added walletError to dependency array

  // Removed handleSignIn function as email/password form is gone

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 bg-secondary">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
             <LogIn className="h-6 w-6" /> {/* Keep LogIn icon */}
             Sign In
          </CardTitle>
          <CardDescription>Connect your Ethereum wallet to sign in.</CardDescription> {/* Updated description */}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Removed Sign In Form */}

          {/* Wallet Connection Section */}
          <div className="space-y-3 pt-4"> {/* Removed border-t */}
             <Label className="text-center block font-medium text-muted-foreground">Connect Wallet to Proceed</Label>
              {account ? (
                <div className="flex items-center justify-center gap-2 p-3 border rounded-md bg-green-100/50 border-green-300/50 text-green-800">
                   <CheckCircle className="h-5 w-5" />
                   <span className="text-sm font-medium">Wallet Connected: <span className="font-mono text-xs">{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</span></span>
                    {/* Message indicating redirection */}
                   <span className="ml-auto text-xs italic">(Redirecting...)</span>
                </div>
              ) : (
                 <Button
                    onClick={connectWallet}
                    disabled={isWalletLoading}
                    variant="default" // Make it the primary action button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" // Style as primary
                  >
                    {isWalletLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wallet className="mr-2 h-4 w-4" />
                    )}
                    {isWalletLoading ? 'Connecting...' : 'Connect Wallet & Sign In'}
                  </Button>
              )}
             {/* Display wallet-specific error message */}
             {error && ( // Use the local error state which mirrors walletError
                <div className="flex items-center justify-center gap-2 text-sm text-destructive mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
             )}
          </div>

           {/* Go Back Button */}
           <div className="mt-4 text-center border-t pt-4"> {/* Added border-t and pt-4 for separation */}
            <Link href="/" passHref>
              <Button variant="ghost" className="w-full text-muted-foreground" disabled={isWalletLoading}> {/* Disable while connecting */}
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
