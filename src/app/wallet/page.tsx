
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Wallet, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // Import Badge

export default function WalletPage() {
  const { connectWallet, disconnectWallet, account, provider, error, isLoading } = useWalletConnection();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 bg-secondary">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Wallet className="h-6 w-6 text-primary" /> Wallet Connection
          </CardTitle>
          <CardDescription>Manage your Ethereum wallet connection.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {account ? (
            <div className="space-y-4">
              <p className="text-lg font-medium text-foreground">Connected!</p>
              <Badge variant="secondary" className="text-sm break-all px-3 py-1">
                {account}
              </Badge>
              <Button
                onClick={disconnectWallet}
                variant="outline"
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
               <p className="text-muted-foreground">
                {isLoading ? 'Attempting to connect...' : 'Your wallet is not connected.'}
               </p>
              <Button
                onClick={connectWallet}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wallet className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>Error: {error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
