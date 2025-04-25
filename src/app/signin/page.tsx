
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, ArrowLeft, Wallet, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';

export default function SignInPage() {
  const { connectWallet, account, isLoading: isWalletLoading, error: walletError } = useWalletConnection();
  const [, setStoredWalletAddress] = useLocalStorage<string | null>('userWalletAddress', null);
  const [isSigningIn, setIsSigningIn] = useState(false); // Loading state for sign-in itself
  const { toast } = useToast();
  const router = useRouter();

  // Placeholder sign-in handler
  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSigningIn(true);
    setError(null); // Clear previous errors

    // --- Placeholder Authentication Logic ---
    // Replace this with your actual authentication (e.g., Firebase Auth)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
    const isAuthenticated = true; // Assume authentication is successful for now
    // TODO: Implement actual sign-in logic
    console.log('Sign In attempt - Placeholder success');
    // -------------------------------------

    if (isAuthenticated) {
      // Check if wallet is connected after successful authentication
      if (!account) {
         setError("Sign-in successful, but wallet is not connected. Please connect your wallet to continue.");
         toast({
            title: "Wallet Connection Required",
            description: "Please connect your wallet.",
            variant: "destructive", // Use destructive or default based on preference
         });
         setIsSigningIn(false);
         return; // Stop here, wait for user to connect wallet
      }

      // Both authenticated and wallet connected
      setStoredWalletAddress(account); // Store the connected wallet address
      toast({
        title: 'Sign In Successful',
        description: 'Redirecting to attendance registration...',
        variant: 'default',
      });
      router.push('/'); // Redirect to the main page
    } else {
      // Authentication failed
      setError('Invalid email or password.'); // Example error
      toast({
        title: 'Sign In Failed',
        description: 'Invalid credentials provided.',
        variant: 'destructive',
      });
      setIsSigningIn(false);
    }
    // Note: setIsSigningIn(false) is handled within the conditional flows or might be set finally if redirection doesn't happen immediately. If redirecting, the component unmounts anyway.
  };

   // Local error state for the sign-in form
   const [error, setError] = useState<string | null>(null);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 bg-secondary">
      <Card className="w-full max-w-md shadow-lg"> {/* Increased max-width */}
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Enter your credentials and connect your wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6"> {/* Increased spacing */}
          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required disabled={isSigningIn || isWalletLoading}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required disabled={isSigningIn || isWalletLoading}/>
            </div>
            {/* Combine Sign In & Status in one button or separate actions */}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSigningIn || isWalletLoading || !account}>
              {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              {isSigningIn ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Wallet Connection Section */}
          <div className="space-y-3 border-t pt-4">
             <Label className="text-center block font-medium text-muted-foreground">Wallet Status</Label>
              {account ? (
                <div className="flex items-center justify-center gap-2 p-3 border rounded-md bg-green-100/50 border-green-300/50 text-green-800">
                   <CheckCircle className="h-5 w-5" />
                   <span className="text-sm font-medium">Wallet Connected: <span className="font-mono text-xs">{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</span></span>
                </div>
              ) : (
                 <Button
                    onClick={connectWallet}
                    disabled={isWalletLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isWalletLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wallet className="mr-2 h-4 w-4" />
                    )}
                    {isWalletLoading ? 'Connecting...' : 'Connect Wallet'}
                  </Button>
              )}
             {walletError && (
                <div className="flex items-center justify-center gap-2 text-sm text-destructive mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Wallet Error: {walletError}</span>
                </div>
             )}
          </div>


           {/* Display combined error message */}
           {error && (
             <div className="flex items-center justify-center gap-2 text-sm text-destructive mt-4">
               <AlertCircle className="h-4 w-4" />
               <span>{error}</span>
             </div>
           )}

           {/* Go Back Button */}
           <div className="mt-4 text-center">
            <Link href="/" passHref>
              <Button variant="ghost" className="w-full text-muted-foreground"> {/* Changed to ghost */}
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
