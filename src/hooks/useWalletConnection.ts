
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, Eip1193Provider } from 'ethers';
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
  error: string | null;
  isLoading: boolean;
}

export function useWalletConnection(): UseWalletConnectionReturn {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Function to handle account changes
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has disconnected accounts
      console.log('Please connect to MetaMask.');
      disconnectWallet(); // Disconnect if no accounts are found
      toast({ title: 'Wallet Disconnected', description: 'No accounts found or wallet locked.' });
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      setError(null); // Clear previous errors
      toast({ title: 'Account Changed', description: `Switched to account: ${accounts[0]}` });
    }
  }, [account]); // Add toast dependency

  // Function to handle chain changes
  const handleChainChanged = useCallback((chainId: string) => {
    console.log('Chain changed:', chainId);
    // Optionally reload the page or re-fetch data based on the new chain
    // window.location.reload(); // Simple approach
    toast({ title: 'Network Changed', description: 'Please ensure you are on the correct network.' });
    // For a smoother UX, you might re-initialize the provider or prompt the user
    connectWallet(); // Re-attempt connection logic to get the new provider state
  }, []); // Add toast dependency

   // Function to handle disconnect event
   const handleDisconnect = useCallback((error?: any) => {
    console.log('Wallet disconnected:', error);
    disconnectWallet();
    toast({ title: 'Wallet Disconnected', description: error?.message || 'You have been disconnected.', variant: 'destructive' });
   }, []); // Add toast dependency


  const connectWallet = useCallback(async () => {
    setError(null); // Clear previous errors
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
        setAccount(accounts[0]);
         toast({ title: 'Wallet Connected', description: `Connected account: ${accounts[0]}` });

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
    } finally {
        setIsLoading(false);
    }
  }, [handleAccountsChanged, handleChainChanged, handleDisconnect]); // Add dependencies

  const disconnectWallet = useCallback(() => {
     console.log("Disconnecting wallet...");
     setAccount(null);
     setProvider(null);
     setError(null);
     // Remove event listeners
     if (window.ethereum?.removeListener) {
         window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
         window.ethereum.removeListener('chainChanged', handleChainChanged);
         window.ethereum.removeListener('disconnect', handleDisconnect);
     }
      toast({ title: 'Wallet Disconnected' });
  }, [handleAccountsChanged, handleChainChanged, handleDisconnect]); // Add dependencies

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

  // Optional: Attempt to reconnect if already connected previously (e.g., page reload)
  // Be cautious with this to avoid unnecessary prompts. Usually handled by dApp state management.
  // useEffect(() => {
  //   const checkConnection = async () => {
  //     if (window.ethereum) {
  //       try {
  //         const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  //         if (accounts.length > 0) {
  //           // If accounts are found, it means the user previously granted permission
  //           // You could potentially auto-connect here, but it might be better
  //           // to just update the state and let the user click connect again
  //           // for explicit action. For now, let's not auto-connect fully.
  //           // setAccount(accounts[0]); // Avoid setting account directly without provider
  //           // setProvider(new ethers.BrowserProvider(window.ethereum));
  //           console.log("Previously connected account found:", accounts[0]);
  //           // Consider setting a state like 'canConnect' = true
  //         }
  //       } catch (err) {
  //         console.error("Error checking existing connection:", err);
  //       }
  //     }
  //   };
  //   checkConnection();
  // }, []);


  return { connectWallet, disconnectWallet, account, provider, error, isLoading };
}
