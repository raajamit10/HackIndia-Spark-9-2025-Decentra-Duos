
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, Eip1193Provider, formatEther } from 'ethers'; // Import formatEther
import { useToast } from "@/hooks/use-toast";

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: Eip1193Provider & { // Use Eip1193Provider for modern standards
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] | Record<string, any> }) => Promise<any>;
      on: (eventName: string, listener: (...args: any[]) => void) => void;
      removeListener: (eventName: string, listener: (...args: any[]) => void) => void;
    };
  }
}


interface UseWalletConnectionReturn {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  account: string | null;
  provider: BrowserProvider | null;
  balance: string | null; // Add balance state
  error: string | null;
  isLoading: boolean;
}

export function useWalletConnection(): UseWalletConnectionReturn {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [balance, setBalance] = useState<string | null>(null); // State for balance
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // --- Helper Function to Fetch Balance ---
  const fetchBalance = useCallback(async (currentProvider: BrowserProvider | null, currentAccount: string | null) => {
    if (currentProvider && currentAccount) {
      try {
        const balanceWei = await currentProvider.getBalance(currentAccount);
        const balanceEther = formatEther(balanceWei);
        // Format to a reasonable number of decimal places, e.g., 4
        const formattedBalance = parseFloat(balanceEther).toFixed(4);
        setBalance(formattedBalance);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setBalance(null); // Reset balance on error
        setError("Failed to fetch balance.");
        // Optionally show a toast for balance fetch error
        // toast({ title: 'Balance Error', description: 'Could not fetch account balance.', variant: 'destructive' });
      }
    } else {
      setBalance(null); // Reset balance if provider or account is missing
    }
  }, []);

  // Function to handle account changes
  const handleAccountsChanged = useCallback(async (accounts: string[]) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has disconnected accounts
      console.log('Please connect to MetaMask.');
      disconnectWallet(); // Disconnect if no accounts are found
      toast({ title: 'Wallet Disconnected', description: 'No accounts found or wallet locked.' });
    } else if (accounts[0] !== account) {
      const newAccount = accounts[0];
      setAccount(newAccount);
      setError(null); // Clear previous errors
      toast({ title: 'Account Changed', description: `Switched to account: ${newAccount}` });
      await fetchBalance(provider, newAccount); // Fetch balance for new account
    }
  }, [account, provider, fetchBalance, toast]); // Add provider, fetchBalance, toast

  // Function to handle chain changes
  const handleChainChanged = useCallback(async (chainId: string) => {
    console.log('Chain changed:', chainId);
    toast({ title: 'Network Changed', description: 'Reloading for the new network.' });
    // Reloading is a simple way to handle chain changes and ensure provider is correct
    window.location.reload();
    // Alternatively, attempt to reconnect and fetch balance for the new chain
    // setError(null);
    // setAccount(null); // Reset account while reconnecting
    // setBalance(null);
    // await connectWallet(); // Re-run connection logic
  }, [toast]); // Add toast

   // Function to handle disconnect event
   const handleDisconnect = useCallback((error?: any) => {
    console.log('Wallet disconnected:', error);
    disconnectWallet();
    toast({ title: 'Wallet Disconnected', description: error?.message || 'You have been disconnected.', variant: 'destructive' });
   }, [toast]); // Add toast dependency

  const connectWallet = useCallback(async () => {
    setError(null); // Clear previous errors
    setBalance(null); // Clear previous balance
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask (or another Ethereum wallet) is not installed. Please install it to connect.');
      toast({ title: 'Wallet Not Found', description: 'Please install MetaMask or another Ethereum wallet.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      // Use BrowserProvider which is recommended for browser environments
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      // Request account access
      const accounts = await browserProvider.send('eth_requestAccounts', []);

      if (accounts.length > 0) {
        const currentAccount = accounts[0];
        setAccount(currentAccount);
        toast({ title: 'Wallet Connected', description: `Connected account: ${currentAccount}` });

        // Fetch balance after setting account and provider
        await fetchBalance(browserProvider, currentAccount);

        // --- Set up event listeners ---
        window.ethereum?.on('accountsChanged', handleAccountsChanged);
        window.ethereum?.on('chainChanged', handleChainChanged);
        window.ethereum?.on('disconnect', handleDisconnect); // Listen for standard disconnect

      } else {
         setError('No accounts found. Please ensure your wallet is unlocked and has accounts.');
         toast({ title: 'Connection Failed', description: 'No accounts found in wallet.', variant: 'destructive' });
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      let errorMessage = 'Failed to connect wallet.';
      if (err.code === 4001) {
        errorMessage = 'Connection request rejected by user.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast({ title: 'Connection Error', description: errorMessage, variant: 'destructive' });
      setAccount(null); // Ensure account is null on error
      setProvider(null);
      setBalance(null); // Ensure balance is null on error
    } finally {
        setIsLoading(false);
    }
  }, [fetchBalance, handleAccountsChanged, handleChainChanged, handleDisconnect, toast]); // Add fetchBalance and toast


  const disconnectWallet = useCallback(() => {
     console.log("Disconnecting wallet...");
     setAccount(null);
     setProvider(null);
     setBalance(null); // Reset balance on disconnect
     setError(null);
     // Remove event listeners
     if (window.ethereum?.removeListener) {
         window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
         window.ethereum.removeListener('chainChanged', handleChainChanged);
         window.ethereum.removeListener('disconnect', handleDisconnect);
     }
      toast({ title: 'Wallet Disconnected' });
  }, [handleAccountsChanged, handleChainChanged, handleDisconnect, toast]); // Add dependencies

  // Clean up listeners on component unmount
  useEffect(() => {
    return () => {
       if (window.ethereum?.removeListener) {
           window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
           window.ethereum.removeListener('chainChanged', handleChainChanged);
           window.ethereum.removeListener('disconnect', handleDisconnect);
       }
    };
  }, [handleAccountsChanged, handleChainChanged, handleDisconnect]); // Add dependencies


  return { connectWallet, disconnectWallet, account, provider, balance, error, isLoading }; // Return balance
}
